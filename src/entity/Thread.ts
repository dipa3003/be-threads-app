import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity({ name: "threads" })
export class Thread {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    content: string;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => User, (user) => user.threads, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user: User;

    @OneToMany(() => Like, (like) => like.thread, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.thread, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    replies: Reply[];
}
