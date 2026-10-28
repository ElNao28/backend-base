import { confirm } from '@inquirer/prompts';
import { input } from '@inquirer/prompts';
import { select } from '@inquirer/prompts';

export class MenuOptions {
  static migrationType = async () =>
    select({
      message: 'Select a migration operation:',
      choices: [
        {
          name: 'generate',
          value: 'generate',
          description: 'Generate a migration file from entity files',
        },
        {
          name: 'create',
          value: 'create',
          description: 'Create an empty SQL file',
        },
        {
          name: 'run',
          value: 'run',
          description: 'Run all migrations in the migrations directory',
        },
        {
          name: 'revert',
          value: 'revert',
          description: 'Revert the last executed migration',
        },
      ],
    });

  static migrationName = async () =>
    input({
      message: 'Enter a name for the migration:',
      required: true,
      validate: (value) =>
        value.trim().length > 0 || 'Migration name cannot be empty.',
    });

  static confirmAction = (message = 'Are you sure?') =>
    confirm({
      message,
      default: false,
    });
}
