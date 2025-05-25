import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddIsItemRedeemableFlag1748165062421 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
