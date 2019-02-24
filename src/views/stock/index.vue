<template>
  <div>
    <div class="page-head">
      <div class="add-btn-div">
        <router-link :to="{path:'./edit',query:{id:0}}">
          <button type="button" class="add-btn head-btn">
            <svg-icon icon-class="add"></svg-icon>
          </button>
        </router-link>
      </div>
      <div class="search-div">
        <my-search
          v-model="search"
          auto-scroll-to-top
          :top="search_top"
          @on-fixed="onSearchFixed"
          @on-blur="onSearchBlur"
          @on-submit="onSearchSubmit"
          @on-cancel="onSearchCancel"
          ref="search"></my-search>
      </div>
      <div class="filte-btn-div">
        <button type="button" class="show-filter head-btn" @click="show_filter=true">筛选</button>
      </div>
    </div>
    <div class="list-box" :style="search_fixed?'margin-top: 19px':''">
      <div class="list-item" v-for="(item, $index) in list" :key="$index">
        <div class="list-item-body">
          <div class="list-item-img">
            <div class="img-div">
              <my-img :src="getItemFistImg(item.location_imgs)" @on-error="errorImg"
                     default-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9Imxkcy1lY2xpcHNlIj48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMSAwIDAgMSAzMCA1MCIgZmlsbD0iIzYwYWE0ZiIgdHJhbnNmb3JtPSJyb3RhdGUoMjI5LjgzMiA1MCA1MC41KSI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMCA1MCA1MC41OzM2MCA1MCA1MC41IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjAuNnMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L3BhdGg+PC9zdmc+"
                     @click.native="previewerImg(getItemFistImg(item.location_imgs))"></my-img>
            </div>
          </div>
          <div class="list-item-right">
            <div class="list-item-title">{{item.name}}</div>
            <div class="list-item-info"><span class="list-item-info-lable"><div class="justify-4">产权</div>：</span>{{item.owner}}</div>
            <div class="list-item-info"><span class="list-item-info-lable">镇街平台：</span>{{getAreaTitle(item.area_id)}}</div>
            <div class="list-item-info"><span class="list-item-info-lable">首次申报：</span>{{item.first_time.substring(0,10)}}</div>
          </div>
        </div>
        <div class="list-item-bottom">
          <div class="list-item-bottom-info">
            <div><label>资源原用途：</label><span>{{item.old_use}}</span></div>
            <div><label><div class="justify-5">招商形式</div>：</label><span>{{item.recruiting_forms}}</span></div>
          </div>
          <div class="list-item-bottom-btn">
            <x-button mini type="primary" action-type="button" class="look-btn"
                      :link="{ name: 'stock_look', params: { info:item, imgs:getInfoImgs(item.location_imgs) } }">
              <svg-icon icon-class="look"></svg-icon>&nbsp;查看
            </x-button>&nbsp;
            <x-button mini type="primary" action-type="button" class="edit-btn"
                      :link="{path:'./edit',query:{id:item.id}}">
              <svg-icon icon-class="edit"></svg-icon>&nbsp;修改
            </x-button>
          </div>
        </div>
      </div>
      <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
        <div slot="no-more"><div style="padding: 20px 0;color: #999999">没有更多了</div></div>
        <div slot="no-results"><div style="padding: 20px 0;color: #999999">无相关数据</div></div>
      </infinite-loading>
    </div>

    <div>
      <popup v-model="show_filter" class="filter-p-div" position="right"
             @on-show="setOldFilter"
             @on-hide="onHideFilter">
        <div class="filter-div">
          <div class="checker-box">
            <div class="checker-title">存量资源形式：</div>
            <checker v-model="filter.form" default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item v-for="val in form_arr" :key="val" :value="val">{{val}}</checker-item>
            </checker>
          </div>
          <div class="checker-box">
            <div class="checker-title">招商形式：</div>
            <checker v-model="filter.recruiting_forms"  default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item v-for="val in recruiting_form_arr" :key="val" :value="val">{{val}}</checker-item>
            </checker>
          </div>
          <div class="checker-box">
            <div class="checker-title">首次申报时间：</div>
            <checker v-model="first_times" default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item v-for="date_obj in dateRange()" :value="date_obj.value" :key="date_obj.text">{{date_obj.text}}</checker-item>
            </checker>
            <div class="two-time-div">
              <div class="two-time-title">自定义：</div>
              <div class="two-time-1 two-time" @click="showCalendar('first_time1')">{{filter.first_time1}}</div>
              <div class="two-time-mind">{{this.time_pacer}}</div>
              <div class="two-time-2 two-time" @click="showCalendar('first_time2')">{{filter.first_time2}}</div>
            </div>
          </div>
          <div class="checker-box">
            <div class="checker-title">月度情况：</div>
            <checker v-model="filter.month" default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item v-for="m_obj in monthRange()" :value="m_obj.value" :key="m_obj.text">{{m_obj.text}}</checker-item>
            </checker>
            <group class="month-group">
              <datetime v-model="filter.month" format="YYYY-MM" title="自定义：" class="month-datetime"></datetime>
            </group>
          </div>
          <div class="checker-box" v-if="checkRole('index/index')">
            <div class="checker-title">镇街平台：</div>
            <checker v-model="filter.area_id" default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item v-for="val in area_list" :key="val.id" :value="val.id">{{val.title}}</checker-item>
            </checker>
          </div>
        </div>
        <div class="filter-bottom">
          <x-button type="primary" @click.native="onSubmitFilter">确定</x-button>
        </div>
      </popup>
      <div v-show="show_calendar" style="position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: 599;background-color: rgba(0,0,0,0.4)"></div>
      <popup v-model="show_calendar" :show-mask="true" :popup-style="{'z-index':600}">
        <div class="do-calendar-div">
          <div style="color: orange;text-align: left"><span @click="show_calendar=false">取消</span></div>
          <div style="color: #666666;text-align: center"><span @click="calendar=''">清除</span></div>
          <div style="color: darkgreen;text-align: right"><span @click="sunmitCalendar">确定</span></div>
        </div>
        <inline-calendar
          ref="calendar"
          @on-change="onCalendarChange"
          class="inline-calendar-demo"
          v-model="calendar"
          :end-date="end_date"
          :show-last-month="false"
          :show-next-month="false"
          :highlight-weekend="true"
          :return-six-rows="true"
          :replace-text-list="{'TODAY':'今'}"
          :weeks-list="['日', '一', '二', '三', '四', '五', '六 ']"
          :disable-future="true"
        >
        </inline-calendar>
      </popup>
    </div>
    <previewer ref="previewer" :list="previewer_imgs"></previewer>
  </div>
