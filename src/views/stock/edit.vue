<template>
<div>
  <group title="基本信息" label-width="6em" label-margin-right="1.3em" label-align="justify">
    <my-textarea  title="存量资源名称" v-model="info.name" autosize :rows="1" class="my-textarea"></my-textarea >
    <selector title="存量资源形式" v-model="info.form" :options="forms"></selector>
    <my-textarea  title="存量资源位置" v-model="info.location" autosize :rows="1" class="my-textarea"></my-textarea >
    <cell title="存量资源位置图片" align-items="flex-start" primary="content">
      <div style="text-align: left">
        <vue-core-image-upload
          :class="['upload-btn']"
          extensions="png,jpg,jpeg"
          :crop="false"
          :multiple="true"
          @imageuploading="imageUploading"
          @imageuploaded="imageUploaded"
          inputOfFile="file"
          :headers="upload_headers"
          :credentials="false"
          :list="imgs"
          :url=upload_url >
          <svg-icon icon-class="add"></svg-icon>
        </vue-core-image-upload>
      </div>
    </cell>
    <div class="imgs-div">
      <transition-group name="fade"
                  enter-active-class="animated fadeInDown"
                  leave-active-class="animated fadeOutUp"
                  :duration="250">
        <div v-for="(img,index) in imgs" :key="index+img.src" class="list-item-img">
          <div class="img-div">
            <x-img :src="img.src" @on-error="errorImg"
                   default-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCIgY2xhc3M9Imxkcy1lY2xpcHNlIj48cGF0aCBuZy1hdHRyLWQ9Int7Y29uZmlnLnBhdGhDbWR9fSIgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jb2xvcn19IiBzdHJva2U9Im5vbmUiIGQ9Ik0zMCA1MEEyMCAyMCAwIDAgMCA3MCA1MEEyMCAyMSAwIDAgMSAzMCA1MCIgZmlsbD0iIzYwYWE0ZiIgdHJhbnNmb3JtPSJyb3RhdGUoMjI5LjgzMiA1MCA1MC41KSI+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMCA1MCA1MC41OzM2MCA1MCA1MC41IiBrZXlUaW1lcz0iMDsxIiBkdXI9IjAuNnMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L3BhdGg+PC9zdmc+"
                   @click.native="$refs.previewer.show(index)"></x-img>
          </div>
          <div class="remove-img-div" @click="removeImg(img.id)">
            <svg-icon icon-class="close"></svg-icon>
          </div>
        </div>
      </transition-group>
    </div>
  </group>
  <group title="资源情况" label-width="6em" label-margin-right="1.3em" label-align="justify">
    <my-textarea title="产权所有者" v-model="info.owner" autosize :rows="1" class="my-textarea"></my-textarea>
    <my-textarea title="资源概况" v-model="info.resources" autosize :rows="1" class="my-textarea"></my-textarea>
    <my-textarea title="四至范围" v-model="info.range" autosize :rows="1" class="my-textarea"></my-textarea>
    <my-input title="用地面积" v-model="info.land_area" type="number" class="my-input">
      <div slot="right">平方米</div>
    </my-input>
    <my-input title="容积率" v-model="info.rlot_ratio" class="my-input"></my-input>
    <my-textarea title="资源原用途" v-model="info.old_use" autosize :rows="1" class="my-textarea"></my-textarea>
    <selector title="存量资源形式" v-model="info.recruiting_forms" :options="recruiting_forms"></selector>
    <my-textarea title="招商业态" v-model="info.investment_format" autosize :rows="1" class="my-textarea"></my-textarea>
  </group>
  <group title="资源联系方式" label-width="6em" label-margin-right="1.3em" label-align="justify">
    <my-input title="资源联系人" v-model="info.contacts" class="my-input"></my-input>
    <my-input title="联系电话" v-model="info.tel" class="my-input"></my-input>
  </group>
  <group title="其他信息" label-width="6em" label-margin-right="1.3em" label-align="justify">
    <my-textarea title="备注" v-model="info.remarks" autosize :rows="1" class="my-textarea"></my-textarea>
    <selector title="是否本月新增" v-model="info.is_this_month" :options="[{key:0,value:'否'},{key:1,value:'是'}]"></selector>
  </group>
  <box gap="25px 25px">
    <x-button type="primary" @click.native="saveInfo">{{info.id?'保存修改':'确定新增'}}</x-button>
  </box>
  <previewer ref="previewer" :list="imgs"></previewer>
