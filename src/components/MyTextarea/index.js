import { XTextarea } from 'vux'

export default {
  name: 'my-textarea',
  extends: XTextarea,
  mounted () {
    this.initAutosize()
  },
  activated () {
    this.initAutosize()
  },
  methods: {
    initAutosize () {
      if (this.autosize) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.updateAutosize()
          }, 500)
        })
      }
    }
  }
}
