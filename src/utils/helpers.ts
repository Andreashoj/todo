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

export function displayTodos(todos: Todo[], currentTodoId?: string): void {
  if (todos.length === 0) {
    console.log('No todos found!');
    return;
  }

  console.log('\nYour Todos:\n');
  
  todos.forEach((todo, index) => {
    const checkbox = todo.completed ? '[X]' : '[ ]';
    const completedText = todo.completed && todo.completedAt 
      ? ` (completed: ${formatDate(todo.completedAt)})` 
      : '';
    
    // Add dart emoji to the current/focused todo
    const currentIndicator = (todo.id === currentTodoId && !todo.completed) ? ' 🎯' : '';
    
    console.log(`${index + 1}. ${checkbox} ${todo.task}${completedText}${currentIndicator}`);
  });
  
  console.log(`\nTotal: ${todos.length} todos (${todos.filter(t => !t.completed).length} pending, ${todos.filter(t => t.completed).length} completed)\n`);
}
