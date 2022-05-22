import { Container } from "typeorm-typedi-extensions";
import { ConnectionOptions, createConnection, useContainer } from 'typeorm';
import chalk from 'chalk';
import config from '../ormconfig';

//todo remove 'as'
async function setupDb() {
  useContainer(Container);
  const connection = await createConnection(config as ConnectionOptions)
  console.log(chalk.green( `db connected: ${connection.name}/${connection.options.database} `));
}

export default setupDb;
