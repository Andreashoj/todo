import { TodoModel } from '../models/TodoModel';
import { formatDate } from '../utils/helpers';

export async function archiveList(todoModel: TodoModel): Promise<void> {
  try {
    const currentTodos = await todoModel.list();
    
    if (currentTodos.length === 0) {
      console.log('No todos to archive!');
      return;
    }
    
    await todoModel.archive();
    console.log(`Archived ${currentTodos.length} todos. Starting fresh!\n`);
    
    // Show the clean slate
    console.log('Your Todos:\n\nNo todos found!');
    console.log('\nTotal: 0 todos (0 pending, 0 completed)\n');
  } catch (error) {
    console.error('Error archiving todos:', error);
  }
}

export async function listArchives(todoModel: TodoModel): Promise<void> {
  try {
    const archives = await todoModel.getArchivedLists();
    
    if (archives.length === 0) {
      console.log('No archived lists found!');
      return;
    }
    
    console.log('\nArchived Lists:\n');
    
    // Group archives by date
    const archivesByDate = new Map<string, typeof archives>();
    archives.forEach(list => {
      const dateKey = list.createdAt.toISOString().split('T')[0];
      if (!archivesByDate.has(dateKey)) {
        archivesByDate.set(dateKey, []);
      }
      archivesByDate.get(dateKey)!.push(list);
    });
    
    // Sort dates in descending order (most recent first)
    const sortedDates = Array.from(archivesByDate.keys()).sort((a, b) => b.localeCompare(a));
    
    sortedDates.forEach((dateKey, dayIndex) => {
      const dayLists = archivesByDate.get(dateKey)!;
      const date = new Date(dateKey);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      console.log(`${dayIndex + 1}. ${dateStr} (${dayLists.length} list${dayLists.length > 1 ? 's' : ''}):`);
      
      // Sort lists within the day by creation time (most recent first)
      dayLists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      dayLists.forEach((list, listIndex) => {
        const timeStr = list.createdAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const totalTodos = list.todos.length;
        const completedTodos = list.todos.filter(t => t.completed).length;
        
        console.log(`   ${dayIndex + 1}.${listIndex + 1} ${timeStr} - ${totalTodos} todos (${totalTodos - completedTodos} pending, ${completedTodos} completed)`);
      });
      console.log();
    });
    
    console.log(`Total archived lists: ${archives.length}\n`);
  } catch (error) {
    console.error('Error listing archives:', error);
  }
}

export async function showArchive(archiveRef: string, todoModel: TodoModel): Promise<void> {
  try {
    // Parse the archive reference (e.g., "2" or "2.1")
    const parts = archiveRef.split('.');
    const dayNumber = parseInt(parts[0]);
    const listNumber = parts.length > 1 ? parseInt(parts[1]) : undefined;
    
    if (isNaN(dayNumber) || dayNumber < 1) {
      console.log(`Invalid archive reference: ${archiveRef}. Use format like "2" or "2.1"`);
      return;
    }
    
    if (listNumber !== undefined && (isNaN(listNumber) || listNumber < 1)) {
      console.log(`Invalid list number: ${parts[1]}. Use a positive number.`);
      return;
    }
    
    const archive = await todoModel.getArchivedListByNumber(dayNumber, listNumber);
    
    if (!archive) {
      console.log(`No archived list found for reference: ${archiveRef}`);
      return;
    }
    
    const displayRef = listNumber ? `${dayNumber}.${listNumber}` : `${dayNumber}.1`;
    console.log(`\nArchived List ${displayRef} from ${formatDate(archive.createdAt)}:\n`);
    
    if (archive.todos.length === 0) {
      console.log('No todos in this archived list!');
      return;
    }
    
    archive.todos.forEach((todo, index) => {
      const checkbox = todo.completed ? '[X]' : '[ ]';
      const completedText = todo.completed && todo.completedAt 
        ? ` (completed: ${formatDate(todo.completedAt)})` 
        : '';
      
      console.log(`${index + 1}. ${checkbox} ${todo.task}${completedText}`);
    });
    
    const totalTodos = archive.todos.length;
    const completedTodos = archive.todos.filter(t => t.completed).length;
    console.log(`\nTotal: ${totalTodos} todos (${totalTodos - completedTodos} pending, ${completedTodos} completed)\n`);
  } catch (error) {
    console.error('Error showing archive:', error);
  }
}

export async function clearArchives(todoModel: TodoModel): Promise<void> {
  try {
    const archives = await todoModel.getArchivedLists();
    
    if (archives.length === 0) {
      console.log('No archives to clear!');
      return;
    }
    
    await todoModel.clearArchives();
    console.log(`Cleared ${archives.length} archived lists.`);
  } catch (error) {
    console.error('Error clearing archives:', error);
  }
}