import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";

@Entity({ name: "replies" })
export class Reply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    content: string;

    @Column()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.replies, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user: User;

    @ManyToOne(() => Thread, (thread) => thread.replies, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    thread: Thread;
}
