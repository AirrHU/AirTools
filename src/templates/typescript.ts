export const getMainFile = () => {
  return `import { config } from 'dotenv';
  config();
  const { EXPRESS_PORT: PORT } = process.env; 
  
  import express, { Application } from 'express';
  import { Route } from '../common/common.routes.config';
  export const routes: Array<Route> = [];
  
  import registerRoutes from './routes';
  
  export const app: Application = express();
  
  app.listen(PORT, () => {
    registerRoutes(app, routes);
  
    routes.forEach((route: Route) => {
      console.log(\`\${route.getName()} initialized.\`);
    });
  
    console.log('Server listening at port', PORT);
  });`
}

export const getMainCommonFile = () => {
  return `import { Application } from 'express'

  export abstract class Route {
    app: Application
    name: string
  
    constructor(app: Application, name: string) {
      this.app = app
      this.name = name
      this.configRoute()
    }
  
    getName() {
      return this.name
    }
  
    abstract configRoute(): Application
  }
  `
}

export const getRoutesIndex = () => {
  return `import { Route } from '../../common/common.routes.config';
  import { Application } from 'express';
  import { BaseRoute } from './base/base.routes.config';
  
  const registerRoutes = (app: Application, routes: Array<Route>) => {
    routes.push(new BaseRoute(app));
  };
  
  export default registerRoutes;
  `
}

export const getBaseRoute = () => {
  return `import { Route } from '../../../common/common.routes.config';
  import { Application, Request, Response } from 'express';
  
  export class BaseRoute extends Route {
    constructor(app: Application) {
      super(app, 'BaseRoute');
    }
  
    configRoute(): Application {
      this.app.route('/').get((_: Request, res: Response) => {
        res.status(200);
      });
  
      return this.app;
    }
  }
  `
}

export const getEnv = () => {
  return `EXPRESS_PORT=3001`
}
