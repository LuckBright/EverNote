<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogTableVisible"
      class="ui_dialog_02"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row class="mb20">
        <el-col :span="24">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        ref="serviceTable"
        @selection-change="handleSelectionChange"
        row-key="id"
        max-height="354"
        height="354"
        class="mb20"
        :border="false"
        tooltip-effect="dark"
      >
        <el-table-column prop="id" reserve-selection type="selection"></el-table-column>
        <el-table-column prop="code" label="项目编号"></el-table-column>
        <el-table-column prop="name" label="收费项目名称">
          <template slot-scope="scope">
            {{scope.row.byname || scope.row.name }}
            <b style="fontWeight:normal" v-show='scope.row.byname != scope.row.name && scope.row.name && scope.row.byname'>({{scope.row.name}})</b>
          </template>
        </el-table-column>
        <el-table-column prop="serviceClassification" label="类别">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格">
          <template slot-scope="scope">
            <template v-if="scope.row.spec">{{scope.row.spec}}</template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" label="包装单位"></el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitBefore">保存</el-button>
      </div>
       <!-- cdss建议弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      v-if="wringData[0]"
      :visible.sync="showCdss"
      title="用药提示"
      size="tiny"
      class="ui_dialog_02"
      ref="cdssConfirm"
      @close="closeCdssEvent"
    >
      <drugCdss :wringData="wringData"></drugCdss>
      <div slot="footer" class="dialog-footer" style="position:relative;z-index: 10">
        <el-button @click="closeCdssEvent">
          <i class="icon iconfont icon-quxiao"></i>
          {{$t('取消')}}
        </el-button>
        <el-button type="primary" @click="confirmCdssSubmit">
          <i class="icon iconfont icon-tijiao"></i>
          {{$t('确认添加')}}
        </el-button>
      </div>
    </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import servapi from '../../store/servicesetapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import api from '@/sob/store/service.import/servicesel'
