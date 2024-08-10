import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { Post } from "./post.entity";

@Table
export class User extends Model {
  @Unique
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Unique
  @Column
  username: string;

  @Column
  email: string;

  @Column({ type: DataType.JSON })
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };

  @Column
  phone: string;

  @Column
  website: string;

  @Column({ type: DataType.JSON })
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };

  @HasMany(() => Post)
  posts: Post[];
}
