import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function completeTodo(position: string | undefined, todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    let targetTodo;
    let targetPosition;
    
    if (position === undefined) {
      // Use current focused todo
      targetTodo = await todoModel.getCurrentTodo();
      if (!targetTodo) {
        console.log('No current todo to complete!');
        return;
      }
      // Find the position of the focused todo in the current list
      const todoIndex = todos.findIndex(t => t.id === targetTodo!.id);
      targetPosition = todoIndex + 1;
    } else {
      // Use specified position
      const index = parseInt(position) - 1; // Convert to 0-based index
      
      if (isNaN(index) || index < 0 || index >= todos.length) {
        console.log(`Invalid position: ${position}. Use a number between 1 and ${todos.length}`);
        return;
      }
      
      targetTodo = todos[index];
      targetPosition = parseInt(position);
    }
    
    const success = await todoModel.complete(targetTodo.id);
    
    if (success) {
      console.log(`Completed todo ${targetPosition}: "${targetTodo.task}"\n`);
      // Show updated list with current todo ID
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    } else {
      console.log(`Todo "${targetTodo.task}" not found or already completed`);
    }
  } catch (error) {
    console.error('Error completing todo:', error);
  }
}
