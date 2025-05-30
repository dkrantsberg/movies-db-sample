import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { MoviesService } from '../services/movies.service';
import { MovieListDto } from '../dto/movie-list.dto';
import { MovieDetailsDto } from '../dto/movie-details.dto';
import { PaginatedMovieListResponseDto } from '../dto/paginated-response.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all movies',
    description:
      'Returns a paginated list of all movies with basic information including IMDb ID, title, genres, release date, and budget.'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max: 50, default: 50)',
    example: 50
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description:
      'Sort by field and direction (e.g., releaseDate:ASC, title:DESC)',
    example: 'releaseDate:ASC'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved paginated list of movies',
    type: PaginatedMovieListResponseDto
  })
  async findAll(
    @Paginate() query: PaginateQuery
  ): Promise<{ data: MovieListDto[]; meta: any; links: any }> {
    const result = await this.moviesService.findAll(query);
    return {
      data: result.data.map((movie) => this.moviesService.toListDto(movie)),
      meta: result.meta,
      links: result.links
    };
  }

  @Get('year/:year')
  @ApiOperation({
    summary: 'Get movies by year',
    description:
      'Returns a paginated list of movies from a specific release year, sorted chronologically by default.'
  })
  @ApiParam({
    name: 'year',
    description: 'Release year',
    example: 1988
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max: 50, default: 50)',
    example: 50
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort direction (releaseDate:ASC or releaseDate:DESC)',
    example: 'releaseDate:ASC'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved movies for the specified year',
    type: PaginatedMovieListResponseDto
  })
  async findByYear(
    @Param('year', ParseIntPipe) year: number,
    @Paginate() query: PaginateQuery
  ): Promise<{ data: MovieListDto[]; meta: any; links: any }> {
    const result = await this.moviesService.findByYear(year, query);
    return {
      data: result.data.map((movie) => this.moviesService.toListDto(movie)),
      meta: result.meta,
      links: result.links
    };
  }

  @Get('genre/:genre')
  @ApiOperation({
    summary: 'Get movies by genre',
    description:
      'Returns a paginated list of movies that contain the specified genre. Uses partial string matching.'
  })
  @ApiParam({
    name: 'genre',
    description: 'Genre name (case-sensitive)',
    example: 'Comedy'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max: 50, default: 50)',
    example: 50
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description:
      'Sort by field and direction (e.g., releaseDate:ASC, title:DESC)',
    example: 'releaseDate:ASC'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved movies for the specified genre',
    type: PaginatedMovieListResponseDto
  })
  async findByGenre(
    @Param('genre') genre: string,
    @Paginate() query: PaginateQuery
  ): Promise<{ data: MovieListDto[]; meta: any; links: any }> {
    const result = await this.moviesService.findByGenre(genre, query);
    return {
      data: result.data.map((movie) => this.moviesService.toListDto(movie)),
      meta: result.meta,
      links: result.links
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get movie details',
    description:
      'Returns detailed information about a specific movie including average rating calculated from the ratings database.'
  })
  @ApiParam({
    name: 'id',
    description: 'Movie ID',
    example: 2
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved movie details',
    type: MovieDetailsDto
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Movie not found'
        },
        error: {
          type: 'string',
          example: 'Not Found'
        },
        statusCode: {
          type: 'number',
          example: 404
        }
      }
    }
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<MovieDetailsDto> {
    try {
      return await this.moviesService.findOne(id);
    } catch {
      throw new NotFoundException('Movie not found');
    }
  }
}
