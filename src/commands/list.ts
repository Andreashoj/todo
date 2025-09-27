import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function listTodos(todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    const currentTodo = await todoModel.getCurrentTodo();
    displayTodos(todos, currentTodo?.id);
  } catch (error) {
    console.error('Error listing todos:', error);
  }
}
