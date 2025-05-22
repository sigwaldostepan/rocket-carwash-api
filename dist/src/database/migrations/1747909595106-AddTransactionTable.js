"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTransactionTable1747909595106 = void 0;
class AddTransactionTable1747909595106 {
    constructor() {
        this.name = 'AddTransactionTable1747909595106';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "transaction_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isRedeemed" boolean NOT NULL DEFAULT false, "transactionId" uuid, "itemId" uuid, CONSTRAINT "PK_bafdd7fde2ed67494cf9cd9ec2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNo" character varying NOT NULL, "transTotal" integer NOT NULL, "paymentMethod" character varying, "isCompliment" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, CONSTRAINT "UQ_03b046e9f79489d44fa3bb61631" UNIQUE ("invoiceNo"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_46ace7094c8fa92dc33f82c9aa6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_dc321d3ba426d32789f3d74aba6" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP CONSTRAINT "FK_dc321d3ba426d32789f3d74aba6"`);
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP CONSTRAINT "FK_46ace7094c8fa92dc33f82c9aa6"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction_detail"`);
    }
}
exports.AddTransactionTable1747909595106 = AddTransactionTable1747909595106;
//# sourceMappingURL=1747909595106-AddTransactionTable.js.map