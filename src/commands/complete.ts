import { TodoModel } from '../models/TodoModel';

export async function completeTodo(id: string, todoModel: TodoModel): Promise<void> {
  try {
    const success = await todoModel.complete(id);
    
    if (success) {
      console.log(`Completed todo [${id}]`);
    } else {
      console.log(`Todo [${id}] not found or already completed`);
    }
  } catch (error) {
    console.error('Error completing todo:', error);
  }
}
