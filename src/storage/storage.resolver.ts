import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { StorageService } from './storage.service';

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async uploadFile(@Args('file') file: string, @Args('key') key: string) {
    return this.storageService.uploadFile(file, key);
  }
}
