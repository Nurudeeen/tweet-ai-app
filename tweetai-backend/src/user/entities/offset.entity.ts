import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class PostOffset extends Model {
  @Column({ primaryKey: true, type: DataType.STRING })
  key: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  value: number;
}

@Table
export class CommentOffset extends Model {
  @Column({ primaryKey: true, type: DataType.STRING })
  key: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  value: number;
}

@Table
export class UserOffset extends Model {
  @Column({ primaryKey: true, type: DataType.STRING })
  key: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  value: number;
}