</div>
</template>

<script>
  import { getEdit, save } from '@/api/stock'
  import { getToken } from '@/utils/auth'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import MyTextarea from '@/components/MyTextarea'
  import MyInput from '@/components/MyInput'
  import { Group, Cell, XImg, Previewer, XTextarea, Selector, XButton, Box } from 'vux'
  export default {
    components: {
      Group,
      Cell,
      XImg,
      XTextarea,
      Selector,
      Previewer,
      VueCoreImageUpload,
      XButton,
      Box,
      MyTextarea,
      MyInput
    },
    data () {
      return {
        upload_url: '',
        upload_headers: {
          'Access-Token': getToken()
        },
        imgs: [],
        id: 0,
        forms: [],
        recruiting_forms: [],
        info: {},
        option: {}
      }
    },
    created () {
      this.upload_url = process.env.BASE_API + '/File/fileUpload'
    },
    activated () {
      this.$store.dispatch('UpdateTitleBack', {title: (this.$route.query.id ? '修改' : '新增') + '存量资源信息', ShowBack: true})
      this.initInfo()
    },
    methods: {
      initInfo () {
        this.$vux.loading.show({
          text: ''
        })
        getEdit({id: this.$route.query.id}).then((response) => {
          this.$vux.loading.hide()
          this.info = response.data.info
          this.forms = response.data.forms
          this.recruiting_forms = response.data.recruiting_forms
          this.imgs = []
          if (response.data.info_location_imgs && Object.keys(response.data.info_location_imgs).length > 0) {
            for (const i in response.data.info_location_imgs) {
              this.imgs.push({src: response.data.info_location_imgs[i].path, id: response.data.info_location_imgs[i].id})
            }
          }
        })
      },
      imageUploading () {
        this.$vux.loading.show({
          text: '图片上传中...'
        })
      },
      imageUploaded (res) {
        this.$vux.loading.hide()
        if (res.data && Object.keys(res.data).length > 0) {
          if (res.data.id) {
            this.imgs.push({src: res.data.path, id: res.data.id})
          } else {
            for (const i in res.data) {
              this.imgs.push({src: res.data[i].path, id: res.data[i].id})
            }
          }
        }
      },
      removeImg (id) {
        this.imgs = this.imgs.filter(t => t.id !== id)
      },
      errorImg (src, ele) {
        ele.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ3MTk5NTgwNjM3IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE4NjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTc0LjgzNDM0NyA4ODUuNzkwNzJMMjYyLjEyMDEwNyA4ODUuNzkwNzJsMjc1Ljk2OC00NzguMzM0MjkzIDEwMy45ODM3ODctMTAzLjk4Mzc4NyAyMC44MDA4NTMtMTI0Ljc4MTIyNyA2Mi4zODg5MDctNDEuNTk0ODggMjQ5LjU2OTI4IDBjMjIuOTY4MzIgMCA0MS41ODgwNTMgMTguNjIzMTQ3IDQxLjU4ODA1MyA0MS41OTQ4OGwwIDY2NS41MDQ0MjdDMTAxNi40MTg5ODcgODY3LjE2NDE2IDk5Ny43OTkyNTMgODg1Ljc5MDcyIDk3NC44MzQzNDcgODg1Ljc5MDcyek03OTUuMTQ2MjQgNDA3LjQ1NjQyN2wtMTM4LjQwNzI1MyAzMjAuMzgyMjkzLTk3LjQ0NzI1My0xOTEuNjk5NjI3LTE0NS45ODE0NCAyODcuMjU5MzA3IDIwMi4xMzc2IDAgODkuODQ5MTczIDAgMjY5LjUzMzg2NyAwTDc5NS4xNDYyNCA0MDcuNDU2NDI3ek01MzguMDkxNTIgMzAzLjQ3MjY0YzAgMC0yNC42OTU0NjcgMjguODIyMTg3LTUyLjExNDc3MyA2MC44MDg1MzMtMzQuMjE4NjY3IDM5LjkwODY5My03Mi42NjMwNCA4NC43NzAxMzMtNzIuNjYzMDQgODQuNzcwMTMzTDI0OS41MzE3MzMgODg1Ljc5MDcyIDU5Ljc2MDY0IDg4NS43OTA3MmMtMjIuOTY4MzIgMC00MS41OTQ4OC0xOC42MjY1Ni00MS41OTQ4OC00MS41OTQ4OEwxOC4xNjU3NiAxNzguNjkxNDEzYzAtMjIuOTcxNzMzIDE4LjYyNjU2LTQxLjU5NDg4IDQxLjU5NDg4LTQxLjU5NDg4bDUxOS45MjIzNDcgMGMwIDAtMjAuNzk0MDI3IDc0Ljg2MTIyNy0yMC43OTQwMjcgODMuMTg2MzQ3QzU1OC44ODg5NiAyMjguNjExNDEzIDUzOC4wOTE1MiAzMDMuNDcyNjQgNTM4LjA5MTUyIDMwMy40NzI2NHpNMjY3LjcyODIxMyAyNjEuODc3NzZjLTU3LjQzNjE2IDAtMTAzLjk4Mzc4NyA0Ni41NTEwNC0xMDMuOTgzNzg3IDEwMy45ODcyIDAgNTcuNDM2MTYgNDYuNTQ3NjI3IDEwMy45ODAzNzMgMTAzLjk4Mzc4NyAxMDMuOTgwMzczIDU3LjQzNjE2IDAgMTAzLjk5MDYxMy00Ni41NDc2MjcgMTAzLjk5MDYxMy0xMDMuOTgwMzczQzM3MS43MTU0MTMgMzA4LjQyODggMzI1LjE2NDM3MyAyNjEuODc3NzYgMjY3LjcyODIxMyAyNjEuODc3NzZ6IiBwLWlkPSIxODY3IiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+PC9zdmc+'
        ele.style.padding = '10px'
      },
      saveInfo () {
        let imgIds = []
        this.imgs.map(v => {
          imgIds.push(v.id)
        })
        this.info.location_imgs = imgIds.join(',')
        save(this.info).then(response => {
          this.$store.dispatch('UpdateHaveUpdated', {stock: true})
          this.$vux.toast.show({
            text: response.msg,
            time: 3 * 1000
          })
        })
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .weui-cell__bd {
    textarea,input,select{
      color: #888888;
      font: 400 17px Arial;
    }
  }
  .upload-btn{
    font-size: 12px;
    margin-top: 0.3em;
    line-height: 1;
    svg{
      border:1px solid #f1f1f1;
      border-radius: 5px;
      background-color: #dddddd;
      padding: 0.41176471em;
      vertical-align: baseline;
      color: #ffffff;
      display: inline-block;
    }
  }
  .imgs-div{
    text-align: left;
    padding-left: 8px;
    box-sizing: border-box;
    margin-top: -40px;
    margin-bottom: 30px;
    &::after{
      content: '';
      display: block;
      clear: both;
    }
  }
  .list-item-img{
    margin: 15px 0 0 15px;
    float: left;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    padding: 2px;
    position: relative;
    .img-div{
      box-sizing: border-box;
      position: relative;
      height: 90px;
      width: 90px;
      background-color: #f7f7f7;
      border-radius: 8px;
      img{
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
    .remove-img-div{
      float: none;
      position: absolute;
      top: 5px;
      right: 5px;
      color: #ff4542;
      font-size: 12px;
      svg{
        display: block;
      }
    }
  }
</style>
