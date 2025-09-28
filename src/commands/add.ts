import { TodoModel } from '../models/TodoModel';
import { createTodo, displayTodos } from '../utils/helpers';

export async function addTodo(tasks: string[], todoModel: TodoModel): Promise<void> {
  try {
    if (tasks.length === 0) {
      console.log('Please provide at least one task to add.');
      return;
    }
    
    const addedTasks: string[] = [];
    
    for (const task of tasks) {
      if (task.trim()) {
        const todo = createTodo(task.trim());
        await todoModel.add(todo);
        addedTasks.push(task.trim());
      }
    }
    
    if (addedTasks.length === 1) {
      console.log(`Added todo: "${addedTasks[0]}"\n`);
    } else {
      console.log(`Added ${addedTasks.length} todos:`);
      addedTasks.forEach((task, index) => {
        console.log(`  ${index + 1}. "${task}"`);
      });
      console.log();
    }
    
    // Show updated list with current todo
    const updatedTodos = await todoModel.list();
    const currentTodo = await todoModel.getCurrentTodo();
    displayTodos(updatedTodos, currentTodo?.id);
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}
