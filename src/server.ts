// server.ts

import { PORT } from './common/config';
import app from './app';

app.start(Number(PORT) || 4000);

// __EOF__
