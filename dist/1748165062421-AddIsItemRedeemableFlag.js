"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsItemRedeemableFlag1748165062421 = void 0;
class AddIsItemRedeemableFlag1748165062421 {
    constructor() {
        this.name = 'AddIsItemRedeemableFlag1748165062421';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" ADD "isRedeemable" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isRedeemable"`);
    }
}
exports.AddIsItemRedeemableFlag1748165062421 = AddIsItemRedeemableFlag1748165062421;
//# sourceMappingURL=1748165062421-AddIsItemRedeemableFlag.js.map