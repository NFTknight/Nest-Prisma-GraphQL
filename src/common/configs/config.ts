import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '1d',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  sms: {
    otpUrl: process.env.UNIFONIC_AUTHENTICATE_URL as string,
    otpAppId: process.env.UNIFONIC_AUTHENTICATE_APP_ID as string,
    otpToken: process.env.UNIFONIC_AUTHENTICATE_TOKEN as string,
    defaultLocale: 'ar',
    defaultChannel: 'sms',
    defaultLength: 4,
  },
  shipping: {
    url: process.env.SMSA_API_URL as string,
    token: process.env.SMSA_API_KEY as string,
  },
  payment: {
    url: process.env.MYFATOORAH_API_URL as string,
    token: process.env.MYFATOORAH_API_TOKEN as string,
  },
  storage: {
    enpoint: process.env.AWS_S3_ENDPOINT as string,
    space: process.env.AWS_BUCKET as string,
    accessKey: process.env.AWS_ACCESS_KEY_ID as string,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
};

export default (): Config => config;
