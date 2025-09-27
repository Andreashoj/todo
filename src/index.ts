#!/usr/bin/env node

import { program } from 'commander';
import { addTodo } from './commands/add';
import { listTodos } from './commands/list';
import { completeTodo } from './commands/complete';
import { undoneTodo } from './commands/undone';
import { removeTodo } from './commands/remove';
import { archiveList, listArchives, showArchive, clearArchives } from './commands/archive';
import { focusTodo } from './commands/focus';
import { TodoModel } from './models/TodoModel';

import packageJson from '../package.json';

const todoModel = new TodoModel();

program
  .name('todo')
  .description('A simple CLI todo application')
  .version(packageJson.version);

program
  .command('add <task>')
  .description('Add a new todo item')
  .action((task) => addTodo(task, todoModel));

program
  .command('list')
  .alias('ls')
  .description('List all todo items')
  .action(() => listTodos(todoModel));

program
  .command('complete [position]')
  .alias('done')
  .description('Mark a todo item as complete (defaults to first pending todo)')
  .action((position) => completeTodo(position, todoModel));

program
  .command('undone [position]')
  .alias('uncomplete')
  .description('Mark a completed todo item as incomplete (defaults to first completed todo)')
  .action((position) => undoneTodo(position, todoModel));

program
  .command('remove <position>')
  .alias('rm')
  .description('Remove a todo item by position number')
  .action((position) => removeTodo(position, todoModel));

program
  .command('focus <position>')
  .description('Focus on a specific todo (it becomes the current todo)')
  .action((position) => focusTodo(position, todoModel));

program
  .command('archive')
  .description('Archive current todo list and start fresh')
  .action(() => archiveList(todoModel));

program
  .command('archives')
  .description('List all archived todo lists')
  .action(() => listArchives(todoModel));

program
  .command('archive-show <ref>')
  .description('Show archived list by number (e.g., "2" for 2.1 or "2.2" for specific)')
  .action((ref) => showArchive(ref, todoModel));

program
  .command('clear-archives')
  .description('Clear all archived lists')
  .action(() => clearArchives(todoModel));

program.parse();
