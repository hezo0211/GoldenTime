import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid") 
    NotificationID: string;
    @Column()
    Title: string;
    @Column({type:"text"})
    Content: string;
    @Column({type:"timestamp"})
    CreatedAt: Date;
    @Column()
    IsBroadcasted: Boolean;
} 
