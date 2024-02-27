import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, Tree } from "typeorm";
import { Thread } from "./Thread";
import { Like } from "./Like";
import { Reply } from "./Reply";
import { Follow } from "./Follow";

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

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    image: string;

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

    @OneToMany(() => Follow, (follow) => follow.following)
    following: Follow[];

    @OneToMany(() => Follow, (follow) => follow.follower)
    follower: Follow[];
}
