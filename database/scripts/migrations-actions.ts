import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

interface MigrationPaths {
  datasourcePath: string;
  migrationPath: string;
  packageManager: string;
}

export class MigrationActions {
  private static generateMigrationConfig = (
    migrationName: string = 'base',
  ): MigrationPaths => {
    const packageManager = process.env.PACKAGE_MANAGER ?? 'pnpm';

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

  private static executeTypeorm = (
    packagemanager: string,
    args: string[],
  ): void => {
    execFileSync(packagemanager, ['typeorm-ts-node-esm', ...args], {
      stdio: 'inherit',
      shell: true,
    });
  };

  static generateMigration = (migrationName: string): void => {
    console.log(
      `Generating migration "${migrationName}" from entity changes...`,
    );
    const { datasourcePath, migrationPath, packageManager } =
      this.generateMigrationConfig(migrationName);

    this.executeTypeorm(packageManager, [
      'migration:generate',
      migrationPath,
      '-d',
      datasourcePath,
    ]);
  };

  static createMigration = (migrationName: string): void => {
    console.log(`Creating empty migration "${migrationName}"...`);
    const { migrationPath, packageManager } =
      this.generateMigrationConfig(migrationName);

    this.executeTypeorm(packageManager, ['migration:create', migrationPath]);
  };

  static runMigrations = (): void => {
    console.log('Running pending migrations...');
    const { packageManager, datasourcePath } = this.generateMigrationConfig();
    this.executeTypeorm(packageManager, [
      'migration:run',
      '-d',
      datasourcePath,
    ]);
  };

  static revertMigration = (): void => {
    console.log('Reverting the last executed migration...');
    const { packageManager, datasourcePath } = this.generateMigrationConfig();

    this.executeTypeorm(packageManager, [
      'migration:revert',
      '-d',
      datasourcePath,
    ]);
  };
}
