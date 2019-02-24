import { XInput } from 'vux'
export default {
  name: 'my-input',
  extends: XInput,
  watch: {
    value (val) {
      if (val === undefined) {
        this.currentValue = ''
      }
    },
    currentValue (val) {
      if (val === undefined) {
        this.currentValue = ''
      }
    }
  }
}
