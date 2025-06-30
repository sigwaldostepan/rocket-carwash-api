import { MigrationInterface, QueryRunner } from "typeorm";
export declare class ChangeUniqueConstraint1751088853924 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
