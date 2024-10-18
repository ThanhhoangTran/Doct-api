import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimeOpeningTable1724607324601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE EVENT_TYPE AS ENUM ('appointment', 'meeting', 'operation');
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "time_opening" (
            "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
            "start_opening" TIMESTAMP WITH TIME ZONE    NULL,
            "end_opening"   TIMESTAMP WITH TIME ZONE    NULL, 
            "event"     EVENT_TYPE  NOT NULL,
            "user_id"   UUID     NOT NULL,
            "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            CONSTRAINT "PK_time_opening_id"  PRIMARY KEY ("id"),
            CONSTRAINT "PK_time_opening_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id")
        )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
