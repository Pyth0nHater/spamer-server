import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  link: string;

  @Column()
  invoiceId: number;

  @Column({ default: 'active' })
  status: string;
}
