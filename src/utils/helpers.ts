import { randomBytes } from 'crypto';
import { Todo } from '../types';

export function generateId(): string {
  return randomBytes(4).toString('hex');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function createTodo(task: string): Todo {
  return {
    id: generateId(),
    task,
    completed: false,
    createdAt: new Date(),
  };
}

export function displayTodos(todos: Todo[]): void {
  if (todos.length === 0) {
    console.log('No todos found!');
    return;
  }

  console.log('\nYour Todos:\n');
  
  todos.forEach((todo, index) => {
    const status = todo.completed ? '[DONE]' : '[TODO]';
    const completedText = todo.completed && todo.completedAt 
      ? ` (completed: ${formatDate(todo.completedAt)})` 
      : '';
    
    console.log(`${index + 1}. [${todo.id}] ${status} ${todo.task}${completedText}`);
  });
  
  console.log(`\nTotal: ${todos.length} todos (${todos.filter(t => !t.completed).length} pending, ${todos.filter(t => t.completed).length} completed)\n`);
}
