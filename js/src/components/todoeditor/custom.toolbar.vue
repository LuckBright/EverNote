<template>
  <div class="custom_toolbar">
    <div>
      <div v-if="!isEditor">{{clinic.name && clinic.name.length >16 ? (clinic.name.substring(0, 16) + '...') : clinic.name}}</div>
      <div v-else class="toolbar">
        <div class="col font_size_wrap">
          <span @click="fontSizeHandle(1)" title="缩小字号">
            A
          </span>
          <span @click="fontSizeHandle(2)" title="增大字号">
           A
          </span>
        </div>
        <div class="col add_btn_warp" @click="addItem">
          <i class="icon iconfont icon-complete1"></i>
        </div>
        <div class="col color_warp">
          <span v-for="item in color" @click="textColorHandle(item)" :key="item" :style="'background:' + item"></span>
        </div>
      </div>
    </div>
    <div class="btns_toolbar">
      <el-button size="mini" v-if="isEditor" @click="cancelFlag">取消</el-button>
      <el-button size="mini" class="success_btn" v-if="isEditor" type="primary" @click="saveHtml">完成</el-button>
      <el-button size="mini" v-if="!isEditor" @click="goEditor" v-ever-click-once="disabled" :disabled="disabled">编辑</el-button>
    </div>
  </div>
</template>
<script>
  import api from '@/crm/store/todoeditorapi.js'
  export default {
    props: {
      editor: {
        type: Object,
        default: () => {}
      },
      clinic: {
        type: Object,
        default: () => {}
      },
      htmlParams: {
        type: Object,
        default: () => {}
      },
      pageType: {
        type: Number
      },
      editorFlag: {
        type: Boolean,
        default: false // 区分预约还是服务看板使用
      }
    },
    data () {
      return {
        api,
        color: ['#000000', '#BC0000', '#0020BC', '#007709', '#C36E00', '#D8D8D8'],
        fontSize: 10.5, // 9pt (12px) 10.5pt(14px) 12pt(16px) 13.5pt(18px)
        isEditor: this.editorFlag,
        disabled: false
      }
    },
    methods: {
      saveHtml () {
        this.$emit('saveHtml')
      },
      goEditor () {
        this.$emit('reload') // 点击编辑时获取上一个人最新编辑的内容
        let params = {
          pageType: this.htmlParams.pageType,
          time: this.htmlParams.time,
          orgId: this.htmlParams.orgId,
        }
        if (params.pageType && params.time && params.orgId) {
          this.api.lock(params).then(rs => {
            if (rs && rs.data && rs.data.name) {
              this.$messageTips(this, 'success', '不能多人同时编辑,' + rs.data.name + '正在编辑本看板', '提示')
            } else {
              this.isEditor = !this.isEditor
              this.$emit('upDateFlag', true)
            }
          })
        }
      },
      cancelFlag () {
        this.isEditor = false
        let params = {
          pageType: this.htmlParams.pageType,
          time: this.htmlParams.time,
          orgId: this.htmlParams.orgId,
        }
        if (params.pageType && params.time && params.orgId) {
          this.api.unlock(params).then(rs => {
            if (rs && rs.head.errCode === 0) {
              this.$emit('upDateFlag', false)
            }
          })
        }
      },
      fontSizeHandle (type) {
        let size = this.fontSize
        if (type === 1) {
          size -= 1.5
          if (size < 9) {
            size = 9
          }
          this.editor.data.commands['font-size']({pt: size})
        } else if (type === 2) {
          size += 1.5
          if (size > 12) {
            size = 12
          }
          this.editor.data.commands['font-size']({pt: size})
        }
      },
      textColorHandle (color) {
        this.editor.data.commands['text_color']({color: color})
      },
      addItem () {
        this.$bus.$emit('addNew')
      }
    },
    watch: {
      'editor.data.getMarkAttrs' (val) {
        this.fontSize = val('font-size') && val('font-size').pt && (typeof (val('font-size').pt) !== 'string') ? val('font-size').pt : 10.5
      },
      'editorFlag' (val) {
        this.isEditor = val
      }
      // 'isEditor' (val) {
      //   console.log(this.isEditor, 'isEditor')
      //   this.$bus.$emit('isEditor', this.isEditor)
      // }
    }
  }
</script>
<style lang="scss" scoped>
.custom_toolbar{
  background-color:rgba(0,0,0,0.08);
  padding:0 10px 0 14px;
  width:100%;
  display:inline-flex;
  justify-content: space-between;
  z-index:9999;
  height: 37px;
  line-height: 37px;
  .col{
    display: inline-block;
    span{
      margin: 0 3px;
      user-select: none;
      cursor: pointer;
    }
  }
 .toolbar{
  height: 37px;
  line-height: 37px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
    .font_size_wrap{
      width:39px;
      height:20px;
      line-height: 20px;
      background-image: linear-gradient(-180deg, #FFFFFF 0%, #E5E5E5 97%);
      border: 1px solid #CBCBCB;
      vertical-align: center;
      display: inline-flex;
      border-radius: 4px;
      span{
        flex:1;
        color: #000000;
        font-size:12px;
        font-weight: 700;
        margin:0;
        text-align: center;
      }
      span:nth-child(2){
        font-size:16px;
        border-left:1px solid #CBCBCB;
      }
    }
    .add_btn_warp{
      width:20px;
      height:20px;
      line-height: 20px;
      background-image: linear-gradient(-180deg, #FFFFFF 0%, #E5E5E5 97%);
      border: 1px solid #CBCBCB;
      border-radius: 4px;
      margin-left: 5px;
      text-align:left;
      .icon-complete1{
        position: relative;
        top:-1px;
        left:3px;
        font-size:12px;
        color:#000000;
        font-weight: 700;
      }
    }
    .color_warp{
      height:20px;
      // line-height: 20px;
      border: 1px solid #CBCBCB;
      background-image: linear-gradient(-180deg, #FFFFFF 0%, #E5E5E5 97%);
      border-radius: 4px;
      margin-left: 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding:0 4px;
      span{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 3px;
        margin:0;
        margin-left: 2px;
      }
      span:nth-child(1){
        margin-left: 0px;
      }
    }
  }
  .btns_toolbar {
    /deep/.el-button--mini{border-radius: 4px;padding: 3px 7px;}
    .success_btn{margin-left: 5px;}
  }
}
</style>
