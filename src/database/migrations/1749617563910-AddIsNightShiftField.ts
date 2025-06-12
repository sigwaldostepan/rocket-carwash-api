import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsNightShiftField1749617563910 implements MigrationInterface {
  name = 'AddIsNightShiftField1749617563910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "isNightShift" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isNightShift"`);
  }
}
