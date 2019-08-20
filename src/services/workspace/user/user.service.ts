import axios from 'axios';

import { ResponseDataWrapper } from '@/interfaces';

import { GetUserInfoResponseData } from './get-user-info.response-data';
import { LoginDto } from './login.dto';
import { LoginResponseData } from './login.response-data';
import { WxAuthParamsDto } from './wx-auth-params.dto';
import { WxAuthorizeDto } from './wx-authorize.dto';
export class CurrentUserService {
  async login(dto: LoginDto) {
    const { data } = await axios.post<LoginResponseData>(
      'api/auth/oauth/token',
      undefined,
      {
        headers: {
          Authorization: 'Basic YWdlbnRfYXBwOmFnZW50X2FwcA==',
          'X-Token-Needed': false,
          ContentType: 'application/json',
        },
        params: { ...dto, grant_type: 'password', scope: 'server' },
      },
    );

    return data;
  }

  async getUserInfo() {
    const { data } = await axios.get<
      ResponseDataWrapper<GetUserInfoResponseData>
    >('api/admin/user/info');
    return data.data;
  }

  async getUserOpenId(dto: WxAuthParamsDto) {
    const { data } = await axios.get('api/admin/wx/baseapi/openid', {
      headers: {
        'X-Token-Needed': false,
      },
      params: { ...dto },
    });
    console.log('response :', data.data);
    return data.data;
  }


  async getJsapiSignature(dto: any) {
    const { data } = await axios.get('api/admin/wx/jsapi/signature', {
      headers: {
        'X-Token-Needed': false,
      },
      params: { ...dto },
    });
    return data.data;
  }

  async goWxAuthorize(state: string) {
    const dto: WxAuthorizeDto = {
      redirect_uri: 'http://www.fxly69.com/agentapp/auth',
      response_type: 'code',
      scope: 'snsapi_base',
      state,
     };
    await axios.get('api/admin/wx/oauth2/authorize', {
      params: { ...dto },
    });
  }

  async refreshToken(refreshToken: string) {
    const { data } = await axios.post('api/auth/oauth/token', undefined, {
      params: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'server',
      },
      headers: {
        Authorization: 'Basic cGlnOnBpZw==',
        'X-Token-Needed': false,
      },
    });

    return data;
  }

  async logout() {
    await axios.delete('api/auth/token/logout');
  }
}

export const currentUserService = new CurrentUserService();
