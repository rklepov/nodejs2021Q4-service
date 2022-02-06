// file.interceptor.ts

import { FileInterceptor as ExpressFileInterceptor } from '@nestjs/platform-express';

type FileInterceptorFactoryType = typeof ExpressFileInterceptor;

export const FileInterceptor: FileInterceptorFactoryType = (
  fieldName,
  localOptions,
) => {
  return ExpressFileInterceptor(fieldName, localOptions);
};

// __EOF__
