<template>
  <div>
    <div>
      <datetime
        v-model="month"
        format="YYYY-MM"
        :end-date="getMaxMonth()"
        @on-change="changeMonth"
        title="统计月份"></datetime>
      <popup-picker v-if="checkRole('index/index')" title="统计镇街" :data="area_list" v-model="area_id" :display-format="areaShowName"
                    @on-change="changeArea" placeholder="全部"></popup-picker>
    </div>
    <divider>数据统计</divider>
    <card v-for="(value, key) in char_data" v-if="value.data!==false" :key="key" :header="{title:value.label}">
      <div slot="content">
        <div v-if="value.type!=='pie'">
          <my-chart :data="value.data">
            <v-bar />
            <v-tooltip :show-item-marker="false" :show-x-value="true" />
          </my-chart>
        </div>
        <div v-else>
          <my-chart :data="value.data" :height="300">
            <v-pie :radius="0.85" series-field="name" :colors="colors" />
            <v-scale x :tick-count="0" />
            <v-legend :options="legendOptions" />
          </my-chart>
        </div>
      </div>
    </card>
  </div>
</template>

<script>
  import { parseTime } from '@/utils'
  import { getAreaAll } from '@/api/area'
  import { getChart } from '@/api/index'
  import MyChart from '@/components/MyChart'
  import { Datetime, PopupPicker, Card, Divider, VPie, VLegend, VScale, VBar, VTooltip, Masker } from 'vux'
  export default {
    components: {
      Datetime,
      PopupPicker,
      Card,
      Divider,
      MyChart,
      VScale,
      VBar,
      VTooltip,
      VPie,
      VLegend,
      Masker
    },
    data () {
      return {
        month: parseTime(new Date(), '{y}-{m}'),
        area_title_arr: {},
        area_list: [],
        area_id: [],
        colors: ['#1790ff', '#facc16', '#f14764', '#1bb392', '#f8843c', '#8543e0', '#737DDE', '#1c84c6', '#1ec7a5', '#27727b', '#00c622', '#a94442', '#ed5565', '#2f4050', '#23c6c8', '#1ab394', '#3c763d', '#8a6d3b', '#f8ac59', '#999', '#676a6c', '#749f83', '#91c7ae', '#61a0a8'],
        legendOptions: {
          position: 'left',
          itemFormatter (val) {
            return val
          }
        },
        char_data: []
      }
    },
    mounted () {
      if (this.checkRole('index/index')) {
        this.initAreaList()
      }
    },
    activated () {
      let showBack = true
      if (this.$route.matched && this.$route.matched[0] && this.$route.matched[0].redirect) {
        if (typeof this.$route.matched[0].redirect === 'function') {
          showBack = this.$route.matched[0].redirect().path !== this.$route.path
        } else {
          showBack = this.$route.matched[0].redirect.path !== this.$route.path
        }
      }
      this.$store.dispatch('UpdateTitleBack', {title: this.$route.query.title, ShowBack: showBack})
      this.initChart()
    },
    methods: {
      areaShowName (areaIds) {
        if (areaIds.length === 0) {
          return ''
        }
        return this.area_title_arr[areaIds[0]]
      },
      getMaxMonth () {
        return parseTime(new Date(), '{y}-{m}-01')
      },
      changeMonth () {
        this.initChart()
      },
      changeArea () {
        this.initChart()
      },
      initAreaList () {
        this.$vux.loading.show({
          text: '获取镇街中...'
        })
        getAreaAll().then(response => {
          this.$vux.loading.hide()
          let lists = response.data.list
          lists.unshift({title: '全部', id: 0})
          for (const i in lists) {
            lists[i].name = lists[i].title
            lists[i].value = lists[i].id
            this.$set(this.area_title_arr, lists[i].id, lists[i].title)
          }
          this.area_list = [lists]
        })
      },
      initChart () {
        this.$vux.loading.show({
          text: '获取数据中...'
        })
        let areaId = this.area_id
        if (areaId.length === 0) {
          areaId = 0
        } else {
          areaId = areaId[0]
        }
        getChart({area_id: areaId, month: this.month, chart_type: this.$route.query.chart_type}).then(response => {
          this.$vux.loading.hide()
          this.char_data = response.data.chart
        })
      }
    }
  }
</script>

<style scoped>
  .weui-cell_access .vux-popup-picker-value.vux-cell-value{
    color: #999999;
  }
</style>
