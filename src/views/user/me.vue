<template>
  <div>
    <group title="我的基本信息">
      <cell title="邮箱" :value="email" @click.native="showConfirm('请输入邮箱地址','email')" is-link></cell>
      <cell title="邮箱" :value="mobile" @click.native="showConfirm('请输入手机号码','mobile')" is-link></cell>

    </group>
    <box gap="25px 25px">
      <x-button type="warn" @click.native="logout">
        <svg-icon icon-class="logout" class="logout"></svg-icon>
        <span>退出登录</span>
      </x-button>
    </box>
    <confirm
      v-model="confirm_show"
      show-input
      ref="user_confirm"
      :title="confirm_title"
      :close-on-confirm="false"
      @on-confirm="onConfirm"
      @on-show="onShowConfirm"
    >
    </confirm>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { save } from '@/api/user'
import { Group, Cell, XInput, XButton, Box, Confirm } from 'vux'
export default {
  components: {
    Group,
    XInput,
    XButton,
    Box,
    Confirm,
    Cell
  },
  data () {
    return {
      confirm_show: false,
      confirm_title: '',
      confirm_type: ''
    }
  },
  computed: {
    ...mapGetters(['user']),
    mobile: {
      get () {
        return this.user.data.mobile
      },
      set () {}
    },
    email: {
      get () {
        return this.user.data.email
      },
      set () {}
    }
  },
  activated () {
    this.$store.dispatch('UpdateTitleBack', {
      title: '修改个人资料',
      ShowBack: true
    })
  },
  methods: {
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    showConfirm (title, filed) {
      this.confirm_title = title
      this.confirm_type = filed
      this.confirm_show = true
    },
    onShowConfirm () {
      this.$refs.user_confirm.setInputValue(this[this.confirm_type])
    },
    onConfirm (value) {
      this.$vux.loading.show({
        text: ''
      })
      let data = {email: this.email, mobile: this.mobile}
      data[this.confirm_type] = value
      save(data).then(() => {
        this.confirm_show = false
        this.$store.dispatch('GetInfo').then(() => {
          this.$vux.loading.hide()
        })
      })
    }
  }
}
</script>

<style scoped>
.logout.svg-icon {
  margin-right: 2px;
}
</style>
