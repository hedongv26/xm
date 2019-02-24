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
        <div class="list-item-body" :class="{'show-more':item.show_more}">
          <card>
            <div slot="header" class="list-item-body-head">
              <div class="left"> {{item.name}}</div>
              <div class="right">
                <router-link :to="{path:'./edit',query:{id:item.id}}">
                  <svg-icon icon-class="edit2"></svg-icon>
                </router-link>
              </div>
            </div>
            <div slot="content" class="list-item-body-content">
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div>所属镇街平台</div>
                </div>
                <div class="list-item-row-r">{{getAreaTitle(item.area_id)}}</div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div>{{titles.progress}}</div>
                </div>
                <div class="list-item-row-r can-show-more" @click="showProgressList(item.id)">
                  <svg-icon class="more-investors" icon-class="more"></svg-icon>
                  <span style="color: darkgreen">{{item.progress}}</span>
                </div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div class="justify-6">{{titles.investors}}</div>
                </div>
                <div class="list-item-row-r can-show-more" @click="showInvestors(item.investors,item.region)">
                  <svg-icon class="more-investors" icon-class="more"></svg-icon>
                  <div class="investors-item" v-for="(val,key) in getArrByJson(item.investors)" :key="key">
                    <span>
                      <svg-icon icon-class="left_bracket"></svg-icon>
                      <span>{{val}}</span>
                      <svg-icon icon-class="right_bracket"></svg-icon>
                    </span>
                  </div>
                </div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div class="justify-4">{{titles.investment}}</div>
                </div>
                <div class="list-item-row-r"><span style="color: orange">{{item.investment}}</span>（万元）</div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div>{{titles.registered_capital}}</div>
                </div>
                <div class="list-item-row-r"><span style="color: orange">{{item.registered_capital}}</span>（万元）</div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div>{{titles.land_area}}</div>
                </div>
                <div class="list-item-row-r">
                  {{item.land_area}}（{{item.land_area_type==='1'||item.land_area_type===1?'亩':'平方米'}}）
                </div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div class="justify-4">{{titles.industry}}</div>
                </div>
                <div class="list-item-row-r">{{item.industry}}
                  <span v-if="item.industry==='其他'&&item.industry_other.trim()!==''" style="color: #b2b2b2">（{{item.industry_other.trim()}}）</span>
                </div>
              </div>
              <div class="list-item-row">
                <div class="list-item-row-l">
                  <div>{{titles.type}}</div>
                </div>
                <div class="list-item-row-r">{{item.type}}</div>
              </div>

              <collapse-transition>
                <div class="item-more" v-show="item.show_more&&item.show_more===true">
                  <div class="list-item-row">
                    <div class="list-item-row-l">
                      <div>{{titles.overview}}</div>
                    </div>
                    <div class="list-item-row-r" v-html="doEmptyStr(item.overview)"></div>
                  </div>
                  <div class="list-item-row">
                    <div class="list-item-row-l">
                      <div>{{titles.major_issues}}</div>
                    </div>
                    <div class="list-item-row-r" v-html="doEmptyStr(item.major_issues)"></div>
                  </div>
                  <div class="list-item-row">
                    <div class="list-item-row-l">
                      <div>{{titles.measures}}</div>
                    </div>
                    <div class="list-item-row-r" v-html="doEmptyStr(item.measures)"></div>
                  </div>
                  <div class="list-item-row">
                    <div class="list-item-row-l">
                      <div>{{titles.receptionist}}</div>
                    </div>
                    <div class="list-item-row-r" v-html="doEmptyStr(item.receptionist)"></div>
                  </div>
                  <div class="list-item-row">
                    <div class="list-item-row-l">
                      <div class="justify-4">{{titles.remarks}}</div>
                    </div>
                    <div class="list-item-row-r" v-html="doEmptyStr(item.remarks)"></div>
                  </div>
                </div>
              </collapse-transition>

            </div>
            <div slot="footer">
              <div style="text-align: center; padding-bottom: 8px;">
                <div class="show-item-info-btn" @click="showMoreToggle(item)">
                  <svg-icon icon-class="more"></svg-icon>
                  <span>更多</span>
                </div>
              </div>
            </div>
          </card>
        </div>
      </div>
      <infinite-loading :identifier="infiniteId" @infinite="infiniteHandler">
        <div slot="no-more">
          <div style="padding: 20px 0;color: #999999">没有更多了</div>
        </div>
        <div slot="no-results">
          <div style="padding: 20px 0;color: #999999">无相关数据</div>
        </div>
      </infinite-loading>
    </div>
    <div>
      <popup v-model="show_filter" class="filter-p-div" position="right"
             @on-show="setOldFilter"
             @on-hide="onHideFilter">
        <div class="filter-div">
          <div class="checker-box">
            <div class="checker-title">{{titles.progress}}：</div>
            <checker v-model="filter['progress[0]']" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item v-for="val in filter_data.progress_arr" :key="val" :value="val">{{val}}</checker-item>
            </checker>
          </div>
          <div class="checker-box">
            <div class="checker-title">{{titles.industry}}：</div>
            <checker v-model="filter['industry[0]']" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item v-for="val in filter_data.industry_arr" :key="val" :value="val">{{val}}</checker-item>
            </checker>
          </div>
          <div class="checker-box">
            <div class="checker-title">{{titles.type}}：</div>
            <checker v-model="filter['type[0]']" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item v-for="val in filter_data.type_arr" :key="val" :value="val">{{val}}</checker-item>
            </checker>
          </div>
          <div class="checker-box">
            <div class="checker-title">{{titles.investment}}（万元）：</div>
            <checker v-model="investment" default-item-class="checker-item" selected-item-class="checker-item-selected">
              <checker-item :value="{'-1':'','-2':10000}">一亿人民币以下</checker-item>
              <checker-item :value="{'-1':10000,'-2':''}">一亿人民币以上</checker-item>
            </checker>
            <div class="filter-input-div">
              <div class="filter-input-title">自定义：</div>
              <input class=" filter-input" v-model="filter['investment[-1]']" placeholder="万元"/>
              <div class="input-time-mind">{{this.time_pacer}}</div>
              <input class=" filter-input" v-model="filter['investment[-2]']" placeholder="万元"/>
            </div>
          </div>
          <div class="checker-box">
            <div class="checker-title">{{titles.registered_capital}}（万元）：</div>
            <checker v-model="registered_capital" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item :value="{'-1':'','-2':10000}">一亿人民币以下</checker-item>
              <checker-item :value="{'-1':10000,'-2':''}">一亿人民币以上</checker-item>
            </checker>
            <div class="filter-input-div">
              <div class="filter-input-title">自定义：</div>
              <input class=" filter-input" v-model="filter['registered_capital[-1]']" placeholder="万元"/>
              <div class="input-time-mind">{{this.time_pacer}}</div>
              <input class=" filter-input" v-model="filter['registered_capital[-2]']" placeholder="万元"/>
            </div>
          </div>
          <div class="checker-box">
            <div class="checker-title">{{titles.investment}} 或 {{titles.registered_capital}}（万元）：</div>
            <checker v-model="investment_capital" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item :value="{'-1':'','-2':10000}">一亿人民币以下</checker-item>
              <checker-item :value="{'-1':10000,'-2':''}">一亿人民币以上</checker-item>
            </checker>
            <div class="filter-input-div">
              <div class="filter-input-title">自定义：</div>
              <input class=" filter-input" v-model="filter['investment_capital[-1]']" placeholder="万元"/>
              <div class="input-time-mind">{{this.time_pacer}}</div>
              <input class=" filter-input" v-model="filter['investment_capital[-2]']" placeholder="万元"/>
            </div>
          </div>
          <div class="checker-box">
            <div class="checker-title">月度情况：</div>
            <checker v-model="filter.month" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item v-for="m_obj in monthRange()" :value="m_obj.value" :key="m_obj.text">{{m_obj.text}}
              </checker-item>
            </checker>
            <group class="month-group">
              <datetime v-model="filter.month" format="YYYY-MM" title="自定义：" class="month-datetime"></datetime>
            </group>
          </div>
          <div class="checker-box" v-if="checkRole('index/index')">
            <div class="checker-title">镇街平台：</div>
            <checker v-model="filter.area_id" default-item-class="checker-item"
                     selected-item-class="checker-item-selected">
              <checker-item v-for="val in filter_data.area_list" :key="val.id" :value="val.id">{{val.title}}
              </checker-item>
            </checker>
          </div>
        </div>
        <div class="filter-bottom">
          <x-button type="primary" @click.native="onSubmitFilter">确定</x-button>
        </div>
      </popup>
      <div v-show="show_calendar"
           style="position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: 599;background-color: rgba(0,0,0,0.4)"></div>
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
      <popup v-model="show_investors">
        <group title="投资方信息（投资方与所属地区）">
          <cell v-for="(v,k) in investors_list" :title="v.investors" :key="k" align-items="flex-start"
                :value="v.region"></cell>
        </group>
      </popup>
      <popup v-model="show_progress">
        <div style="height: 75px;line-height: 75px;text-align: center" v-show="progress_loading">
          <inline-loading></inline-loading>
          <span style="padding-left: 20px;color: #666666">获取数据中...</span>
        </div>
        <timeline>
          <my-timeline-item v-for="(v, index) in progress_list" :key="index">
            <div :class="{recent:index===0,'timeline-div':true}">
              <div class="timeline-head">{{v.value}}</div>
              <div class="timeline-body">{{v.info}}</div>
              <div class="timeline-foot">{{v.write_time}}</div>
            </div>
          </my-timeline-item>
        </timeline>
      </popup>
    </div>
  </div>
