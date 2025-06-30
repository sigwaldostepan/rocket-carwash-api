"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeCustomerCascade1749826533529 = void 0;
class ChangeCustomerCascade1749826533529 {
    constructor() {
        this.name = 'ChangeCustomerCascade1749826533529';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.ChangeCustomerCascade1749826533529 = ChangeCustomerCascade1749826533529;
//# sourceMappingURL=1749826533529-ChangeCustomerCascade.js.map