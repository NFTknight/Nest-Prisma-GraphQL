export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  sms: SmsConfig;
  shipping: ShippingConfig;
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
