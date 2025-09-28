# Todo CLI

A simple command-line todo application built with Node.js and TypeScript.

## Installation

### Global Installation (Recommended)
```bash
npm install -g anho-todo
```

Then use it anywhere:
```bash
# Add single or multiple todos
todo add "Buy groceries"
todo add "Walk the dog" "Finish project" "Call mom"

# List todos with focus indicator
todo list                # See your todos with 🎯 on current one

# Complete single or multiple todos
todo complete            # Complete the focused todo
todo complete 1          # Complete specific todo by position
todo complete 1 3 5      # Complete multiple todos at once

# Remove single or multiple todos
todo remove 2            # Remove todo by position
todo remove 1 3 4        # Remove multiple todos at once

# Focus on specific todo
todo focus 2             # Focus on todo #2
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
- **Add todos** - `todo add "Your task"` or multiple `todo add "Task 1" "Task 2" "Task 3"`
- **Smart completion** - `todo complete` (completes focused todo) or multiple `todo complete 1 3 5`
- **Position-based operations** - No more cryptic IDs!
- **Focus system** - `todo focus 3` to control which todo is current
- **Bulk operations** - Add, complete, or remove multiple todos at once
- **Clean removal** - `todo remove 2` or multiple `todo remove 1 3 4`

### 📅 Daily Workflow
- **Archive system** - `todo archive` to start fresh
- **Hierarchical archives** - `todo archives` shows organized history
- **Easy archive viewing** - `todo archive-show 1.2`
- **Archive cleanup** - `todo clear-archives`

### ✨ User Experience
- **Visual focus indicator** - 🎯 shows current todo
- **Position-based numbering** - Work with 1, 2, 3 instead of IDs
- **Smart defaults** - `todo complete` knows what you want
- **Bulk operations** - Efficient multi-parameter support for productivity
- **Intelligent error handling** - Clear feedback on failed operations
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
# Add some todos (single or multiple)
todo add "Buy groceries"
todo add "Walk the dog" "Finish project" "Call mom"

# Check your list (🎯 shows current todo)
todo list
# 1. [ ] Buy groceries 🎯
# 2. [ ] Walk the dog
# 3. [ ] Finish project
# 4. [ ] Call mom

# Complete the current todo
todo complete
# Completed todo 1: "Buy groceries"

# Complete multiple todos at once
todo complete 2 4
# Completed 2 todos:
#   2. "Walk the dog"
#   4. "Call mom"

# Focus on a specific todo
todo focus 3
todo complete  # Now completes "Finish project"

# Remove multiple todos by position
todo remove 1 2
# Removed 2 todos:
#   1. "Buy groceries"
#   2. "Walk the dog"
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
# Adding todos
todo add <task>              # Add a single todo
todo add <task1> <task2>...  # Add multiple todos at once

# Viewing todos
todo list / ls               # List all todos

# Completing todos
todo complete / done         # Complete focused todo
todo complete <position>     # Complete specific todo
todo complete <pos1> <pos2>  # Complete multiple todos at once

# Managing todos
todo undone / uncomplete     # Mark completed todo as incomplete
todo focus <position>        # Focus on specific todo
todo remove / rm <pos>       # Remove todo by position
todo remove / rm <pos1> <pos2>  # Remove multiple todos at once

# Archiving
todo archive                 # Archive current list
todo archives                # List archived lists
todo archive-show <ref>      # Show archived list (e.g., "1.2")
todo clear-archives          # Clear all archives

# Configuration
todo data-location           # Show current data location
todo data-location change    # Change data storage location
todo --help                  # Show help
```

## 🔒 Privacy & Data Storage

### Respectful Data Handling
Todo CLI respects your privacy and asks permission before storing any data on your system.

**First Run Setup:**
On your first use, Todo CLI will ask where you'd like to store your data:

```
🎯 Welcome to Todo CLI!

For your privacy and security, we need to ask where you'd like to store your todo data.
This is a one-time setup that you can change later with `todo data-location`.

Available options:
1. Platform standard (recommended): ~/Library/Application Support/todo-cli  (macOS)
2. Home directory: ~/.todo-cli
3. Custom path (you specify)
4. Current directory (portable, but data tied to this folder)

Choose an option (1-4):
```

### Platform-Specific Defaults
- **macOS**: `~/Library/Application Support/todo-cli/`
- **Linux**: `~/.local/share/todo-cli/`
- **Windows**: `%APPDATA%/todo-cli/`
- **Custom**: Any path you specify

### Managing Data Location
```bash
# Check current data location
todo data-location

# Change data location (with migration option)
todo data-location change
```

### What Gets Stored
- Your todo items and completion status
- Archive history of completed todo lists
- Focus preferences and timestamps
- **No tracking, analytics, or personal information**

### Data Migration
When changing data location, Todo CLI offers to migrate your existing data safely to the new location.

### Uninstalling
To completely remove Todo CLI and its data:
```bash
npm uninstall -g anho-todo
rm -rf [your-data-location]  # Remove data directory
rm ~/.todo-cli-config.json   # Remove config file
```
