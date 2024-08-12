import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Offset } from './entities/offset.entity';
import { AutobotGateway } from './autobot.gateway';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[
    SequelizeModule.forFeature([User, Post, Comment, Offset]),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
  ],
  controllers: [UserController],
  providers: [UserService, AutobotGateway, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class UserModule {}
