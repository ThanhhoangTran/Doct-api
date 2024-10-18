import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtenstion1721666766738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "unaccent";  
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('SELECT 1;');
  }
}
