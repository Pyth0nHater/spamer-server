import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Mailing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session: string;

  @Column()
  messageText: string;

  @Column('simple-array')
  usernames: string[];

  @Column()
  batchSize: number;

  @Column()
  waitTime: number;

  @ManyToOne(() => User, (user) => user.mailings, { onDelete: 'CASCADE' })
  user: User;
}