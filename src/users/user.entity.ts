import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: number;

  @Column()
  name: string;

  @Column({ default: false })
  Subscribed: boolean;
}
