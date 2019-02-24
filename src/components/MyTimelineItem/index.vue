<template>
  <li class="vux-timeline-item">
    <div :class="['vux-timeline-item-color', {'vux-timeline-item-head': !isFirst,'vux-timeline-item-head-first': isFirst }]" :style="headStyle">
      <svg-icon v-show="isFirst && $parent.isShowIcon" icon-class="current" class="current-time"></svg-icon>
    </div>
    <div class="vux-timeline-item-tail" :style="tailStyle"></div>
    <div class="vux-timeline-item-content">
      <slot></slot>
    </div>
  </li>
</template>

<script>
  export default {
    name: 'my-timeline-item',
    data () {
      return {
        isLast: true,
        isFirst: true,
        headStyle: { backgroundColor: this.$parent.color }
      }
    },
    mounted () {
      this.$parent.setChildProps()
    },
    beforeDestroy () {
      // this will be null
      const $parent = this.$parent
      this.$nextTick(() => {
        $parent.setChildProps()
      })
    },
    computed: {
      tailStyle () {
        return this.isLast ? { display: 'none', backgroundColor: this.$parent.color } : { display: 'block', backgroundColor: this.$parent.color }
      }
    }
  }
</script>
<style scoped lang="less">
  .current-time{
    font-size: 20px;
    color: #09BB07;
  }
  .vux-timeline-item-color{
    &.vux-timeline-item-head-first{
      background-color:transparent;
      &+.vux-timeline-item-tail{
        top: 25px;
        height: auto;
        bottom: -5px;
      }
    }
  }

</style>

