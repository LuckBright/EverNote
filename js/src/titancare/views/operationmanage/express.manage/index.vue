<template>
  <!-- 发药管理 -->
  <div class='layout_inner send-box'>
    <div class=" min-high pos_re express-box">
      <div class='leftSearch'>
        <left-search-list :tabsName='tabsName' :isShowAllBtn='false' @changeRow='changeRow' @changeShow='changeShow' ref='searchListRef'></left-search-list>
      </div>
      <div style='flex-grow: 1' v-if='row'>
        <div class='send-info' v-if='!isShow'>
          <p>
            <el-button type='primary' @click='allSendClick' :disabled="disabled">整包发药</el-button>
            <el-button type='primary' @click='smallSendClick'>分包发药</el-button>
            <span @click='viewAddress'>查询相同地址待发药订单</span>
          </p>
        </div>
        <receiving-address :values='detailsObj' :list='addressList'></receiving-address>
        <div class='adopt-info'>
          <span class='label-info'>开方医生：</span>
          <span class='value-info'>{{detailsObj.orderDoctorSignature}}</span>
          <span class='label-info' style='margin-left: 20px'>开方时间：</span>
          <span class='value-info'>{{detailsObj.createDate}}</span>
        </div>
        <div v-for='(items, index) in detailsObj.recipeList' :key='index'>
          <see-btn v-if='items.list.length' :values='items' :status='detailsObj.auditStatus'></see-btn>
          <table-label
            v-for='(item, index) in items.list'
            :key='index'
            :name="serviceType[item[0].serviceType]"
            :resultData='item'
            :isShowCheckBox='!isShow'
            ref='tableref'
            ></table-label>
        </div>
      </div>
    </div>
    <el-dialog :title="title" class='dialog-send' :visible.sync="isShowdialog" :close-on-press-escape='false' :close-on-click-modal='false'>
      <send-form @close="close('sendref')" :rowValue='row' :title='title' ref='sendref' :idList='idList' @closeSearch='closeSearch' v-if='isShowdialog' :num='smallSendNum'></send-form>
    </el-dialog>
    <el-dialog title="合并发药" :visible.sync="addressDialog" :close-on-press-escape='false' :close-on-click-modal='false'>
      <address-express :values='addressDialogValues' v-if='addressDialog'  @closeExpressDialog='closeExpressDialog' ref='addressRef'></address-express>
    </el-dialog>
  </div>
