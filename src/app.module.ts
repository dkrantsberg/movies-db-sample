import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Rating } from './entities/rating.entity';
import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'moviesDb',
      type: 'sqlite',
      database: 'db/movies.db',
      entities: [Movie],
      synchronize: false
    }),
    TypeOrmModule.forRoot({
      name: 'ratingsDb',
      type: 'sqlite',
      database: 'db/ratings.db',
      entities: [Rating],
      synchronize: false,
      logging: true
    }),
    TypeOrmModule.forFeature([Movie], 'moviesDb'),
    TypeOrmModule.forFeature([Rating], 'ratingsDb')
  ],
  controllers: [MoviesController],
  providers: [MoviesService]
})
export class AppModule {}
