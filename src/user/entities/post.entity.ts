import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Table
export class Post extends Model {
  @Column
  title: string;

  @Column
  body: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Comment)
  comments: Comment[];
}