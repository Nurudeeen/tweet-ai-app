import { Table, Column, Model, ForeignKey, BelongsTo, Unique, PrimaryKey, DataType } from 'sequelize-typescript';
import { Post } from './post.entity';

@Table
export class Comment extends Model {
  @Unique
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

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