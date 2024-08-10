import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './post.entity';

@Table
export class Comment extends Model {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  body: string;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}