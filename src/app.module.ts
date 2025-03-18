import { ClusterModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClusterModule.forRoot({
      config: {
        nodes: [
          { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) }
        ],
        redisOptions: {
          password: process.env.REDIS_PASSWORD,
          db: Number(process.env.REDIS_DB)
        }
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
