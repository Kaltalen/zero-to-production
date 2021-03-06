import { Todo } from './todo.model';
import { newId } from '@app-testing/api/helpers';
import { createGraphQLSpec } from '@app-testing/api/graphQLSpec';
import { schema } from '../graphql';
import config from '../../../environments';

const todo = {
  title: 'Some Todo',
  description: 'A todo that needs to be done',
  user: newId()
};

const updatedTodo = {
  completed: true
};

createGraphQLSpec(schema, config.secrets.accessToken)(
  Todo,
  'Todo',
  todo,
  updatedTodo
);
