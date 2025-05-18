import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserItemsModule } from './routes/user-items/user-items.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI!), UserItemsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
