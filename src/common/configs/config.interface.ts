export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  sms: SmsConfig;
  shipping: ShippingConfig;
  payment: PaymentConfig;
  storage: StorageConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface SmsConfig {
  otpUrl: string;
  otpToken: string;
  otpAppId: string;
  defaultLocale: string;
  defaultChannel: string;
  defaultLength: number;
}

export interface ShippingConfig {
  url: string;
  token: string;
}

export interface PaymentConfig {
  currency: string;
  clientUrl: string;
  url: string;
  token: string;
}

export interface StorageConfig {
  enpoint: string;
  space: string;
  accessKey: string;
  secretKey: string;
}
