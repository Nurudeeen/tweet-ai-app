import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Post } from "./post.entity";

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  username: string;

  @Column
  email: string;

  @HasMany(() => Post)
  posts: Post[];
}