import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { GraphqlConfig } from './common/configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { hideFieldDirectiveTransformer } from './utils/hideFieldsDirective';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      // schema options
      transformSchema: (schema) =>
        hideFieldDirectiveTransformer(schema, 'hideFields'),
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
        directives: [
          new GraphQLDirective({
            name: 'hideFields',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      // subscription
      installSubscriptionHandlers: true,
      debug: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
      context: ({ req }) => ({ req }),
      cors: true,
    };
  }
}
