import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Tag } from './models/tag.model';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { CreateTagInput } from './dto/create-tag.input';
import { PrismaService } from 'nestjs-prisma';
import { TagConnection } from './models/tag-paginated.model';
import { PaginationArgs } from 'src/common/pagination/pagination.args';
import { TagOrder } from './dto/tag-order.input';
@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly prisma: PrismaService) {}
  @Mutation(() => Tag)
  async createTag(@Args('data') data: CreateTagInput) {
    const newTag = this.prisma.tag.create({ data });
    // const newPost = this.prisma.post.create({
    //   data: {
    //     published: true,
    //     title: data.title,
    //     content: data.content,
    //     authorId: user.id,
    //   },
    // });
    // pubSub.publish('postCreated', { postCreated: newPost });
    // return newPost;
    return newTag;
  }

  @Query(() => TagConnection)
  async getTags(
    @Args() { after, before, first, last }: PaginationArgs,
    @Args({ name: 'query', type: () => String, nullable: true })
    @Args({
      name: 'orderBy',
      type: () => TagOrder,
      nullable: true,
    })
    orderBy: TagOrder
  ) {
    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.tag.findMany({
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : null,
          ...args,
        }),
      () => this.prisma.tag.count({}),
      { first, last, before, after }
    );
    return a;
  }
}
