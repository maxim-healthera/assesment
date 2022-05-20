import dotenv from 'dotenv';
import Container from 'typedi';
import 'reflect-metadata';
import AppDataSource from './setupDB';
import App from './server';

dotenv.config();
console.log('first')

// const server = AppDataSource.initialize()
// new Promise(() => {})
//   .then(() => {
//       console.log('as')
//     Container.get(App).initRoutes().startServer();
//   })
//   .catch((error) => console.log(error));

// export default server;
Container.get(App).initRoutes().startServer();