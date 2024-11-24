// session.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Mailing } from '../mailing/mailing.entity';

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  session: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Mailing, (mailing) => mailing.session) // Обратная связь
  mailings: Mailing[];
}
