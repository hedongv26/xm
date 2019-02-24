<template>
  <div>
    <div v-if="showTop" class="weui-cell" style="display: none"></div>
    <my-textarea :title="title" v-model="industry_str" autosize
                 @click.native="openIndustry"
                 :rows="1"
                 readonly
                 class="my-textarea link-textarea"></my-textarea>
    <popup v-model="show_edit_industry">
      <popup-header
        left-text="取消"
        right-text="确定"
        title="选择产业"
        :show-bottom-border="false"
        @on-click-left="show_edit_industry = false"
        @on-click-right="saveIndustry"></popup-header>
      <group gutter="0">
        <radio :options="list" v-model="currentValue"></radio>
      </group>
      <collapse-transition>
        <group title="其他产业" v-show="currentValue==='其他'">
          <my-textarea v-model="currentOther"
                       ref="industry_other"
                       autosize
                       :rows="1"
                       placeholder="请填写其他产业..."
                       class="my-textarea">
          </my-textarea>
        </group>
      </collapse-transition>
    </popup>
  </div>
</template>

<script>
  import MyTextarea from '@/components/MyTextarea'
  import CollapseTransition from '@/components/CollapseTransition'
  import {Popup, PopupHeader, Group, Radio} from 'vux'
  export default {
    name: 'industry',
    components: {
      Popup, PopupHeader, MyTextarea, CollapseTransition, Group, Radio
    },
    data () {
      return {
        currentValue: '',
        currentOther: '',
        show_edit_industry: false
      }
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      value: {
        type: Object,
        default: {}
      },
      list: {
        type: Array,
        default: []
      },
      showTop: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      industry_str: {
        get () {
          if (this.value.industry === '其他') {
            return this.value.industry_other ? this.value.industry_other : ''
          } else {
            return this.value.industry ? this.value.industry : ''
          }
        },
        set () {}
      }
    },
    methods: {
      openIndustry () {
        this.currentValue = this.value.industry || ''
        this.currentOther = this.value.industry_other || ''
        this.show_edit_industry = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.industry_other.updateAutosize()
          }, 500)
        })
      },
      saveIndustry () {
        if (this.currentValue === null || this.currentValue === undefined ||
          this.list.indexOf(this.currentValue) === -1) {
          this.$vux.toast.show({
            text: '请选择正确的产业',
            type: 'warn'
          })
          return false
        }
        if (this.currentValue === '其他') {
          if (this.currentOther.trim() === '') {
            this.$vux.toast.show({
              text: '请选择填写其他产业名称',
              type: 'warn'
            })
            return false
          }
        } else {
          this.currentOther = ''
        }
        this.$set(this.value, 'industry_other', this.currentOther.trim())
        this.$set(this.value, 'industry', this.currentValue)
        this.show_edit_industry = false
      }
    }
  }
</script>

<style scoped>
  .link-textarea:before{
    content: " ";
  }
  .link-textarea:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: absolute;
    top: 50%;
    right: 15px;
    margin-top: -4px;
  }
</style>
