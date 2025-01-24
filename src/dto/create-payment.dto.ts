import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Сумма платежа', example: 10 })
  amount: number;
}
