export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TodoStore {
  todos: Todo[];
  save(): Promise<void>;
  load(): Promise<Todo[]>;
  add(todo: Todo): Promise<void>;
  remove(id: string): Promise<boolean>;
  complete(id: string): Promise<boolean>;
  list(): Promise<Todo[]>;
}