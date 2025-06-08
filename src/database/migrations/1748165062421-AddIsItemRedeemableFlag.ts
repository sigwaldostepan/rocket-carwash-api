import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsItemRedeemableFlag1748165062421 implements MigrationInterface {
  name = 'AddIsItemRedeemableFlag1748165062421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "isRedeemable" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isRedeemable"`);
  }
}
