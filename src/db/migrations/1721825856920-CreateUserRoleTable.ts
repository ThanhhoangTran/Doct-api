import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRoleTable1721825856920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_role" (
            "id"            UUID    NOT NULL    DEFAULT uuid_generate_v4(),
            "user_id"       UUID    NOT NULL,
            "role_id"       UUID    NOT NULL,
            "created_at"    TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            "updated_at"    TIMESTAMP WITH TIME ZONE    DEFAULT now(),
            CONSTRAINT "PK_user_role_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_user_role_user_id" FOREIGN KEY ("user_id") REFERENCES  "user"("id"),
            CONSTRAINT "FK_user_role_role_id" FOREIGN KEY ("role_id") REFERENCES  "role"("id"),
            CONSTRAINT "UNQ_user_role_user_id_role_id" UNIQUE ("user_id", "role_id")
        )
    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
