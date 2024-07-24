import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRoleData1721837110472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "role" ("name", "description")
        VALUES ('patient', 'patient of system'),
        ('doctor', 'doctor, who use system to raise schedule');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
