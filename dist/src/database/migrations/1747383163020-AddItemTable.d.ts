import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddItemTable1747383163020 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
