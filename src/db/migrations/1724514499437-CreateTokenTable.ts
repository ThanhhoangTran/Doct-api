import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTable1724514499437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "token" (
        "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
        "user_id"    UUID     NOT NULL,
        "access_token"    varchar(100)     NOT NULL,
        "refresh_token"   varchar(100)    NOT NULL,
        "email"      VARCHAR(100)     NOT NULL,
        "last_used"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
        CONSTRAINT "PK_token_id"  PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
