import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CommentOffset, PostOffset, UserOffset } from './entities/offset.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Post) private readonly postModel: typeof Post,
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(UserOffset) private readonly userOffsetModel: typeof UserOffset,
    @InjectModel(PostOffset) private readonly postOffsetModel: typeof PostOffset,
    @InjectModel(CommentOffset) private readonly commentOffsetModel: typeof CommentOffset,
  ) {}

  private readonly logger = new Logger(UserService.name);

  private readonly USERS_OFFSET_KEY = 'users_offset';
  private readonly POSTS_OFFSET_KEY = 'posts_offset';
  private readonly COMMENTS_OFFSET_KEY = 'comments_offset';

  // This method is run every hour to create 500 Autobots
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      this.logger.debug('Starting to create 500 new Autobots.');

      // Fetch users, posts, and comments
      const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/users'),
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/comments'),
      ]);

      const users = usersResponse.data;
      const posts = postsResponse.data;
      const comments = commentsResponse.data;

      // Get the last offsets from the database
      let userOffsetRecord = await this.userOffsetModel.findOne({ where: { key: this.USERS_OFFSET_KEY } });
      let postOffsetRecord = await this.postOffsetModel.findOne({ where: { key: this.POSTS_OFFSET_KEY } });
      let commentOffsetRecord = await this.commentOffsetModel.findOne({ where: { key: this.COMMENTS_OFFSET_KEY } });

      if (!userOffsetRecord) {
        userOffsetRecord = await this.userOffsetModel.create({ key: this.USERS_OFFSET_KEY, value: 0 });
      }
      if (!postOffsetRecord) {
        postOffsetRecord = await this.postOffsetModel.create({ key: this.POSTS_OFFSET_KEY, value: 0 });
      }
      if (!commentOffsetRecord) {
        commentOffsetRecord = await this.commentOffsetModel.create({ key: this.COMMENTS_OFFSET_KEY, value: 0 });
      }

      let userOffset = userOffsetRecord.dataValues;
      let postOffset = postOffsetRecord.dataValues;
      let commentOffset = commentOffsetRecord.dataValues;

      // Create 500 new Autobots starting from the last user offset
      for (let i = 0; i < 500; i++) {
        const userIndex = (userOffset + i) % users.length;
        const user = users[userIndex];
        const newUser = await this.userModel.create({
          name: `${user.name}-${uuidv4()}`,
          username: `${user.username}-${uuidv4()}`,
          email: `${user.email}-${uuidv4()}`,
          address: user.address,
          phone: user.phone,
          website: user.website,
          company: user.company,
        });

        // Create 10 posts for each Autobot
        for (let j = 0; j < 10; j++) {
          const postIndex = (postOffset + j) % posts.length;
          const post = posts[postIndex];
          const newPost = await this.postModel.create({
            title: `${post.title}-${uuidv4()}`,
            body: post.body,
            userId: newUser.id,
          });

          // Create 10 comments for each post
          for (let k = 0; k < 10; k++) {
            const commentIndex = (commentOffset + k) % comments.length;
            const comment = comments[commentIndex];
            await this.commentModel.create({
              name: `${comment.name}-${uuidv4()}`,
              email: comment.email,
              body: comment.body,
              postId: newPost.id,
            });
          }
        }
      }

      // Update the offsets to reflect the new starting points for the next run
      userOffsetRecord.value = (userOffset + 500) % users.length;
      postOffsetRecord.value = (postOffset + 100) % posts.length;
      commentOffsetRecord.value = (commentOffset + 1000) % comments.length;

      await userOffsetRecord.save();
      await postOffsetRecord.save();
      await commentOffsetRecord.save();

      this.logger.debug('Successfully created 500 new Autobots with their posts and comments.');
    } catch (error) {
      this.logger.error('Failed to create Autobots', error);
    }
  }

  // Method to get all Autobots
  async getAutobots(limit: number, offset: number): Promise<User[]> {
    return this.userModel.findAll({
      limit,
      offset,
      include: [Post],
    });
  }

  // Method to get an Autobot’s posts
  async getAutobotPosts(userId: string, limit: number, offset: number): Promise<Post[]> {
    return this.postModel.findAll({
      where: { userId },
      limit,
      offset,
      include: [Comment],
    });
  }

  // Method to get a post’s comments
  async getPostComments(postId: number, limit: number, offset: number): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { postId },
      limit,
      offset,
    });
  }
}
