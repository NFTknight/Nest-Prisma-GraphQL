import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import config from 'src/common/configs/config';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import { VendorsModule } from './vendors/vendors.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { CouponsModule } from './coupons/coupons.module';
import { TagModule } from './tags/tags.module';
import { OrdersModule } from './orders/orders.module';
import { SmsModule } from './sms/sms.module';
import { ShippingModule } from './shipping/shipping.module';
import { HealthController } from './health.controller';
import { PaymentModule } from './payment/payment.module';
import { SendgridService } from './sendgrid/sendgrid.service';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    CouponsModule,
    TagModule,
    OrdersModule,
    SmsModule,
    ShippingModule,
    PaymentModule,
    BookingsModule,
  ],
  controllers: [HealthController],
  providers: [SendgridService],
})
export class AppModule {}
