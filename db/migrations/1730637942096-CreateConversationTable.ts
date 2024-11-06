import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationTable1730637942096 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "conversation" (
                "id"            uuid            NOT NULL   DEFAULT uuid_generate_v4(),
                "name"          varchar(100)    NOT NULL,
                "attendees"     jsonb          NULL,
                "created_by_id" uuid            NOT NULL,
                "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
                "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
                CONSTRAINT "PK_conversation_id"  PRIMARY KEY ("id"),
                CONSTRAINT "PK_conversation_created_by_id" FOREIGN KEY ("created_by_id") REFERENCES "user"("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
