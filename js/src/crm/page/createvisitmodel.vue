<template>
  <div id="createvisit">
    <ever-bread-crumb :name="!id ? '新建随访模版' : '详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card>
      <h4>基础设置</h4>
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="api"
        :rules="rules"
        label-position="right">
        <template slot="visitDpt">
          <el-row>
            <el-col :span="20">
              <el-select v-model="obj.kinship" placeholder="请创建或选择分类">
                <el-option
                  v-for="item in kinshipData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" align="right">
              <visit-class ref="relationship" :kinship="kinshipData" @update="update"></visit-class>
            </el-col>
          </el-row>
        </template>
        <div slot="default"></div>
      </ever-form2>
      <h4>添加进度</h4>
      <div>
        <el-button
          size="small"
          @click="addTab(editableTabsValue2)">
          添加进度
        </el-button>
        <el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
          <el-tab-pane
            v-for="(item, index) in editableTabs2"
            :key="index"
            :label="item.title"
            :name="item.name">
            <div>
              <el-form ref="form" :model="item.items">
                <el-row>
                  <el-col :span="6">
                    <span>随访时间：</span>
                    <sys-type code="GBT.3304" v-model="item.items.triggerType" size="mini" style="width:200px;"></sys-type>
                  </el-col>
                  <el-col :span="6">
                    <span>后第</span>
                    <el-input v-model="item.timeNum"  style="width:200px;"></el-input>
                    <sys-type code="GBT.3304" v-model="item.form" size="mini" style="width:200px;"></sys-type>
                  </el-col>
                  <el-col :span="12">
                    <span>随访方式：</span>
                    <sys-type code="THC_CC_FOLLOWUP" v-model="item.form" size="mini" style="width:200px;"></sys-type>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col><span>随访内容：</span></el-col>
                </el-row>
                <el-row style="height:400px;border:1px solid #ccc;">
                  <el-col :span="3" style="height:399px;border-right:1px solid #cfcfcf;">
                    <el-tree
                      :props="props"
                      show-checkbox
                      :default-expand-all="true"
                      @check-change="handleCheckChange">
                    </el-tree>
                  </el-col>
                  <el-col :span="21"></el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-button type="primary" @click="save">确认</el-button>
      <el-button @click="cancle">取消</el-button>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/visitapi'
  import capi from '../../warehouse/store/clinicapi'
  import depart from '../../warehouse/store/departmentapi'
  import visitClass from '@/crm/page/visit.class'
  let schema = [
    {
      name: 'patientName',
      span: 8,
      label: '随访模版名称：'
    },
    {
      name: 'visitOrgId',
      label: '适用科室：',
      span: 8,
      comp: 'el-select',
      props: {
        options: []
      }
    },
    {
      name: 'visitDpt',
      label: '随访分类：',
      comp: 'custom',
      span: 8
    },
    {
      name: 'comment',
      comp: 'el-input',
      label: '使用说明：',
      span: 24,
      props: {
        max: 200,
        placeholder: '请填写随访说明'
      }
    }
  ]
  let schema2 = [
    {
      name: 'country',
      label: '国家',
      span: 6,
      comp: 'sys-type',
      props: {
        code: 'GBT.2659-2000'
      }
    }
  ]
  export default {
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      obj.patient = ''
      obj.visitWay = ''
      obj.patientIds = []
      return {
        schema,
        api: api,
        capi,
        depart: depart,
        id: this.$route.query.id,
        obj,
        obj2,
        kinshipData: [],
        editableTabsValue2: '0',
        editableTabs2: [],
        tabIndex: 0,
        props: {
          label: 'name',
          children: 'zones'
        },
        rules: {
          patientName: [
            {required: true, message: '请选择客户', trigger: 'change'}
          ],
          visitOrgId: [
            {required: true, message: '请选择机构', trigger: 'change', type: 'number'}
          ],
          visitTime: [
            {required: true, message: '请选择随访时间', trigger: 'change'}
          ],
          visitWay: [
            {required: true, message: '请选择随访方式', trigger: 'change'}
          ],
          questionName: [
            {required: true, message: '请选择随访问卷', trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      'obj.visitOrgId' (val) {
        if (val) {
          this.getDptList(val)
        }
      },
      'obj.visitDpt' (val) {
        this.obj.visitDptId = val.id
        val && this.getVistStaff(schema, 'visitDoctor', val.id)
      },
      'obj.visitDoctor' (val) {
        this.obj.visitDoctorId = val.id
        this.obj.visitDoctorName = val.name
      }
    },
    created () {
      this.getClinicList(schema, 'visitOrgId')
      this.getAllFollowUpType()
    },
    methods: {
      handleCheckChange (data, checked, indeterminate) {
        console.log(data, checked, indeterminate)
      },
      getAllFollowUpType () {
        api.getAllFollowUpType().then(rs => {
          if (rs.head.errCode === 0) {
            console.log('rs: ', rs)
          }
        })
      },
      getDptList (clinicId) {
        let dpt = this.$ever.getFieldFromSchema(schema, 'visitDpt')
        this.depart.list({clinicId: clinicId}).then(rs => {
          if (rs) {
            dpt.options = rs
          }
        })
      },
      getVistStaff (schema, field, id) {
        // 人员新接口
      },
      save () {
        console.log('todo save')
      },
      cancle () {
        console.log('cancle ')
      },
      getClinicList (schema, name) {
        let clinic = this.$ever.getFieldFromSchema(schema, name)
        this.capi.list().then(rs => {
          clinic.options = rs
        })
      },
      update (val) {
        this.kinshipData = val
      },
      addTab (targetName) {
        let newTabName = ++this.tabIndex + ''
        this.editableTabs2.push({
          title: '随访进度' + this.tabIndex,
          name: newTabName,
          items: {}
        })
        this.editableTabsValue2 = newTabName
      },
      removeTab (targetName) {
        let tabs = this.editableTabs2
        let activeName = this.editableTabsValue2
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.editableTabsValue2 = activeName
        this.editableTabs2 = tabs.filter(tab => tab.name !== targetName)
        this.tabIndex = this.editableTabs2.length
      }
    },
    components: {
      visitClass
    }
  }
</script>
<style scoped>
  #createvisit .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
  #createvisit .el-input-group__append .is-disabled{background: rgb(238, 240, 246) !important;color: #bbb !important;box-shadow: none !important;}
</style>
