import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Sessions } from '../sessions/sessions.entity';
import { Mailing } from '../mailing/mailing.entity'; // Импортируем Mailing

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

  @Column({ default: 0 })
  Balance: number;

  @OneToMany(() => Sessions, (session) => session.user)
  sessions: Sessions[];

  @OneToMany(() => Mailing, (mailing) => mailing.user)
  mailings: Mailing[];

  @Column({ default: 0 })
  invitedBy: number;

  @Column({ default: 0 })
  inviteCount: number;

  @Column({ default: 0 })
  paidForUser: number;
}
