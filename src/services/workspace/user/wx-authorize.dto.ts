export interface WxAuthorizeDto {
  redirect_uri: string;
  response_type: string;
  scope: string;
  state: string;
}
