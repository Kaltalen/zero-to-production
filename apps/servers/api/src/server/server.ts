import Koa from 'koa';
import Router from 'koa-router';
import { setupMiddleware } from '@ngw/api/middleware';
import { applyApiEndpoints } from './api';
import { applyAuthRoutes } from './auth/auth';
import { dbConnection } from './db/db-connection';
import config from '../environments';

/**
 * Crates a new API Server
 */
export default class ApiServer {
  /**
   * Instantiate a new API Server
   * @constructor
   * @param {Koa} app an instance of a koa server
   * @param {Router} router an instance of a koa-router
   */
  constructor(private app: Koa, private router: Router) {
    this.setupServer(app, router);
  }

  /**
   * Sets up all the server configuration and applies the routes
   * @param {Koa} app an instance of a koa server
   * @param {Router} router an instance of a koa-router
   */
  setupServer(app: Koa, router: Router) {
    /**
     * Start the db connection
     */
    dbConnection();

    /**
     * Setup all the required middleware for the app
     */
    setupMiddleware({ app, logging: config.logging });

    /**
     * Apply the API endpoints
     */
    applyApiEndpoints(app);

    /**
     * apply all authorization routes
     */
    applyAuthRoutes(app);

    /**
     * Apply the routes
     */
    app.use(router.routes());
    app.use(router.allowedMethods());

    /**
     * Health check for kubernetes on google cloud
     *
     * Container must return status 200 on a designated health route. In k8's the default route is '/'
     * Must be configured on the deployment object to use this route for checking
     */
    router.get('/healthz', ctx => {
      ctx.status = 200;
    });

    return app.callback();
  }

  /**
   *
   * @returns a request handler callback for node's native http/http2 server.
   */
  public start() {
    return this.app.callback();
  }
}
