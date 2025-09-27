import { TodoModel } from '../models/TodoModel';

export async function removeTodo(id: string, todoModel: TodoModel): Promise<void> {
  try {
    const success = await todoModel.remove(id);
    
    if (success) {
      console.log(`Removed todo [${id}]`);
    } else {
      console.log(`Todo [${id}] not found`);
    }
  } catch (error) {
    console.error('Error removing todo:', error);
  }
}
