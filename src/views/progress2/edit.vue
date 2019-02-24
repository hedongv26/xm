<template>
  <div>
    <group title="基本信息" label-width="6em" label-margin-right="1.3em" label-align="justify">
      <my-textarea :title="titles.name" v-model="info.name" autosize :rows="1" class="my-textarea"></my-textarea>
      <my-textarea :title="titles.overview" v-model="info.overview" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <input-progress v-model="info" :list="progress_arr" :values="progress_list"
                      :title="titles.progress"></input-progress>
    </group>
    <group title="项目信息" label-width="4em" label-margin-right="1.3em" label-align="justify">
      <my-textarea :title="titles.major_issues" v-model="info.major_issues" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <my-textarea :title="titles.measures" v-model="info.measures" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <my-textarea :title="titles.china" v-model="info.china" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <investment :title="titles.foreign" v-model="info" :label="titles.foreign" value-key="foreign"
                  other-key="region"></investment>
      <my-input :title="titles.investment" v-model="info.investment" type="number" class="my-input">
        <div slot="right">万美元</div>
      </my-input>
      <my-input :title="titles.contractural_foreign_investment" v-model="info.contractural_foreign_investment"
                type="number" class="my-input">
        <div slot="right">万美元</div>
      </my-input>
      <selector :title="titles.investment_mode" v-model="info.investment_mode"
                :options="investment_mode"></selector>
      <my-input :title="titles.land_area" v-model="info.land_area" class="my-input" placeholder="请填写使用大小">
        <div slot="right">平方米</div>
      </my-input>
      <industry v-model="info" :title="titles.industry" :list="industry_list"></industry>
      <selector :title="titles.type" v-model="info.type" :options="types" class="left-auto"></selector>
    </group>
    <group title="其他信息">
      <my-textarea :title="titles.remarks" v-model="info.remarks" autosize :rows="1"
                   class="my-textarea"></my-textarea>
    </group>
    <box gap="25px 25px">
      <x-button type="primary" @click.native="saveInfo">{{info.id?'保存修改':'确定新增'}}</x-button>
    </box>
  </div>
</template>

<script>
  import { getEdit, save } from '@/api/progress2'
  import MyTextarea from '@/components/MyTextarea'
  import MyTimelineItem from '@/components/MyTimelineItem'
  import MyInput from '@/components/MyInput'
  import Industry from '@/components/Form/Industry'
  import InputProgress from '@/components/Form/InputProgress'
  import Investment from '@/components/Form/Investment'
  import { Group, Cell, XTextarea, Selector, XButton, Box } from 'vux'

  export default {
    components: {
      Investment,
      InputProgress,
      Industry,
      Group,
      Cell,
      XTextarea,
      Selector,
      XButton,
      Box,
      MyTextarea,
      MyTimelineItem,
      MyInput
    },
    data () {
      return {
        titles: {},
        id: 0,
        types: [],
        investment_mode: [],
        info: {},
        industry_list: [],
        progress_arr: [],
        progress_list: []
      }
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {
        title: (this.$route.query.id ? '修改' : '新增') + '在谈外资项目情况',
        ShowBack: true
      })
      this.initInfo()
    },
    methods: {
      initInfo () {
        this.$vux.loading.show({
          text: ''
        })
        getEdit({ id: this.$route.query.id }).then((response) => {
          this.$vux.loading.hide()
          this.info = response.data.info
          this.titles = response.data.titles
          this.types = response.data.type
          this.investment_mode = response.data.investment_mode
          this.industry_list = response.data.industry
          this.progress_arr = response.data.progress
          this.progress_list = response.data.progress_list
          if (!this.info && this.info.type) {
            this.$set(this.info, 'type', '')
          }
          this.$set(this.info, 'foreign', this.getArrByJson(this.info.foreign, true))
          this.$set(this.info, 'region', this.getArrByJson(this.info.region, true))
        })
      },
      getArrByJson (jsonStr, isObj = false) {
        if (!jsonStr) {
          return isObj ? {} : []
        }
        try {
          return JSON.parse(jsonStr)
        } catch (error) {
          return isObj ? {} : []
        }
      },
      saveInfo () {
        save(this.info).then(response => {
          this.$store.dispatch('UpdateHaveUpdated', { progress2: true })
          this.$vux.toast.show({
            text: response.msg,
            time: 3 * 1000
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .weui-cell__bd {
    textarea, input, select {
      color: #888888;
      font: 400 17px Arial;

      &::-webkit-input-placeholder {
        color: #dddddd;
        font-size: 14px;
      }

      &:-moz-placeholder {
        color: #dddddd;
        font-size: 14px;
      }

      &::-moz-placeholder {
        color: #dddddd;
        font-size: 14px;
      }

      &:-ms-input-placeholder {
        color: #dddddd;
        font-size: 14px;
      }
    }
  }

  .left-auto /deep/ .weui-label {
    width: auto !important;
    text-align: left;
  }
</style>
