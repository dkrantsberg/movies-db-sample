import { NotFoundException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../entities/movie.entity';
import { MovieListDto } from '../dto/movie-list.dto';
import { MovieDetailsDto } from '../dto/movie-details.dto';
import { PaginateQuery } from 'nestjs-paginate';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: jest.Mocked<MoviesService>;

  const mockMovie: Movie = {
    movieId: 1,
    imdbId: 'tt0094675',
    title: 'Ariel',
    overview: 'A Finnish coal miner whose father has just committed suicide...',
    productionCompanies: [{ id: 2303, name: 'Villealfa Filmproduction Oy' }],
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

  const mockMovieListDto: MovieListDto = {
    movieId: 1,
    imdbId: 'tt0094675',
    title: 'Ariel',
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' }
    ],
    releaseDate: '1988-10-21',
    budget: '$1,000,000'
  };

  const mockMovieDetailsDto: MovieDetailsDto = {
    movieId: 1,
    imdbId: 'tt0094675',
    title: 'Ariel',
    description:
      'A Finnish coal miner whose father has just committed suicide...',
    releaseDate: '1988-10-21',
    budget: '$1,000,000',
    runtime: 69,
    averageRating: 4.5,
    genres: [
      { id: 18, name: 'Drama' },
      { id: 80, name: 'Crime' }
    ],
    language: 'fi',
    productionCompanies: [{ id: 2303, name: 'Villealfa Filmproduction Oy' }]
  };

  const mockPaginatedResult = {
    data: [mockMovie],
    meta: {
      totalItems: 1,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 50,
      itemCount: 1
    },
    links: {
      first: '/movies?page=1&limit=50',
      last: '/movies?page=1&limit=50',
      next: null,
      previous: null
    }
  };

  beforeEach(() => {
    service = createMock<MoviesService>();
    controller = new MoviesController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of movies', async () => {
      const query: PaginateQuery = { page: 1, limit: 50, path: '/movies' };

      service.findAll.mockResolvedValue(mockPaginatedResult as any);
      service.toListDto.mockReturnValue(mockMovieListDto);

      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockMovieListDto],
        meta: mockPaginatedResult.meta,
        links: mockPaginatedResult.links
      });

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.toListDto).toHaveBeenCalledWith(mockMovie);
    });

    it('should handle empty results', async () => {
      const query: PaginateQuery = { page: 1, limit: 50, path: '/movies' };
      const emptyResult = {
        ...mockPaginatedResult,
        data: [],
        meta: { ...mockPaginatedResult.meta, totalItems: 0, itemCount: 0 }
      };

      service.findAll.mockResolvedValue(emptyResult as any);

      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [],
        meta: emptyResult.meta,
        links: emptyResult.links
      });

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.toListDto).toHaveBeenCalledTimes(0);
    });
  });

  describe('findByYear', () => {
    it('should return movies for a specific year', async () => {
      const year = 1988;
      const query: PaginateQuery = {
        page: 1,
        limit: 50,
        path: '/movies/year/1988'
      };

      service.findByYear.mockResolvedValue(mockPaginatedResult as any);
      service.toListDto.mockReturnValue(mockMovieListDto);

      const result = await controller.findByYear(year, query);

      expect(result).toEqual({
        data: [mockMovieListDto],
        meta: mockPaginatedResult.meta,
        links: mockPaginatedResult.links
      });

      expect(service.findByYear).toHaveBeenCalledWith(year, query);
      expect(service.toListDto).toHaveBeenCalledWith(mockMovie);
    });

    it('should handle year with no movies', async () => {
      const year = 2050;
      const query: PaginateQuery = {
        page: 1,
        limit: 50,
        path: '/movies/year/2050'
      };
      const emptyResult = {
        ...mockPaginatedResult,
        data: [],
        meta: { ...mockPaginatedResult.meta, totalItems: 0, itemCount: 0 }
      };

      service.findByYear.mockResolvedValue(emptyResult as any);

      const result = await controller.findByYear(year, query);

      expect(result).toEqual({
        data: [],
        meta: emptyResult.meta,
        links: emptyResult.links
      });

      expect(service.findByYear).toHaveBeenCalledWith(year, query);
    });
  });

  describe('findByGenre', () => {
    it('should return movies for a specific genre', async () => {
      const genre = 'Drama';
      const query: PaginateQuery = {
        page: 1,
        limit: 50,
        path: '/movies/genre/Drama'
      };

      service.findByGenre.mockResolvedValue(mockPaginatedResult as any);
      service.toListDto.mockReturnValue(mockMovieListDto);

      const result = await controller.findByGenre(genre, query);

      expect(result).toEqual({
        data: [mockMovieListDto],
        meta: mockPaginatedResult.meta,
        links: mockPaginatedResult.links
      });

      expect(service.findByGenre).toHaveBeenCalledWith(genre, query);
      expect(service.toListDto).toHaveBeenCalledWith(mockMovie);
    });

    it('should handle genre with no movies', async () => {
      const genre = 'NonExistentGenre';
      const query: PaginateQuery = {
        page: 1,
        limit: 50,
        path: '/movies/genre/NonExistentGenre'
      };
      const emptyResult = {
        ...mockPaginatedResult,
        data: [],
        meta: { ...mockPaginatedResult.meta, totalItems: 0, itemCount: 0 }
      };

      service.findByGenre.mockResolvedValue(emptyResult as any);

      const result = await controller.findByGenre(genre, query);

      expect(result).toEqual({
        data: [],
        meta: emptyResult.meta,
        links: emptyResult.links
      });

      expect(service.findByGenre).toHaveBeenCalledWith(genre, query);
    });
  });

  describe('findOne', () => {
    it('should return movie details', async () => {
      const movieId = 1;

      service.findOne.mockResolvedValue(mockMovieDetailsDto);

      const result = await controller.findOne(movieId);

      expect(result).toEqual(mockMovieDetailsDto);
      expect(service.findOne).toHaveBeenCalledWith(movieId);
    });

    it('should throw NotFoundException when movie not found', async () => {
      const movieId = 999;

      service.findOne.mockRejectedValue(new Error('Movie not found'));

      await expect(controller.findOne(movieId)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.findOne(movieId)).rejects.toThrow(
        'Movie not found'
      );

      expect(service.findOne).toHaveBeenCalledWith(movieId);
    });

    it('should handle service errors gracefully', async () => {
      const movieId = 1;

      service.findOne.mockRejectedValue(new Error('Database connection error'));

      await expect(controller.findOne(movieId)).rejects.toThrow(
        NotFoundException
      );

      expect(service.findOne).toHaveBeenCalledWith(movieId);
    });
  });

  describe('parameter validation', () => {
    it('should work with ParseIntPipe for movie ID', async () => {
      const movieId = 1;

      service.findOne.mockResolvedValue(mockMovieDetailsDto);

      const result = await controller.findOne(movieId);

      expect(typeof movieId).toBe('number');
      expect(result).toEqual(mockMovieDetailsDto);
    });

    it('should work with ParseIntPipe for year parameter', async () => {
      const year = 1988;
      const query: PaginateQuery = {
        page: 1,
        limit: 50,
        path: '/movies/year/1988'
      };

      service.findByYear.mockResolvedValue(mockPaginatedResult as any);
      service.toListDto.mockReturnValue(mockMovieListDto);

      const result = await controller.findByYear(year, query);

      expect(typeof year).toBe('number');
      expect(result.data).toHaveLength(1);
    });
  });
});
