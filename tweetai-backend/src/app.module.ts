import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { Post } from './user/entities/post.entity';
import { Comment } from './user/entities/comment.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { Offset } from './user/entities/offset.entity';

dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      uri: process.env.DATABASE_URL as string,
      logging: false,
      synchronize: true,
      //autoLoadModels: true,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      models: [User, Post, Comment, Offset],
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
