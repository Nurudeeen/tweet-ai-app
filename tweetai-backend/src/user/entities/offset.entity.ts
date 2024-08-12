import { Column, DataType, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table
export class Offset extends Model {
  @PrimaryKey
  @Column({ type: DataType.STRING })
  key: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  value: number;
}
