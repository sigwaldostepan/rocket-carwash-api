"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsNightShiftField1749617563910 = void 0;
class AddIsNightShiftField1749617563910 {
    constructor() {
        this.name = 'AddIsNightShiftField1749617563910';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "isNightShift" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "isNightShift"`);
    }
}
exports.AddIsNightShiftField1749617563910 = AddIsNightShiftField1749617563910;
//# sourceMappingURL=1749617563910-AddIsNightShiftField.js.map