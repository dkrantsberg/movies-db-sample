import { ApiProperty } from '@nestjs/swagger';

export class ProductionCompanyDto {
  @ApiProperty({
    description: 'Unique identifier for the production company',
    example: 8411
  })
  id: number;
  @ApiProperty({
    description: 'Name of the production company',
    example: 'Metro-Goldwyn-Mayer (MGM)'
  })
  name: string;
}
