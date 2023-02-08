import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

export function hideFieldDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hideFieldDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (hideFieldDirective) {
        const jwtService = new JwtService();
        const prismaService = new PrismaService();
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result based on role
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info);
          const authToken = context?.req?.headers?.authorization;
          const userId = jwtService?.decode(
            authToken?.split('Bearer ')?.[1] || ''
          )?.['userId'];

          if (userId) {
            const role: Role = await prismaService.user
              .findUnique({
                where: { id: userId },
              })
              .then((e) => e?.role);

            if (role !== Role.AGENT && role !== Role.ADMIN) {
              return null;
            }
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
}
