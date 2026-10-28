import { execSync } from 'node:child_process';
import { join } from 'node:path';

const generateMigrationConfig = (migrationName = 'base') => {
  const packageManager = process.env.PACKAGE_MANAGER;

  const datasourcePath = join(
    process.cwd(),
    'database',
    'postgres.datasource.ts',
  );
  const migrationPath = join(
    process.cwd(),
    'database',
    'migrations',
    migrationName,
  );

  return {
    datasourcePath,
    migrationPath,
    packageManager,
  };
};

export class MigrationActions {
  static generateMigration = (migrationName) => {
    const formatName = migrationName.trim();
    console.log(`Generating migration "${formatName}" from entity changes...`);
    const { datasourcePath, migrationPath, packageManager } =
      generateMigrationConfig(formatName);

    try {
      execSync(
        `${packageManager} typeorm-ts-node-esm migration:generate ${migrationPath} -d ${datasourcePath}`,
        {
          stdio: 'inherit',
        },
      );
      console.log('Migration generated successfully.');
    } catch (error) {
      console.error('Failed to generate migration:', error.message);
      throw error;
    }
  };

  static createMigration = (migrationName) => {
    const formatName = migrationName.trim();
    console.log(`Creating empty migration "${formatName}"...`);
    const { migrationPath, packageManager } =
      generateMigrationConfig(formatName);
    try {
      execSync(
        `${packageManager} typeorm-ts-node-esm migration:create ${migrationPath}`,
      );
      console.log('Empty migration created successfully.');
    } catch (error) {
      console.error('Failed to create migration:', error.message);
      throw error;
    }
  };

  static runMigrations = () => {
    console.log('Running pending migrations...');
    const { packageManager, datasourcePath } = generateMigrationConfig();
    try {
      execSync(
        `${packageManager} typeorm-ts-node-esm migration:run -d ${datasourcePath}`,
        {
          stdio: 'inherit',
        },
      );
      console.log('Migrations executed successfully.');
    } catch (error) {
      console.error('Failed to run migrations:', error.message);
      throw error;
    }
  };

  static revertMigration = () => {
    console.log('Reverting the last executed migration...');
    const { packageManager, datasourcePath } = generateMigrationConfig();
    try {
      execSync(
        `${packageManager} typeorm-ts-node-esm migration:revert -d ${datasourcePath}`,
        {
          stdio: 'inherit',
        },
      );
      console.log('Last migration reverted successfully.');
    } catch (error) {
      console.error('Failed to revert migration:', error.message);
      throw error;
    }
  };
}