import utillist from '@/util/list'
import { objPullAllBy } from '@/util/common'
import orderApi from '@/inpatient/components/issued.orders/api'
import drugCdss from '@/inpatient/components/issued.orders/drug.cdss.vue'
let schema = [
  {
    name: 'code',
    type: 'text',
    label: '项目编号'
  },
  {
    name: 'name',
    type: 'text',
    label: '项目名称'
  },
  {
    name: 'serviceClassificationList',
    type: 'cascader',
    label: '医嘱项分类',
    options: [],
    clearable: true,
    filterable: true
  }
  // {
  //   name: 'serviceClassification',
  //   type: 'systype',
  //   code: 'THC_WH_OBJECT_SUB_TYPE',
  //   useValue: false,
  //   label: '物资分类'
  // }
]
export default {
  name: 'servicesdialog',
  components: { drugCdss },
  props: ['title', 'categoryOptions', 'objId', 'selData'],
  mixins: [utillist],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.serviceClassificationList = []
    obj.serviceSetId = this.objId
    return {
      api,
      servapi,
      querySchema: schema,
      queryObj: obj,
      dialogTableVisible: false,
      noStoreQuery: true,
      totalCount: 0,
      tableData: [],
      selected: [],
      serviceSetClassification: '',
      serviceClassification: '',
      showCdss: false, // cdss弹窗
      wringData: [] // cdss提示数组
    }
  },
  watch: {
    dialogTableVisible (val) {
      if (val) {
        window.setTimeout(() => {
          this.selected = []
          this.$refs.serviceTable.clearSelection()
        }, 0)
      }
    },
    '$route.params.belong' (val) {
      this.queryObj.serviceBelongType = val
    }
  },
  created () {

  },
  methods: {
    getClassOptions () {
      let arr = this.serviceSetClassification === '3002' ? ['296'] : ['798']
      sysvalue.cascade(
        'THC_WH_OBJECT_TYPE', arr).then(options => {
          let optionsAll = []
          options.forEach(ele => {
            if (ele.children && ele.children.length > 0)optionsAll = optionsAll.concat(ele.children)
          })
          optionsAll = optionsAll.filter(element => {
            return !(element.code === '301' || element.code === '302' || element.code === '3002')
          })
          this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').options = optionsAll
        })
    },
    query () {
      this.$refs.serviceTable.clearSelection()
      // if (this.queryObj.serviceClassificationList && this.queryObj.serviceClassificationList.length) {
      //   this.queryObj.serviceClassification = this.queryObj.serviceClassificationList[0]
      //   if (this.queryObj.serviceClassificationList.length > 1) {
      //     this.queryObj.threeServiceClassify = this.queryObj.serviceClassificationList[1]
      //   } else {
      //     this.queryObj.threeServiceClassify = ''
      //   }
      // } else {
      //   this.queryObj.serviceClassification = ''
      //   this.queryObj.threeServiceClassify = ''
      // }
      if (this.serviceSetClassification) {
        this.queryObj.setServiceClassification = this.serviceSetClassification
      }
      this.list()
    },
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen ({serviceSetClassification}, data) {
      this.dialogTableVisible = true
      for (let item in this.queryObj) {
        if (item !== 'serviceSetId') this.queryObj[item] = null
      }
      this.serviceSetClassification = serviceSetClassification + ''
      this.getClassOptions()
      this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').disabled = false
      if (data && data[0]) {
        this.serviceClassification = data[0].serviceClassification
        if (this.serviceSetClassification === '3002') {
          this.queryObj.serviceClassificationList = [this.serviceClassification]
          this.$ever.getFieldFromSchema(this.querySchema, 'serviceClassificationList').disabled = true
        }
      }
      this.$nextTick(_ => {
        this.query()
      })
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    async onSubmitBefore () {
      if (this.serviceSetClassification !== '3002' || !this.selected.length) {
        this.onSubmit()
        return
      }
      let res = await this.checkCdss([...this.selData, ...this.selected])
      if (!res) {
        this.onSubmit()
        return
      }
      this.showCdss = true
    },
    onSubmit () {
      let data = this.tableData
      let ids = []
      let selData = []
      if (this.selData && this.selData.length) {
        selData = JSON.parse(JSON.stringify(this.selData))
        selData.map(item => {
          item.id = item.serviceId
          return item
        })
      }
      let selectedLen = this.selected.length
      let diffItems = objPullAllBy(this.selected, selData, 'id')
      if (diffItems && diffItems.length) {
        if (diffItems.length !== selectedLen) {
          this.$messageTips(this, 'warning', `您选择的service中存在${selectedLen - diffItems.length}已经添加，已自动过滤`, '提示')
        }
        diffItems.forEach(item => {
          ids.push({
            serviceId: item.id,
            serviceName: item.name,
            unit: item.unit,
            unitName: item.unitName,
            quantity: item.quantity || '1',
            serviceClassification: item.serviceClassification,
            // localMaterialId: item.localMaterialId
            globalMaterialId: item.globalMaterialId
          })
        })
        let obj = {
          serviceSetId: this.objId,
          servSetItemList: ids,
          serviceClassification: this.serviceSetClassification
        }
        if ((data && !data[0]) || ids.length === 0) {
          this.$messageTips(this, 'warning', '请您选择您要添加的Service', '提示')
          return false
        }
        this.servapi.createServiceSetItem(obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.selected = []
          }
        }).then(_ => {
          // this._getServiceSetItemList()
          this.$emit('selectChange', this.selected)
        })
        // Promise.all([a]).then(_ => {
        //   this.$emit('selectChange', this.selected)
        // })
      } else {
        this.selected.length && this.$messageTips(this, 'warning', '您选择的service都已经添加，请直接编辑数量', '提示')
      }
      this.onDialogClose()
    },
    _getServiceSetItemList () {
      servapi.getServiceSetItemList(this.objId).then(res => {
        if (res && res[0]) {
          // Object.assign(this.itemData, res).splice()
          this.itemData = res
        }
      })
    },
    pageAfter () {
      return this.selected && this.selected.forEach(row => {
        if (row) {
          this.$refs.serviceTable.toggleRowSelection(row, true)
        }
      })
    },
    async checkCdss (datas) {
      let materialSkuIds = datas.map(item => item.globalMaterialId)
      let params = {
        bizCode: 'THC_RULE_MZYZKL',
        materialSkuIds
      }
      let res = await orderApi.checkCdssRule(params)
      if (!res) return false
      this.wringData = res.map(item => {
        return {type: 1, tipTypeName: '', part: '', tipInfo: item.message}
      })
      return this.wringData.length
    },
    closeCdssEvent () {
      this.showCdss = false
    },
    confirmCdssSubmit () {
      this.showCdss = false
      this.onSubmit()
    }
  }
}
</script>
