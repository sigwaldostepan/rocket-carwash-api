import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComplimentValue1748305291853 implements MigrationInterface {
    name = 'AddComplimentValue1748305291853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "isRedeemed"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "redeemedQuantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "complimentValue" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transTotal"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transTotal" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transTotal"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transTotal" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "complimentValue"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "redeemedQuantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "isRedeemed" boolean NOT NULL DEFAULT false`);
    }

}
