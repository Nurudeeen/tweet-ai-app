import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { User } from './entities/user.entity';
import { Throttle } from '@nestjs/throttler';

@Controller('api/autobots')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAutobots(@Query('page') page: number = 1): Promise<User[]> {
    const limit = 10;
    const offset = (page - 1) * limit;
    return this.userService.getAutobots(limit, offset);
  }

  @Get(':id/posts')
  async getAutobotPosts(
    @Param('id') id: string,
    @Query('page') page: number = 1
  ): Promise<Post[]> {
    const limit = 10;
    const offset = (page - 1) * limit;
    return this.userService.getAutobotPosts(id, limit, offset);
  }

  @Get('posts/:postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1
  ): Promise<Comment[]> {
    const limit = 10;
    const offset = (page - 1) * limit;
    return this.userService.getPostComments(postId, limit, offset);
  }
}
