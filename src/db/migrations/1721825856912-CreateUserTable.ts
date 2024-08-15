import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1721825856912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
                "first_name"    VARCHAR(100)     NOT NULL,
                "last_name"     VARCHAR(100)     NOT NULL,
                "email"         VARCHAR(100)     NOT NULL,
                "password"      VARCHAR(100)     NOT NULL,
                "address"       VARCHAR          NOT NULL,
                "phone"         VARCHAR(100)     NOT NULL,
                "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
                "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
                CONSTRAINT "PK_user_id"  PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
