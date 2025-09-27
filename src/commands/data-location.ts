import { SetupManager } from '../utils/setup';

export async function showDataLocation(): Promise<void> {
  const setupManager = new SetupManager();
  
  try {
    const config = await setupManager.getConfig();
    
    if (config) {
      console.log(`\nCurrent data location: ${config.dataPath}`);
      console.log('\nTo change the data location, run: todo data-location change\n');
    } else {
      console.log('\nNo data location configured yet.');
      console.log('Run any todo command to start the setup process.\n');
    }
  } catch (error) {
    console.error('Error reading data location:', error);
  }
}

export async function changeDataLocation(): Promise<void> {
  const setupManager = new SetupManager();
  
  try {
    await setupManager.changeDataLocation();
  } catch (error) {
    console.error('Error changing data location:', error);
  }
}