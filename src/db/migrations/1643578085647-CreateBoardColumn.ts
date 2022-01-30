// npm run db:migration:gen CreateBoardColumn

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBoardColumn1643578085647 implements MigrationInterface {
  name = 'CreateBoardColumn1643578085647';

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "board_column"
        `);
  }
}

//__EOF__
