import { Search } from 'vux'
export default {
  name: 'my-search',
  extends: Search,
  data () {
    return {
      submit_search: ''
    }
  },
  methods: {
    getFixed () {
      return this.isFixed
    },
    changeisFixed (isFixed) {
      this.isFixed = isFixed
    },
    getSubVal () {
      return this.submit_search
    },
    setSubVal (val) {
      this.submit_search = val
    }
  },
  watch: {
    isFixed (val) {
      this.$emit('on-fixed')
    }
  }
}
