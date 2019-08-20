import { addSeconds, parse } from 'date-fns';
import { defaultTo } from 'lodash';
import { Module } from 'vuex';

import { AgentEntity } from '@/entities';
import {
  currentUserService,
  GetUserInfoResponseData,
  LoginDto,
  LoginResponseData,
  WxAuthParamsDto,
} from '@/services';
import { RootState } from '@/store';
import { UserState } from './user.state';

function getExpiresIn() {
  const expiresIn = sessionStorage.getItem('expiresIn');
  if (expiresIn) {
    return parse(expiresIn);
  } else {
    return null;
  }
}

export const userStore: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    profile: null,
    role: null,
    openId: null,
    permissions: null,
    agentInfo: null,
    accessToken: defaultTo(sessionStorage.getItem('accessToken'), null),
    refreshToken: defaultTo(sessionStorage.getItem('refreshToken'), null),
    expiresIn: getExpiresIn(),
  },
  getters: {
    logined(state) {
      return !!state.accessToken;
    },
  },
  mutations: {
    setTokenInfo(state, tokenInfo: LoginResponseData) {
      const expiresIn = addSeconds(new Date(), tokenInfo.expires_in);
      sessionStorage.setItem('accessToken', tokenInfo.access_token);
      sessionStorage.setItem('refreshToken', tokenInfo.refresh_token);
      sessionStorage.setItem('expiresdIn', expiresIn.toISOString());
      state.accessToken = tokenInfo.access_token;
      state.refreshToken = tokenInfo.refresh_token;
      state.expiresIn = expiresIn;
    },
    setUserInfo(state, userInfo: GetUserInfoResponseData) {
      state.profile = userInfo.sysUser;
    },
    setUserOpenId(state, openId: string) {
      state.openId = openId;
      sessionStorage.setItem('openId', openId);
    },
    setAgentInfo(state, agentInfo: AgentEntity) {
      state.agentInfo = agentInfo;
    },
    clear(state) {
      state.profile = null;
      state.role = null;
      state.permissions = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.openId = null;
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('expiresIn');
      sessionStorage.removeItem('openId');
    },
  },
  actions: {
    async login(context, payload: LoginDto) {
      const data = await currentUserService.login(payload);
      context.commit('setTokenInfo', data);
    },
    async logout(context) {
      context.commit('clear');
    },
    async getUserInfo(context) {
      const data = await currentUserService.getUserInfo();
      context.commit('setUserInfo', data);
    },
    async getUserOpenId(context, payload: WxAuthParamsDto) {
      const data = await currentUserService.getUserOpenId(payload);
      context.commit('setUserOpenId', data);
    }
  },
};
