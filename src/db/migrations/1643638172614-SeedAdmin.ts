import { ConfigService } from '@nestjs/config';
// npm run db:migration:gen SeedAdmin

import { MigrationInterface, QueryRunner } from 'typeorm';

import { PasswordTransformer } from './../../common/password-transformer';

export class SeedAdmin1643638172614 implements MigrationInterface {
  name = 'SeedAdmin1643638172614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordTransformer = new PasswordTransformer(new ConfigService());
    await queryRunner.query(`
        INSERT INTO "user" (name, login, password)
        VALUES (
            'admin',
            'admin',
            '${passwordTransformer.to('admin')}'
          )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "user"
        WHERE login = 'admin'
    `);
  }
}

// __EOF__
