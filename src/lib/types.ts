export interface CommandOutput {
  timestamp: string;
  content: string;
}

export interface CommandResponse {
  error?: string;
  output?: string;
}