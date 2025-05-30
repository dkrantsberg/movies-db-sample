import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  movieId: number;

  @Column()
  imdbId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ type: 'json', nullable: true })
  productionCompanies: { id: number; name: string }[];

  @Column({ type: 'text' })
  releaseDate: string;

  @Column({ nullable: true })
  budget: number;

  @Column({ nullable: true })
  revenue: number;

  @Column({ nullable: true, type: 'real' })
  runtime: number;

  @Column()
  language: string;

  @Column({ type: 'json', nullable: true })
  genres: { id: number; name: string }[];

  @Column({ nullable: true })
  status: string;
}
