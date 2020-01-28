import Boom from '@hapi/boom';
import { Middleware, ParameterizedContext } from 'koa';

/**
 * Builds a custom error and logs it to the console.
 *
 * @param {Error} error
 */
export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log('TODO');
    console.log('DELETE ME!!!!!!!!!!!!!!!');
    console.error(err);
    const errPayload = handleError(err);
    ctx.status = errPayload.status;
    ctx.body = errPayload.body;
  }
};

function handleError(err: any): { status: number; body: any } {
  if (err.isBoom) {
    // Is A Boom
    return {
      status: err.output.statusCode,
      body: err.output.payload
    };
  } else if ((err as Error).name === 'ValidationError') {
    // It is a a mongoose validation error
    const error = Boom.badRequest(err.message);
    return {
      status: error.output.statusCode,
      body: error.output.payload
    };
  } else if (err.name === 'MongoError' && err.code === 11000) {
    /**
     * A MongoError with code 11000 is a duplicate error.
     * Using regex to extrapolate the error and construct an error message
     *
     * Note we are doing a positive look ahead and behind as well as capturing the matching group
     * as the property field
     */
    const index = /(?<=index: )(?<field>\w+)(?=_)/.exec(err.errmsg);
    if (index && index.groups) {
      const errorMessage = `${index.groups.field} must be unique`;
      const error = Boom.badRequest(errorMessage);

      return {
        status: error.output.statusCode,
        body: error.output.payload
      };
    } else {
      const error = Boom.badRequest();

      return {
        status: error.output.statusCode,
        body: error.output.payload
      };
    }
  } else {
    const error = Boom.badImplementation(err.message);
    return {
      status: error.output.statusCode,
      body: error.output.payload
    };
  }
}

export function errorLogger(err: any, ctx: ParameterizedContext) {
  const date = new Date();
  console.error('There was an error.', {
    timestamp: date.toISOString(),
    status: err.status,
    name: err.name,
    text: err.statusText,
    message: err.message,
    code: err.code,
    zone: err.zone,
    task: err.task,
    error: err
  });
}