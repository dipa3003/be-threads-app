import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "follows" })
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.following)
    following: User;

    @ManyToOne(() => User, (user) => user.following)
    follower: User;
}
