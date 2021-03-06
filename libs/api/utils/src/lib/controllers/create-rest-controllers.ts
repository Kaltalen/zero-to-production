import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import mongoose from 'mongoose';
import { createControllers } from './create-controllers';

export function generateRestEndpoints<T extends mongoose.Document>(
  model: mongoose.Model<T>
) {
  const router = new Router();
  const controllers = generateRestControllers<T>(model);

  router.param('id', controllers.params);

  router.get('/', controllers.getAll).post('/', controllers.createOne);

  router
    .get('/:id', controllers.getOne)
    .put('/:id', controllers.updateOne)
    .delete('/:id', controllers.removeOne);

  return router.routes();
}

export function generateRestControllers<T extends mongoose.Document>(
  model: mongoose.Model<T>
) {
  const controllers = createControllers<T>(model);

  return {
    params: async (
      id: string,
      ctx: ParameterizedContext,
      next: () => Promise<any>
    ) => {
      ctx.state.id = id;
      await next();
    },
    getAll: async (ctx: ParameterizedContext) => {
      ctx.status = 200;
      ctx.body = await controllers.getAll();
    },
    getOne: async (ctx: ParameterizedContext, next: () => Promise<any>) => {
      try {
        ctx.status = 200;
        ctx.body = await controllers.getOne(ctx.state.id);
      } catch (err) {
        throw err;
      }
    },
    createOne: async (ctx: ParameterizedContext, next: () => Promise<any>) => {
      ctx.status = 201;
      ctx.body = await controllers.createOne((ctx.request as any).body);
    },
    updateOne: async (ctx: ParameterizedContext, next: () => Promise<any>) => {
      try {
        ctx.status = 201;
        ctx.body = await controllers.updateOne(
          ctx.state.id,
          (ctx.request as any).body
        );
      } catch (err) {
        throw err;
      }
    },
    removeOne: async (ctx: ParameterizedContext, next: () => Promise<any>) => {
      try {
        ctx.status = 200;
        ctx.body = await controllers.removeOne(ctx.state.id);
      } catch (err) {
        throw err;
      }
    }
  };
}
