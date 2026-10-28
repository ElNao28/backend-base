import 'dotenv/config';
import { MenuOptions } from './menu-options.js';
import { MigrationActions } from './migrations-actions.js';

(async () => {
  await main();
})();

async function main() {
  let menuOption;
  let isContinue: boolean = false;
  let shouldExit: boolean = false;

  do {
    try {
      menuOption = await MenuOptions.migrationType();
      switch (menuOption) {
        case 1: {
          isContinue = await MenuOptions.confirmAction(
            'Are you sure you want to run pending migrations?',
          );
          if (isContinue) MigrationActions.runMigrations();
          else console.log('Operation cancelled.');
          break;
        }

        case 2: {
          const migrationName = await MenuOptions.migrationName();
          MigrationActions.generateMigration(migrationName);
          break;
        }

        case 3: {
          const migrationName = await MenuOptions.migrationName();
          MigrationActions.createMigration(migrationName);
          break;
        }

        case 4: {
          isContinue = await MenuOptions.confirmAction(
            'Are you sure you want to revert the last executed migration?',
          );
          if (isContinue) MigrationActions.revertMigration();
          else console.log('Operation cancelled.');
          break;
        }
      }

      if (!shouldExit) {
        const continueOperation = await MenuOptions.confirmAction(
          'Would you like to perform another operation?',
        );

        shouldExit = !continueOperation;

        if (shouldExit) {
          console.log('Migration tool closed. Goodbye!');
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
  } while (!shouldExit);
}