</template>

<script>
  import { getIndex, getList } from '@/api/stock'
  import { parseTime } from '@/utils'
  import MySearch from '@/components/MySearch'
  import MyImg from '@/components/MyImg'
  import InfiniteLoading from 'vue-infinite-loading'
  import { XButton, Popup, Checker, CheckerItem, InlineCalendar, Group, Datetime, Previewer } from 'vux'
  export default {
    components: {
      MySearch,
      XButton,
      Popup,
      Checker,
      CheckerItem,
      InlineCalendar,
      Group,
      Datetime,
      InfiniteLoading,
      MyImg,
      Previewer
    },
    data () {
      return {
        search_top: '46px',
        search: '',
        search_fixed: false,
        show_filter: false,
        show_calendar: false,
        calendar_field: '',
        calendar: '',
        end_date: parseTime(new Date(), '{y}-{m}-{d}'),
        time_pacer: ' - ',
        form_arr: [],
        recruiting_form_arr: [],
        area_list: [],
        area_arr: {},
        oldFilter: {},
        filter: {
          searchText: '',
          form: '',
          area_id: 0,
          recruiting_forms: '',
          first_time1: '',
          first_time2: '',
          month: parseTime(new Date(), '{y}-{m}')
        },
        location_imgs_list: {},
        previewer_imgs: [],
        list_cfg: {
          sortName: 'id',
          sortOrder: 'desc',
          pageSize: 15,
          pageNumber: 1
        },
        list: [],
        infiniteId: +new Date()
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {title: '存量招商资源情况', ShowBack: false})
      this.$store.dispatch('GetHaveUpdated', 'stock').then(val => {
        // 如果更新了数据
        if (val === true) {
          this.$store.dispatch('UpdateHaveUpdated', {stock: false})
          this.filterData()
        }
      })
    },
    computed: {
      first_times: {
        get: function () {
          return this.setDateRange(this.filter.first_time1, this.filter.first_time2)
        },
        set: function (val) {
          console.log(val)
          const arr = val.split(this.time_pacer)
          this.filter.first_time1 = arr[0] ? arr[0].trim() : ''
          this.filter.first_time2 = arr[1] ? arr[1].trim() : ''
        }
      }
    },
    methods: {
      setDateRange (time1, time2) {
        return time1 + this.time_pacer + time2
      },
      getMonthDays (myMonth) {
        const d = new Date()
        const nowYear = d.getFullYear()
        const monthStartDate = new Date(nowYear, myMonth, 1)
        const monthEndDate = new Date(nowYear, myMonth + 1, 1)
        return (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
      },
      handleScroll () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        this.search_top = scrollTop >= 46 ? '0px' : (46 - scrollTop) + 'px'
      },
      onSearchFixed () {
        this.search_fixed = this.$refs.search.getFixed()
      },
      onSearchBlur () {
        if (this.filter.searchText.trim() === '') {
          if (this.search.trim() === '') {
            this.$refs.search.cancel()
          }
        } else {
          this.$refs.search.setBlur()
          this.$refs.search.changeisFixed(false)
          const newSearchText = this.filter.searchText
          this.search = newSearchText
        }
      },
      onSearchCancel () {
        if (this.filter.searchText !== '') {
          this.filter.searchText = ''
          this.filterData()
        }
      },
      onSearchSubmit () {
        const newSearchText = this.search
        this.filter.searchText = newSearchText
        this.$refs.search.setSubVal(newSearchText)
        this.$refs.search.setBlur()
        this.$refs.search.changeisFixed(false)
        this.filterData()
      },
      showCalendar (field) {
        this.calendar_field = field
        this.show_calendar = true
        if (this.calendar_field !== '' && this.filter[this.calendar_field] !== undefined) {
          this.calendar = this.filter[this.calendar_field].toString()
        } else {
          this.calendar = ''
        }
      },
      sunmitCalendar () {
        this.show_calendar = false
        if (this.calendar_field !== '' && this.filter[this.calendar_field] !== undefined) {
          this.filter[this.calendar_field] = this.calendar.toString()
        }
      },
      onCalendarChange () {

      },
      setOldFilter () {
        this.oldFilter = JSON.parse(JSON.stringify(this.filter))
      },
      onHideFilter () {
        this.filter = JSON.parse(JSON.stringify(this.oldFilter))
      },
      onSubmitFilter () {
        this.setOldFilter()
        this.show_filter = false
        this.filterData()
      },
      filterData () {
        this.list_cfg.pageNumber = 1
        this.list = []
        this.infiniteId += 1
      },
      initData () {
        this.$vux.loading.show({
          text: ''
        })
        getIndex().then(response => {
          this.form_arr = response.data.forms
          this.recruiting_form_arr = response.data.recruiting_forms
          this.area_list = response.data.area_list
          response.data.area_list.forEach(v => {
            this.$set(this.area_arr, v.id, v)
          })
          this.$vux.loading.hide()
        })
      },
      infiniteHandler ($state) {
        getList(Object.assign(this.list_cfg, this.filter)).then(response => {
          if (response.data.rows && response.data.rows.length > 0) {
            this.list_cfg.pageNumber += 1
            this.list.push(...response.data.rows)
            if (response.data.location_imgs_list) {
              Object.assign(this.location_imgs_list, response.data.location_imgs_list)
            }
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      },
      getItemFistImg (imgIds) {
        const imgIdArr = imgIds.split(',')
        if (imgIdArr[0] && this.location_imgs_list[imgIdArr[0]]) {
          return this.location_imgs_list[imgIdArr[0]]
        } else {
          return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        }
      },
      getInfoImgs (imgIds) {
        const imgIdArr = imgIds.split(',')
        let imgPaths = []
        imgIdArr.forEach(v => {
          if (v !== '' && v !== '0' && v !== 0)imgPaths.push(this.getItemFistImg(v))
        })
        return imgPaths
      },
      previewerImg (src) {
        this.$set(this.previewer_imgs, 0, {src})
        this.$refs.previewer.show(0)
      },
      getAreaTitle (id) {
        return this.area_arr[id] ? this.area_arr[id].title : ''
      },
      errorImg (src, ele) {
        ele.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ3MTk5NTgwNjM3IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTc0LjgzNDM0NyA4ODUuNzkwNzJMMjYyLjEyMDEwNyA4ODUuNzkwNzJsMjc1Ljk2OC00NzguMzM0MjkzIDEwMy45ODM3ODctMTAzLjk4Mzc4NyAyMC44MDA4NTMtMTI0Ljc4MTIyNyA2Mi4zODg5MDctNDEuNTk0ODggMjQ5LjU2OTI4IDBjMjIuOTY4MzIgMCA0MS41ODgwNTMgMTguNjIzMTQ3IDQxLjU4ODA1MyA0MS41OTQ4OGwwIDY2NS41MDQ0MjdDMTAxNi40MTg5ODcgODY3LjE2NDE2IDk5Ny43OTkyNTMgODg1Ljc5MDcyIDk3NC44MzQzNDcgODg1Ljc5MDcyek03OTUuMTQ2MjQgNDA3LjQ1NjQyN2wtMTM4LjQwNzI1MyAzMjAuMzgyMjkzLTk3LjQ0NzI1My0xOTEuNjk5NjI3LTE0NS45ODE0NCAyODcuMjU5MzA3IDIwMi4xMzc2IDAgODkuODQ5MTczIDAgMjY5LjUzMzg2NyAwTDc5NS4xNDYyNCA0MDcuNDU2NDI3ek01MzguMDkxNTIgMzAzLjQ3MjY0YzAgMC0yNC42OTU0NjcgMjguODIyMTg3LTUyLjExNDc3MyA2MC44MDg1MzMtMzQuMjE4NjY3IDM5LjkwODY5My03Mi42NjMwNCA4NC43NzAxMzMtNzIuNjYzMDQgODQuNzcwMTMzTDI0OS41MzE3MzMgODg1Ljc5MDcyIDU5Ljc2MDY0IDg4NS43OTA3MmMtMjIuOTY4MzIgMC00MS41OTQ4OC0xOC42MjY1Ni00MS41OTQ4OC00MS41OTQ4OEwxOC4xNjU3NiAxNzguNjkxNDEzYzAtMjIuOTcxNzMzIDE4LjYyNjU2LTQxLjU5NDg4IDQxLjU5NDg4LTQxLjU5NDg4bDUxOS45MjIzNDcgMGMwIDAtMjAuNzk0MDI3IDc0Ljg2MTIyNy0yMC43OTQwMjcgODMuMTg2MzQ3QzU1OC44ODg5NiAyMjguNjExNDEzIDUzOC4wOTE1MiAzMDMuNDcyNjQgNTM4LjA5MTUyIDMwMy40NzI2NHpNMjY3LjcyODIxMyAyNjEuODc3NzZjLTU3LjQzNjE2IDAtMTAzLjk4Mzc4NyA0Ni41NTEwNC0xMDMuOTgzNzg3IDEwMy45ODcyIDAgNTcuNDM2MTYgNDYuNTQ3NjI3IDEwMy45ODAzNzMgMTAzLjk4Mzc4NyAxMDMuOTgwMzczIDU3LjQzNjE2IDAgMTAzLjk5MDYxMy00Ni41NDc2MjcgMTAzLjk5MDYxMy0xMDMuOTgwMzczQzM3MS43MTU0MTMgMzA4LjQyODggMzI1LjE2NDM3MyAyNjEuODc3NzYgMjY3LjcyODIxMyAyNjEuODc3NzZ6IiBwLWlkPSIxODY3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+'
        ele.style.padding = '10px'
      },
      monthRange () {
        const d = new Date()
        const nowYear = d.getFullYear()
        let arr = []
        for (let i = 1; i <= 12; i++) {
          const m = i > 9 ? i : '0' + i
          arr.push({
            text: i + '月',
            value: nowYear + '-' + m
          })
        }
        return arr
      },
      dateRange () {
        const d = new Date()
        const nowYear = d.getFullYear()
        const nowMonth = d.getMonth()
        const nowDay = d.getDate()
        const nowDayOfWeek = d.getDay()

        const lastMonthDate = new Date()
        lastMonthDate.setDate(1)
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
        const lastYear = lastMonthDate.getFullYear()
        const lastMonth = lastMonthDate.getMonth()
        const nowMonthText = nowMonth >= 9 ? (nowMonth + 1) : '0' + (nowMonth + 1)
        const lastMonthText = lastMonth >= 9 ? (lastMonth + 1) : '0' + (lastMonth + 1)
        return [
          {
            text: '本周',
            value: this.setDateRange(
              parseTime(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1), '{y}-{m}-{d}'),
              parseTime(new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1), '{y}-{m}-{d}')
            )
          },
          {
            text: '本月',
            value: this.setDateRange(
              nowYear + '-' + nowMonthText + '-01',
              nowYear + '-' + nowMonthText + '-' + this.getMonthDays(nowMonth)
            )
          },
          {
            text: '上月',
            value: this.setDateRange(
              lastYear + '-' + lastMonthText + '-01',
              lastYear + '-' + lastMonthText + '-' + this.getMonthDays(lastMonth)
            )
          },
          {
            text: '今年',
            value: this.setDateRange(
              nowYear + '-01-01',
              nowYear + '-12-31'
            )
          },
          {
            text: '去年',
            value: this.setDateRange(
              (nowYear - 1) + '-01-01',
              (nowYear - 1) + '-12-31'
            )
          }
        ]
      }
    }
  }
</script>
<style scoped lang="less">
  @color1:#999999;
  @filter_w:85%;
  @item_val_color:#888888;
  .justify{
    text-align: justify;
    text-align-last: justify;
    display: inline-block;
  }
  .time_zdy{
    line-height: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: top;
    color: @item_val_color;
  }
  .timeselect{
    width: 100px;
    border:1px solid #e5e8ea;
    border-radius: 8px;
    display: inline-block;
    text-align: center;
    &:active{
      border-color: chocolate;
    }
  }
  .justify-3{
    .justify();
    min-width: 3em;
  }
  .justify-4{
    .justify();
    min-width: 4em;
  }
  .justify-5{
    .justify();
    min-width: 5em;
  }
  .justify-6{
    .justify();
    min-width: 6em;
  }
  .page-head{
    display: flex;
    overflow: hidden;
    .add-btn-div{
      flex-basis:50px;
      .add-btn{
        font-size: 18px;
        color: #2196f3;
      }
    }
    .search-div{
      flex-grow:1;
      width: 0;
      overflow: hidden;
    }
    .filte-btn-div{
      flex-basis:80px;
    }
    .head-btn{
      background-color: #EFEFF4;
      border:0;
      text-align: center;
      width: 100%;
      height: 100%;
    }
  }
  .list-box{
    background-color: #ffffff;
    box-sizing: border-box;
     *{
      box-sizing: border-box;
    }
    .list-item{
      position: relative;
      .list-item-body{
        display: flex;
        overflow: hidden;
        .list-item-img{
          margin: 15px 15px 0 15px;
          height: 90px;
          flex-basis:90px;
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          padding: 2px;
          .img-div{
            width: 100%;
            height: 100%;
            background-color: #f7f7f7;
            position: relative;
            border-radius: 8px;
            img{
              border-radius: 2px;
              max-width: 100%;
              max-height: 100%;
              position:absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
            }
          }
        }
        .list-item-right{
          margin: 15px 15px 0 0;
          flex-grow:1;
          width: 0;
          overflow: hidden;
          display: inline-block;
          text-align: right;
          .list-item-title{
            margin-bottom: 3px;
          }
          .list-item-info{
            color: #999999;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .list-item-info-lable{
              float: left;
              display: inline;
            }
          }
        }
      }
      .list-item-bottom{
        margin: 0 15px 15px 15px;
        font-size: 13px;
        color: @item_val_color;
        clear: both;
        display: flex;
        .list-item-bottom-info{
          padding-top: 2px;
          flex-grow:1;
          width: 0;
          overflow: hidden;
          >div{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            label{
              display: inline;
              +span{
                color: @color1;
              }
            }
          }
        }
        .list-item-bottom-btn{
          flex-basis: 170px;
          text-align: right;
          .weui-btn{
            &.look-btn{
              background-color: #2196f3;
            }
            &.edit-btn{
              background-color: #ffbe00;
              &:active{
                background-color: #ff7d00;
              }
            }
          }
        }
      }
      +.list-item::before{
        content: ' ';
        position: absolute;
        pointer-events: none;
        box-sizing: border-box;
        left: 15px;
        right: 0;
        top: 0;
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
      }
    }
  }
  .filter-p-div{
    background-color: #ffffff;
    width: @filter_w!important;
    *{
      box-sizing: border-box;
    }
    .filter-div{
      padding-bottom: 50px;
      .checker-box{
        padding: 10px 4%;
        .checker-title{
          line-height: 28px;
          height: 28px;
          margin: 10px 0;
          font-size: 14px;
        }
        .checker-item{
          color: @item_val_color;
          border-radius: 6px;
          line-height: 28px;
          height: 28px;
          min-width: 30%;
          max-width: 45%;
          padding: 0 0.5%;
          margin: 0 3% 10px 0;
          text-align: center;
          background: #f2f2f2;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.3s;
          &.checker-item-selected{
            background-color: #18a689;
            color: #ffffff;
          }
        }
        .month-group{
          /deep/ .weui-cells::before,/deep/ .weui-cells::after{
            display: none;
          }
          .month-datetime{
            padding: 0;
            color: @item_val_color;
            /deep/ div  p{
              font-size: 12px;
              .time_zdy();
            }
            /deep/ .weui-cell__ft{
              text-align: left;
              .time_zdy();
              .timeselect();
              &::after{
                display: none;
              }
            }
          }
        }
        &+.checker-box{
          padding-top: 0;
          border-top: 1px solid #e7e7e7;
        }
      }
      .two-time-div{
        color: @item_val_color;
        >div{
          .time_zdy()
        }
        .two-time-title{
          font-size: 12px;
        }
        .two-time-mind{
          color: @item_val_color;
        }
        .two-time{
          color: #18a689;
          .timeselect()
        }
      }
    }
    .filter-bottom{
      position: fixed;
      bottom: 0;
      width: @filter_w;
      .weui-btn{
        border-radius: 0;
      }
    }
  }
  .do-calendar-div{
    >div{
      float: left;
      width: 33.333%;
      >span{
        padding: 0 15px;
        line-height: 42px;
      }
    }
    &::after{
      content: '';
      display: block;
      clear: both;
    }
  }
</style>
