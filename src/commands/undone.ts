import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function undoneTodo(position: number | undefined, todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    let targetPosition: number;
    
    if (position === undefined) {
      // Find the first completed todo
      const firstCompletedIndex = todos.findIndex(t => t.completed);
      if (firstCompletedIndex === -1) {
        console.log('No completed todos to undo!');
        return;
      }
      targetPosition = firstCompletedIndex + 1;
    } else {
      targetPosition = position;
    }
    
    // Validate position
    if (targetPosition < 1 || targetPosition > todos.length) {
      console.log(`Invalid position: ${targetPosition}. Please use a number between 1 and ${todos.length}.`);
      return;
    }
    
    const todoIndex = targetPosition - 1;
    const todo = todos[todoIndex];
    
    if (!todo.completed) {
      console.log(`Todo ${targetPosition} is not completed yet!`);
      return;
    }
    
    const success = await todoModel.uncomplete(todo.id);
    
    if (success) {
      console.log(`Undone todo ${targetPosition}: "${todo.task}"`);
      console.log(''); // Empty line for spacing
      
      // Show updated list
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    } else {
      console.log('Failed to undo todo. Please try again.');
    }
  } catch (error) {
    console.error('Error undoing todo:', error);
  }
}