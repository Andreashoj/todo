# Todo CLI

A simple command-line todo application built with Node.js and TypeScript.

## Installation

### Global Installation (Recommended)
```bash
npm install -g anho-todo
```

Then use it anywhere:
```bash
todo add "Buy groceries"
todo list
todo complete <id>
todo remove <id>
```

### Local Development
```bash
git clone https://github.com/Andreashoj/todo.git
cd todo
npm install
npm run build
```

## Usage

### Development
```bash
# Run in development mode with TypeScript
npm run dev

# Watch mode for development
npm run watch
```

### Production
```bash
# Build the project
npm run build

# Run the built version
npm start
```

### Commands

```bash
# Add a new todo
npm run dev add "Buy groceries"

# List all todos
npm run dev list
npm run dev ls

# Complete a todo (use the ID from list command)
npm run dev complete <todo-id>
npm run dev done <todo-id>

# Remove a todo
npm run dev remove <todo-id>
npm run dev rm <todo-id>
```

## Project Structure

```
src/
├── commands/           # CLI command implementations
│   ├── add.ts
│   ├── complete.ts
│   ├── list.ts
│   └── remove.ts
├── models/             # Data models
│   └── TodoModel.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── helpers.ts
└── index.ts            # Main entry point

tests/                  # Test files (to be added)
dist/                   # Compiled JavaScript output
```

## Features

- Add todos
- List todos with status
- Complete todos
- Remove todos
- Persistent storage (JSON file in home directory)
- TypeScript support
- Clean text-based CLI interface
- Date tracking (created/completed)

## Data Storage

Todos are stored in `~/.todo-cli.json` in your home directory.