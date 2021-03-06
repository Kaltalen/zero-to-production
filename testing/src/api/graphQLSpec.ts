import 'jest-extended';
import mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runQuery, setupTestDB } from './helpers';
import { signTestAccessToken } from './auth';

/**
 * Object.keys(object) is used to return an array of the names of object properties.
 * This can be used to create abstracted values to create the query strings
 * Example of a query string
 *
 * @param model
 * @param resourceName
 * @param resourceToCreate
 * @param resourceToUpdate
 * @param testDependents
 */
export function createGraphQLSpec<T>(
  schema: GraphQLSchema,
  tokenSecret: string
) {
  return function(
    model: any,
    resourceName: string,
    resourceToCreate: any,
    resourceToUpdate: any
  ) {
    if (!resourceToCreate || Object.keys(resourceToCreate).length === 0) {
      throw new Error(
        'Must provide an object to create with properties of at least length 1'
      );
    }

    if (!resourceToUpdate || Object.keys(resourceToUpdate).length === 0) {
      throw new Error(
        'Must provide an object to updated with properties of at least length 1'
      );
    }

    // GraphQL schemas are designed written with UpperCase names
    const upperResourceName =
      resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

    describe(`GraphQL / ${upperResourceName}`, () => {
      let mongoServer: MongoMemoryServer;
      let db: mongoose.Mongoose;
      let resource: T;
      let jwt: string;

      beforeAll(async () => {
        ({ db, mongoServer } = await setupTestDB());
        jwt = signTestAccessToken({ id: '1', role: 0 }, tokenSecret);

        resource = await model.create(resourceToCreate);
      });

      afterAll(async () => {
        await db.disconnect();
        await mongoServer.stop();
      });

      describe(`new${upperResourceName}($input: New${upperResourceName}Input!)`, () => {
        it(`should create a new ${upperResourceName}`, async () => {
          const queryName = `new${upperResourceName}`;
          const result = await runQuery(schema)(
            `
            mutation New${upperResourceName}($input: New${upperResourceName}Input!) {
              ${queryName}(input: $input) {
                id
              }
            }
          `,
            { input: resourceToCreate },
            jwt
          );

          expect(result.errors).not.toBeDefined();
          expect((result.data as any)[queryName]).toBeObject();
          expect((result.data as any)[queryName].id).toBeString();
        });
      });

      describe(`all${upperResourceName}s`, () => {
        it(`should return all ${resourceName}s`, async () => {
          const queryName = `all${upperResourceName}s`;
          const result = await runQuery(schema)(
            `
          {
            ${queryName} {
              id
              ${Object.keys(resourceToCreate)[0]}
            }
          }`,
            {},
            jwt
          );

          expect(result.errors).not.toBeDefined();
          expect((result.data as any)[queryName]).toBeArray();
        });
      });

      describe(`${resourceName}(id: ID!)`, () => {
        it(`should return a ${resourceName} by id`, async () => {
          const queryName = `${resourceName}`;

          const result = await runQuery(schema)(
            `
        {
          ${queryName}(id: "${(resource as any).id}") {
            id
          }
        }`,
            {},
            jwt
          );

          expect(result.errors).not.toBeDefined();
          expect((result.data as any)[queryName]).toBeObject();
          expect((result.data as any)[queryName].id).toEqual(
            (resource as any).id.toString()
          );
        });
      });

      describe(`update${upperResourceName}($input: Updated${upperResourceName}Input!)`, () => {
        it(`should update an ${upperResourceName}`, async () => {
          const queryName = `update${upperResourceName}`;

          resourceToUpdate.id = (resource as any).id;

          const result = await runQuery(schema)(
            `
            mutation Update${upperResourceName}($input: Updated${upperResourceName}Input!) {
              ${queryName}(input: $input) {
                id
              }
            }
          `,
            { input: resourceToUpdate },
            jwt
          );

          expect(result.errors).not.toBeDefined();
          expect((result.data as any)[queryName]).toBeObject();
          expect((result.data as any)[queryName].id).toEqual(
            (resource as any).id.toString()
          );
        });
      });

      describe(`remove${upperResourceName}($id: ID!)`, () => {
        it(`should delete a ${upperResourceName} by id`, async () => {
          const queryName = `remove${upperResourceName}`;
          const result = await runQuery(schema)(
            `
            mutation Remove${upperResourceName}($id: ID!) {
              ${queryName}(id: $id) {
                id
              }
            }`,
            { id: (resource as any).id },
            jwt
          );

          expect(result.errors).not.toBeDefined();
          expect((result.data as any)[queryName]).toBeObject();
        });
      });
    });
  };
}
