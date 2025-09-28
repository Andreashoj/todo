import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function undoneTodo(positions: string[], todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    const undoneTasks: { position: number; task: string }[] = [];
    const failedPositions: string[] = [];
    
    if (positions.length === 0) {
      // Find the first completed todo
      const firstCompletedIndex = todos.findIndex(t => t.completed);
      if (firstCompletedIndex === -1) {
        console.log('No completed todos to undo!');
        return;
      }
      const targetPosition = firstCompletedIndex + 1;
      const todo = todos[firstCompletedIndex];
      
      const success = await todoModel.uncomplete(todo.id);
      if (success) {
        undoneTasks.push({ position: targetPosition, task: todo.task });
      } else {
        console.log('Failed to undo todo. Please try again.');
        return;
      }
    } else {
      // Process multiple positions
      // Sort positions in descending order to avoid index shifting issues
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
        
        const targetTodo = todos[index];
        if (!targetTodo.completed) {
          failedPositions.push(`${position} (not completed)`);
          continue;
        }
        
        const success = await todoModel.uncomplete(targetTodo.id);
        if (success) {
          undoneTasks.push({ position, task: targetTodo.task });
        } else {
          failedPositions.push(position.toString());
        }
      }
    }
    
    // Display results
    if (undoneTasks.length === 1) {
      console.log(`Undone todo ${undoneTasks[0].position}: "${undoneTasks[0].task}"`);
    } else if (undoneTasks.length > 1) {
      console.log(`Undone ${undoneTasks.length} todos:`);
      undoneTasks
        .sort((a, b) => a.position - b.position)
        .forEach(({ position, task }) => {
          console.log(`  ${position}. "${task}"`);
        });
    }
    
    if (failedPositions.length > 0) {
      console.log(`Failed to undo positions: ${failedPositions.join(', ')}`);
      console.log(`Valid positions are between 1 and ${todos.length}`);
    }
    
    if (undoneTasks.length > 0) {
      console.log();
      // Show updated list with current todo ID
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    }
  } catch (error) {
    console.error('Error undoing todo:', error);
  }
}
