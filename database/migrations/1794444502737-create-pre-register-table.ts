import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePreRegisterTable1794444502737 implements MigrationInterface {
    name = 'CreatePreRegisterTable1794444502737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pre_register" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(64) NOT NULL, "token_hash" character varying(255) NOT NULL, "jti" character varying NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_92e08ea04bea080b097dad453d3" UNIQUE ("email"), CONSTRAINT "UQ_3191a0e77733ebcc465a87340ec" UNIQUE ("jti"), CONSTRAINT "PK_da786d4c6f01e1cbb0be67607a6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pre_register"`);
    }

}
