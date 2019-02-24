<template>
<div>
  <group title="基本信息">
    <cell title="存量资源名称" align-items="flex-start" primary="content">
      <div class="long-val">{{info.name}}</div>
    </cell>
    <cell title="存量资源形式" :value="info.form"></cell>
    <cell title="存量资源位置" align-items="flex-start" primary="content">
      <div class="long-val">{{info.location}}</div>
    </cell>
    <cell title="存量资源位置图片" align-items="flex-start" primary="content">
      <div slot="inline-desc" class="long-val">
        <div v-for="(img,index) in imgs" :key="index">
          <div class="list-item-img">
            <div class="img-div">
              <x-img :src="img.src" @on-error="errorImg"
                     default-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9Imxkcy1lY2xpcHNlIj48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMSAwIDAgMSAzMCA1MCIgZmlsbD0iIzYwYWE0ZiIgdHJhbnNmb3JtPSJyb3RhdGUoMjI5LjgzMiA1MCA1MC41KSI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMCA1MCA1MC41OzM2MCA1MCA1MC41IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjAuNnMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L3BhdGg+PC9zdmc+"
                     @click.native="$refs.previewer.show(index)"></x-img>
            </div>
          </div>
        </div>
      </div>
    </cell>
  </group>
  <group title="资源情况">
    <cell title="产权所有者" :value="info.owner" align-items="flex-start" primary="content"></cell>
    <cell title="资源概况" align-items="flex-start" primary="content">
      <div class="long-val">{{info.resources}}</div>
    </cell>
    <cell title="四至范围" align-items="flex-start" primary="content">
      <div class="long-val">{{info.range}}</div>
    </cell>
    <cell title="用地面积" :value="info.land_area"></cell>
    <cell title="容积率" :value="info.rlot_ratio"></cell>
    <cell title="资源原用途" :value="info.old_use"></cell>
    <cell title="招商形式" :value="info.recruiting_forms"></cell>
    <cell title="招商业态" :value="info.investment_format"></cell>
  </group>
  <group title="资源联系方式">
    <cell title="资源联系人" :value="info.contacts"></cell>
    <cell title="联系电话" :value="info.tel"></cell>
  </group>
  <group title="其他信息">
    <cell title="备注" :inline-desc="info.remarks"></cell>
    <cell title="是否本月新增" :value="okNo(info.is_this_month)"></cell>
  </group>
  <previewer ref="previewer" :list="imgs"></previewer>
</div>
</template>

<script>
  import { Group, Cell, XImg, Previewer } from 'vux'
  export default {
    components: {
      Group,
      Cell,
      XImg,
      Previewer
    },
    data () {
      return {
        imgs: [],
        info: {}
      }
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {title: '存量招商资源情况详情', ShowBack: true})
      this.info = this.$route.params.info
      this.imgs = []
      if (this.$route.params.imgs && this.$route.params.imgs.length > 0) {
        this.$route.params.imgs.forEach(v => {
          this.imgs.push({
            src: v
          })
        })
      }
    },
    methods: {
      errorImg (src, ele) {
        ele.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ3MTk5NTgwNjM3IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTc0LjgzNDM0NyA4ODUuNzkwNzJMMjYyLjEyMDEwNyA4ODUuNzkwNzJsMjc1Ljk2OC00NzguMzM0MjkzIDEwMy45ODM3ODctMTAzLjk4Mzc4NyAyMC44MDA4NTMtMTI0Ljc4MTIyNyA2Mi4zODg5MDctNDEuNTk0ODggMjQ5LjU2OTI4IDBjMjIuOTY4MzIgMCA0MS41ODgwNTMgMTguNjIzMTQ3IDQxLjU4ODA1MyA0MS41OTQ4OGwwIDY2NS41MDQ0MjdDMTAxNi40MTg5ODcgODY3LjE2NDE2IDk5Ny43OTkyNTMgODg1Ljc5MDcyIDk3NC44MzQzNDcgODg1Ljc5MDcyek03OTUuMTQ2MjQgNDA3LjQ1NjQyN2wtMTM4LjQwNzI1MyAzMjAuMzgyMjkzLTk3LjQ0NzI1My0xOTEuNjk5NjI3LTE0NS45ODE0NCAyODcuMjU5MzA3IDIwMi4xMzc2IDAgODkuODQ5MTczIDAgMjY5LjUzMzg2NyAwTDc5NS4xNDYyNCA0MDcuNDU2NDI3ek01MzguMDkxNTIgMzAzLjQ3MjY0YzAgMC0yNC42OTU0NjcgMjguODIyMTg3LTUyLjExNDc3MyA2MC44MDg1MzMtMzQuMjE4NjY3IDM5LjkwODY5My03Mi42NjMwNCA4NC43NzAxMzMtNzIuNjYzMDQgODQuNzcwMTMzTDI0OS41MzE3MzMgODg1Ljc5MDcyIDU5Ljc2MDY0IDg4NS43OTA3MmMtMjIuOTY4MzIgMC00MS41OTQ4OC0xOC42MjY1Ni00MS41OTQ4OC00MS41OTQ4OEwxOC4xNjU3NiAxNzguNjkxNDEzYzAtMjIuOTcxNzMzIDE4LjYyNjU2LTQxLjU5NDg4IDQxLjU5NDg4LTQxLjU5NDg4bDUxOS45MjIzNDcgMGMwIDAtMjAuNzk0MDI3IDc0Ljg2MTIyNy0yMC43OTQwMjcgODMuMTg2MzQ3QzU1OC44ODg5NiAyMjguNjExNDEzIDUzOC4wOTE1MiAzMDMuNDcyNjQgNTM4LjA5MTUyIDMwMy40NzI2NHpNMjY3LjcyODIxMyAyNjEuODc3NzZjLTU3LjQzNjE2IDAtMTAzLjk4Mzc4NyA0Ni41NTEwNC0xMDMuOTgzNzg3IDEwMy45ODcyIDAgNTcuNDM2MTYgNDYuNTQ3NjI3IDEwMy45ODAzNzMgMTAzLjk4Mzc4NyAxMDMuOTgwMzczIDU3LjQzNjE2IDAgMTAzLjk5MDYxMy00Ni41NDc2MjcgMTAzLjk5MDYxMy0xMDMuOTgwMzczQzM3MS43MTU0MTMgMzA4LjQyODggMzI1LjE2NDM3MyAyNjEuODc3NzYgMjY3LjcyODIxMyAyNjEuODc3NzZ6IiBwLWlkPSIxODY3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+'
        ele.style.padding = '10px'
      },
      okNo (val) {
        if (!val || val === 0 || val === '0') {
          return '否'
        }
        return '是'
      }
    }
  }
</script>

<style scoped lang="less">
  .long-val{
    float: right;
    text-align: left;
    padding-left: 8px;
    box-sizing: border-box;
  }
  .list-item-img{
    margin: 15px 0 0 15px;
    height: 90px;
    width: 90px;
    float: left;
    box-sizing: border-box;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 2px;
    .img-div{
      width: 100%;
      height: 100%;
      background-color: #f7f7f7;
      box-sizing: border-box;
      position: relative;
      border-radius: 8px;
      >img{
        border-radius: 2px;
        box-sizing: border-box;
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
</style>
