import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { Todo, TodoStore, TodoData, TodoList } from '../types';
import { generateId } from '../utils/helpers';

export class TodoModel implements TodoStore {
  public data: TodoData = { currentList: null, archivedLists: [] };
  private filePath: string;

  constructor() {
    this.filePath = join(homedir(), '.todo-cli.json');
  }

  private createNewList(): TodoList {
    return {
      id: generateId(),
      createdAt: new Date(),
      archived: false,
      todos: []
    };
  }

  private ensureCurrentList(): void {
    if (!this.data.currentList) {
      this.data.currentList = this.createNewList();
    }
  }

  private ensureCurrentTodo(): void {
    if (!this.data.currentList) return;
    
    // If no current todo set, or current todo doesn't exist, set to first pending
    const currentTodo = this.data.currentList.todos.find(t => t.id === this.data.currentList!.currentTodoId);
    if (!this.data.currentList.currentTodoId || !currentTodo || currentTodo.completed) {
      const firstPending = this.data.currentList.todos.find(t => !t.completed);
      this.data.currentList.currentTodoId = firstPending?.id;
    }
  }

  async save(): Promise<void> {
    try {
      const dataToSave = {
        currentList: this.data.currentList,
        archivedLists: this.data.archivedLists
      };
      await fs.writeFile(this.filePath, JSON.stringify(dataToSave, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async load(): Promise<TodoData> {
    try {
      const fileData = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(fileData);
      
      // Handle new format
      if (parsed.currentList || parsed.archivedLists) {
        this.data = {
          currentList: parsed.currentList ? {
            ...parsed.currentList,
            createdAt: new Date(parsed.currentList.createdAt),
            archivedAt: parsed.currentList.archivedAt ? new Date(parsed.currentList.archivedAt) : undefined,
            todos: parsed.currentList.todos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
              completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
            }))
          } : null,
          archivedLists: parsed.archivedLists ? parsed.archivedLists.map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            archivedAt: list.archivedAt ? new Date(list.archivedAt) : undefined,
            todos: list.todos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
              completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
            }))
          })) : []
        };
      } else {
        // File doesn't exist or is in old format, start fresh
        this.data = { currentList: null, archivedLists: [] };
      }
      return this.data;
    } catch (error) {
      // File doesn't exist, start fresh
      this.data = { currentList: null, archivedLists: [] };
      return this.data;
    }
  }

  async add(todo: Todo): Promise<void> {
    await this.load();
    this.ensureCurrentList();
    
    // If this is the first todo, make it current
    const wasEmpty = this.data.currentList!.todos.length === 0;
    this.data.currentList!.todos.push(todo);
    
    if (wasEmpty || !this.data.currentList!.currentTodoId) {
      this.data.currentList!.currentTodoId = todo.id;
    }
    
    await this.save();
  }

  async remove(id: string): Promise<boolean> {
    await this.load();
    if (!this.data.currentList) return false;
    
    const initialLength = this.data.currentList.todos.length;
    this.data.currentList.todos = this.data.currentList.todos.filter(todo => todo.id !== id);
    
    if (this.data.currentList.todos.length < initialLength) {
      await this.save();
      return true;
    }
    return false;
  }

  async complete(id: string): Promise<boolean> {
    await this.load();
    if (!this.data.currentList) return false;
    
    const todo = this.data.currentList.todos.find(t => t.id === id);
    
    if (todo && !todo.completed) {
      todo.completed = true;
      todo.completedAt = new Date();
      
      // If we completed the current todo, focus on next pending
      if (this.data.currentList.currentTodoId === id) {
        const firstPending = this.data.currentList.todos.find(t => !t.completed);
        this.data.currentList.currentTodoId = firstPending?.id;
      }
      
      await this.save();
      return true;
    }
    return false;
  }

  async uncomplete(id: string): Promise<boolean> {
    await this.load();
    if (!this.data.currentList) return false;
    
    const todo = this.data.currentList.todos.find(t => t.id === id);
    
    if (todo && todo.completed) {
      todo.completed = false;
      todo.completedAt = undefined;
      
      // If no current todo is set, make this the current one
      if (!this.data.currentList.currentTodoId) {
        this.data.currentList.currentTodoId = todo.id;
      }
      
      await this.save();
      return true;
    }
    return false;
  }

  async list(): Promise<Todo[]> {
    await this.load();
    return this.data.currentList?.todos || [];
  }

  async archive(): Promise<void> {
    await this.load();
    if (!this.data.currentList || this.data.currentList.todos.length === 0) {
      return; // Nothing to archive
    }

    // Archive the current list
    this.data.currentList.archived = true;
    this.data.currentList.archivedAt = new Date();
    this.data.archivedLists.push(this.data.currentList);
    
    // Start fresh with a new current list
    this.data.currentList = this.createNewList();
    await this.save();
  }

  async clearArchives(): Promise<void> {
    await this.load();
    this.data.archivedLists = [];
    await this.save();
  }

  async getArchivedLists(): Promise<TodoList[]> {
    await this.load();
    return this.data.archivedLists;
  }

  async getArchivedList(date: string): Promise<TodoList | null> {
    await this.load();
    return this.data.archivedLists.find(list => 
      list.createdAt.toISOString().split('T')[0] === date
    ) || null;
  }

  async getCurrentTodo(): Promise<Todo | null> {
    await this.load();
    if (!this.data.currentList) return null;
    
    this.ensureCurrentTodo();
    
    if (!this.data.currentList.currentTodoId) return null;
    return this.data.currentList.todos.find(t => t.id === this.data.currentList!.currentTodoId) || null;
  }

  async focusOnTodo(position: number): Promise<boolean> {
    await this.load();
    this.ensureCurrentList();
    
    const index = position - 1;
    const todo = this.data.currentList!.todos[index];
    
    if (!todo || todo.completed) {
      return false;
    }
    
    this.data.currentList!.currentTodoId = todo.id;
    await this.save();
    return true;
  }

  async focusOnNextPending(): Promise<void> {
    await this.load();
    if (!this.data.currentList) return;
    
    const firstPending = this.data.currentList.todos.find(t => !t.completed);
    this.data.currentList.currentTodoId = firstPending?.id;
    await this.save();
  }

  async getArchivedListByNumber(dayNumber: number, listNumber?: number): Promise<TodoList | null> {
    await this.load();
    
    // Group archives by date
    const archivesByDate = new Map<string, TodoList[]>();
    this.data.archivedLists.forEach(list => {
      const dateKey = list.createdAt.toISOString().split('T')[0];
      if (!archivesByDate.has(dateKey)) {
        archivesByDate.set(dateKey, []);
      }
      archivesByDate.get(dateKey)!.push(list);
    });
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Array.from(archivesByDate.keys()).sort((a, b) => b.localeCompare(a));
    
    if (dayNumber < 1 || dayNumber > sortedDates.length) {
      return null;
    }
    
    const targetDateKey = sortedDates[dayNumber - 1];
    const dayLists = archivesByDate.get(targetDateKey)!;
    
    // Sort lists within the day by creation time (most recent first)
    dayLists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Default to first list if no listNumber specified
    const targetListIndex = (listNumber || 1) - 1;
    
    if (targetListIndex < 0 || targetListIndex >= dayLists.length) {
      return null;
    }
    
    return dayLists[targetListIndex];
  }
}
