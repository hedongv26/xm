<template>
  <div>
    <group title="基本信息" label-width="6em" label-margin-right="1.3em" label-align="justify">
      <my-textarea :title="titles.name" v-model="info.name" autosize :rows="1" class="my-textarea"></my-textarea>
      <my-textarea :title="titles.overview" v-model="info.overview" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <input-progress v-model="info" :list="progress_arr" :values="progress_list"
                      :title="titles.progress"></input-progress>
    </group>
    <group title="项目信息" label-width="5em" label-margin-right="1.3em" label-align="justify">
      <my-textarea :title="titles.major_issues" v-model="info.major_issues" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <my-textarea :title="titles.measures" v-model="info.measures" autosize :rows="1"
                   class="my-textarea"></my-textarea>
      <investment :title="titles.investors" v-model="info" :label="titles.investors" value-key="investors"
                  other-key="region"></investment>
      <my-input :title="titles.investment" v-model="info.investment" type="number" class="my-input">
        <div slot="right">万元</div>
      </my-input>
      <my-input :title="titles.registered_capital" v-model="info.registered_capital" type="number" class="my-input">
        <div slot="right">万元</div>
      </my-input>
      <industry v-model="info" :title="titles.industry" :list="industry_list"></industry>
      <my-textarea :title="titles.receptionist" v-model="info.receptionist" autosize :rows="1"
                   class="my-textarea"></my-textarea>
    </group>
    <group :title="titles.land_area">
      <radio :options="land_area_types" v-model="info.land_area_type"></radio>
      <my-input title="使用大小：" v-model="info.land_area" class="my-input" placeholder="请填写使用大小">
        <div slot="right">{{info.land_area_type===1?'亩':'平方米'}}</div>
      </my-input>
    </group>
    <checklist :title="titles.type" :options="types" v-model="info.type" @on-change="typeChange"></checklist>
    <group title="其他信息" label-width="5em" label-margin-right="1.3em" label-align="justify">
      <my-textarea :title="titles.remarks" v-model="info.remarks" autosize :rows="1" class="my-textarea"></my-textarea>
    </group>
    <box gap="25px 25px">
      <x-button type="primary" @click.native="saveInfo">{{info.id?'保存修改':'确定新增'}}</x-button>
    </box>
  </div>
</template>

<script>
  import { getEdit, save } from '@/api/progress'
  import MyTextarea from '@/components/MyTextarea'
  import MyTimelineItem from '@/components/MyTimelineItem'
  import MyInput from '@/components/MyInput'
  import Industry from '@/components/Form/Industry'
  import InputProgress from '@/components/Form/InputProgress'
  import Investment from '@/components/Form/Investment'
  import { Group, Cell, XTextarea, Selector, XButton, Box, Radio, Checklist } from 'vux'

  export default {
    components: {
      Group,
      Cell,
      XTextarea,
      Selector,
      XButton,
      Box,
      MyTextarea,
      MyTimelineItem,
      MyInput,
      Industry,
      InputProgress,
      Investment,
      Radio,
      Checklist
    },
    data () {
      return {
        titles: {},
        id: 0,
        types: [],
        land_area_types: [
          {
            key: 1,
            value: '用地',
            right: '亩'
          },
          {
            key: 2,
            value: '楼宇或厂房',
            right: '平方米'
          }
        ],
        info: {},
        industry_list: [],
        progress_arr: [],
        progress_list: []
      }
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {
        title: (this.$route.query.id ? '修改' : '新增') + '在谈市外内资项目情况',
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
          this.industry_list = response.data.industry
          this.progress_arr = response.data.progress
          this.progress_list = response.data.progress_list
          let types = []
          let landAreaType = 1
          if (this.info) {
            if (this.info.type) {
              types = this.info.type.split(',')
            }
            if (this.info.land_area_type !== undefined) {
              landAreaType = this.info.land_area_type
            }
          }
          this.$set(this.info, 'land_area_type', landAreaType)
          this.$set(this.info, 'type', types)
          this.$set(this.info, 'investors', this.getArrByJson(this.info.investors, true))
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

      typeChange (value) {
        const typeNoneKey = value.indexOf('否')
        if (value && typeNoneKey !== -1) {
          if (typeNoneKey === value.length - 1) {
            if (value.length > 1) this.info.type = ['否']
          } else {
            this.info.type = value.filter(t => t !== '否')
          }
        }
      },

      saveInfo () {
        save(this.info).then(response => {
          this.$store.dispatch('UpdateHaveUpdated', { progress: true })
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
