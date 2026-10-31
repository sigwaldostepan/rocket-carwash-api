import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1740000000000 implements MigrationInterface {
  name = 'InitialSchema1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric NOT NULL, "isRedeemable" boolean NOT NULL DEFAULT false, "isGetPoint" boolean NOT NULL DEFAULT false, "canBeComplimented" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '0', "redeemedQuantity" integer NOT NULL DEFAULT '0', "transactionId" uuid, "itemId" uuid, CONSTRAINT "PK_bafdd7fde2ed67494cf9cd9ec2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "phone_number" character varying NOT NULL, "point" integer DEFAULT '0', CONSTRAINT "UQ_68db634015cb7defd6b98f910f4" UNIQUE ("code"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceNo" character varying NOT NULL, "transTotal" numeric NOT NULL DEFAULT '0', "paymentMethod" character varying, "isCompliment" boolean NOT NULL DEFAULT false, "complimentValue" numeric NOT NULL DEFAULT '0', "isNightShift" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "customerId" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_478b68a9314d8787fb3763a2298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(255), "amount" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_46ace7094c8fa92dc33f82c9aa6" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_detail" ADD CONSTRAINT "FK_dc321d3ba426d32789f3d74aba6" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a"`);
    await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_16ead8467f1f71ac7232aa46ad3"`);
    await queryRunner.query(`ALTER TABLE "transaction_detail" DROP CONSTRAINT "FK_dc321d3ba426d32789f3d74aba6"`);
    await queryRunner.query(`ALTER TABLE "transaction_detail" DROP CONSTRAINT "FK_46ace7094c8fa92dc33f82c9aa6"`);
    await queryRunner.query(`DROP TABLE "expense"`);
    await queryRunner.query(`DROP TABLE "expense_category"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "transaction_detail"`);
    await queryRunner.query(`DROP TABLE "item"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
