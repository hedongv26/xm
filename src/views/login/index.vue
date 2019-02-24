<template>
  <div class="login">
    <box class="head-div">
      <svg-icon icon-class="login-logo"/>
      <h3>欢迎访问招商局项目资源管理平台</h3>
    </box>
    <group>
      <x-input title="" name="mobile" placeholder="请输入用户名" v-model="username" ref="username" required></x-input>
      <x-input title="" type="password" placeholder="请输入密码" v-model="password" ref="password" :min="6" :max="16" required></x-input>
    </group>
    <box gap="25px 25px">
      <x-button type="primary" @click.native="handleLogin">{{loginBtnText}}</x-button>
    </box>
    <p>技术支持：杭州巨创网络科技有限公司 © 2019</p>
  </div>
</template>

<script>
  import { XInput, Box, Group, XButton } from 'vux'
  export default {
    name: 'login',
    data () {
      return {
        loginBtnText: '登录',
        username: '',
        password: ''
      }
    },
    components: {
      XInput,
      XButton,
      Group,
      Box
    },
    methods: {
      handleLogin () {
        if (this.$refs.username.valid === true && this.$refs.password.valid === true) {
          this.$vux.loading.show({
            text: '登录中...'
          })
          this.$store.dispatch('Login', {username: this.username, password: this.password}).then(() => {
            this.$vux.loading.show({
              text: '登录成功，页面跳转中...'
            })
            this.$router.push({ path: '/' }).then(() => {
              this.$vux.loading.hide()
            })
          }).catch((err) => {
            console.log(err)
            this.$vux.loading.hide()
          })
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @color666:#666666;
  @color393a31:#393a31;
  .input-box{
    background-color: #FFFFFF;
  }
  .login{
    >p:first-of-type{
      float: right;
      color: @color666;
      font-size:14px;
    }
    >p:last-of-type{
      width: 100%;
      text-align: center;
      color: @color393a31;
      font-size:14px;
      margin-top: 15%;
    }
  }
  .head-div{
    text-align: center;
    font-size: 120px;
    color: #e7eef5;
    >h3{
      font-size: 22px;
      font-weight: 300;
      color: #999999;
      padding-bottom: 25px;
    }
  }

</style>
