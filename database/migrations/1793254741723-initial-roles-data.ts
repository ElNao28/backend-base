import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRolesData1793254741723 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "rol"(id, name) VALUES (1,'super_admin'), (2,'admin'),(3,'user')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "rol" WHERE id <= 3`);
  }
}
