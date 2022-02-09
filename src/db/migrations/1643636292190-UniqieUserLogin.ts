import {MigrationInterface, QueryRunner} from "typeorm";

export class UniqieUserLogin1643636292190 implements MigrationInterface {
    name = 'UniqieUserLogin1643636292190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_a62473490b3e4578fd683235c5e"
        `);
    }

}
