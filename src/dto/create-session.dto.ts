import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ description: 'User Id' })
  userId: number;

  @ApiProperty({ description: 'String session' })
  session: string;

  @ApiProperty({ description: 'Название сессии' })
  name: string;
}