</template>

<script>
  import { getIndex, getList, getProgressList } from '@/api/progress'
  import { parseTime } from '@/utils'
  import MySearch from '@/components/MySearch'
  import CollapseTransition from '@/components/CollapseTransition'
  import MyTimelineItem from '@/components/MyTimelineItem'
  import InfiniteLoading from 'vue-infinite-loading'
  import {
    XButton,
    Popup,
    Checker,
    CheckerItem,
    InlineCalendar,
    Group,
    Datetime,
    Card,
    Cell,
    InlineLoading,
    Timeline
  } from 'vux'

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
      Card,
      CollapseTransition,
      Cell,
      InlineLoading,
      Timeline,
      MyTimelineItem
    },
    data () {
      return {
        titles: {},
        search_top: '46px',
        search: '',
        search_fixed: false,
        show_filter: false,
        show_calendar: false,
        show_investors: false,
        investors_list: [],
        show_progress: false,
        progress_loading: false,
        progress_list: [],
        calendar_field: '',
        calendar: '',
        end_date: parseTime(new Date(), '{y}-{m}-{d}'),
        time_pacer: ' - ',
        filter_data: {
          area_arr: {},
          area_list: [],
          progress_arr: [],
          industry_arr: [],
          type_arr: []
        },
        oldFilter: {},
        filter: {
          searchText: '',
          area_id: 0,
          'progress[0]': '',
          'industry[0]': '',
          'type[0]': '',
          'investment[-1]': 0,
          'investment[-2]': 0,
          'registered_capital[-1]': 0,
          'registered_capital[-2]': 0,
          'investment_capital[-1]': 0,
          'investment_capital[-2]': 0,
          month: parseTime(new Date(), '{y}-{m}')
        },
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
    watch: {
      filter: {
        handler (newName, oldName) {
          for (const i in newName) {
            if (newName[i] === 0 || newName[i] === '0') {
              newName[i] = ''
            }
          }
        },
        immediate: true,
        deep: true
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', { title: '在谈市外内资项目情况', ShowBack: false })
      this.$store.dispatch('GetHaveUpdated', 'progress').then(val => {
        // 如果更新了数据
        if (val === true) {
          this.$store.dispatch('UpdateHaveUpdated', { progress: false })
          this.filterData()
        }
      })
    },
    computed: {
      investment: {
        get: function () {
          return {
            '-1': this.filter['investment[-1]'],
            '-2': this.filter['investment[-2]']
          }
        },
        set: function (val) {
          this.filter['investment[-1]'] = val[-1]
          this.filter['investment[-2]'] = val[-2]
        }
      },
      investment_capital: {
        get: function () {
          return {
            '-1': this.filter['investment_capital[-1]'],
            '-2': this.filter['investment_capital[-2]']
          }
        },
        set: function (val) {
          this.filter['investment_capital[-1]'] = val[-1]
          this.filter['investment_capital[-2]'] = val[-2]
        }
      },
      registered_capital: {
        get: function () {
          return {
            '-1': this.filter['registered_capital[-1]'],
            '-2': this.filter['registered_capital[-2]']
          }
        },
        set: function (val) {
          this.filter['registered_capital[-1]'] = val[-1]
          this.filter['registered_capital[-2]'] = val[-2]
        }
      },
      first_times: {
        get: function () {
          return this.setDateRange(this.filter.first_time1, this.filter.first_time2)
        },
        set: function (val) {
          const arr = val.split(this.time_pacer)
          this.filter.first_time1 = arr[0] ? arr[0].trim() : ''
          this.filter.first_time2 = arr[1] ? arr[1].trim() : ''
        }
      }
    },
    methods: {
      doEmptyStr (val) {
        if (val === undefined || val.trim() === '') {
          return '<span style="color: #e2e2e2">（暂无）</span>'
        }
        return val.trim()
      },
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
          this.titles = response.data.titles
          this.filter_data.progress_arr = response.data.progress
          this.filter_data.type_arr = response.data.type
          this.filter_data.industry_arr = response.data.industry
          this.filter_data.area_list = response.data.area_list
          response.data.area_list.forEach(v => {
            this.$set(this.filter_data.area_arr, v.id, v)
          })
          this.$vux.loading.hide()
        })
      },
      infiniteHandler ($state) {
        getList(Object.assign(this.list_cfg, this.filter)).then(response => {
          if (response.data.rows && response.data.rows.length > 0) {
            this.list_cfg.pageNumber += 1
            this.list.push(...response.data.rows)
            $state.loaded()
          } else {
            $state.complete()
          }
        })
      },
      getAreaTitle (id) {
        return this.filter_data.area_arr[id] ? this.filter_data.area_arr[id].title : ''
      },
      getArrByJson (jsonStr) {
        try {
          return JSON.parse(jsonStr)
        } catch (error) {
          return []
        }
      },
      showMoreToggle (item) {
        this.$set(item, 'show_more', !item.show_more)
      },
      showInvestors (investors, region) {
        let investorsList = []
        const investorsObj = this.getArrByJson(investors)
        const regionObj = this.getArrByJson(region)
        for (const i in investorsObj) {
          investorsList.push({
            investors: investorsObj[i],
            region: regionObj[i] ? regionObj[i] : ''
          })
        }
        this.investors_list = investorsList
        this.show_investors = true
      },
      showProgressList (id) {
        this.progress_list = []
        this.progress_loading = true
        this.show_progress = true
        getProgressList({ id }).then(response => {
          this.progress_loading = false
          if (response.data && response.data.length > 0) {
            this.progress_list = response.data.reverse()
          }
        })
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
  @color1: #999999;
  @filter_w: 85%;
  @item_val_color: #888888;
  .clear_float {
    content: '';
    display: block;
    clear: both;
  }

  .justify {
    text-align: justify;
    text-align-last: justify;
    display: inline-block;
  }

  .time_zdy {
    line-height: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: top;
    color: @item_val_color;
  }

  .timeselect {
    width: 100px;
    border: 1px solid #e5e8ea;
    border-radius: 8px;
    display: inline-block;
    text-align: center;

    &:active {
      border-color: chocolate;
    }
  }

  .justify-3 {
    .justify();
    min-width: 3em;
  }

  .justify-4 {
    .justify();
    min-width: 4em;
  }

  .justify-5 {
    .justify();
    min-width: 5em;
  }

  .justify-6 {
    .justify();
    min-width: 6em;
  }

  .page-head {
    display: flex;
    overflow: hidden;

    .add-btn-div {
      flex-basis: 50px;

      .add-btn {
        font-size: 18px;
        color: #2196f3;
      }
    }

    .search-div {
      flex-grow: 1;
      width: 0;
      overflow: hidden;
    }

    .filte-btn-div {
      flex-basis: 80px;
    }

    .head-btn {
      background-color: #EFEFF4;
      border: 0;
      text-align: center;
      width: 100%;
      height: 100%;
    }
  }

  .list-box {
    box-sizing: border-box;

    * {
      box-sizing: border-box;
    }

    .list-item {
      position: relative;
      margin-bottom: 12px;

      .list-item-body {
        &.show-more {
          .list-item-body-head {
            div {
              white-space: normal
            }
          }

          .show-item-info-btn {
            color: #f88f00;

            svg {
              vertical-align: middle;
              transform-origin: center center 0;
              transform: rotate(180deg);
            }
          }
        }

        .list-item-body-head {
          font-size: 16px;
          padding: 14px 0 10px 15px;
          position: relative;
          display: flex;

          .left {
            flex-grow: 1;
            width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .right {
            svg {
              box-sizing: content-box;
              padding: 0.3em 15px 0 0.3em;
              float: right;
              color: #2196f3;
            }
          }

          &:after {
            content: " ";
            position: absolute;
            bottom: 0;
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

        .list-item-body-content {
          padding: 10px 15px;

          .list-item-row {
            font-size: 13px;
            line-height: 2;
            display: flex;

            .list-item-row-l {
              color: #999999;
              white-space: nowrap;

              > div {
                display: inline-block;
              }

              &:after {
                content: '：';
                display: inline;
              }
            }

            .list-item-row-r {
              color: #444444;
              flex-grow: 1;
              width: 0;

              &.can-show-more {
                color: #2196f3;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                position: relative;

                &:before {
                  content: '';
                  display: block;
                  float: right;
                  width: 1em;
                  height: 1em;
                }

                .more-investors {
                  color: #999999;
                  position: absolute;
                  right: 0;
                  top: 0.4em;
                  transform: rotate(270deg);
                }

                .investors-item {
                  display: initial;

                  & > span {
                    & > svg {
                      display: inline-block;
                      color: #aaaaaa;

                      &:last-of-type {
                        margin-left: -.5em;
                      }
                    }

                    span {
                      margin-left: -0.5em;
                    }
                  }
                }
              }
            }

            &:after {
              .clear_float()
            }
          }

          &:after {
            .clear_float()
          }
        }

        .show-item-info-btn {
          transition: all 0.3s;
          font-size: 12px;
          display: inline-block;
          color: #1ab394;

          svg {
            transition: all 0.3s;
            vertical-align: baseline;
          }
        }
      }

    }
  }

  .filter-p-div {
    background-color: #ffffff;
    width: @filter_w !important;

    * {
      box-sizing: border-box;
    }

    .filter-div {
      padding-bottom: 50px;

      .checker-box {
        padding: 10px 4%;

        .checker-title {
          line-height: 28px;
          height: 28px;
          margin: 10px 0;
          font-size: 14px;
        }

        .checker-item {
          color: @item_val_color;
          border-radius: 6px;
          line-height: 28px;
          height: 28px;
          min-width: 30%;
          max-width: 45%;
          padding: 0 1%;
          margin: 0 2.5% 10px 0;
          text-align: center;
          background: #f2f2f2;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.3s;

          &.checker-item-selected {
            background-color: #18a689;
            color: #ffffff;
          }
        }

        .month-group {
          /deep/ .weui-cells:before, /deep/ .weui-cells:after {
            display: none;
          }

          .month-datetime {
            padding: 0;
            color: @item_val_color;

            /deep/ div p {
              font-size: 12px;
              .time_zdy();
            }

            /deep/ .weui-cell__ft {
              text-align: left;
              .time_zdy();
              .timeselect();

              &:after {
                display: none;
              }
            }
          }
        }

        & + .checker-box {
          padding-top: 0;
          border-top: 1px solid #e7e7e7;
        }
      }

      .filter-input-div {
        color: @item_val_color;

        .filter-input-title {
          .time_zdy();
          font-size: 12px;
        }

        .input-time-mind {
          .time_zdy();
          color: @item_val_color;
        }

        input {
          &.filter-input {
            outline: medium;

            &::-webkit-input-placeholder {
              color: #dddddd;
              font-size: 13px;
            }

            &:-moz-placeholder {
              color: #dddddd;
              font-size: 13px;
            }

            &::-moz-placeholder {
              color: #dddddd;
              font-size: 13px;
            }

            &:-ms-input-placeholder {
              color: #dddddd;
              font-size: 13px;
            }
          }
        }

        .filter-input {
          .time_zdy();
          .timeselect();
          color: #18a689;
        }
      }
    }

    .filter-bottom {
      position: fixed;
      bottom: 0;
      width: @filter_w;

      .weui-btn {
        border-radius: 0;
      }
    }
  }

  .do-calendar-div {
    > div {
      float: left;
      width: 33.333%;

      > span {
        padding: 0 15px;
        line-height: 42px;
      }
    }

    &:after {
      .clear_float()
    }
  }

  .timeline-div {
    &.recent {
      .timeline-head {
        font-weight: 600;
      }
    }

    .timeline-head {
      font-size: 16px;
      padding-left: 10px;
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
</style>
