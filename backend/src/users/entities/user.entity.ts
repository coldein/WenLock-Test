import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 150,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 254,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
    })
    registration: string;

    @Column({
        name: 'password_hash',
        type: 'varchar',
        length: 255,
        select: false,
    })
    passwordHash: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime',
    })
    updatedAt: Date;
}