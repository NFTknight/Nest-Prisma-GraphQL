import { Module } from '@nestjs/common';
import { VendorsModule } from 'src/vendors/vendors.module';
import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';

@Module({
  imports: [VendorsModule],
  providers: [TagsResolver, TagsService],
})
export class TagModule {}
