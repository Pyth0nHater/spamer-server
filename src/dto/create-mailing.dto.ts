import { ApiProperty } from '@nestjs/swagger';


export class CreateMailingDto {
  @ApiProperty({ description: 'User Id' })
  userId: number;

  @ApiProperty({ description: 'String session' })
  session: string;

  @ApiProperty({ description: 'Текст сообщения' })
  messageText: string;

  @ApiProperty({ description: 'Массив чатов' })
  usernames: string[];

  @ApiProperty({ description: 'Размер партии' })
  batchSize: number;
  
  @ApiProperty({ description: 'Задержка между сообщениями' })
  waitTime: number;
}
