import { Repository, SelectQueryBuilder } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { MoviesService } from './movies.service';
import { Movie } from '../entities/movie.entity';
import { Rating } from '../entities/rating.entity';
import { PaginateQuery } from 'nestjs-paginate';

jest.mock('nestjs-paginate', () => ({
  paginate: jest.fn()
}));

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesRepository: jest.Mocked<Repository<Movie>>;
  let ratingsRepository: jest.Mocked<Repository<Rating>>;

  const mockMovie: Movie = {
    movieId: 1,
    imdbId: 'tt0094675',
    title: 'The Professional',
    overview: 'French secret agent...',
    productionCompanies: [{ id: 1, name: 'Test Company' }],
    releaseDate: '1988-10-21',
    budget: 1000000,
    revenue: 2000000,
    runtime: 69,
    language: 'fi',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' }
    ],
    status: 'Released'
  };

  const mockPaginatedResponse = {
    data: [mockMovie],
    meta: {
      itemCount: 1,
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10
    },
    links: {
      first: '',
      last: '',
      next: '',
      previous: ''
    }
  };

  beforeEach(() => {
    moviesRepository = createMock<Repository<Movie>>();
    ratingsRepository = createMock<Repository<Rating>>();
    service = new MoviesService(moviesRepository, ratingsRepository);

    // Set up default paginate mock
    const paginateMock = jest.mocked(require('nestjs-paginate').paginate);
    paginateMock.mockResolvedValue(mockPaginatedResponse);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated movies', async () => {
      const query: PaginateQuery = { page: 1, limit: 10, path: '' };
      const mockQueryBuilder = createMock<SelectQueryBuilder<Movie>>();

      moviesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.totalItems).toBe(1);
      expect(moviesRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(
        jest.mocked(require('nestjs-paginate').paginate)
      ).toHaveBeenCalledWith(query, mockQueryBuilder, expect.any(Object));
    });
  });

  describe('findOne', () => {
    it('should return movie details with average rating', async () => {
      const movieId = 1;

      moviesRepository.findOne.mockResolvedValue(mockMovie);

      // Mock the private getAverageRating method
      const mockQueryBuilder = createMock<SelectQueryBuilder<Rating>>();
      ratingsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getRawOne.mockResolvedValue({ average: '4.5' });

      const result = await service.findOne(movieId);

      expect(result).toEqual({
        movieId: 1,
        imdbId: 'tt0094675',
        title: 'The Professional',
        description: 'French secret agent...',
        releaseDate: '1988-10-21',
        budget: '$1,000,000',
        runtime: 69,
        averageRating: 4.5,
        genres: [
          { id: 18, name: 'Drama' },
          { id: 80, name: 'Crime' }
        ],
        language: 'fi',
        productionCompanies: [{ id: 1, name: 'Test Company' }]
      });

      expect(moviesRepository.findOne).toHaveBeenCalledWith({
        where: { movieId: 1 }
      });
    });

    it('should throw error when movie not found', async () => {
      const movieId = 999;

      moviesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(movieId)).rejects.toThrow('Movie not found');
    });
  });

  describe('findByYear', () => {
    it('should return movies filtered by year', async () => {
      const year = 1988;
      const query: PaginateQuery = { page: 1, limit: 10, path: '' };
      const mockQueryBuilder = createMock<SelectQueryBuilder<Movie>>();

      moviesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);

      await service.findByYear(year, query);

      expect(moviesRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'substr(movie.releaseDate, 1, 4) = :year',
        { year: year.toString() }
      );
      expect(
        jest.mocked(require('nestjs-paginate').paginate)
      ).toHaveBeenCalledWith(query, mockQueryBuilder, expect.any(Object));
    });
  });

  describe('findByGenre', () => {
    it('should return movies filtered by genre', async () => {
      const genre = 'Drama';
      const query: PaginateQuery = { page: 1, limit: 10, path: '' };
      const mockQueryBuilder = createMock<SelectQueryBuilder<Movie>>();

      moviesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);

      await service.findByGenre(genre, query);

      expect(moviesRepository.createQueryBuilder).toHaveBeenCalledWith('movie');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'movie.genres LIKE :genre',
        { genre: `%${genre}%` }
      );
      expect(
        jest.mocked(require('nestjs-paginate').paginate)
      ).toHaveBeenCalledWith(query, mockQueryBuilder, expect.any(Object));
    });
  });

  describe('toListDto', () => {
    it('should convert movie entity to list DTO', () => {
      const result = service.toListDto(mockMovie);

      expect(result).toEqual({
        movieId: 1,
        imdbId: 'tt0094675',
        title: 'The Professional',
        genres: [
          { id: 18, name: 'Drama' },
          { id: 80, name: 'Crime' }
        ],
        releaseDate: '1988-10-21',
        budget: '$1,000,000'
      });
    });

    it('should handle movie with no budget', () => {
      const movieWithNoBudget = {
        ...mockMovie,
        budget: null
      } as unknown as Movie;

      const result = service.toListDto(movieWithNoBudget);

      expect(result.budget).toBe('$0');
    });

    it('should handle movie with zero budget', () => {
      const movieWithZeroBudget = { ...mockMovie, budget: 0 };

      const result = service.toListDto(movieWithZeroBudget);

      expect(result.budget).toBe('$0');
    });
  });

  it('should format budget correctly through toListDto', () => {
    const testCases = [
      { budget: 1000000, expected: '$1,000,000' },
      { budget: 150000000, expected: '$150,000,000' },
      { budget: null, expected: '$0' },
      { budget: 0, expected: '$0' }
    ];

    testCases.forEach(({ budget, expected }) => {
      const testMovie = { ...mockMovie, budget } as unknown as Movie;
      const result = service.toListDto(testMovie);
      expect(result.budget).toBe(expected);
    });
  });
});
