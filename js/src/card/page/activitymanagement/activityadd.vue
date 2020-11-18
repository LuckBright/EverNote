<template>
  <div v-loading="loading">
    <div class="layout_inner">
      <div class="panel-body">
        <ever-form2
          :schema="schema"
          v-model="obj"
          :rules="rules"
          ref="form"
          :span="13"
          :info="true"
          :nosubmit="isGroupControl ? true : false"
          labelWidth="140px">
          <template slot="activityTime">
            <ever-range-picker
              :start.sync="obj.startDate"
              :end.sync="obj.endDate"
              dateType="datetimerange"
              outformat="YYYY-MM-DD HH:mm:ss"
              startPlaceholder="_年_月_日 _时_分_秒"
              endPlaceholder="_年_月_日 _时_分_秒"
              :defaultTime="['00:00:00', '23:59:59']"
              autoWidth="true"
            ></ever-range-picker>
          </template>
          <template slot="status">
            <ever-select v-model="obj.status" placeholder="状态" :options="statusOption" :disabled="!code"></ever-select>
          </template>
          <!-- <template slot="canUseCard">
            <el-radio-group v-model="obj.canUseCard">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </template>
          <template slot="canUseBenefit">
            <el-radio-group v-model="obj.canUseBenefit">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </template> -->
          <template slot="discountSelect">
            <el-radio-group v-model="obj.discountSelect" @change="radioChange">
              <el-radio label="1">
                <span class="mr5">折扣</span>
                <ever-price v-show="obj.discountSelect == 1" v-model="obj.discount" width="200px" placeholder="请输入0-100之间的整数，如50表示5折" append="%"></ever-price>
              </el-radio>
              <el-radio label="3">
                <span class="mr5">折扣规则</span>
                <el-select v-show="obj.discountSelect == 3" v-model="obj.discountRule" :filterable="true" placeholder="请选择折扣规则" class="inline-block">
                  <el-option
                    v-for="item in discountRules"
                    :key="item.id"
                    :label="item.masterName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-radio>
              <el-radio label="2">
                <span class="mr5">减免金额</span>
                <ever-price v-show="obj.discountSelect == 2" v-model="obj.saleMoney" width="200px" placeholder="请输入金额" append="元"></ever-price>
              </el-radio>
            </el-radio-group>
          </template>
          <template slot="useRange">
            <el-radio-group v-model="obj.useRange">
              <el-radio :label="1">物资分类</el-radio>
              <el-radio :label="2">医嘱项目</el-radio>
            </el-radio-group>
            <el-form-item label="" prop="itemIds" v-show="obj.useRange == 2">
              <el-card class="box-card clearfix">
                <el-button v-if="!objId || (objId && taskId) || code" class="fr mb5" type="primary" @click="addService(selectData)">添加</el-button>
                <el-table
                  :data="selectData"
                  style="width: 100%"
                  border>
                  <el-table-column
                    prop="name"
                    label="项目名称">
                  </el-table-column>
                  <el-table-column
                    prop="serviceClassification"
                    label="医嘱项目类型">
                    <template slot-scope="scope">
                      <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="obj.discountSelect === '1' && !objId"
                    prop="discount"
                    label="折扣">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.discount" placeholder="请输入0-100之间的整数，如50表示5折"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-else-if="obj.discountSelect === '1' && objId && !taskId"
                    prop="discount"
                    label="折扣">
                  </el-table-column>
                  <el-table-column
                    v-if="obj.discountSelect === '1' && objId && taskId"
                    prop="discount"
                    label="折扣">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.discount" placeholder="请输入0-100之间的整数，如50表示5折"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop=""
                    width="80"
                    v-if="!objId || (objId && taskId) || code"
                    label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="danger"
                        @click="deleteRow1(scope.$index, selectData)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-form-item>
          </template>
          <template slot="categoryRange">
            <el-radio-group v-model="obj.categoryRange" v-show="obj.useRange == 1">
              <el-radio :label="'1'">全部分类</el-radio>
              <el-radio :label="'2'">自定义分类</el-radio>
            </el-radio-group>
          </template>
          <template slot="categoryIds">
            <el-checkbox-group v-model="categorisData" v-show="obj.useRange == 1">
              <el-checkbox v-for="(item, i) in typeoptions" :label="item.id" :disabled="obj.categoryRange == 1" :key="i">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template slot="remark">
            <el-radio-group v-model="obj.remark">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </template>
          <template slot="default" v-if="!isGroupControl">
            <el-col>
              <el-form-item>
                <el-button type="primary" @click="submitFormApply('form')" v-if="!objId">保存</el-button>
                <el-button type="primary" @click="modifyFormApply('form')" v-if="((objId && taskId) || code) && obj && !obj.isClinic">提交</el-button>
              </el-form-item>
            </el-col>
          </template>
        </ever-form2>
      </div>
    </div>
    <service-dialog ref="service" :itemIds="selectData" @selectChange="selectChange"></service-dialog>
  </div>
