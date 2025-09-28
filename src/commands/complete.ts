import { TodoModel } from '../models/TodoModel';
import { displayTodos } from '../utils/helpers';

export async function completeTodo(positions: string[], todoModel: TodoModel): Promise<void> {
  try {
    const todos = await todoModel.list();
    
    if (todos.length === 0) {
      console.log('No todos found!');
      return;
    }
    
    const completedTasks: { position: number; task: string }[] = [];
    const failedPositions: string[] = [];
    
    if (positions.length === 0) {
      // Use current focused todo
      const targetTodo = await todoModel.getCurrentTodo();
      if (!targetTodo) {
        console.log('No current todo to complete!');
        return;
      }
      // Find the position of the focused todo in the current list
      const todoIndex = todos.findIndex(t => t.id === targetTodo.id);
      const targetPosition = todoIndex + 1;
      
      const success = await todoModel.complete(targetTodo.id);
      if (success) {
        completedTasks.push({ position: targetPosition, task: targetTodo.task });
      } else {
        console.log(`Todo "${targetTodo.task}" not found or already completed`);
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
        if (targetTodo.completed) {
          failedPositions.push(`${position} (already completed)`);
          continue;
        }
        
        const success = await todoModel.complete(targetTodo.id);
        if (success) {
          completedTasks.push({ position, task: targetTodo.task });
        } else {
          failedPositions.push(position.toString());
        }
      }
    }
    
    // Display results
    if (completedTasks.length === 1) {
      console.log(`Completed todo ${completedTasks[0].position}: "${completedTasks[0].task}"`);
    } else if (completedTasks.length > 1) {
      console.log(`Completed ${completedTasks.length} todos:`);
      completedTasks
        .sort((a, b) => a.position - b.position)
        .forEach(({ position, task }) => {
          console.log(`  ${position}. "${task}"`);
        });
    }
    
    if (failedPositions.length > 0) {
      console.log(`Failed to complete positions: ${failedPositions.join(', ')}`);
      console.log(`Valid positions are between 1 and ${todos.length}`);
    }
    
    if (completedTasks.length > 0) {
      console.log();
      // Show updated list with current todo ID
      const updatedTodos = await todoModel.list();
      const currentTodo = await todoModel.getCurrentTodo();
      displayTodos(updatedTodos, currentTodo?.id);
    }
  } catch (error) {
    console.error('Error completing todo:', error);
  }
}
