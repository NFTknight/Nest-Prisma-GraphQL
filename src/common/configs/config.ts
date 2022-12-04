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
};

export default (): Config => config;
