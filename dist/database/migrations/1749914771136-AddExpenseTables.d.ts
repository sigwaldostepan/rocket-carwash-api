import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddExpenseTables1749914771136 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
