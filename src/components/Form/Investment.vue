<template>
  <div>
    <div v-if="showTop" class="weui-cell" style="display: none"></div>
    <cell :title="title" align-items="flex-start" primary="content">
      <div class="add-btn">
        <svg-icon icon-class="add" @click.native="openInvestment(null)"></svg-icon>
      </div>
    </cell>
    <div class="investment-box" v-show="info[this.valueKey]&&Object.keys(info[this.otherKey]).length>0">
      <transition-group name="fade"
                        enter-active-class="animated fadeInDown"
                        leave-active-class="animated fadeOutUp"
                        :duration="250">
        <div class="investment-item" v-for="(v,k) in info[this.valueKey]" :key="k+v">
          <div class="investment-investment">
            <div class="svg-div">
              <svg-icon icon-class="company"></svg-icon>
            </div>
            <div class="info-div">{{v}}</div>
          </div>
          <div class="investment-region">
            <div class="svg-div">
              <svg-icon icon-class="map3"></svg-icon>
            </div>
            <div class="info-div">{{info.region[k]}}</div>
            <div class="investment-btns">
              <div class="investment-btn">
                <svg-icon icon-class="edit3" @click.native="openInvestment(k)"></svg-icon>
              </div>
              <div class="investment-btn">
                <svg-icon icon-class="close" @click.native="removeInvestment(k)"></svg-icon>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
    <x-dialog v-model="show_edit_investment" class="investment-dialog">
      <group :title="alertTitle">
        <my-textarea :title="label" v-model="currentValue" autosize
                     :rows="1"
                     ref="currentValue_text"
                     :placeholder="'请填写'+label+'名称'"
                     class="my-textarea">
        </my-textarea>
        <my-textarea title="地区" v-model="currentOther" autosize
                     :placeholder="'请填写'+label+'所在地区'"
                     :rows="1"
                     ref="currentOther_text"
                     class="my-textarea">
        </my-textarea>
      </group>
      <div style="padding:15px;">
        <x-button type="warn" mini style="margin-right: 2em" @click.native="show_edit_investment=false">取消
        </x-button>
        <x-button type="primary" mini @click.native="saveInvestment">确定</x-button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import MyTextarea from '@/components/MyTextarea'
  import { XButton, Group, Cell, ConfirmPlugin, XDialog } from 'vux'

  export default {
    name: 'Investment',
    components: {
      XButton, Group, Cell, XDialog, MyTextarea
    },
    uses: {
      ConfirmPlugin
    },
    data () {
      return {
        key: null,
        currentValue: '',
        currentOther: '',
        show_edit_investment: false,
        info: {}
      }
    },
    computed: {
      alertTitle () {
        if (this.key === null || this.key === undefined) {
          return '添加' + this.label + '信息'
        }
        return '修改' + this.label + '信息'
      }
    },
    watch: {
      value (val) {
        this.info = val === undefined ? {} : val
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      valueKey: {
        type: String,
        default: ''
      },
      otherKey: {
        type: String,
        default: ''
      },
      value: {
        type: Object,
        default: {}
      },
      showTop: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      openInvestment (key) {
        if (key !== undefined && key !== null) {
          this.currentValue = this.info[this.valueKey][key]
          this.currentOther = this.info[this.otherKey][key]
          this.key = key
        } else {
          this.currentValue = ''
          this.currentOther = ''
          this.key = null
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.currentValue_text.updateAutosize()
            this.$refs.currentOther_text.updateAutosize()
          }, 500)
        })
        this.show_edit_investment = true
      },
      saveInvestment () {
        if (this.currentValue.trim() === '') {
          this.$vux.toast.show({
            text: '需填写' + this.label + '名称',
            type: 'warn'
          })
          return false
        }
        if (this.currentOther.trim() === '') {
          this.$vux.toast.show({
            text: '需填写' + this.label + '所在地区',
            type: 'warn'
          })
          return false
        }
        let key = 1
        if (this.key === null) {
          key = this.info[this.valueKey] ? Object.keys(this.info[this.valueKey]).length + 1 : 1
        } else {
          key = this.key
        }
        this.info[this.valueKey][key] = this.currentValue
        this.info[this.otherKey][key] = this.currentOther
        this.show_edit_investment = false
      },
      removeInvestment (key) {
        if (this.info[this.valueKey] === undefined || this.info[this.valueKey][key] === undefined) {
          return false
        }
        const vm = this
        this.$vux.confirm.show({
          title: '提示！',
          content: '确定移除吗？没有提交前并不会真正删除此条内容',
          confirmText: '确定移除',
          onConfirm () {
            vm.$delete(vm.info[vm.valueKey], key)
            vm.$delete(vm.info[vm.otherKey], key)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .investment-box {
    margin: -1rem 15px 15px 15px;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    background-color: #f9f9f9;
    padding: 16px;
    font-size: 14px;
    .investment-item {
      position: relative;

      .svg-div {
        color: #aaaaaa;
        width: 1.5em;
        text-align: left;
      }

      .info-div {
        color: #666666;
        flex: 1;
      }

      .investment-investment {
        display: flex;
        padding-bottom: 5px;
      }

      .investment-region {
        display: flex;

        .investment-btns {
          width: 4em;
          text-align: justify;
          text-align-last: justify;

          .investment-btn {
            display: inline;
            padding: 0 0.4em;
            color: #2C9EFF;

            & + .investment-btn {
              color: #ff4542;
            }
          }
        }
      }

      &:first-of-type {
        padding-bottom: 10px;
      }

      &:last-of-type {
        padding-bottom: 0;
      }

      & + .investment-item {
        padding: 10px 0;

        &:before {
          content: " ";
          position: absolute;
          top: 0;
          right: 0;
          height: 1px;
          border-bottom: 1px solid #E5E5E5;
          color: #E5E5E5;
          -webkit-transform-origin: 0 100%;
          transform-origin: 0 100%;
          -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
          left: 15px;
        }
      }
    }
  }
  .add-btn {
    font-size: 12px;
    margin-top: 0.3em;
    line-height: 1;
    text-align: left;
    svg {
      border: 1px solid #f1f1f1;
      border-radius: 5px;
      background-color: #dddddd;
      padding: 0.41176471em;
      vertical-align: baseline;
      color: #ffffff;
      display: inline-block;
    }
  }
</style>
