import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsGetPointField1749397972232 implements MigrationInterface {
  name = 'AddIsGetPoint1749397972232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" ADD "isGetPoint" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isGetPoint"`);
  }
}
