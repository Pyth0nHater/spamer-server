import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ description: 'Телеграмм Id' })
  telegramId: number;

  @ApiProperty({ description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ description: 'Имеется ли подписка', default: false })
  isActive?: boolean;
}
