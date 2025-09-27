#!/usr/bin/env node

import { program } from 'commander';
import { addTodo } from './commands/add';
import { listTodos } from './commands/list';
import { completeTodo } from './commands/complete';
import { removeTodo } from './commands/remove';
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
  .command('complete <id>')
  .alias('done')
  .description('Mark a todo item as complete')
  .action((id) => completeTodo(id, todoModel));

program
  .command('remove <id>')
  .alias('rm')
  .description('Remove a todo item')
  .action((id) => removeTodo(id, todoModel));

program.parse();
