import 'reflect-metadata';
import dotenv from 'dotenv';
import Container from 'typedi';
import 'reflect-metadata';

dotenv.config();
import App from './server';
import setupDb from './setupDB';
import queue from './services/queue.service';
import redis from './services/redis.service';

Promise.all([setupDb(), queue.connect(), redis.connect()])
  .then(() => {
    Container.get(App).initRoutes().startServer();
  })
  .catch((error) => console.log(error));
