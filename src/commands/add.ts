import { TodoModel } from '../models/TodoModel';
import { createTodo } from '../utils/helpers';

export async function addTodo(task: string, todoModel: TodoModel): Promise<void> {
  try {
    const todo = createTodo(task);
    await todoModel.add(todo);
    console.log(`Added todo: "${task}"`);
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}
