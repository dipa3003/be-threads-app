import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.likes, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user: User;

    @ManyToOne(() => Thread, (thread) => thread.likes, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    thread: Thread;
}
