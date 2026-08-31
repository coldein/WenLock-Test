import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUsersTable1788200265635 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
