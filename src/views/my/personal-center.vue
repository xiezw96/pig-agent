<template>
  <cube-page title="个人中心">
    <template #content>
      <div class="custom-item" @click="checkItem({ path: 'information' })">
        <img class="avatar" :src="profile.photo | b64toUrl" lazy="loaded" />
        <span class="name">
          <p class="title">{{ profile.name }}</p>
        </span>
        <span class="status">
          <i class="cubeic-arrow"></i>
        </span>
      </div>
      <div class="indexList">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          data-pos="right"
          :class="checked"
          @click="checkItem(item)"
        >
          <label class="cube-checkbox-wrap">
            <input type="checkbox" class="cube-checkbox-input" />
            <span class="cube-checkbox-ui"> <i class="cubeic-arrow"></i></span>
            <span class="cube-checkbox-label">
              <p>{{ item.label }}</p>
            </span>
          </label>
        </div>
      </div>
      <div style="padding-top: 20px;">
        <cube-button :primary="true" @click="onLogout">退出登录</cube-button>
      </div>
    </template>
  </cube-page>
</template>
<script lang="ts">
import CubePage from '@/components/cube-page.vue';
import { currentUserService } from '@/services';
import { Component, Vue } from 'vue-property-decorator';
import { createNamespacedHelpers } from 'vuex';
import { namespace } from 'vuex-class';
import { UserEntity } from '../../entities';

const { mapActions } = createNamespacedHelpers('workspace/user');
const { mapMutations } = createNamespacedHelpers('workspace/user');

const User = namespace('workspace/user');

@Component({
  components: { CubePage },
})
export class PersonalCenterComponent extends Vue {
  dataList = [
    {
      label: '认证信息',
      path: 'authInfo',
    },
    {
      label: '我的密码',
      path: 'password',
    },
    {
      label: '交易密码',
      path: 'transactionPwd',
    },
    // {
    //   label: '我的手机',
    //   path: 'bindPhone',
    // },
    {
      label: '配送地址',
      path: 'address',
    },
    {
      label: '代金券',
      path: 'voucher',
    },
    {
      label: '发展抽佣',
      path: 'developCommission',
    },
    {
      label: '补货模板',
      path: 'machineTemplate',
    },
  ];

  selected = '';

  checked = 'cube-checkbox cube-checkbox_checked';

  @User.State('agentInfo')
  profile: any;

  @User.Mutation
  clear: () => void;

  async onLogout(this: any) {
    await currentUserService.logout();
    this.clear();
    this.$router.push({ name: '登陆' });
  }

  checkItem(item: any) {
    this.$router.push(item.path);
  }
}

export default PersonalCenterComponent;
</script>
<style lang="stylus" scoped>
.indexList
  background-color #fff

.cube-checkbox
  border-bottom 1px solid #efeff4

.cube-checkbox_checked
  .cube-checkbox-ui
    i
      color #dddde0

.custom-item
  display flex
  height 70px
  align-items center
  padding 12px 0 0 10px
  background-color #fff
  border-bottom 1px solid #efeff4

  .avatar
    width 50px
    height 50px
    border-radius 50%
    margin-bottom 12px

  .name
    margin-left 20px
    color $color-text-l
    font-size $font-size-medium

  .status
    padding-left 83%
    color #dddde0
    font-size 20px
    position absolute
</style>
