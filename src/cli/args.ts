export interface CliArgs {
	print: boolean; // --print / -p: non-interactive, stream to stdout
	provider?: string; // --provider groq|gemini|anthropic
	model?: string; // --model <id>
	session?: string; // --session <id>: resume an existing session
	contextLimit?: number; // --context-limit <n>: override the model's window
	yolo: boolean; // --yolo: run tools without asking
	classic: boolean; // --classic: plain readline REPL instead of the TUI
	listModels: boolean; // --list-models
	listSessions: boolean; // --list-sessions
	version: boolean; // --version
	help: boolean; // --help
	message?: string; // first positional argument, or piped stdin
}

export function parseArgs(argv: string[]): CliArgs {
	const args: CliArgs = {
		print: false,
		yolo: false,
		classic: false,
		listModels: false,
		listSessions: false,
		version: false,
		help: false,
	};

	const positional: string[] = [];

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]!;
		switch (arg) {
			case "--print":
			case "-p":
				args.print = true;
				break;
			case "--yolo":
			case "--dangerously-skip-permissions":
				args.yolo = true;
				break;
			case "--classic":
				args.classic = true;
				break;
			case "--list-models":
				args.listModels = true;
				break;
			case "--list-sessions":
				args.listSessions = true;
				break;
			case "--version":
			case "-v":
				args.version = true;
				break;
			case "--help":
			case "-h":
				args.help = true;
				break;
			case "--provider":
				args.provider = argv[++i];
				break;
			case "--model":
				args.model = argv[++i];
				break;
			case "--session":
				args.session = argv[++i];
				break;
			case "--context-limit": {
				const raw = argv[++i];
				const parsed = Number(raw);
				if (!raw || Number.isNaN(parsed) || parsed <= 0) {
					throw new Error(`--context-limit needs a positive number, got: ${raw ?? "(nothing)"}`);
				}
				args.contextLimit = parsed;
				break;
			}
			default:
				if (!arg.startsWith("-")) positional.push(arg);
		}
	}

	if (positional.length > 0) {
		args.message = positional.join(" ");
	}

	return args;
}

export function printHelp(): void {
	console.log(`
code_ai — minimal coding agent

USAGE
  code_ai [message]          Interactive mode (default)
  code_ai --print [message]  Print mode: stream output to stdout

OPTIONS
  --provider <name>     Provider: groq (default), anthropic, or gemini
  --model <id>          Model ID to use (see --list-models)
  --session <id>        Resume a previous session
  --context-limit <n>   Pretend the context window is n tokens (forces compaction)
  --yolo                Run tools without asking permission
  --classic             Plain readline REPL instead of the full TUI
  --list-models         List all available models
  --list-sessions       List saved sessions
  --print, -p           Non-interactive: output to stdout
  --version, -v         Show version
  --help, -h            Show this help

ENVIRONMENT
  ANTHROPIC_API_KEY   Anthropic API key
  GEMINI_API_KEY      Google Gemini API key
  GROQ_API_KEY        Groq API key
  CODE_AI_PROVIDER    Default provider
  CODE_AI_MODEL       Default model

INTERACTIVE COMMANDS
  /model [id]   Switch model mid-conversation      /compact   Summarize history now
  /context      Show token usage                   /tools     List tools
  /sessions     List saved sessions                /clear     Drop in-memory history
  /help         All commands                       /exit      Quit

EXAMPLES
  code_ai                                 # Start interactive chat
  code_ai "explain this codebase"         # One-shot interactive
  echo "list all ts files" | code_ai -p   # Pipe input, stream output
  code_ai --session <id>                  # Resume where you left off
`);
}

export function printVersion(): void {
	console.log("code_ai 0.1.0");
}
