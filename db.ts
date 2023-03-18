
import pgPromise from 'pg-promise';
import AWS from 'aws-sdk';
import { configureAWS, awsConfig } from './awsconfig';

configureAWS();

const pgp = pgPromise();

const getSecret = async (secretName: string, region: string): Promise<string> => {
    const client = new AWS.SecretsManager({ region });
  
    return new Promise((resolve, reject) => {
      client.getSecretValue({ SecretId: secretName }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (data.SecretString) {
            resolve(data.SecretString);
          } else if (data.SecretBinary) {
            const buff = Buffer.from(data.SecretBinary as ArrayBuffer);
            resolve(buff.toString('ascii'));
          } else {
            reject(new Error('Secret not found.'));
          }
        }
      });
    });
  };
  

const initDbConnection = async (): Promise<pgPromise.IDatabase<any>> => {
  const secretName = awsConfig.secretName;
  const region = awsConfig.region;

  const secretString = await getSecret(secretName, region);
  const secret = JSON.parse(secretString);

  const connection = {
    host: 'test-database-plugin-1.chjgwksnejv7.us-east-1.rds.amazonaws.com',
    port: 5432,
    database: secret.dbname,
    user: secret.username,
    password: secret.password,
  };

  return pgp(connection);
};

let dbConnection: Promise<pgPromise.IDatabase<any>> | null = null;

export const getDb = (): Promise<pgPromise.IDatabase<any>> => {
  if (!dbConnection) {
    dbConnection = initDbConnection();
  }
  return dbConnection;
};
