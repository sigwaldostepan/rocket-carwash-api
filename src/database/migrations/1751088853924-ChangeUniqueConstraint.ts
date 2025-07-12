import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUniqueConstraint1751088853924 implements MigrationInterface {
  name = 'ChangeUniqueConstraint1751088853924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_03b046e9f79489d44fa3bb61631"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "UQ_03b046e9f79489d44fa3bb61631" UNIQUE ("invoiceNo")`,
    );
  }
}
