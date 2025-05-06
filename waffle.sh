#!/usr/bin/env bash

# CC BY-NC
# Tom Howard, University of Sheffield
# Copyright (c) 2023

# Terminal Prompt Colour Options:
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;93m'
BLUE='\033[1;34m'
MAGENTA='\033[0;95m'
CYAN='\033[0;96m'
IT='\033[3m'
NC='\033[0m'

USAGE="${IT}waffle${NC} command line interface for The University of Sheffield TurtleBot3
Waffles.

Usage: waffle [NUM] [COMMAND]

[NUM]     Numeric ID of the robot you are working with (a number between
          1 and 50) e.g. ${IT}dia-waffle[NUM]${NC}.

[COMMAND] options:
  pair    ${IT}Pair${NC} this laptop to the specified robot (dia-waffle[NUM]).
  sync    Manually ${IT}sync${NC}hronise both system clocks to a common NTP Server.
  term    Launch a (tmux) ${IT}term${NC}inal instance on the specified robot
          (dia-waffle[NUM]).
  bridge  Launch a Zenoh ${IT}bridge${NC} to connect the laptop with the specified robot 
          (dia-waffle[NUM])
  ping    Look for the specified robot (dia-waffle[NUM]) on the network by
          ${IT}ping${NC}ing it.
  pingpong Check if the robot (dia-waffle[NUM]) is reachable and return ${IT}true${NC} or
          ${IT}false${NC}.
  off     Shutdown the robot.
  bringup Launch a terminal in the robot and run the ${IT}tb3_bringup${NC} command.
"

# Internal functions

ask() {
    local reply prompt
    prompt='y/n'
    echo -e -n "${YELLOW}[INPUT]${NC} $1 [$prompt] >> "
    read -r reply </dev/tty
    if [[ -z $reply ]]; then
        return 1;
    elif [ "$reply" == "y" ] || [ "$reply" == "Y" ]; then
        return 0;
    elspairinge
        return 1;
    fi
}

check-for-dialab() {
    SSID_NOW=$(iwgetid -r)
    if [[ $SSID_NOW != "DIA-LAB" ]]; then
        if [[ "$1" == "loud" ]]; then
            echo -e "${CYAN}[$laptop_id]${NC} You aren't connected to the 'DIA-LAB' WiFi network yet."
            echo -e "You need to be connected to this to run ROS"
            echo -e "(but you won't be able to access the internet)."
        fi
        if ask "Do you want to connect to DIA-LAB now?"; then
            echo -e "${CYAN}[$laptop_id]${NC} Connecting to DIA-LAB..."
            nmcli c up DIA-LAB > /dev/null
        else
            echo -e "${CYAN}[$laptop_id]${NC} OK, remember to do it later then!"
        fi
    fi
}

check-pairing() {
    wn=~/.tuos/waffle_number
    touch $wn
    if grep -qi "$WAFFLE_NO" $wn; then
        # local pairing looks OK.
        # now check the pairing on the waffle side too...
        robot_response=$(ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO 'bash -s' < /usr/local/bin/robot_pair_check.sh $LAPTOP_NO) 
        if [[ $robot_response == "1" ]]; then
            if [[ $1 == "loud" ]]; then
                echo -e "${GREEN}[dia-waffle$WAFFLE_NO]${NC} Robot-Laptop pairing verified."
            fi
        elif [[ $robot_response == "0" ]]; then
            echo -e "${GREEN}[dia-waffle$WAFFLE_NO]${NC} ${RED}Invalid pairing.${NC}"
            exit 2
        else
            echo -e "${GREEN}[dia-waffle$WAFFLE_NO]${NC} ${RED}Unexpected error.${NC}"
            exit 2
        fi
    else
        echo -e "${CYAN}[$laptop_id] ${RED}DENIED: This laptop isn't paired with dia-waffle$WAFFLE_NO.${NC}" 
        exit 2
    fi
}

launch-zenoh() {
    echo "Establishing a Zenoh bridge with dia-waffle$WAFFLE_NO"
    sleep 3
    zenoh-bridge-ros2dds -e tcp/dia-waffle$WAFFLE_NO:7447
}

pingpong() {
    echo -e "${CYAN}[$laptop_id]${NC} Checking if ${GREEN}dia-waffle$WAFFLE_NO${NC} is reachable..."
    # Try pinging the robot once with a 2 second timeout
    if ping -c 1 -W 2 dia-waffle$WAFFLE_NO &>/dev/null; then
        echo "true"
        return 0
    else
        echo "false"
        return 1
    fi
}

# CLI entry points:

pair() {
    echo -e "You are about to pair ${CYAN}dia-laptop$LAPTOP_NO${NC} with ${GREEN}dia-waffle$WAFFLE_NO${NC}."
    echo -e "${CYAN}[$laptop_id]${NC} Pairing in progress (this will take a minute)..."
    echo "$WAFFLE_NO" > ~/.tuos/waffle_number # set the waffle number

    # configuring ssh connection:
    mkdir -p ~/.ssh/
    rm -f ~/.ssh/waffle_rsa*
    ssh-keygen -t rsa -b 2048 -f ~/.ssh/waffle_rsa -q -N ""
    
    # Configure SSH to automatically accept host keys for waffle devices
    grep -q "dia-waffle" ~/.ssh/config 2>/dev/null || cat >> ~/.ssh/config << EOF
Host dia-waffle*
    StrictHostKeyChecking no
    UserKnownHostsFile=/dev/null
EOF

    # Copy SSH key automatically with password
    sshpass -p "diamond" ssh-copy-id -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO > /dev/null 2>&1
    
    # Run pairing script without prompts
    ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO 'bash -s' < /usr/local/bin/robot_pairing.sh $LAPTOP_NO

    if [[ "$1" != "quick" && "$1" != "q" ]]; then
        sync
    fi
    check-pairing loud

    echo -e "${BLUE}Pairing complete.${NC}"
}

