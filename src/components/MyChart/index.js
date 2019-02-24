import { VChart } from 'vux'
export default {
  name: 'my-chart',
  extends: VChart,
  async mounted () {
    await this.$nextTick()
    window.removeEventListener('resize', this.render)
  }
}
