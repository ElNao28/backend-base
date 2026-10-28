import { confirm, input, select } from '@inquirer/prompts';

export class MenuOptions {
  static migrationType = async (): Promise<number> =>
    select({
      message: 'Select a migration operation:',
      choices: [
        {
          name: 'Run pending migrations',
          value: 1,
          description: 'Apply migrations that have not yet been executed',
        },
        {
          name: 'Generate a new migration',
          value: 2,
          description:
            'Compare entities with the database schema and generate the required migration',
        },
        {
          name: 'Create an empty migration',
          value: 3,
          description: 'Create a migration file to write SQL changes manually',
        },
        {
          name: 'Revert the last migration',
          value: 4,
          description: 'Undo the most recently executed migration',
        },
      ],
    });

  static migrationName = async (): Promise<string> => {
    const name = await input({
      message: 'Enter a name for the migration:',
      required: true,
      validate: (value) => {
        if (!value.trim()) {
          return 'Migration name cannot be empty.';
        }
        return (
          this.sanitizeName(value).length > 0 ||
          'Migration name must contain at least one letter or number.'
        );
      },
    });

    return this.sanitizeName(name);
  };

  static confirmAction = (message = 'Are you sure?'): Promise<boolean> =>
    confirm({
      message,
      default: false,
    });

  private static sanitizeName = (name: string): string =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
}
