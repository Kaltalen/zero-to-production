import merge from 'lodash.merge';
import { createTypeResolver } from '@ngw/api/utils';
import { ITodoDocument } from '@ngw/types';
import { userResolvers } from './users/index';
import { Todo } from './todos/index';
import { verifyTokenGraphQL, authResolvers } from '../auth/auth';

// All the resolvers as an object.
const resolvers = merge(
  {},
  authResolvers,
  userResolvers,
  createTypeResolver<ITodoDocument>({
    model: Todo,
    name: 'Todo',
    resolverAuthentication: verifyTokenGraphQL
  })
);

export default resolvers;
