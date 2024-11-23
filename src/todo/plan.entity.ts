import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Priority } from './priority.enum';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'datetime', nullable: false })
  startDate: Date;

  @Column({ type: 'datetime', nullable: false })
  endDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: Priority, nullable: false })
  priority: Priority;

  @Column({ default: false })
  done: boolean;

  @ManyToOne(() => Plan, { nullable: true, onDelete: 'CASCADE' })
  parentPlan: Plan | null;
}
