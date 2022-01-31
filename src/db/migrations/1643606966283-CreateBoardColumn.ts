// npm run db:migration:gen CreateBoardColumn

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardColumn1643606966283 implements MigrationInterface {
  name = 'CreateBoardColumn1643606966283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "board_column" (
                "columnId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "order" integer NOT NULL,
                "boardId" uuid,
                CONSTRAINT "PK_b4998ae27b61758fe4e19f2de00" PRIMARY KEY ("columnId")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "task"
            ADD CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b" FOREIGN KEY ("columnId") REFERENCES "board_column"("columnId") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task" DROP CONSTRAINT "FK_f56fe6f2d8ab0b970f764bd601b"
        `);
    await queryRunner.query(`
            DROP TABLE "board_column"
        `);
  }
}

// __EOF__
