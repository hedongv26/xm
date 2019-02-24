<template>
  <div>
    <div v-if="menu.role()" v-for="menu in menus" :key="menu.charTitle" style="margin: 20px 10px;overflow: hidden;">
      <router-link :to="menu.charUrl">
        <masker style="border-radius: 2px;" :color="menu.bgColor" :opacity="0">
          <div class="m-img" :style="'background-image:url(\''+menu.img+'\')'"></div>
          <div slot="content" class="m-title">
            {{menu.charTitle}}
            <br/>
            <span class="m-time"> {{menu.charSubTitle}}</span>
          </div>
        </masker>
      </router-link>
    </div>
    <card v-if="show_char" :header="{title:'各镇街、平台基本数据统计'}">
      <div slot="content">
        <my-chart :height="area_data.length*14"
          prevent-render
          @on-render="renderChart"></my-chart>
      </div>
    </card>
  </div>
</template>

<script>
  import MyChart from '@/components/MyChart'
  import { Card, Divider, Masker } from 'vux'
  import { getIndex } from '@/api/index'
  import { mapState } from 'vuex'
  import menuList from '@/utils/menus'
  export default {
    name: 'index',
    components: {
      Card,
      Divider,
      MyChart,
      Masker
    },
    data () {
      return {
        show_char: false,
        area_data: [],
        menus: menuList
      }
    },
    mounted () {
      if (this.checkRole('index/index')) {
        this.initAreaData()
      }
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {title: this.username, ShowBack: false})
    },
    computed: {
      ...mapState({
        username: state => state.user.name
      })
    },
    methods: {
      initAreaData () {
        this.$vux.loading.show({
          text: '获取统计数据中...'
        })
        getIndex({}).then(response => {
          this.$vux.loading.hide()
          if (response.data.area_data) {
            this.area_data = response.data.area_data
          }
          this.show_char = true
        })
      },
      renderChart ({ chart }) {
        const data = this.area_data
        chart.source(data, {
          label: {
            isRounding: true
          }
        })
        chart.coord({
          transposed: true
        })
        chart.tooltip({
          onChange (obj) {
            obj.tooltip.offsetY = obj.items[obj.items.length - 1].y - 100
          }
        })
        chart.axis('label', {
          label: {
            fill: '#404040', // 文本的颜色
            fontSize: 11
          }
        })
        /** 显示数字**/
          // let types = {}
          // let typei = 1
          // data.map(function (obj) {
          //   if (types[obj.type] === undefined) {
          //     types[obj.type] = typei
          //     typei++
          //   }
          // })
          // const typelen = Object.keys(types).length
          // const typelenhalf = Math.ceil(typelen / 2)
          // for (const i in types) {
          //   if (types[i] * 2 + 1 === typelen) {
          //     types[i] = 0
          //   } else if (types[i] <= typelenhalf) {
          //     types[i] = types[i] - typelen + 1
          //   } else {
          //     types[i] = types[i] - typelenhalf
          //   }
          // }
          // data.map(function (obj) {
          //   chart.guide().text({
          //     position: [obj.label, obj.value],
          //     content: obj.value,
          //     style: {
          //       textAlign: 'start'
          //     },
          //     offsetX: 10,
          //     offsetY: types[obj.type] * -9
          //   })
          // })
        var margin = 1 / data.length
        chart.interval().position('label*value').color('type').adjust({
          type: 'dodge',
          marginRatio: 0.8,
          range: [margin / 4, 1 - margin / 4]
        }).size(11.2)
        chart.render()
      }
    }
  }
</script>

<style>
  .m-img {
    padding-bottom: 33%;
    display: block;
    position: relative;
    max-width: 100%;
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    border-radius: 2px;
  }
  .m-title {
    color: #fff;
    text-align: center;
    text-shadow: 0 0 2px rgba(0, 0, 0, .5);
    font-weight: 500;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
  }
  .m-time {
    font-size: 12px;
    padding-top: 4px;
    border-top: 1px solid #f0f0f0;
    display: inline-block;
    margin-top: 5px;
  }
</style>
