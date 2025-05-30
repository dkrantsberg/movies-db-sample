import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  ratingId: number;

  @Column()
  userId: number;

  @Column()
  movieId: number;

  @Column({ type: 'real' })
  rating: number;

  @Column()
  timestamp: number;
}
