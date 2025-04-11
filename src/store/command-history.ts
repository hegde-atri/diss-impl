import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CommandEntry {
	command: string;
	output?: string;
	error?: string;
	timestamp: number;
}

export interface CommandHistoryState {
	history: CommandEntry[];
	addCommand: (entry: Omit<CommandEntry, "timestamp">) => void;
	clearHistory: () => void;
}

export const useCommandHistoryStore = create<CommandHistoryState>()(
	persist(
		(set) => ({
			history: [],
			addCommand: (entry) =>
				set((state) => ({
					history: [
						{ ...entry, timestamp: Date.now() },
						...state.history,
					].slice(0, 10), // Keep only the last 10 commands
				})),
			clearHistory: () => set({ history: [] }),
		}),
		{
			name: "command-history", // name for localStorage
		}
	)
);
