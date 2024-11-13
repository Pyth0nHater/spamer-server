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

  @OneToMany(() => Sessions, (session) => session.user)
  session: Sessions[];

  @OneToMany(() => Mailing, (mailing) => mailing.user)
  mailings: Mailing[];
}
