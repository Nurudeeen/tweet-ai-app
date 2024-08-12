import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Offset } from './entities/offset.entity';
import { randomBytes } from 'crypto';
import { AutobotGateway } from './autobot.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Post) private readonly postModel: typeof Post,
    @InjectModel(Comment) private readonly commentModel: typeof Comment,
    @InjectModel(Offset) private readonly offsetModel: typeof Offset,
    private readonly autobotGateway: AutobotGateway, // Inject the WebSocket Gateway
  ) {}

  private readonly logger = new Logger(UserService.name);

  // This method is run every hour to create 500 Autobots
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    try {
      this.autobotGateway.emitAutobotCountUpdate(await this.userModel.count());

      this.logger.debug('Starting to create 500 new Autobots.');
    
      // Fetch the entire datasets once
      const [users, posts, comments] = await Promise.all([
        this.fetchData('https://jsonplaceholder.typicode.com/users'),
        this.fetchData('https://jsonplaceholder.typicode.com/posts'),
        this.fetchData('https://jsonplaceholder.typicode.com/comments'),
      ]);

      // Get the last offsets from the database
      let userOffsetRecord = await this.offsetModel.findOne({ where: { key: 'users_offset' } });
      let postOffsetRecord = await this.offsetModel.findOne({ where: { key: 'posts_offset' } });
      let commentOffsetRecord = await this.offsetModel.findOne({ where: { key: 'comments_offset' } });

      if (!userOffsetRecord) {
        userOffsetRecord = await this.offsetModel.create({ key: 'users_offset', value: 0 });
      }
      if (!postOffsetRecord) {
        postOffsetRecord = await this.offsetModel.create({ key: 'posts_offset', value: 0 });
      }
      if (!commentOffsetRecord) {
        commentOffsetRecord = await this.offsetModel.create({ key: 'comments_offset', value: 0 });
      }

      let userOffset = userOffsetRecord.value;
      let postOffset = postOffsetRecord.value;
      let commentOffset = commentOffsetRecord.value;

      // Create 500 new Autobots starting from the last user offset
      for (let i = 0; i < 500; i++) {
        const userIndex = (userOffset + i) % users.length;
        const user = users[userIndex];

        const newUser = await this.userModel.create({
          name: `${user.name}-${this.generateRandomString(6)}`,
          username: `${user.username}-${this.generateRandomString(6)}`,
          email: `${user.email}-${this.generateRandomString(6)}`,
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
            title: `${post.title}-${this.generateRandomString(8)}`,
            body: post.body,
            userId: newUser.id,
          });

          // Create 10 comments for each post
          for (let k = 0; k < 10; k++) {
            const commentIndex = (commentOffset + k) % comments.length;
            const comment = comments[commentIndex];
            await this.commentModel.create({
              name: `${comment.name}-${this.generateRandomString(6)}`,
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

      // Emit the updated Autobot count
      const totalAutobots = await this.userModel.count();
      this.autobotGateway.emitAutobotCountUpdate(totalAutobots); // Emit the new count

      this.logger.debug('Successfully created 500 new Autobots with their posts and comments.');
    } catch (error) {
      this.logger.error('Failed to create Autobots', error);
    }
  }

  // Helper function to fetch the entire dataset
  private async fetchData(apiUrl: string) {
    const response = await axios.get(apiUrl);
    return response.data;
  }

  // Helper function to generate a random string
  private generateRandomString(length: number): string {
    return randomBytes(length).toString('hex');
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
  async getPostComments(postId: string, limit: number, offset: number): Promise<Comment[]> {
    return this.commentModel.findAll({
      where: { postId },
      limit,
      offset,
    });
  }
}
