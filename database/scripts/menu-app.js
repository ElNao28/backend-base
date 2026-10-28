import { MenuOptions } from './menu-options.js';
import 'dotenv/config';
import { MigrationActions } from './migrations-actions.js';

(async () => {
  await main();
})();

async function main() {
  try {
    const actionType = await MenuOptions.migrationType();

    switch (actionType) {
      case 'run': {
        const isContinue = await MenuOptions.confirmAction(
          'Are you sure you want to run pending migrations?',
        );
        if (isContinue) MigrationActions.runMigrations();
        else console.log('Operation cancelled.');
        break;
      }

      case 'generate': {
        const migrationName = await MenuOptions.migrationName();
        MigrationActions.generateMigration(migrationName);
        break;
      }

      case 'create': {
        const migrationName = await MenuOptions.migrationName();
        MigrationActions.createMigration(migrationName);
        break;
      }

      case 'revert': {
        const isContinue = await MenuOptions.confirmAction(
          'Are you sure you want to revert the last executed migration?',
        );
        if (isContinue) MigrationActions.revertMigration();
        else console.log('Operation cancelled.');
        break;
      }

      default: {
        throw new Error(`Unknown migration operation: ${actionType}`);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log('\nOperation cancelled.');
      return;
    }

    console.error('\nAn unexpected error occurred:', error);
    process.exitCode = 1;
  }
}