sync() {
    echo -e "${CYAN}[$laptop_id]${NC} Preparing to run an NTP update on both systems..."
    SSID_NOW=$(iwgetid -r)
    if [[ $SSID_NOW != "eduroam" ]]; then
        echo -e "${CYAN}[$laptop_id]${NC} Temporarily connecting to eduroam..."
        nmcli c up eduroam > /dev/null
        echo -e "${CYAN}[$laptop_id]${NC} Synchronising laptop OS to NTP Server..."
        sudo ntpdate ntp.ubuntu.com > /dev/null
        echo -e "${CYAN}[$laptop_id]${NC} Laptop time synchronisation complete."
        echo -e "${CYAN}[$laptop_id]${NC} Connecting back to $SSID_NOW..."
        nmcli c up $SSID_NOW > /dev/null
    else
        echo -e "${CYAN}[$laptop_id]${NC} Synchronising laptop OS to NTP Server..."
        sudo ntpdate ntp.ubuntu.com > /dev/null
        echo -e "${CYAN}[$laptop_id]${NC} Laptop time synchronisation complete."
    fi
    ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO 'bash -s' < /usr/local/bin/robot_sync.sh $LAPTOP_NO
}

term() {
    # check-for-dialab
    check-pairing loud
    echo -e "${CYAN}[$laptop_id]${NC} Logging in to dia-waffle$WAFFLE_NO..."
    ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO -t "tmux new-session -s robot || tmux attach-session -t robot"
}

bridge() {
    check-pairing
    ZENOH_ID=$(pgrep zenoh)
    if [[ -z $ZENOH_ID ]]; then
        launch-zenoh
    elif [[ "$1" == "restart" || "$1" == "r" ]]; then
        echo "Killing an existing Zenoh bridge (PID: $ZENOH_ID)."
        pkill zenoh
        launch-zenoh
    else
        echo "A Zenoh bridge is already running (PID: $ZENOH_ID)."
    fi
}

off() {
    check-pairing
    if [[ "$1" == "quick" || "$1" == "q" ]]; then
        echo "Shutting down the robot now..."
        ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO -t "sudo poweroff"
    else
        if ask "Are you sure you want to shutdown ${GREEN}dia-waffle$WAFFLE_NO?${NC}"; then
            ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO -t "sudo poweroff"
        else
            echo -e "${RED}Shutdown cancelled.${NC}"
        fi
    fi
}

waffle_ping() {
    echo -e "${CYAN}[$laptop_id]${NC} Pinging ${GREEN}dia-waffle$WAFFLE_NO${NC}..."
    ping dia-waffle$WAFFLE_NO
}

bringup() {
    check-pairing loud
    echo -e "${CYAN}[$laptop_id]${NC} Opening terminal on dia-waffle$WAFFLE_NO and running tb3_bringup..."
    ssh -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i ~/.ssh/waffle_rsa robot@dia-waffle$WAFFLE_NO -t "sleep 10 && bash -l -c 'source /home/robot/.tuos/tuos_robot_setup.sh && tb3_bringup'"
}

# Main:

laptop_id=$(hostname)
LAPTOP_NO=$(hostname | grep -o -E '[0-9]+')

if [[ $# -eq 2 || $# -eq 3 ]]; then
    WAFFLE_NO=$1
    COMMAND=$2
    OPTION=$3
else
    echo -e "$USAGE"
    if [ ! -f ~/.tuos/waffle_number ]; then
        paired_waffle=""
    else
        paired_waffle=$(cat ~/.tuos/waffle_number)
    fi
    if [[ "$paired_waffle" == "" ]]; then
        echo -e "This laptop (${CYAN}dia-laptop$LAPTOP_NO${NC}) is not currently paired with a robot."
    else
        echo -e "This laptop (${CYAN}dia-laptop$LAPTOP_NO${NC}) is currently paired with ${GREEN}dia-waffle$paired_waffle.${NC}"
    fi
    exit 0
fi

NUM_MSG="Not a valid Waffle number ([NUM] must be between 1 and 50)."
if [[ "$WAFFLE_NO" == "" ]]; then
    echo "$NUM_MSG"
    exit 2
elif (( $WAFFLE_NO >= 1 && $WAFFLE_NO <= 50 )); then
    true
else
    echo "$NUM_MSG"
    exit 2
fi

echo "robot" > ~/.tuos/robot_mode # set the laptop to 'real-robot mode' (as opposed to 'simulation mode')

case $COMMAND in 
    pair|sync|term|bridge|off|bringup)
        echo -e "${BLUE}Running '$COMMAND' command${NC}..." 
        eval $COMMAND $OPTION
        ;;
    ping)
        waffle_ping
        ;;
    pingpong)
        pingpong
        ;;
    *) 
        echo -e "${RED}[INVALID INPUT]...${NC}"
        echo -e "$USAGE"
        exit 0
        ;;
esac
