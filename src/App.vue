<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    if (document.getElementById('app-box'))document.getElementById('app-box').style.display = 'block'
    if (document.getElementById('app-loading'))document.getElementById('app-loading').style.display = 'none'
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #f7f5fa;
}
</style>
