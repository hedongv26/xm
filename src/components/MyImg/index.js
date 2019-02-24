import { XImg } from 'vux'
import Blazy from 'blazy'
export default {
  name: 'my-img',
  extends: XImg,
  activated () {
    this.$el.setAttribute('id', `vux-ximg-${this.uuid}`)
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.$el.src === this.defaultSrc) { this.init() }
      }, this.delay)
    })
  },
  methods: {
    init () {
      const _this = this
      this.blazy && this.blazy.destroy()
      this.blazy = new Blazy({
        scroller: this.scroller,
        container: this.container,
        selector: `#vux-ximg-${this.uuid}`,
        offset: _this.offset,
        errorClass: _this.errorClass,
        successClass: _this.successClass,
        separator: _this.separator,
        success (ele) {
          _this.$emit('on-success', _this.src, ele)
        },
        error (ele, msg) {
          _this.$emit('on-error', _this.src, ele, msg)
        }
      })
    }
  }
}
