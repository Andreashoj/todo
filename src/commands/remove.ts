import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function removeTodo(positions: string[], todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    if (positions.length === 0) {
      console.log('Please provide at least one position to remove.');
      return;
    }
    
    const removedTasks: { position: number; task: string }[] = [];
    const failedPositions: string[] = [];
    
    // Sort positions in descending order to avoid index shifting issues when removing
    const sortedPositions = positions
      .map(p => parseInt(p))
      .filter(p => !isNaN(p))
      .sort((a, b) => b - a);
    
    const invalidPositions = positions.filter(p => isNaN(parseInt(p)));
    if (invalidPositions.length > 0) {
      failedPositions.push(...invalidPositions);
    }
    
    for (const position of sortedPositions) {
      const index = position - 1;
      
      if (index < 0 || index >= todos.length) {
        failedPositions.push(position.toString());
        continue;
      }
      
      const todo = todos[index];
      const success = await todoModel.remove(todo.id);
      
      if (success) {
        removedTasks.push({ position, task: todo.task });
        // Remove from our local todos array to keep positions accurate for remaining operations
        todos.splice(index, 1);
      } else {
        failedPositions.push(position.toString());
      }
    }
    
    // Display results
    if (removedTasks.length === 1) {
      console.log(`Removed todo ${removedTasks[0].position}: "${removedTasks[0].task}"`);
    } else if (removedTasks.length > 1) {
      console.log(`Removed ${removedTasks.length} todos:`);
      removedTasks
        .sort((a, b) => a.position - b.position)
        .forEach(({ position, task }) => {
          console.log(`  ${position}. "${task}"`);
        });
    }
    
    if (failedPositions.length > 0) {
      console.log(`Failed to remove positions: ${failedPositions.join(', ')}`);
      const originalTodosLength = await todoModel.list().then(todos => todos.length) + removedTasks.length;
      console.log(`Valid positions were between 1 and ${originalTodosLength}`);
    }
    
    if (removedTasks.length > 0) {
      console.log();
      // Show updated list with current todo
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    }
  } catch (error) {
    console.error('Error removing todo:', error);
  }
}
