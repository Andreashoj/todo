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
todo add "Walk the dog"
todo list                # See your todos with 🎯 on current one
todo complete            # Complete the focused todo
todo focus 2             # Focus on todo #2
todo complete 1          # Complete specific todo by position
todo remove 2            # Remove todo by position
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

### 🎯 Core Functionality
- **Add todos** - `todo add "Your task"`
- **Smart completion** - `todo complete` (completes focused todo)
- **Position-based operations** - No more cryptic IDs!
- **Focus system** - `todo focus 3` to control which todo is current
- **Clean removal** - `todo remove 2`

### 📅 Daily Workflow
- **Archive system** - `todo archive` to start fresh
- **Hierarchical archives** - `todo archives` shows organized history
- **Easy archive viewing** - `todo archive-show 1.2`
- **Archive cleanup** - `todo clear-archives`

### ✨ User Experience
- **Visual focus indicator** - 🎯 shows current todo
- **Position-based numbering** - Work with 1, 2, 3 instead of IDs
- **Smart defaults** - `todo complete` knows what you want
- **Aliases** - `ls`, `done`, `rm` for common commands
- **Clean output** - No clutter, just what you need

### 💾 Technical Features
- **Persistent storage** - JSON file in home directory
- **TypeScript support** - Full type safety
- **Date tracking** - Created/completed timestamps
- **Cross-platform** - Works on macOS, Linux, Windows

## Usage Examples

### Basic Workflow
```bash
# Add some todos
todo add "Buy groceries"
todo add "Walk the dog" 
todo add "Finish project"

# Check your list (🎯 shows current todo)
todo list
# 1. [TODO] Buy groceries 🎯
# 2. [TODO] Walk the dog
# 3. [TODO] Finish project

# Complete the current todo
todo complete
# Completed todo 1: "Buy groceries"

# Focus on a specific todo
todo focus 3
todo complete  # Now completes "Finish project"

# Remove a todo by position
todo remove 2
```

### Daily Workflow
```bash
# End of day - archive your work
todo archive
# Archived 3 todos. Starting fresh!

# View your archived work
todo archives
# 1. Sep 27, 2025 (1 list):
#    1.1 04:30 PM - 3 todos (1 pending, 2 completed)

# View a specific archived list
todo archive-show 1
# or
todo archive-show 1.1
```

### All Available Commands
```bash
todo add <task>           # Add a new todo
todo list / ls            # List all todos
todo complete / done      # Complete focused todo
todo complete <position>  # Complete specific todo
todo focus <position>     # Focus on specific todo
todo remove / rm <pos>    # Remove todo by position
todo archive              # Archive current list
todo archives             # List archived lists
todo archive-show <ref>   # Show archived list (e.g., "1.2")
todo clear-archives       # Clear all archives
todo --help              # Show help
```

## Data Storage

Todos are stored in `~/.todo-cli.json` in your home directory with a structured format supporting current lists and archives.
