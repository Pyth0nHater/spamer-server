import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import axios from 'axios';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  private readonly cryptoBotApiUrl = 'https://pay.crypt.bot/api/createInvoice';
  private readonly botToken = process.env.CRYPTO_BOT_TOKEN;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  // Создание платежа
  async processPayment(createPaymentDto: CreatePaymentDto) {
    const { userId, amount } = createPaymentDto;

    // Проверяем, существует ли пользователь
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const currencyType = 'crypto'; // Defaults to 'crypto'
    const asset = 'USDT'; // Required for 'crypto'
    const description = `Пополнение баланса Spamer Bot`;
    const payload = { userId };
    const expiresIn = 3600; // 1 hour expiration time (optional)

    try {
      // Make API request to create the invoice
      const response = await axios.post(
        this.cryptoBotApiUrl,
        {
          currency_type: currencyType,
          asset,
          amount: amount.toFixed(2),
          description,
          payload: JSON.stringify(payload),
          expires_in: expiresIn,
        },
        {
          headers: {
            'Crypto-Pay-API-Token': `${this.botToken}`,
          },
        },
      );

      if (response.data) {
        console.log(response.data);

        const newPayment = this.paymentRepository.create({
          userId,
          link: response.data.result.pay_url,
          invoiceId: response.data.result.invoice_id,
        });
        await this.paymentRepository.save(newPayment);

        const paymentUrl = response.data.result.pay_url;

        return { payment_id: newPayment.id, payment_url: paymentUrl };
      } else {
        throw new BadRequestException(
          `Failed to create invoice: ${response.data.description}`,
        );
      }
    } catch (error) {
      console.error('Error processing payment:', error.message);
      throw new BadRequestException('Failed to process payment');
    }
  }

  async checkPaymentStatus(paymentId: number) {
    const payment = await this.paymentRepository.findOneBy({ id: paymentId });
    const invoiceId = payment.invoiceId;

    const cryptoBotApiUrl = `https://pay.crypt.bot/api/getInvoices`;

    try {
      // Запрос к API для проверки статуса платежа
      const response = await axios.get(cryptoBotApiUrl, {
        params: {
          invoice_ids: invoiceId,
        },
        headers: {
          'Crypto-Pay-API-Token': `${this.botToken}`,
        },
      });

      if (response.data) {
        console.log(response.data.result);
        const { status, amount } = response.data.result.items[0];

        // Возможные статусы: "active", "paid", "expired", "cancelled"
        return {
          invoice_id: invoiceId,
          status,
          amount,
        };
      } else {
        throw new BadRequestException(
          `Failed to fetch invoice status: ${response.data.description}`,
        );
      }
    } catch (error) {
      console.error('Error checking payment status:', error.message);
      throw new BadRequestException('Failed to check payment status');
    }
  }
}
