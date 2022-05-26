import { NextFunction, Response } from 'express';

const Route =
  () =>
  (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalRouteHandler = descriptor.value;
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const fnReturn = await originalRouteHandler.call(this, req, res, next);
        res.status(200).json({ data: fnReturn });
      } catch (err) {
        next(err);
      }
    };

    return {
      configurable: true,
      get(this: Function) {
        const bound = descriptor.value!.bind(this);
        Object.defineProperty(this, propertyKey, {
          value: bound,
          configurable: true,
          writable: true,
        });
        return bound;
      },
    };
  };

export default Route;
