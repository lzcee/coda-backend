import {MigrationInterface, QueryRunner} from "typeorm";

export class init1620090827557 implements MigrationInterface {
    name = 'init1620090827557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
