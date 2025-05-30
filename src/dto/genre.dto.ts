import { ApiProperty } from '@nestjs/swagger';

export class GenreDto {
  @ApiProperty({
    description: 'Unique identifier for the genre',
    example: 18
  })
  id: number;
  @ApiProperty({
    description: 'Name of the genre',
    example: 'Drama'
  })
  name: string;
}
