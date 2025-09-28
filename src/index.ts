#!/usr/bin/env node

import { program } from 'commander';
import { addTodo } from './commands/add';
import { listTodos } from './commands/list';
import { completeTodo } from './commands/complete';
import { undoneTodo } from './commands/undone';
import { removeTodo } from './commands/remove';
import { archiveList, listArchives, showArchive, clearArchives } from './commands/archive';
import { focusTodo } from './commands/focus';
import { showDataLocation, changeDataLocation } from './commands/data-location';
import { TodoModel } from './models/TodoModel';

import packageJson from '../package.json';

const todoModel = new TodoModel();

program
  .name('todo')
  .description('A simple CLI todo application')
  .version(packageJson.version);

program
  .command('add <task...>')
  .description('Add one or more todo items')
  .action((tasks) => addTodo(tasks, todoModel));

program
  .command('list')
  .alias('ls')
  .description('List all todo items')
  .action(() => listTodos(todoModel));

program
  .command('complete [positions...]')
  .alias('done')
  .description('Mark todo items as complete (defaults to first pending todo, or specify multiple positions)')
  .action((positions) => {
    // If positions is undefined (no arguments), pass empty array
    // If positions is a string (single argument), convert to array
    // If positions is already an array, use it as-is
    let positionsArray: string[] = [];
    if (positions) {
      positionsArray = Array.isArray(positions) ? positions : [positions];
    }
    completeTodo(positionsArray, todoModel);
  });

program
  .command('undone [positions...]')
  .alias('uncomplete')
  .description('Mark completed todo items as incomplete (defaults to first completed todo, or specify multiple positions)')
  .action((positions) => {
    // If positions is undefined (no arguments), pass empty array
    // If positions is a string (single argument), convert to array
    // If positions is already an array, use it as-is
    let positionsArray: string[] = [];
    if (positions) {
      positionsArray = Array.isArray(positions) ? positions : [positions];
    }
    undoneTodo(positionsArray, todoModel);
  });

program
  .command('remove <positions...>')
  .alias('rm')
  .description('Remove todo items by position numbers')
  .action((positions) => removeTodo(positions, todoModel));

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

program
  .command('data-location [action]')
  .description('Show current data location or change it (actions: show, change)')
  .action((action) => {
    if (action === 'change') {
      changeDataLocation();
    } else {
      showDataLocation();
    }
  });

program.parse();
