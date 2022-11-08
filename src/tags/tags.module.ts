import { Module } from '@nestjs/common';
import { TagsResolver } from './tags.resolver';

@Module({
  providers: [TagsResolver],
})
export class TagsModule {}
