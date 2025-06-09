"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsGetPointField1749397972232 = void 0;
class AddIsGetPointField1749397972232 {
    constructor() {
        this.name = 'AddIsGetPoint1749397972232';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" ADD "isGetPoint" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "isGetPoint"`);
    }
}
exports.AddIsGetPointField1749397972232 = AddIsGetPointField1749397972232;
//# sourceMappingURL=1749397972232-AddIsGetPoint.js.map