</template>
<script>
import leftSearchList from '../leftsearchlist'
import tableLabel from '../tablelabel'
import seeBtn from '@/titancare/views/operationmanage/seebutton.vue'
import receivingAddress from '../receiving.address'
import sendForm from './send.form'
import addressExpress from './address.express'
import api from '@/titancare/api/operation'
export default {
  components: {
    leftSearchList,
    tableLabel,
    seeBtn,
    receivingAddress,
    sendForm,
    addressExpress
  },
  data () {
    return {
      api,
      tabsName: {
        tab1: '待发药',
        tab2: '已发药'
      },
      title: '',
      isShowdialog: false,
      form: {
        value1: '',
        value2: ''
      },
      row: '',
      isShow: false,
      detailsObj: {},
      serviceType: {
        301: '西药',
        302: '中成药',
        303: '中药材',
        304: '中药材'
      },
      idList: [],
      addressDialog: false,
      addressDialogValues: [],
      addressList: [],
      disabled: false,
      smallSendNum: ''
    }
  },
  methods: {
    /**
     * 整包发药
     */
    allSendClick () {
      this.title = '整包发药'
      this.isShowdialog = true
    },
    /**
     * 分包发药
     */
    smallSendClick () {
      let selection = []
      this.idList.length = 0
      this.$refs.tableref.forEach(item => {
        selection.push(...item.allSelection)
      })
      selection.forEach(item => {
        this.idList.push(item.doctorAdviceId)
      })
      if (selection.length) {
        api.deliverNum({ recipeOrderId: this.row.id }).then(res => {
          if (!res.errCode) {
            this.smallSendNum = res.data
            this.isShowdialog = true
            this.title = '分包发药-包裹' + this.smallSendNum
          }
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请选择要发货的药品',
          type: 'warning'
        })
      }
    },
    changeRow (row) {
      this.row = row
      if (row) this.getInfo(row.id)
    },
    changeShow (row) {
      this.isShow = row
      this.row = ''
      this.detailsObj = {}
    },
    /**
     * 格式化请求表格数据
     */
    setInfo (values) {
      let arr301 = []
      let arr302 = []
      let arr303 = []
      values.doctorAdviceList.forEach(item => {
        if (item.serviceType === '301') {
          let info = JSON.parse(item.content)
          info.doctorAdviceId = item.doctorAdviceId
          info.dispensingStatus = item.dispensingStatus
          if (info.dispensingStatus === 1) this.disabled = true
          arr301.push(info)
        } else if (item.serviceType === '302') {
          let info = JSON.parse(item.content)
          info.doctorAdviceId = item.doctorAdviceId
          info.dispensingStatus = item.dispensingStatus
          if (info.dispensingStatus === 1) this.disabled = true
          arr302.push(info)
        } else if (item.serviceType === '303' || item.serviceType === '304') {
          let info = JSON.parse(item.content)
          info.doctorAdviceId = item.doctorAdviceId
          info.dispensingStatus = item.dispensingStatus
          if (info.dispensingStatus === 1) this.disabled = true
          arr303.push(info)
        }
      })
      values.list = []
      if (arr301.length) {
        values.list.push(arr301)
      }
      if (arr302.length) {
        values.list.push(arr302)
      }
      if (arr303.length) {
        values.list.push(arr303)
      }
    },
    /**
     * 获取数据
     */
    getInfo (id) {
      this.disabled = false
      api.getRecipeOrderDetail({ recipeOrderId: id }).then(res => {
        if (!res.errCode) {
          res.data.recipeList.forEach(item => {
            this.setInfo(item)
          })
          this.detailsObj = res.data
          console.log('details', this.detailsObj)
        }
      })
      this.getAddress(id)
    },
    /**
     * 获取快递信息列表
     */
    getAddress (id) {
      api.getAddressList({ recipeOrderId: id, orgId: localStorage.getItem('CLINICID') }).then(res => {
        if (!res.errCode) {
          this.addressList = res.data
        }
      })
    },
    /**
     * 手动关闭发货弹框
     */
    close (ref) {
      this.$refs[ref].forms = []
      this.$refs[ref].form = {
        expressComCode: '',
        expressNumber: '',
        expressComName: ''
      }
      this.isShowdialog = false
      this.addressDialog = false
    },
    /**
     * 相同地址发药审核
     */
    viewAddress () {
      api.sameAddressRecipeOrder({ recipeOrderId: this.row.id }).then(res => {
        if (!res.errCode) {
          res.data.forEach(items => {
            items.recipeList.forEach(item => {
              this.setInfo(item)
            })
          })
          this.addressDialogValues = res.data
          this.addressDialog = true
        }
      })
    },
    /**
     * 发药成功后重新请求
     */
    closeSearch () {
      this.close('sendref')
      this.row = ''
      this.$refs.searchListRef.searchList()
    },
    /**
     * 合包发药重新请求
     */
    closeExpressDialog () {
      this.close('addressRef')
      this.row = ''
      this.$refs.searchListRef.searchList()
    }
  }
}
</script>
<style lang="less" scoped>
.layout_inner {
  height: 100%;
  padding-bottom: 20px;
}
.express-box{
  display: flex;
  padding: 20px;
  .leftSearch{
    border-right: 1px solid #ddd;
    margin-right: 10px;
  }
  .adopt-info{
    margin-top: 10px;
    height: 32px;
    line-height: 32px;
    background: #F0F5FA;
    padding-left: 20px;
    .label-info{
      font-size: 14px;
      color: #999;
    }
  }
  .tip{
    border-top: 1px dotted #ddd;
    margin-top: 20px;
  }
  .send-info{
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    padding-bottom: 20px;
    p{
      margin: 0;
      span {
        display: inline-block;
        margin-left: 20px;
        font-size: 14px;
        color: #1c7bef;
        letter-spacing: 0.5px;
        cursor: pointer;
      }
    }
  }
}
.send-box /deep/ .dialog-send .el-dialog{
  width: 395px;
}
</style>
