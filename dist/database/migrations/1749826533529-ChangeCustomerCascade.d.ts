import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class ChangeCustomerCascade1749826533529 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
