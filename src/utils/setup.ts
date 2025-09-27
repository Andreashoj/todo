import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline';

interface DataConfig {
  dataPath: string;
  setupComplete: boolean;
}

export class SetupManager {
  private configPath: string;

  constructor() {
    // Config file is small and always in home directory for discovery
    this.configPath = join(homedir(), '.todo-cli-config.json');
  }

  async getConfig(): Promise<DataConfig | null> {
    try {
      const configData = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(configData);
    } catch (error) {
      return null;
    }
  }

  async saveConfig(config: DataConfig): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2));
  }

  async isSetupComplete(): Promise<boolean> {
    const config = await this.getConfig();
    return config?.setupComplete === true;
  }

  async getDataPath(): Promise<string | null> {
    const config = await this.getConfig();
    return config?.dataPath || null;
  }

  private prompt(question: string): Promise<string> {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  private getDefaultDataPath(): string {
    const platform = process.platform;
    
    if (platform === 'darwin') {
      // macOS: ~/Library/Application Support/todo-cli/
      return join(homedir(), 'Library', 'Application Support', 'todo-cli');
    } else if (platform === 'win32') {
      // Windows: %APPDATA%/todo-cli/
      return join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'todo-cli');
    } else {
      // Linux/Unix: ~/.local/share/todo-cli/
      return join(homedir(), '.local', 'share', 'todo-cli');
    }
  }

  async runFirstTimeSetup(): Promise<string> {
    console.log('\n🎯 Welcome to Todo CLI!');
    console.log('\nFor your privacy and security, we need to ask where you\'d like to store your todo data.');
    console.log('This is a one-time setup that you can change later with `todo data-location`.\n');

    const defaultPath = this.getDefaultDataPath();
    const homePath = join(homedir(), '.todo-cli');

    console.log('Available options:');
    console.log(`1. Platform standard (recommended): ${defaultPath}`);
    console.log(`2. Home directory: ${homePath}`);
    console.log('3. Custom path (you specify)');
    console.log('4. Current directory (portable, but data tied to this folder)');
    
    const choice = await this.prompt('\nChoose an option (1-4): ');
    
    let selectedPath: string;
    
    switch (choice) {
      case '1':
      case '':
        selectedPath = defaultPath;
        break;
      case '2':
        selectedPath = homePath;
        break;
      case '3':
        selectedPath = await this.prompt('Enter custom path: ');
        if (!selectedPath) {
          console.log('Invalid path, using default.');
          selectedPath = defaultPath;
        }
        break;
      case '4':
        selectedPath = process.cwd();
        break;
      default:
        console.log('Invalid choice, using default.');
        selectedPath = defaultPath;
    }

    // Create directory if it doesn't exist
    try {
      await fs.mkdir(selectedPath, { recursive: true });
      console.log(`\n✅ Data will be stored at: ${selectedPath}`);
    } catch (error) {
      console.error(`❌ Could not create directory: ${selectedPath}`);
      console.log('Falling back to home directory...');
      selectedPath = homePath;
      await fs.mkdir(selectedPath, { recursive: true });
    }

    // Save config
    await this.saveConfig({
      dataPath: selectedPath,
      setupComplete: true
    });

    console.log('\n🚀 Setup complete! You can now start using todo CLI.');
    console.log('Type `todo --help` to see available commands.\n');

    return selectedPath;
  }

  async changeDataLocation(): Promise<void> {
    const currentConfig = await this.getConfig();
    const currentPath = currentConfig?.dataPath || 'Not set';
    
    console.log(`\nCurrent data location: ${currentPath}\n`);
    
    const defaultPath = this.getDefaultDataPath();
    const homePath = join(homedir(), '.todo-cli');

    console.log('Available options:');
    console.log(`1. Platform standard: ${defaultPath}`);
    console.log(`2. Home directory: ${homePath}`);
    console.log('3. Custom path');
    console.log('4. Current directory');
    console.log('5. Cancel');
    
    const choice = await this.prompt('\nChoose an option (1-5): ');
    
    if (choice === '5') {
      console.log('Cancelled.');
      return;
    }
    
    let selectedPath: string;
    
    switch (choice) {
      case '1':
        selectedPath = defaultPath;
        break;
      case '2':
        selectedPath = homePath;
        break;
      case '3':
        selectedPath = await this.prompt('Enter custom path: ');
        if (!selectedPath) {
          console.log('Invalid path, cancelled.');
          return;
        }
        break;
      case '4':
        selectedPath = process.cwd();
        break;
      default:
        console.log('Invalid choice, cancelled.');
        return;
    }

    // Ask about migrating existing data
    if (currentConfig && currentPath !== selectedPath) {
      const migrate = await this.prompt(`Would you like to migrate existing data to the new location? (y/N): `);
      
      if (migrate.toLowerCase() === 'y' || migrate.toLowerCase() === 'yes') {
        try {
          await fs.mkdir(selectedPath, { recursive: true });
          // Check for existing data files (could be todos.json or .todo-cli.json)
          let oldDataFile: string | null = join(currentPath, 'todos.json');
          let fallbackFile = join(currentPath, '.todo-cli.json');
          
          // Check which file exists
          try {
            await fs.access(oldDataFile);
          } catch {
            try {
              await fs.access(fallbackFile);
              oldDataFile = fallbackFile;
            } catch {
              oldDataFile = null;
            }
          }
          
          const newDataFile = join(selectedPath, 'todos.json');
          
          if (oldDataFile) {
            try {
              const data = await fs.readFile(oldDataFile, 'utf-8');
              await fs.writeFile(newDataFile, data);
              await fs.unlink(oldDataFile); // Remove old file
              console.log('✅ Data migrated successfully!');
            } catch (error) {
              console.log('ℹ️ Error migrating data:', error);
            }
          } else {
            console.log('ℹ️ No existing data found to migrate.');
          }
        } catch (error) {
          console.error('❌ Failed to migrate data:', error);
          return;
        }
      }
    }

    // Create directory and save config
    try {
      await fs.mkdir(selectedPath, { recursive: true });
      await this.saveConfig({
        dataPath: selectedPath,
        setupComplete: true
      });
      console.log(`\n✅ Data location updated to: ${selectedPath}\n`);
    } catch (error) {
      console.error(`❌ Could not create directory: ${selectedPath}`);
    }
  }
}