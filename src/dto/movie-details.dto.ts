import { ApiProperty } from '@nestjs/swagger';
import { GenreDto } from './genre.dto';
import { ProductionCompanyDto } from './production-company.dto';

export class MovieDetailsDto {
  @ApiProperty({
    description: 'Unique identifier for the movie',
    example: 1
  })
  movieId: number;

  @ApiProperty({
    description: 'IMDb ID of the movie',
    example: 'tt0094675'
  })
  imdbId: string;

  @ApiProperty({
    description: 'Title of the movie',
    example: 'Ariel'
  })
  title: string;

  @ApiProperty({
    description: 'Plot description/overview of the movie',
    example:
      'Taisto Kasurinen is a Finnish coal miner whose father has just committed suicide...'
  })
  description: string;

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1988-10-21'
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Budget of the movie formatted as currency',
    example: '$1,000,000'
  })
  budget: string;

  @ApiProperty({
    description: 'Runtime of the movie in minutes',
    example: 69
  })
  runtime: number;

  @ApiProperty({
    description: 'Average rating calculated from user ratings',
    example: 3.4018691588785046
  })
  averageRating: number;

  @ApiProperty({
    description: 'Genres of the movie in JSON format',
    example: '[{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]'
  })
  genres: GenreDto[];

  @ApiProperty({
    description: 'Original language of the movie',
    example: 'fi'
  })
  language: string;

  @ApiProperty({
    description: 'Production companies in JSON format',
    example: '[{"name": "Villealfa Filmproduction Oy", "id": 2303}]'
  })
  productionCompanies: ProductionCompanyDto[];
}
