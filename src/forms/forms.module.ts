import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { VendorsModule } from 'src/vendors/vendors.module';
import { FormResolver } from './forms.resolver';
// import { OrdersResolver } from './order.resolver';
import { FormService } from './forms.service';

@Module({
  imports: [VendorsModule, CartModule],
  providers: [FormService, FormResolver],
  exports: [FormService],
})
export class FormsModule {}
