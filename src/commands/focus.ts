import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function focusTodo(position: string, todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    const pos = parseInt(position);
    if (isNaN(pos) || pos < 1 || pos > todos.length) {
      console.log(`Invalid position: ${position}. Use a number between 1 and ${todos.length}`);
      return;
    }
    
    const todo = todos[pos - 1];
    if (todo.completed) {
      console.log(`Cannot focus on completed todo: "${todo.task}"`);
      return;
    }
    
    const success = await todoModel.focusOnTodo(pos);
    
    if (success) {
      console.log(`Focused on todo ${pos}: "${todo.task}"\n`);
      // Show updated list with new focus
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    } else {
      console.log(`Failed to focus on todo ${pos}`);
    }
  } catch (error) {
    console.error('Error focusing todo:', error);
  }
}