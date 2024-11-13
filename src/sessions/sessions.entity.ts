import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  session: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.session, { onDelete: 'CASCADE' })
  user: User;
}
