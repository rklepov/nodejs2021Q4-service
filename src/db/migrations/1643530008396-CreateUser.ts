// npm run db:migration:gen CreateUser

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1643530008396 implements MigrationInterface {
  name = 'CreateUser1643530008396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "userId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"),
                CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}

// __EOF__
