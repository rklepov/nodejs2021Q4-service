// migration-gen-ormconfig.ts

import { ConfigModule } from '@nestjs/config';

import dbConfig from './src/db/config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [dbConfig],
});

export default dbConfig();

//__EOF__
