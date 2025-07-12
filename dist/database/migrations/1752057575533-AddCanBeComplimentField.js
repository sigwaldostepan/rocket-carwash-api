"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCanBeComplimentField1752057575533 = void 0;
class AddCanBeComplimentField1752057575533 {
    constructor() {
        this.name = 'AddCanBeComplimentField1752057575533';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" ADD "canBeComplimented" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "canBeComplimented"`);
    }
}
exports.AddCanBeComplimentField1752057575533 = AddCanBeComplimentField1752057575533;
//# sourceMappingURL=1752057575533-AddCanBeComplimentField.js.map