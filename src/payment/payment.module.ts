import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
