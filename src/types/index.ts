export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TodoList {
  id: string;
  createdAt: Date;
  archived: boolean;
  archivedAt?: Date;
  currentTodoId?: string;
  todos: Todo[];
}

export interface TodoData {
  currentList: TodoList | null;
  archivedLists: TodoList[];
}

export interface TodoStore {
  data: TodoData;
  save(): Promise<void>;
  load(): Promise<TodoData>;
  add(todo: Todo): Promise<void>;
  remove(id: string): Promise<boolean>;
  complete(id: string): Promise<boolean>;
  list(): Promise<Todo[]>;
  archive(): Promise<void>;
  clearArchives(): Promise<void>;
  getArchivedLists(): Promise<TodoList[]>;
  getArchivedList(date: string): Promise<TodoList | null>;
  getCurrentTodo(): Promise<Todo | null>;
  focusOnTodo(position: number): Promise<boolean>;
  focusOnNextPending(): Promise<void>;
}
