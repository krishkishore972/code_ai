// Global and per-project settings shape
export interface Settings {
	provider?: string; // "groq" (default) | "gemini" | "anthropic"
	model?: string; // e.g. "openai/gpt-oss-120b"
	maxTokens?: number; // default 8192
	temperature?: number; // default 1.0
	systemPromptExtra?: string; // appended to the base system prompt
}
