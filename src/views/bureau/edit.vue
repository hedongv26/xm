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
      <my-textarea :title="titles.investors" v-model="info.investors" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <my-textarea :title="titles.region" v-model="info.region" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <selector :title="titles.investment_mode" v-model="info.investment_mode"
                :options="investment_mode"></selector>
      <my-input :title="titles.investment" v-model="info.investment" type="number" class="my-input">
        <div slot="right">万元</div>
      </my-input>
      <my-input :title="titles.registered_capital" v-model="info.registered_capital"
                type="number" class="my-input">
        <div slot="right">万元</div>
      </my-input>
      <my-textarea :title="titles.major_issues" v-model="info.major_issues" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <my-textarea :title="titles.measures" v-model="info.measures" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <industry v-model="info" :title="titles.industry" :list="industry_list"></industry>
      <popup-picker :title="titles.area_id"
                    :data="area_arr"
                    :columns="3"
                    v-model="select_area"
                    class="left-auto"
                    :display-format="showAreaTitle">
      </popup-picker>
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
  import { getEdit, save } from '@/api/bureau'
  import MyTextarea from '@/components/MyTextarea'
  import MyTimelineItem from '@/components/MyTimelineItem'
  import MyInput from '@/components/MyInput'
  import Industry from '@/components/Form/Industry'
  import InputProgress from '@/components/Form/InputProgress'
  import Investment from '@/components/Form/Investment'
  import { Group, Cell, XTextarea, Selector, XButton, Box, PopupPicker } from 'vux'

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
      MyInput,
      PopupPicker
    },
    data () {
      return {
        info: {},
        titles: {},
        id: 0,
        investment_mode: [],
        area_arr: [],
        area_objs: {},
        select_area: [],
        industry_list: [],
        progress_arr: [],
        progress_list: []
      }
    },
    watch: {
      select_area (val) {
        this.info.area_id = val[1] ? val[1] : 0
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
          this.investment_mode = response.data.investment_mode
          this.area_objs = response.data.area_objs
          this.area_arr = response.data.area_arr
          this.industry_list = response.data.industry
          this.industry_list = response.data.industry
          this.progress_arr = response.data.progress
          this.progress_list = response.data.progress_list
          if (this.info.area_id && this.area_objs[this.info.area_id]) {
            this.select_area = [this.area_objs[this.info.area_id].pid, this.info.area_id]
          }
        })
      },
      showAreaTitle () {
        return this.info.area_id && this.area_objs[this.info.area_id] ? this.area_objs[this.info.area_id].title : ''
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
          this.$store.dispatch('UpdateHaveUpdated', { bureau: true })
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
