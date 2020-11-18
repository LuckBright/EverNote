<template>
  <div>
    <ever-bread-crumb name="采购退货" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2 :schema="readSchema" class="readform" v-model="obj" ref="form" :span="12" :nosubmit="true">
          <template slot="outStockCode">
            <a class="blue cur" @click="handleOutRoute">{{obj.outStockCode}}</a>
            <span v-if="obj.outStockStatus" class="ml20" :class="{ 'red': obj.outStockStatus === 24 }">{{setName(FULL_STATE.outstock, obj.outStockStatus)}}</span>
            <span v-else class="ungenerated">未生成</span>
          </template>
          <template slot="default"></template>
        </ever-form2>
        <h4>物资明细</h4>
        <ever-table
          :columns="columnsBackSee"
          :border="true"
          :span-method="arraySpanMethod"
          :table-class="'no-hover'"
          :tableKey="'localMaterialId'"
          :data="hanlderItems">
          <!-- 物资展示 -->
          <template slot="materialName" slot-scope="scope">
            {{scope.row.materialName}}
          </template>
        </ever-table>
        <div class="totalprice">
          <span class="ml10">预计退货总金额：<span class="cOrange">{{obj.totalPrice | formatToFinacial(4)}}</span></span>
          <span class="ml10">实际退货总金额：<span class="cOrange">{{obj.outTotalPrice | formatToFinacial(4)}}</span></span>
        </div>
        <div>
          <el-button v-if="obj.status == 72" class="w_60" type="primary" :loading="btnLoading" @click="handleCancle">取消</el-button>
        </div>
      </div>
    </div>
    <!-- 取消弹窗 -->
    <el-dialog
      title="确认是否取消"
      :visible.sync="visibleDialog"
      :close-on-click-modal="false"
      :close-on-press-escape='false'
      :show-close='true'
      width="420px">
      <div class="mb5 cGray6 f14" style="line-height: 18px">单据取消后不能恢复，请确认是否取消？<br>确认取消请填写取消原因</div>
      <el-input
        type="textarea"
        placeholder="请填写取消原因"
        v-model="textarea"
        maxlength="100"
        class="mheight"
        show-word-limit>
      </el-input>
      <div class="alg_c mt10">
        <el-button type="primary" size="small" :disabled="!textarea.length" @click="handlerConsent" :loading="poploding">确认</el-button>
        <el-button size="small" @click="visibleDialog = false" :loading="poploding">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import getstorage from '@/warehouse/page/storages/util/getstorage'
import sets from '@/util/setstatusname'
import { FULL_STATE, debounce } from '@/util/common'
import api from '../store/givebackapi'
import { readSchema, columnsBackSee } from '@/warehouse/page/storages/business/store/columns.js'

export default {
  mixins: [getstorage, sets],
  data () {
    let obj = this.$ever.createObjFromSchema(readSchema)
    obj.items = []
    return {
      readSchema,
      obj,
      columnsBackSee,
      FULL_STATE,
      objId: this.$route.params.id,
      btnLoading: false,
      visibleDialog: false,
      poploding: false,
      textarea: ''
    }
  },
  created () {
    this.getDetails()
  },
  computed: {
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      return this.obj.items.map((item, index) => {
        let childIndex = this.obj.items.findIndex(child => child.localMaterialId === item.localMaterialId)
        const thisArr = this.obj.items.filter(child => child.localMaterialId === item.localMaterialId)
        // 当前物资第一次出现的下标
        item.thisTableIndex = childIndex
        // 当前物资存在几条
        item.thisTableCount = thisArr.length
        // 当前物资的最后一条打上标记  last 需要显示添加批号按钮
        item.last = index === childIndex + thisArr.length - 1
        return item
      })
    }
  },
  methods: {
    handleOutRoute () {
      const id = this.obj.outStockId
      const status = this.obj.outStockStatus
      this.$router.push(status === FULL_STATE.outstock[0].id ? `/storages/output/outputsee/${id}` : `/storages/output/outputedit/${id}?${status === 24 ? 'look' : 'look='}${id}`)
    },
    // 取消采购退货单
    handlerConsent: debounce(function () {
      this.btnLoading = true
      api.cancelReturnSupplier({ id: this.objId, status: 75 }).then(res => {
        if (res) {
          this.getDetails()
        }
        this.visibleDialog = false
        this.textarea = ''
        this.btnLoading = false
      })
    }),
    handleCancle () {
      this.visibleDialog = true
    },
    // 获取采购退货单详情
    getDetails () {
      api.getById({id: this.objId}).then(res => {
        res.statusName = this.setName(FULL_STATE.return, res.status, true)
        this.obj = res
      })
    },
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let columnIndes = [0, 1]
      if (columnIndes.includes(columnIndex) && this.obj.items.length > 1) {
        if (((rowIndex - (row.thisTableIndex + row.thisTableCount)) % row.thisTableCount) === 0) {
          return {
            rowspan: row.thisTableCount,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.totalprice {
  text-align: right;
  line-height: 40px;
  font-weight: bold;
  font-size: 16px;
}
.mheight /deep/ .el-textarea__inner{
  height: 100px;
}
</style>
