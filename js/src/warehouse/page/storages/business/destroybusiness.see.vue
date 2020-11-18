<template>
  <div>
    <ever-bread-crumb name="销毁报废" showTitle="true"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form2
          class="readform"
          :schema="readSchema"
          v-model="obj"
          ref="form"
          :span="12"
          :nosubmit="true">
          <template slot="outStockCode">
            <a class="blue cur" @click="handleOutRoute">{{obj.outStockCode}}</a>
            <span v-if="obj.outStockStatus" class="ml20" :class="{ 'red': obj.outStockStatus === 24 }">{{obj.outStockStatus | formateValueToFnt({list: FULL_STATE.outstock})}}</span>
            <span v-else class="ungenerated">未生成</span>
          </template>
        </ever-form2>
        <h4>物资明细</h4>
        <div class="backsss">
          <ever-table
            border
            :span-method="arraySpanMethod"
            :columns="isBatch ? columns :columnsBackSee"
            :table-class="'no-hover'"
            :tableDefaultCellValue="tableDefaultCellValue"
            :el-table-attr="eltableAttr"
            :tableKey="'localMaterialId'"
            :data="hanlderItems">
            <!-- 物资查询 -->
            <template slot="materialName" slot-scope="scope">
              <material-show-name :materialName="scope.row.materialName"></material-show-name>
            </template>
          </ever-table>
        </div>
        <div>
          <el-button v-if="obj.status == 102" class="w_60" type="primary" :loading="btnLoading" @click="visibleDialog = true">取消</el-button>
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
import api from '../store/destroyscrapapi'
import getstorage from '@/warehouse/page/storages/util/getstorage'
import { readSchema, columnsBackSee } from './store/destroybusiness.columns'
import { FULL_STATE } from '@/util/common'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'

export default {
  mixins: [getstorage],
  data () {
    let obj = this.$ever.createObjFromSchema(readSchema)
    obj.items = []
    return {
      readSchema,
      obj,
      columnsBackSee,
      FULL_STATE,
      tableDefaultCellValue,
      objId: this.$route.params.id,
      eltableAttr: {'empty-text': '请先填写基础信息'},
      textarea: '',
      isBatch: false,
      visibleDialog: false,
      poploding: false,
      btnLoading: false
    }
  },
  created () {
    this.objId && this.getDetails()
  },
  computed: {
    columns () {
      if (columnsBackSee.find(key => key.prop === 'sysBatchCode')) return columnsBackSee
      let arr = columnsBackSee
      arr.splice(3, 0, {
        prop: 'sysBatchCode',
        width: 130,
        align: 'center',
        label: '系统批号'
      })
      arr.splice(6, 0, {
        prop: 'price',
        width: 90,
        align: 'center',
        label: '采购单价'
      }, {
        prop: 'salePrice',
        width: 90,
        align: 'center',
        label: '销售价'
      })
      return arr
    },
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
    handlerConsent () {
      api.cancelDestroyedNotice({id: this.objId, abolitionReason: this.textarea, status: 105}).then(res => {
        if (res) {
          this.visibleDialog = false
          this.everSuccess('取消成功')
          this.getDetails()
        }
      })
    },
    // 提交数据
    submitBackCode (status) {
      this.$refs.form.$refs.form.validate(valid => {
        let params = Object.assign(this.obj, {status, storageRoomId: this.storageId})
        params.items = params.items.map(item => {
          delete item.batchNumList
          return Object.assign(item, {batchNum: item.batchNum.id})
        })
        api.createOrUpdate(params).then(res => {
          if (res) {
            console.log(res)
          }
        })
      })
    },
    // 暂存数据获取
    getDetails () {
      api.getById({ id: this.objId }).then(res => {
        if (res) {
          res.statusName = this.$filters.formateValueToFnt(res.status, {list: FULL_STATE.destroyReason})
          this.obj = Object.assign(this.obj, res)
          this.isBatch = Boolean(res.pricingModel)
        }
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
  components: {
  }
}
</script>