</template>
<script>
  import serviceDialog from '@/sob/page/servicedialog.vue'
  import categoriesDialog from '@/card/page/categoriesdialog'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import sobapi from '@/card/store/selftariffsdetailapi.js'
  import api from '@/card/store/activityapi.js'
  import selfApi from '@/rcm/store/tariffs/selftariffsapi'
  import storage from '@/util/storage'
  import TerminalTab from '@/card/components/terminaltab'
  import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
  import { debounce1 as debounce } from '@/util/common'
  import { request } from '@/util/req'
  import urlMap from '@/systemset/urls'

  var schema = [
    {
      name: 'name',
      label: '活动名称'
    },
    {
      name: 'maxTimes',
      label: '次数限制',
      comp: 'ever-price'
    },
    {
      name: 'activityTime',
      label: '活动起止时间',
      comp: 'custom'
    },
    // {
    //   name: 'canUseCard',
    //   label: '是否优惠券同时使用',
    //   comp: 'custom'
    // },
    {
      name: 'status',
      label: '状态',
      comp: 'custom',
    },
    // {
    //   name: 'canUseBenefit',
    //   label: '是否身份卡同时使用',
    //   comp: 'custom'
    // },
    {
      name: 'remark',
      label: '备注',
      props: {
        maxlength: 30
      }
    },
    {
      name: 'discountSelect',
      label: '优惠类型',
      comp: 'custom'
    },
    {
      name: 'useRange',
      label: '使用范围',
      comp: 'custom'
    },
    {
      name: 'categoryRange',
      label: '',
      comp: 'custom'
    },
    {
      name: 'categoryIds',
      label: '',
      comp: 'custom'
    },
    {
      name: 'terminalList',
      label: '展示终端',
      comp: TerminalTab
    },
    {
      name: 'curDptranges',
      label: '适用科室',
      comp: 'ever-subject-select',
      props: {
        params: {
          type1CodeList: [CATEGORYIDS_TYPE[0].id]
        },
        props: {
          'check-strictly': true,
        },
        ref: 'ess',
        type: 'tree',
        multiple: true,
        fields: 'orgSubjectCode'
      }
    }
  ]
  export default {
    props: ['dataDetails', 'isGroupControl'],
    data () {
      let rules = {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        activityTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        curDptranges: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        useRange: [
          { required: true, message: '必填项', trigger: 'change', type: 'number' }
        ],
        discountSelect: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
      let obj = this.$ever.createObjFromSchema(schema)
      // obj.startDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      // obj.endDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      obj.startDate = ''
      obj.endDate = ''
      obj.items = []
      obj.categories = []
      obj.discount = ''
      obj.saleMoney = ''
      obj.discountRule = ''
      obj.canUseBenefit = 0
      obj.canUseCard = 0
      obj.useRange = 1
      obj.remark = ''
      obj.discountSelect = '1'
      obj.categoryRange = '1'
      obj.terminalList = ['0']
      obj.curDptranges = []
      return {
        schema,
        obj,
        api,
        objId: this.$route.query.id,
        rules,
        tableData: [],
        totalCount: 0,
        loading: false,
        selectData: [],
        typeoptions: [],
        taskId: this.$route.query.taskId,
        categorisData: [],
        discountRules: [],
        statusOption: [
          {id: 2, name: '激活'},
          {id: 4, name: '结束'},
          {id: 5, name: '取消'}
        ],
        code: this.$route.params.code === 'true',
        isGroup: this.$route.matched[0].meta.manage ? 1 : 0
      }
    },
    created () {
      // this.initInfo()
      this.objId = this.$route.query.id
      this.initCheckboxs()
      if (!this.objId) this._getSelfTariff()
    },
    methods: {
      radioChange (val) {
        this.obj.discount = ''
        this.obj.saleMoney = ''
        this.obj.discountRule = ''
        this.selectData = []
        this.categorisData = []
      },
      deleteRow (index, rows) {
        rows.splice(index, 1)
        this.obj.categories.splice(index, 1)
        // this.items.splice(index, 1)
      },
      deleteRow1 (index, rows) {
        rows.splice(index, 1)
        // this.categories.splice(index, 1)
        this.obj.items.splice(index, 1)
      },
      afterSave (data) {
        if (this.isGroup) {
          this.$router.push({ path: `/manages/activitydetail/${(Number(data.status) === 2 || Number(data.status) === 4 || Number(data.status) === 5)}?id=${data.id}` })
          this.$emit('tabChange', {name: 'activityMechanism', id: data.id})
        } else {
          this.$router.push('/card/activitys')
        }
      },
      modifyFormApply () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            if (this.obj.maxTimes && Number(this.obj.maxTimes) < 1) {
              this.$messageTips(this, 'warning', '次数限制不能为0')
              return false
            }
            if (this.obj.discountSelect === '1') {
              if (!this.obj.discount) {
                this.$messageTips(this, 'warning', '折扣请输入0～100之间的整数')
                return false
              }
              if (this.obj.discount < 0 || this.obj.discount > 100 || parseInt(this.obj.discount) !== Number(this.obj.discount)) {
                this.$messageTips(this, 'warning', '折扣请输入0～100之间的整数')
                return false
              }
            } else if (this.obj.discountSelect === '2') {
              if (!this.obj.saleMoney) {
                this.$messageTips(this, 'warning', '请输入减免金额')
                return false
              }
            } else {
              if (!this.obj.discountRule) {
                this.$messageTips(this, 'warning', '请选择折扣规则')
                return false
              }
            }
            this.submitDisabled = true
            this.obj.items = this.selectData.map(v => {
              return {
                'rangeId': v.rangeId ? v.rangeId : v.id,
                'rangeCode': v.code
              }
            })
            if (this.obj.categoryRange === '1') {
              this.obj.categories = [{rangeId: '0'}]
            } else {
              this.obj.categories = this.categorisData.map(v => {
                return {
                  'rangeId': v
                }
              })
            }

            if ((this.obj.categories.length === 0) && (this.obj.items.length === 0)) {
              this.$messageTips(this, 'warning', '请选择使用范围')
              return false
            }
            let arrs = []
            this.obj.curDptranges.map(item => {
              arrs.push({rangeId: item, rangeCode: item})
            })
            this.obj['dptranges'] = arrs
            let params = Object.assign({}, this.obj, {isGroup: this.isGroup})
            delete params.activityTime
            if (this.obj.useRange === 1) {
              params.items = []
            } else {
              params.categories = []
            }
            if (this.code) {
              api.listUpdate(params).then(res => {
                this.submitDisabled = false
                if (res && res.data) {
                  if (res.head.errCode === 0) {
                    let title = '保存成功'
                    if (Number(this.obj.status) === 2) {
                      title = '提交成功'
                    }
                    this.$messageTips(this, 'success', title)
                    this.afterSave(res.data)
                  }
                }
              })
            } else {
              api.createOrUpdate(params).then((response) => {
                this.submitDisabled = false
                if (response && response.data) {
                  if (response.head.errCode === 0) {
                    let paramsFinish = {
                      processData: {
                        taskId: this.taskId
                      },
                      businessData: {
                        flag: 1,
                        remark: '提交申请'
                      }
                    }
                    request(urlMap.process.completeTask, paramsFinish).then(res => {
                      if (res.head.errCode === 0) {
                        this.$messageTips(this, 'success', '提交成功')
                        this.afterSave(response.data)
                      }
                    })
                  }
                  this.afterSave(response.data)
                }
              })
            }
          }
        })
      },
      submitFormApply: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            if (this.obj.maxTimes && Number(this.obj.maxTimes) < 1) {
              this.$messageTips(this, 'warning', '次数限制不能为0')
              return false
            }
            if (this.obj.discountSelect === '1') {
              if (!this.obj.discount) {
                this.$messageTips(this, 'warning', '折扣请输入0～100之间的整数')
                return false
              }
              if (this.obj.discount < 0 || this.obj.discount > 100 || parseInt(this.obj.discount) !== Number(this.obj.discount)) {
                this.$messageTips(this, 'warning', '折扣请输入0～100之间的整数')
                return false
              }
            } else if (this.obj.discountSelect === '2') {
              if (!this.obj.saleMoney) {
                this.$messageTips(this, 'warning', '请输入减免金额')
                return false
              }
            } else {
              if (!this.obj.discountRule) {
                this.$messageTips(this, 'warning', '请选择折扣规则')
                return false
              }
            }
            this.submitDisabled = true
            this.obj.items = this.selectData.map(v => {
              return {
                'rangeId': v.id,
                'rangeCode': v.code
              }
            })
            if (this.obj.categoryRange === '1') {
              this.obj.categories = [{rangeId: '0'}]
            } else {
              this.obj.categories = this.categorisData.map(v => {
                return {
                  'rangeId': v
                }
              })
            }
            if ((this.obj.categories.length === 0) && (this.obj.items.length === 0)) {
              this.$messageTips(this, 'warning', '请选择使用范围')
              return false
            }
            let arrs = []
            this.obj.curDptranges.map(item => {
              arrs.push({rangeId: item, rangeCode: item})
            })
            this.obj['dptranges'] = arrs
            let params = Object.assign({}, this.obj, {isGroup: this.isGroup})
            delete params.activityTime
            if (this.obj.useRange === 1) {
              params.items = []
            } else {
              params.categories = []
            }
            api.createOrUpdate(params).then((response) => {
              this.submitDisabled = false
              if (response && response.data) {
                this.objId = response.data.id
                if (response.head.errCode === 0) {
                  this.$messageTips(this, 'success', '提交成功')
                  this.afterSave(response.data)
                }
              }
            })
          }
        })
      }, 500),
      addService (selects) {
        this.$refs.service.onDialogOpen(this.currTabs, selects)
      },
      selectChange (selects) {
        this.selectData = []
        selects.forEach(item => {
          item.discount = this.obj.discount
          this.selectData.push(item)
        })
        return this.selectData
      },
      addCategories (selects) {
        if (selects) {
          selects.forEach(item => {
            item.checked = 1
          })
        }
        this.$refs.ategories.onDialogOpen(this.currTabs, selects)
      },
      initInfo (resData) {
        if (resData && resData.id) {
          this.objId = resData.id
          this._getSelfTariff(resData.origId)
          if (resData.discount || resData.discount === 0) {
            this.obj.discountSelect = '1'
          } else if (resData.discountRule) {
            this.obj.discountSelect = '3'
          } else {
            this.obj.discountSelect = '2'
          }
          // resData.canUseCard = resData.canUseCard ? 1 : 0
          // resData.canUseBenefit = resData.canUseBenefit ? 1 : 0
          resData.remark = resData.remark
          this.obj = Object.assign(this.obj, resData)
          this.obj.useRange = !resData.categories ? 2 : 1
          let categorisData = []
          let categories = resData.categories ? resData.categories : []
          if (categories[0] && categories[0]['rangeId'] !== '0') {
            this.obj.categoryRange = '2'
            categories.forEach(item => {
              categorisData.push(item.rangeId)
            })
          } else {
            this.obj.categoryRange = '1'
          }
          this.categorisData = categorisData
          let itemIds = []
          if (resData.items) {
            resData.items.map(item => {
              itemIds.push(item.rangeId)
            })
          }
          if (itemIds.length > 0) {
            sobapi.queryServiceVariable({serviceIds: itemIds}).then(result => {
              if (result.data) {
                this.selectData = result.data
                for (let i = 0; i < resData.items.length; i++) {
                  this.selectData[i].discount = resData.items[i].discount
                }
              }
            })
          }
          if (resData.startDate) this.obj.activityTime = resData.startDate
          let initDptranges = resData.dptranges || [] // 回显科室
          let dptranges = []
          initDptranges.map(item => {
            dptranges.push(item.rangeCode)
          })
          this.obj.curDptranges = dptranges
          if (resData.categories && resData.categories.length) this.selectData = []
        }
      },
      initCheckboxs () {
        sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
          this.typeoptions = []
          let arr = []
          res.forEach(item => {
            if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
              arr.push({id: item.id, name: item.name})
            }
          })
          this.typeoptions = arr
        })
      },
      _getSelfTariff (clinicId) {
        let selfTariffParams = {}
        clinicId ? Object.assign(selfTariffParams, {origId: clinicId}) : Object.assign(selfTariffParams, {origId: storage.getLocalStorage('CLINICID')})
        selfApi.list(selfTariffParams).then(result => {
          this.discountRules = result.data
        })
      }
    },
    watch: {
      'dataDetails': {
        handler: function (val) {
          if (val) this.initInfo(val)
        },
        // deep: true,
        immediate: true
      },
      'obj.startDate' (val) {
        val ? this.obj.activityTime = val : ''
      },
      'selectData': {
        handler: function (val, oldVal) {
          this.obj.items = this.selectData.map(v => {
            return {
              'rangeId': v.id,
              'discount': v.discount,
              'rangeCode': v.code
            }
          })
        },
        deep: true,
        immediate: true
      },
      'obj.categoryRange': {
        handler: function (val, oldVal) {
          if (val === '1') {
            this.categorisData = []
          }
        },
        deep: true,
        immediate: true
      },
      'categorisData': {
        handler: function (val, oldVal) {
          this.obj.categories = this.categorisData.map(v => {
            return {
              'rangeId': v
            }
          })
        },
        deep: true,
        immediate: true
      }
    },
    components: {
      serviceDialog,
      categoriesDialog
    }
  }
</script>
<style scoped>
  .panel-body { height: calc(100vh - 220px); overflow-y: scroll; }
  .panel-body /deep/ .el-date-editor--datetime {
    width:100% !important;
  }
  .panel-body /deep/ .el-card.box-card.is-always-shadow {
    box-shadow: none;
  }
  .panel-body /deep/ .box-card .el-card__body  { padding: 10px !important; }
</style>

