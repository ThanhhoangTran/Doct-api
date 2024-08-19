import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserVerificationRequestTable1721830347555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE USER_VERIFICATION_REQUEST_TYPE AS ENUM ('reset_password');

      CREATE TABLE IF NOT EXISTS "user_verification_request" (
        "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
        "email"    VARCHAR(100)     NOT NULL,
        "data"     JSONB    NULL,
        "expiration_time"   TIMESTAMP WITH TIME ZONE    NULL,
        "type"  USER_VERIFICATION_REQUEST_TYPE  NOT NULL,
        "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
        "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
        CONSTRAINT "PK_user_verification_request_id"  PRIMARY KEY ("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
