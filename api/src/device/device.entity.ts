import {
    Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity() 
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    device_code: string; // 1

    @Column({nullable: true})
    device_code_system: string;

    @Column({nullable: true})
    station_code: string;

    @Column({nullable: true})
    network_type: string;
    
    @Column()
    network_class: string; // 2

    @Column({nullable: true})
    network: string;

    @Column({nullable: true})
    dept_code: string;

    @Column() 
    location_id: string; // 3

    @Column()
    location_code: string; // 4

    @Column({charset: 'utf8', collation: 'utf8_general_ci', nullable: true})
    location_name: string;

    @Column({charset: 'utf8', collation: 'utf8_general_ci', nullable: true})
    path_name: string;

    @Column({charset: 'utf8', collation: 'utf8_general_ci', nullable: true})
    province_name: string;
}