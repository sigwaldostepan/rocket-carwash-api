"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeUniqueConstraint1751088853924 = void 0;
class ChangeUniqueConstraint1751088853924 {
    constructor() {
        this.name = 'ChangeUniqueConstraint1751088853924';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "UQ_03b046e9f79489d44fa3bb61631"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "UQ_03b046e9f79489d44fa3bb61631" UNIQUE ("invoiceNo")`);
    }
}
exports.ChangeUniqueConstraint1751088853924 = ChangeUniqueConstraint1751088853924;
//# sourceMappingURL=1751088853924-ChangeUniqueConstraint.js.map