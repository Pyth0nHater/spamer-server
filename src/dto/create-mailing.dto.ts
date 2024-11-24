import { ApiProperty } from '@nestjs/swagger';

export class CreateMailingDto {
  @ApiProperty({ description: 'User Id', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Session Id', example: 123 })
  sessionId: number;

  @ApiProperty({ description: 'Message text', example: 'Hello, this is a test message!' })
  messageText: string;

  @ApiProperty({ description: 'Folder Id', example: 2 })
  folderId: number;

  @ApiProperty({ description: 'Batch size', example: 50 })
  batchSize: number;

  @ApiProperty({ description: 'Wait time (seconds)', example: 10 })
  waitTime: number;

  @ApiProperty({ description: 'Is cyclic?', example: false })
  isCyclic: boolean;
}
