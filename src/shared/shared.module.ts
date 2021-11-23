import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogsInterceptor } from './logs.interceptor';
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogsInterceptor,
    },
  ],
})
export class SharedModule {}
