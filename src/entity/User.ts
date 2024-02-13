import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Thread } from "./Thread";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    bio: string;

    @Column()
    profile_pic: string;

    @OneToMany(() => Thread, (thread) => thread.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    threads: Thread[];

    @OneToMany(() => Like, (like) => like.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.user, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    replies: Reply[];
}
