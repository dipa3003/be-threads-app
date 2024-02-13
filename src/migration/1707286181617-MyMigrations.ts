import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigrations1707286181617 implements MigrationInterface {
    name = 'MyMigrations1707286181617'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "name" character varying NOT NULL, "profile_pic" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "threads" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "likes" integer NOT NULL, "reply" integer NOT NULL, CONSTRAINT "PK_d8a74804c34fc3900502cd27275" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "threads"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
