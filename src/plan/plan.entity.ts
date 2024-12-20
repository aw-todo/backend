import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: "text", nullable: true })
    text: string;

    @Column({ type: "datetime", nullable: false })
    startDate: Date;

    @Column({ type: "datetime", nullable: false })
    endDate: Date;

    @CreateDateColumn()
    created_at: Date;

    @Column({ default: false })
    done: boolean;

    @Column({ type: "varchar", nullable: false })
    color: string;

    @ManyToOne(() => Plan, { nullable: true, onDelete: "CASCADE" })
    parentPlan: Plan | null;
}
