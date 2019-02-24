<template>
  <div>
    <x-header class="header" :left-options="{showBack: showBack}">{{title}}
      <span slot="right"><span slot="icon"><router-link to="/user/me"><svg-icon icon-class="me" class="head-me"/></router-link></span></span>
    </x-header>
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <keep-alive>
        <router-view class="router-view html-box"></router-view>
      </keep-alive>
    </transition>
    <tabbar icon-class="vux-center" class="bottom-menu" slot="bottom" v-model="selectedIndex">
      <tabbar-item v-if="value.role()" :link="value.url" :selected="value.url.path === $route.path"  v-for="(value,index) in menus" :key="value.title">
        <span slot="icon"><svg-icon :icon-class="selectedIndex===index?value.check_ico:value.icon"/></span>
        <span slot="label">{{value.title}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { XHeader, Tabbar, TabbarItem } from 'vux'
  import { mapState } from 'vuex'
  import menuList from '@/utils/menus'
  export default {
    name: 'layout',
    components: {
      XHeader,
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        entryUrl: document.location.href,
        selectedIndex: -1,
        menus: []
      }
    },
    created () {
      let menus = [{title: '项目统计', url: {path: '/index'}, icon: 'statistics', check_ico: 'statistics2', role: () => true}]
      menus.push(...menuList)
      this.menus = menus
    },
    computed: {
      ...mapState({
        direction: state => state.vux.direction,
        username: state => state.user.name,
        title: state => state.layout.title,
        showBack: state => state.layout.showBack
      })
    },
    mounted () {
      this.changeMenuSelect(this.$route)
    },
    methods: {
      changeMenuSelect (route) {
        this.selectedIndex = -1
        for (const i in this.menus) {
          if (this.doSelectMenu(route, this.menus[i].url.path, i) === true) {
            return true
          }
        }
      },
      doSelectMenu (route, path, i) {
        if (route.path === path) {
          this.selectedIndex = parseInt(i)
          return true
        }
        if (route.redirect) {
          if ((typeof route.redirect === 'function' && route.redirect() === path) ||
          (route.redirect && route.redirect.path && route.redirect.path === path) ||
          route.redirect === path) {
            this.selectedIndex = parseInt(i)
            return true
          }
        }
        if (route.parent && route.parent.length > 0) {
          route.parent.forEach(v => {
            if (this.doSelectMenu(v, path, i) === true) {
              return true
            }
          })
        }
        if (route.matched && route.matched.length) {
          route.matched.forEach(v => {
            if (this.doSelectMenu(v, path, i) === true) {
              return true
            }
          })
        }
        return false
      }
    },
    watch: {
      '$route': function (to) {
        this.changeMenuSelect(to)
      }
    }
  }
</script>

<style lang="less">
  @defcolor:#1ab394;
  @textdefcolot:#999999;
  .header.vux-header{
    background-color: @defcolor;
    .vux-header-left{
      .vux-header-back{
        color: #eeeeee;
      }
      .left-arrow:before{
        border-color: #eeeeee;
      }
    }
    .vux-header-right{
      top: 10px;
      .head-me{
        font-size: 28px;
        color:#ffffff;
      }
    }
  }
  .weui-tabbar{
    .vux-center{
      .svg-icon{
        font-size: 24px;
        color:@textdefcolot;
      }
    }
    .weui-tabbar__item.weui-bar__item_on{
      .svg-icon,.weui-tabbar__label{
        color:@defcolor;
      }
    }
  }
  .weui-tabbar.bottom-menu{
    position: fixed;
  }
  .html-box{
    padding-bottom: 50px;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 250ms;
    height: 100%;
    top: 46px;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>

