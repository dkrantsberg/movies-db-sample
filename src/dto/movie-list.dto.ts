import { ApiProperty } from '@nestjs/swagger';
import { GenreDto } from './genre.dto';

export class MovieListDto {
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
    description: 'Genres of the movie in JSON format',
    example: '[{"id": 18, "name": "Drama"}, {"id": 80, "name": "Crime"}]'
  })
  genres: GenreDto[];

  @ApiProperty({
    description: 'Release date of the movie',
    example: '1988-10-21'
  })
  releaseDate: string;

  @ApiProperty({
    description: 'Budget of the movie formatted as currency',
    example: '$1,000,000'
  })
  budget: string; // Formatted as dollars
}
