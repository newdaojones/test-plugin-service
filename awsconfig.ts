// awsconfig.ts
import AWS from 'aws-sdk';

export const awsConfig = {
  secretName: 'rds!db-516303e8-554e-407f-87b7-76b37eaf7b7f',
  region: 'us-east-1',
};

AWS.config.update({
  accessKeyId: 'AKIASXI6HLDFHQJ7FLUJ',
  secretAccessKey: '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',
  region: awsConfig.region,
});

export const configureAWS = () => {
  // You can add additional AWS SDK configuration here if needed.
};
