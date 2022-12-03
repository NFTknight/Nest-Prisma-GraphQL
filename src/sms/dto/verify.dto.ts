export interface CheckVerificationApiInput {
  to: string;
  channel: string;
  code: string;
}

export interface CheckOtpApiResponse {
  id: string;
  to: string;
  response_status?: string;
  error_code: number;

  error_message?: string;
}
