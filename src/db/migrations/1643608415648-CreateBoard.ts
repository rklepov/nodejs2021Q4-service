import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBoard1643608415648 implements MigrationInterface {
    name = 'CreateBoard1643608415648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "board" (
                "boardId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                CONSTRAINT "PK_8db634dbfdd38c51ac9aeed3b2a" PRIMARY KEY ("boardId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ALTER COLUMN "boardId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "board_column"
            ADD CONSTRAINT "FK_7d6b58efcc37a760ffd108eec72" FOREIGN KEY ("boardId") REFERENCES "board"("boardId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3" FOREIGN KEY ("boardId") REFERENCES "board"("boardId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_d88edac9d7990145ff6831a7bb3"
        `);
        await queryRunner.query(`
            ALTER TABLE "board_column" DROP CONSTRAINT "FK_7d6b58efcc37a760ffd108eec72"
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ALTER COLUMN "boardId" DROP NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "board"
        `);
    }

}
