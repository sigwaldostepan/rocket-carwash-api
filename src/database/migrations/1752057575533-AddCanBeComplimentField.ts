import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCanBeComplimentField1752057575533 implements MigrationInterface {
  name = 'AddCanBeComplimentField1752057575533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "canBeComplimented" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "canBeComplimented"`);
  }
}
