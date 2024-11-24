import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Sessions } from '../sessions/sessions.entity';

@Entity()
export class Mailing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sessions, (session) => session.mailings, { eager: true })
  session: Sessions;
  @Column()
  messageText: string;

  @Column()
  folderId: number;

  @Column()
  batchSize: number;

  @Column()
  waitTime: number;

  @Column({ default: false })
  isCyclic: boolean;

  @Column({ default: false })
  started: boolean; // Поле для отслеживания статуса запуска

  @ManyToOne(() => User, (user) => user.mailings)
  user: User;
}
