import {
    Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn() 
    id: number;
    
    @Column()
    location_id: string;

    @Column({nullable: true})
    location_code: string;

    @Column({charset: 'utf8', collation: 'utf8_general_ci', nullable: true})
    location_name: string;

    @Column({nullable: true})
    location_level: number;

    @Column({nullable: true})
    parent_id: string;

    @Column({nullable: true})
    path_id: string;

    @Column({charset: 'utf8', collation: 'utf8_general_ci', nullable: true})
    path_name: string;

}