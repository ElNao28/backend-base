import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRefreshTokenTable1793322891563 implements MigrationInterface {
    name = 'UpdateRefreshTokenTable1793322891563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "revoked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD "jti" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "UQ_e532a5fe469da358494917ce2bf" UNIQUE ("jti")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "UQ_e532a5fe469da358494917ce2bf"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "jti"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "revoked"`);
    }

}
