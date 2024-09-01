import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorProfileTable1724607144741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "doctor_profile" (
            "id"            UUID        NOT NULL        DEFAULT uuid_generate_v4(),
            "user_id"    UUID     NOT NULL,
            "ratting"     float         DEFAULT 0,
            "created_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            "updated_at"  TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            CONSTRAINT "PK_doctor_profile_id"  PRIMARY KEY ("id"),
            CONSTRAINT "PK_doctor_profile_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id")
        )
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
