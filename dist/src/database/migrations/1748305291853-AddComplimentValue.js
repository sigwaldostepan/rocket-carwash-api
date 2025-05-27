"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddComplimentValue1748305291853 = void 0;
class AddComplimentValue1748305291853 {
    constructor() {
        this.name = 'AddComplimentValue1748305291853';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "isRedeemed"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "redeemedQuantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "complimentValue" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transTotal"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transTotal" numeric NOT NULL DEFAULT '0'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "transTotal"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "transTotal" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "complimentValue"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "redeemedQuantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "isRedeemed" boolean NOT NULL DEFAULT false`);
    }
}
exports.AddComplimentValue1748305291853 = AddComplimentValue1748305291853;
//# sourceMappingURL=1748305291853-AddComplimentValue.js.map