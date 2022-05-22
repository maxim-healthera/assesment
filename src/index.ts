import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import Container from 'typedi';
import 'reflect-metadata';
import App from './server';
import setupDb from './setupDB';

setupDb()
  .then(() => {
    Container.get(App).initRoutes().startServer();
  })
  .catch((error) => console.log(error));
