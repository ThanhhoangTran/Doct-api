import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1721692560566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE ROLE_NAME AS ENUM ('doctor', 'patient', 'super_admin');

      CREATE TABLE IF NOT EXISTS "role" (
        "id"          UUID      NOT NULL    DEFAULT uuid_generate_v4(),
        "name"        ROLE_NAME   NOT NULL,
        "description" VARCHAR   NOT NULL, 
        "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
        "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
        CONSTRAINT "PK_role_id" PRIMARY KEY ("id") 
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
