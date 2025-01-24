import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создание платежа и пополнение баланса' })
  @ApiResponse({
    status: 201,
    description: 'Ссылка на оплату успешно создана, баланс обновлен',
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.processPayment(createPaymentDto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Проверка статуса оплаты' })
  @ApiResponse({
    status: 200,
    description: 'Информация о статусе платежа',
  })
  @ApiResponse({
    status: 400,
    description: 'Не удалось проверить статус оплаты',
  })
  @ApiQuery({
    name: 'paymentId',
    required: true,
    description: 'Идентификатор счета для проверки',
  })
  async checkPaymentStatus(@Query('paymentId') paymentId: number) {
    return this.paymentService.checkPaymentStatus(paymentId);
  }
}
