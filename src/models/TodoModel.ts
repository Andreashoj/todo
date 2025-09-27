import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { Todo, TodoStore } from '../types';
import { generateId } from '../utils/helpers';

export class TodoModel implements TodoStore {
  public todos: Todo[] = [];
  private filePath: string;

  constructor() {
    this.filePath = join(homedir(), '.todo-cli.json');
  }

  async save(): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.todos, null, 2));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  async load(): Promise<Todo[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.todos = parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
      }));
      return this.todos;
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      this.todos = [];
      return this.todos;
    }
  }

  async add(todo: Todo): Promise<void> {
    await this.load();
    this.todos.push(todo);
    await this.save();
  }

  async remove(id: string): Promise<boolean> {
    await this.load();
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(todo => todo.id !== id);
    
    if (this.todos.length < initialLength) {
      await this.save();
      return true;
    }
    return false;
  }

  async complete(id: string): Promise<boolean> {
    await this.load();
    const todo = this.todos.find(t => t.id === id);
    
    if (todo && !todo.completed) {
      todo.completed = true;
      todo.completedAt = new Date();
      await this.save();
      return true;
    }
    return false;
  }

  async list(): Promise<Todo[]> {
    return await this.load();
  }
}