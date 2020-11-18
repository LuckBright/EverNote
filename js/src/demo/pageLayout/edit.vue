<template>
  <div>
    <ever-bread-crumb name="列表" path="/demo/layout/list"></ever-bread-crumb>
    <div class="layout_inner">
      <h4>调拨单信息</h4>
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        :nosubmit="true"
        ref="form"
        :span="12"
        labelWidth="140px"
        label-position="right"
      ></ever-form2>
      <h4 class="panel-hr">
        <el-button class="fr" type="primary" size="small">新增</el-button>调拨明细信息
      </h4>
      <el-table :data="obj.itemList" style="width: 100%" border>
        <el-table-column show-overflow-tooltip prop="consumptiveMaterialObject.name" label="物资名称"></el-table-column>
        <el-table-column show-overflow-tooltip prop="outUnitGroupItemName" label="单位"></el-table-column>
        <el-table-column prop label="操作" width="200" v-if="!objId">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, obj.itemList)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="panel-footer">
        <el-button type="primary" @click="submitForm('form')">继续</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </div>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>调拨单信息</h4>
        <ever-form2
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          :nosubmit="true"
          labelWidth="140px"
          @objsaved="afterSave"
          label-position="right"
        ></ever-form2>
      </div>
      <div class="panel-footer">
        <div class="alg_label_140">
          <el-button type="primary" @click="$refs.form.submitForm()">保存</el-button>
          <el-button @click="$refs.form.resetForm()">取消</el-button>
        </div>
      </div>
      <div class="panel-body">
        <h4 class="panel-hr">
          <el-button class="fr" type="primary" size="small">新增</el-button>调拨明细信息
        </h4>
        <el-table :data="obj.itemList" style="width: 100%" border>
          <el-table-column show-overflow-tooltip prop="consumptiveMaterialObject.name" label="物资名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="outNum" label="数量"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop
            label="操作"
            width="200"
            v-if="!objId"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, obj.itemList)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="layout_inner">
      <div class="panel-body">
        <el-tabs>
          <el-tab-pane label="诊室">1</el-tab-pane>
          <el-tab-pane label="科室医生">2</el-tab-pane>
          <el-tab-pane label="科室医嘱项目">3</el-tab-pane>
          <el-tab-pane label="班次">4</el-tab-pane>
          <el-tab-pane label="关联部门">5</el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/store/drugallotboundapi'

var schema = [
  {
    name: 'code',
    label: '单据编号'
  },
  {
    name: 'status',
    label: '会员卡状态',
    type: 'sys-type',
    code: 'THC_CARD_MEMBERCARD_STATUS'
  },
  {
    name: 'description',
    label: '说明',
    type: 'textarea',
    span: 24
  }
]
var obj
export default {
  data () {
    var rules = {
      code: [
        { required: true, message: '必填项', trigger: 'blur' }
      ]
    }
    obj = this.$ever.createObjFromSchema(schema)

    return {
      schema,
      obj: obj,
      api,
      objId: this.$route.params.id,
      num: this.$route.params.num,
      rules
    }
  },
  beforecreated () {
    this.api = api
  },
  methods: {
    afterSave () {

    }
  }
}
</script>
