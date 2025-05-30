import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { MovieListDto } from '../dto/movie-list.dto';
import { MovieDetailsDto } from '../dto/movie-details.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie, 'moviesDb')
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Rating, 'ratingsDb')
    private ratingsRepository: Repository<Rating>
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Movie>> {
    const queryBuilder = this.moviesRepository.createQueryBuilder('movie');

    return await paginate(query, queryBuilder, {
      sortableColumns: ['releaseDate', 'title'],
      defaultSortBy: [['releaseDate', 'ASC']],
      defaultLimit: 50
    });
  }

  async findOne(id: number): Promise<MovieDetailsDto> {
    const movie = await this.moviesRepository.findOne({
      where: { movieId: id }
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    const averageRating = await this.getAverageRating(id);
    return this.toDetailsDto(movie, averageRating);
  }

  async findByYear(
    year: number,
    query: PaginateQuery
  ): Promise<Paginated<Movie>> {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .where('substr(movie.releaseDate, 1, 4) = :year', {
        year: year.toString()
      });
    return await paginate(query, queryBuilder, {
      sortableColumns: ['releaseDate'],
      defaultSortBy: [['releaseDate', 'ASC']],
      defaultLimit: 50
    });
  }

  async findByGenre(
    genre: string,
    query: PaginateQuery
  ): Promise<Paginated<Movie>> {
    const queryBuilder = this.moviesRepository
      .createQueryBuilder('movie')
      .where('movie.genres LIKE :genre', { genre: `%${genre}%` });

    return await paginate(query, queryBuilder, {
      sortableColumns: ['releaseDate', 'title'],
      defaultSortBy: [['releaseDate', 'ASC']],
      defaultLimit: 50
    });
  }

  private async getAverageRating(movieId: number): Promise<number> {
    const result = (await this.ratingsRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.movieId = :movieId', { movieId })
      .getRawOne()) as { average?: string } | null;

    const average = result?.average;
    return average ? parseFloat(average) : 0;
  }

  toListDto(movie: Movie): MovieListDto {
    return {
      movieId: movie.movieId,
      imdbId: movie.imdbId,
      title: movie.title,
      genres: movie.genres || '',
      releaseDate: movie.releaseDate,
      budget: this.formatBudget(movie.budget)
    };
  }

  private toDetailsDto(movie: Movie, averageRating: number): MovieDetailsDto {
    return {
      movieId: movie.movieId,
      imdbId: movie.imdbId,
      title: movie.title,
      description: movie.overview || '',
      releaseDate: movie.releaseDate,
      budget: this.formatBudget(movie.budget),
      runtime: movie.runtime || 0,
      averageRating,
      genres: movie?.genres || [],
      language: movie.language,
      productionCompanies: movie?.productionCompanies || []
    };
  }

  private formatBudget(budget: number | null): string {
    if (!budget || budget === 0) {
      return '$0';
    }
    return `$${budget.toLocaleString()}`;
  }
}
