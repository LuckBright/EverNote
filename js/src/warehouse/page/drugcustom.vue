<template>
  <div>
    <ever-bread-crumb name="耗材管理" :path="toPath"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>单位组信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form-model>
      </div>
      <div class="panel-footer">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/drugapi'
import unitGroup from '../store/unitgroupapi'
import unitGroupItem from '../store/unitgroupitemapi'
// import sysvalue from '@/warehouse/store/sysvalueapi'
var schema = [
  {
    name: 'costUnitId',
    type: 'select',
    options: [],
    label: '成本单位'
  },
  {
    name: 'purchaseUnitId',
    type: 'select',
    options: [],
    label: '采购单位'
  },
  {
    name: 'saleUnitId',
    type: 'select',
    options: [],
    label: '销售单位'
  },
  {
    name: 'storageRoomUnitId',
    type: 'select',
    options: [],
    label: '库存单位'
  }
]
export default {
  name: 'custom',
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      objId: this.$route.params.id,
      groupId: this.$route.params.groupId,
      rules: {
        costUnitId: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        purchaseUnitId: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        saleUnitId: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ],
        storageRoomUnitId: [
          { required: true, message: '必填项', trigger: 'blur', type: 'number' }
        ]
      },
      customUnit: null,
      toPath: this.$route.params.wareType ? `/warehouse/drugcustom/${this.$route.params.groupId}/${this.$route.params.wareType}/${this.$route.params.id}` : `/warehouse/materialcustom/${this.$route.params.groupId}/${this.$route.params.id}`
    }
  },
  methods: {
    submitForm: function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.obj.id = this.$route.params.id
          this.api.updateGroup(this.obj).then(result => {
            this.afterSave(result)
          })
        }
      })
    },
    afterSave (data) {
      this.$router.push(`/warehouse/drugs`)
    },
    getDetail: function (id) {
      this.api.getById(this.objId).then(result => {
        if (result && result.id) {
          Object.assign(this.obj, result)
          this.groupNameVal = this.obj.unitGroupId
        }
      })
    },
    _setOptions (res) {
      const _res = res.unitGroupItemList || res
      this.$ever.getFieldFromSchema(this.schema, 'costUnitId').options = _res
      this.$ever.getFieldFromSchema(this.schema, 'purchaseUnitId').options = _res
      this.$ever.getFieldFromSchema(this.schema, 'saleUnitId').options = _res
      this.$ever.getFieldFromSchema(this.schema, 'storageRoomUnitId').options = _res
    },
    _isCustom (val) {
      let index = this.options.findIndex(item => {
        return item.id === val
      })
      this.customUnitId = val
      if (this.options[index].id === 3) {
        this.customUnit = true
      } else {
        this.customUnit = false
      }
    }
  },
  beforeCreate () {
    this.api = api
  },
  created () {
    if (this.objId) {
      this.getDetail()
    }
    unitGroup.list().then(result => {
      this.options = result.list
      if (this.groupId) {
        this._isCustom(this.groupId)
      }
    })
    this.$watch('customUnit', (val, oVal) => {
      if (val) {
        unitGroupItem.list({ localMaterialId: this.$route.params.id, unitGroupId: this.$route.params.groupId, materialType: Number(this.$route.params.wareType) }).then(res => {
          this._setOptions(res)
        })
      } else {
        unitGroup.getById(this.groupId).then(res => {
          this._setOptions(res)
        })
      }
    })
  }
}
</script>
<style lang="scss" scoped>
</style>
