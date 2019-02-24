<template>
  <div>
    <div v-if="showTop" class="weui-cell" style="display: none"></div>
    <cell :title="title" align-items="flex-start" primary="content">
      <div class="add-btn">
        <svg-icon icon-class="add" @click.native="openProgress(null)"></svg-icon>
      </div>
    </cell>
    <timeline v-show="curList.length>0" class="timeline-p-div">
      <my-timeline-item v-for="(v, index) in reverseList" :key="index">
        <div :class="{recent:index===0,'timeline-div':true}">
          <div class="timeline-head">
            <svg-icon v-if="showDel(v.write_time)" icon-class="close" class="remove-btn" @click.native="removeProgress(index)"></svg-icon>
            <svg-icon icon-class="edit3" @click.native="openProgress(index)"></svg-icon>
            {{v.value}}
          </div>
          <div class="timeline-body">{{v.info}}</div>
          <div class="timeline-foot">{{v.write_time}}</div>
        </div>
      </my-timeline-item>
    </timeline>
    <popup v-model="show_edit_progress">
      <popup-header
        left-text="取消"
        right-text="确定"
        :title="key===null||key===undefined?'添加项目进展情况':'修改项目进展情况'"
        :show-bottom-border="false"
        @on-click-left="show_edit_progress = false"
        @on-click-right="saveProgress"></popup-header>
      <group gutter="0">
        <radio :options="list" v-model="modal_progress"></radio>
      </group>
      <group title="情况说明">
        <my-textarea v-model="modal_progress_statement"
                     ref="modal_progress_statement"
                     autosize
                     :rows="1"
                     placeholder="请填写情况说明..."
                     class="my-textarea">
        </my-textarea>
      </group>
    </popup>
  </div>
</template>

<script>
  import { parseTime } from '@/utils'
  import MyTextarea from '@/components/MyTextarea'
  import MyTimelineItem from '@/components/MyTimelineItem'
  import { Popup, PopupHeader, Group, Radio, Timeline, Cell, ConfirmPlugin } from 'vux'
  export default {
    name: 'input-progress',
    components: {
      Popup, PopupHeader, Group, Radio, Timeline, Cell, MyTextarea, MyTimelineItem
    },
    uses: {
      ConfirmPlugin
    },
    data () {
      return {
        key: null,
        modal_progress: '',
        modal_progress_statement: '',
        show_edit_progress: false,
        curList: [],
        info: {}
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
      values: {
        type: Array,
        default: []
      },
      showTop: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      reverseList: {
        get () {
          let data = []
          for (let i = this.curList.length - 1; i >= 0; i--) {
            data.push(this.curList[i])
          }
          return data
        }
      }
    },
    watch: {
      value (val) {
        this.info = val === undefined ? {} : val
      },
      values (val) {
        this.curList = val === undefined ? [] : val
      },
      reverseList () {
        this.saveInfo()
      }
    },
    methods: {
      showDel (writeTime) {
        if (writeTime === undefined) {
          return true
        }
        const day = new Date()
        const today = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate()
        const writeDate = new Date(writeTime)
        return writeDate.getFullYear() + '-' + (writeDate.getMonth() + 1) + '-' + writeDate.getDate() === today
      },
      saveInfo () {
        const val = this.reverseList
        const progress = val[0]
        if (progress) {
          this.info.progress = progress.value
          this.info.progress_statement = progress.info
        }
        this.info.progress_arr = {
          id: [], value: [], info: []
        }
        val.map(v => {
          this.info.progress_arr.id.push(v.id ? v.id : '')
          this.info.progress_arr.value.push(v.value)
          this.info.progress_arr.info.push(v.info)
        })
      },
      openProgress (key) {
        if (key !== undefined && key !== null) {
          this.key = this.curList.length - 1 - key
          if (this.curList[this.key] === undefined) {
            this.$vux.toast.show({
              text: '失败，请刷新页面后重试',
              type: 'warn'
            })
            return false
          }
          this.modal_progress = this.curList[this.key].value
          this.modal_progress_statement = this.curList[this.key].info
        } else {
          this.key = null
          this.modal_progress = ''
          this.modal_progress_statement = ''
        }
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.modal_progress_statement.updateAutosize()
          }, 500)
        })
        this.show_edit_progress = true
      },
      saveProgress () {
        if (this.modal_progress === null ||
          this.list.indexOf(this.modal_progress) === -1) {
          this.$vux.toast.show({
            text: '请选择正确的项目进展情况',
            type: 'warn'
          })
          return false
        }
        if ((new RegExp('^([^\u4e00-\u9fa5]*[\u4e00-\u9fa5]{1}[^\u4e00-\u9fa5]*){21,}$')).test(this.modal_progress_statement) === false) {
          this.$vux.toast.show({
            text: '进展情况说明至少需20（不包括20）个汉字以上',
            time: 3000,
            type: 'warn'
          })
          return false
        }
        if (this.key === null) {
          this.curList.push({
            value: this.modal_progress,
            info: this.modal_progress_statement,
            write_time: parseTime(new Date(), '{y}-{m}-{d}')
          })
        } else {
          this.curList[this.key].value = this.modal_progress
          this.curList[this.key].info = this.modal_progress_statement
        }
        this.show_edit_progress = false
        this.saveInfo()
      },
      removeProgress (key) {
        const vm = this
        this.$vux.confirm.show({
          title: '提示！',
          content: '确定移除吗？没有提交前并不会真正删除此条内容',
          confirmText: '确定移除',
          onConfirm () {
            vm.$delete(vm.curList, vm.curList.length - 1 - key)
          }
        })
        this.saveInfo()
      }
    }
  }
</script>

<style scoped lang="less">
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
  .vux-timeline.timeline-p-div {
    margin: -1rem 15px 15px 15px;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    background-color: #f9f9f9;
    .timeline-div{
      &.recent {
        .timeline-head {
          font-weight: 600;
        }
      }
      .timeline-head {
        font-size: 16px;
        padding-left: 10px;
        svg {
          margin-top: 0.20588235em;
          margin-left: 0.20588235em;
          float: right;
          color: #2C9EFF;
          &.remove-btn{
            color: #ff4542;
            margin-left: 1em;
          }
        }
        &:after {
          content: '';
          display: block;
          clear: both;
        }
      }
      .timeline-body {
        font-size: 14px;
        padding-left: 20px;
        color: #666666;
      }
      .timeline-foot {
        font-size: 12px;
        text-align: right;
        color: #666666;
        padding-right: 15px;
      }
    }

  }
</style>
