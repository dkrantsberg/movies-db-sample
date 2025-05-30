import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Number of items per page',
    example: 50
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 45430
  })
  totalItems: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  currentPage: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 909
  })
  totalPages: number;

  @ApiProperty({
    description: 'Sort configuration',
    example: [['releaseDate', 'ASC']]
  })
  sortBy: any;
}

export class PaginationLinksDto {
  @ApiProperty({
    description: 'URL for the current page',
    example:
      'http://localhost:3000/movies?page=1&limit=50&sortBy=releaseDate:ASC'
  })
  current: string;

  @ApiProperty({
    description: 'URL for the next page',
    example:
      'http://localhost:3000/movies?page=2&limit=50&sortBy=releaseDate:ASC',
    required: false
  })
  next?: string;

  @ApiProperty({
    description: 'URL for the previous page',
    example:
      'http://localhost:3000/movies?page=1&limit=50&sortBy=releaseDate:ASC',
    required: false
  })
  prev?: string;

  @ApiProperty({
    description: 'URL for the first page',
    example:
      'http://localhost:3000/movies?page=1&limit=50&sortBy=releaseDate:ASC',
    required: false
  })
  first?: string;

  @ApiProperty({
    description: 'URL for the last page',
    example:
      'http://localhost:3000/movies?page=909&limit=50&sortBy=releaseDate:ASC',
    required: false
  })
  last?: string;
}

export class PaginatedMovieListResponseDto {
  @ApiProperty({
    description: 'Array of movie data',
    type: 'array',
    items: {
      type: 'object'
    }
  })
  data: any[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto
  })
  meta: PaginationMetaDto;

  @ApiProperty({
    description: 'Pagination links',
    type: PaginationLinksDto
  })
  links: PaginationLinksDto;
}
