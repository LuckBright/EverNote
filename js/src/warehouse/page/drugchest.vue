<template>
  <div>
    <ever-bread-crumb name="货位管理" path="/warehouse/drugchests"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form-model>
        <h4 class="panel-hr" v-if="$route.params.byId">
          存放物资清单
          <button
            @click="addPrice"
            type="button"
            class="el-button el-button--primary el-button--small"
            style="float: right;"
          >
            <span>新增</span>
          </button>
        </h4>
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column show-overflow-tooltip prop label="物资编码">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject.code}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.code}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.code}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop label="物资名称">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject.name}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.name}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="生产厂商">
            <template slot-scope="scope">
              <span
                v-if="scope.row.drugObject"
              >{{scope.row.drugObject.manufacturerObject ? scope.row.drugObject.manufacturerObject.name : '无'}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.manufacturerObject ? scope.row.consumptiveMaterialObject.manufacturerObject.name : '无'}}</span>
              <span
                v-if="scope.row.equipmentObject"
              >{{scope.row.equipmentObject.manufacturerObject ? scope.row.equipmentObject.manufacturerObject.name : '无'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="品牌">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject ? '无' : '无'}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.name}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="型号">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject ? '无' : '无'}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.name}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="规格">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject.spec}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.spec}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.spec}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="条码编号">
            <template slot-scope="scope">
              <span v-if="scope.row.drugObject">{{scope.row.drugObject.barCode}}</span>
              <span
                v-if="scope.row.consumptiveMaterialObject"
              >{{scope.row.consumptiveMaterialObject.barCode}}</span>
              <span v-if="scope.row.equipmentObject">{{scope.row.equipmentObject.barCode}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="panel-footer">
        <el-button style="margin-left: 120px;" type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </div>
    <dialog-component
      title="新增存放物资清单"
      ref="add"
      :objid="objId"
      :api="localapi"
      :typeid="typeId"
      @submitAfter="afterSubmit"
    ></dialog-component>
  </div>
</template>
<script>
import drugchest from '../store/drugchestapi'
import containerapi from '../store/containerobjectapi'
import storageroom from '../store/storageroomapi'
import localapi from '../store/localdrugsettingapi'
import form from '@/util/form'
import { setDisabled, unDisabled } from '@/util/common'
import DialogComponent from './dialogcomponent.vue'
// import MaterialAdd from './priceadd'
var schema = [
  {
    name: 'name',
    type: 'text',
    label: '货位名称',
    min: 1,
    max: 40
  },
  {
    name: 'type',
    type: 'systype',
    label: '货位类型',
    code: 'THC_WH_OBJECT_TYPE'
  },
  {
    name: 'code',
    type: 'text',
    label: '货位编码',
    disabled: true
  },
  {
    name: 'storageRoomId',
    type: 'select',
    options: [],
    label: '发药库房'
  },
  {
    name: 'purpose',
    type: 'systype',
    code: 'THC_WH_DRUG_CONTAINER_PURPOSE',
    label: '货位用途'
  },
  {
    name: 'place',
    type: 'text',
    label: '位置',
    max: 40
  },
  {
    name: 'enableDate',
    label: '生效日期',
    type: 'date',
    outformat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    name: 'disableDate',
    label: '失效日期',
    type: 'date',
    outformat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    name: 'description',
    label: '说明',
    type: 'textarea',
    span: 24
  }
]

export default {
  mixins: [form],
  data () {
    const arr = ['storageRoomId']
    if (this.$route.params.id) {
      setDisabled(arr, schema)
    } else {
      unDisabled(arr, schema)
    }
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj: obj,
      api: drugchest,
      objId: this.$route.params.id,
      typeId: this.$route.params.byId,
      tableData: [],
      priceData: [],
      listPrices: [],
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        materialType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        storageRoomId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        enableDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    afterSubmit (data) {
      let params = {
        containerObjectList: []
      }
      for (let i = 0; i < data.length; i++) {
        params.containerObjectList.push({
          storageRoomId: this.obj.storageRoomId,
          localMaterialId: data[i].id,
          containerId: this.objId,
          materialType: data[i].materialType
        })
      }
      containerapi.create(params).then(res => {
        if (res) {
          this.getDefalutList()
        }
      })
    },
    afterSave () {
      this.$router.push('/warehouse/drugchests')
    },
    addPrice () {
      this.$refs.add.onDialogOpen()
    },
    handleDelete (index, data) {
      containerapi.del(data.id).then(res => {
        if (res) {
          this.tableData.splice(index, 1)
        }
      })
    },
    getDefalutList () {
      let params = {
        containerId: this.$route.params.id,
        materialType: this.$route.params.byId
      }
      containerapi.list(params).then(res => {
        if (res) {
          this.tableData = res.list
        }
      })
    }
  },
  created () {
    storageroom.clinicList().then(results => {
      this.$ever.getFieldFromSchema(this.schema, 'storageRoomId').options = results
    })
    if (this.$route.params.byId) {
      this.getDefalutList(this.$route.params.byId)
    }
  },
  beforeCreate () {
    this.localapi = localapi
  },
  components: {
    DialogComponent
  }
}
</script>
