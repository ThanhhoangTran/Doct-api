import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsultationScheduleTable1724608513039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE CONSULTATION_TYPE AS ENUM ('clinic', 'video');
    `);

    await queryRunner.query(`
        CREATE TYPE CONSULTATION_STATUS AS ENUM ('confirmed', 'cancelled', 'rescheduled', 'waiting');
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "consultation_schedule" (
            "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
            "start_time" TIMESTAMP WITH TIME ZONE    NULL,
            "end_time"   TIMESTAMP WITH TIME ZONE    NULL, 
            "consultation_type"     CONSULTATION_TYPE  NOT NULL,
            "time_opening_id"   UUID     NOT NULL,
            "patient_info"      JSONB       NULL,
            "meeting_url"       VARCHAR     NULL,
            "user_id"           UUID        NULL,
            "status"           CONSULTATION_STATUS      DEFAULT  'waiting',
            "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            CONSTRAINT "PK_consultation_schedule_id"  PRIMARY KEY ("id"),
            CONSTRAINT "PK_consultation_schedule_time_opening_id" FOREIGN KEY ("time_opening_id") REFERENCES "time_opening"("id"),
            CONSTRAINT "PK_consultation_schedule_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
