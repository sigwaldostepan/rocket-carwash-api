"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddItemTable1747383163020 = void 0;
class AddItemTable1747383163020 {
    constructor() {
        this.name = 'AddItemTable1747383163020';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "item"`);
    }
}
exports.AddItemTable1747383163020 = AddItemTable1747383163020;
//# sourceMappingURL=1747383163020-AddItemTable.js.map