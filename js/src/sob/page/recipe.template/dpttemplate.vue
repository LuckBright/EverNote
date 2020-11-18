<template>
  <div id="addtemplate" class="layout_box">
    <ever-bread-crumb :name="obj.id ? '编辑模版' : '新建模版'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="layout_inner">
      <ever-form2
        class="ever_form_spe label_bold"
        ref="tplForm"
        :nosubmit="true"
        :rules="rules"
        :schema="schema"
        v-model="obj"
        labelWidth="80px"
      >
        <template slot="providerId" v-if="showDpt">
          <el-radio-group v-model="obj.dptId" v-if="dptData && dptData.length">
            <template v-if="dptData && dptData.length">
              <el-radio  v-for="item in dptData" :key="item.id" :label="item.id">{{item.name}}</el-radio>
            </template>
          </el-radio-group>
          <p v-else class="noRelateDpt">请联系管理员维护科室和人员关系后重试！</p>
        </template>
      </ever-form2>
    </div>
    <div class="layout_inner">
      <el-table
        :data="tplTableList"
        style="width: 100%"
        :cell-class-name="columnStyle"
        :span-method="columnSpan"
        border
        ref="tplTable">
        <el-table-column
          :label="$t('类型')"
          width="80">
          <template slot-scope="scope">
            <span>{{scope.row.serviceType}}</span>
            <!-- <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceType" :showEn="true"></sys-value> -->
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('医嘱')">
          <template v-if="scope.row.list && scope.row.list.length" slot-scope="scope">
            <el-table
              style="width: 100%"
              :data="scope.row.list"
              :show-header="false"
              class="el-table-child no-border"
              border
              :cell-class-name="adviceCellClass">
              <el-table-column width="220">
                <template slot-scope="scopeChild">
                  <template v-if="['303', '304'].includes(scopeChild.row.serviceType)">
                    <span
                      v-for="(drag, k) in scopeChild.row.adviceFeesDtoList"
                      :key="k"
                      class="eline"
                    >
                      <label class="bold">{{drag.serviceName}}</label>
                      <label style="top:-5px;" class="lab" v-if="drag.footnote">(
                        <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drag.footnote"></sys-value>)
                      </label>
                      <label
                        style="bottom:-5px;"
                        class="lab"
                      >{{drag.measure}}{{drag.measureUnitTxt}}</label>
                    </span>
                  </template>
                  <template v-else>
                    <span>{{adviceCon(scope.row.list.length, scopeChild)}}</span>
                    <template v-if="scopeChild.row.doctorAdviceType">
                      <service-set-items :item="scopeChild.row"></service-set-items>
                    </template>
                    <template v-else>
                      <drug-info
                        class="bold"
                        v-if="['301', '302'].includes(scopeChild.row)"
                        :drug-obj="scope.row"
                      ></drug-info>
                      <span class="bold" v-else>{{scopeChild.row.serviceName}}</span>
                    </template>
                  </template>
                  <i class="iconfont icon-charge" 
                    :class="{'icon-jia': String(scopeChild.row.chargeLevel) === '1', 
                    'icon-CombinedShape': String(scopeChild.row.chargeLevel) === '2', 
                    'icon-bing': String(scopeChild.row.chargeLevel) === '3',
                    'icon-menzhen-lixiu': String(scope.row.chargeLevel) === '4'}"></i>
                  <template v-if="scopeChild.row.specialClassify">
                    <el-tooltip v-for="code in scopeChild.row.specialClassify.split(',')" :key="code">
                      <span slot="content">{{specialClassify[code].name}}</span>
                      <svg class="icon fontMargin" aria-hidden="true">
                        <use :xlink:href="'#' + specialClassify[code].icon"></use>
                      </svg>                                          
                    </el-tooltip>
                  </template>
                  <template v-if="scopeChild.row.antibioticType">
                    <el-tooltip v-for="code in scopeChild.row.antibioticType.split(',')" :key="code">
                      <span slot="content">{{specialClassify[code].name}}</span>
                      <svg class="icon fontMargin" aria-hidden="true">
                        <use :xlink:href="'#' + specialClassify[code].icon"></use>
                      </svg>
                    </el-tooltip>
                  </template>
                  <template v-if="scopeChild.row.highRisk">
                    <el-tooltip v-if="specialClassify[scopeChild.row.highRisk]">
                      <span slot="content">{{specialClassify[scopeChild.row.highRisk].name}}</span>
                      <svg class="icon fontMargin" aria-hidden="true">
                        <use :xlink:href="'#' + specialClassify[specialClassify[scopeChild.row.highRisk]].icon"></use>
                      </svg>
                    </el-tooltip>
                  </template>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scopeChild">
                  <advice-item-show :item="scopeChild.row" :visit-type="1"></advice-item-show>
                </template>
              </el-table-column>
              <el-table-column width="120">
                <template slot-scope="scopeChild">
                  <span v-if="scopeChild.row.entrust">{{scopeChild.row.entrust}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('嘱托')"
          width="131">
        </el-table-column>
        <el-table-column
          :label="$t('执行科室')"
          width="100">
          <template slot-scope="scope">
            <div class="execute-provider" :title="scope.row.executeProviderName">{{scope.row.executeProviderName}}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('操作')"
          width="150">
          <template slot-scope="scope">
            <el-button type="text" class="editor-btn" @click="editor(scope)">编辑</el-button>
            <el-button type="text" class="delet-btn" @click="del(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="saveTemplate">保存</el-button>
    </div>
    <div class="layout_inner footarea">
      <prescription
        ref="pres"
        :is-add-tpl="true"
        title=""
        :scene="visitType"
        :show-add="showAdd"
        :init-data.sync="waitSendData"
        :user-info="baseInfo"
        :share-info="{}"
        :share-time="{}"
        :search-type="1"
        @change="showAddEvent"
        @open="openAddEvent"
      ></prescription>
    </div>
    <check-submit
        :check-list="['number']"
        :base-info="baseInfo"
        @submit="submitOrders"
      ></check-submit>
    </div>
  </div>
</template>

<script>
import api from '@/sob/store/casecontentdeptapi'
import agencysentence from '@/warehouse/page/agency/store/agencysentenceapi'
import form from '@/util/form'
import storage from '@/util/storage'
import drugInfo from '@/inpatient/components/drug.info' // 西药说明书
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items' // 组套明细
import prescription from '@/inpatient/components/issued.orders/index.vue' // 开医嘱组件
import checkSubmit from '@/inpatient/components/issued.orders/before.submit.vue' // 提交组件

let schema = [
  {
    name: 'providerId',
    label: '所属科室',
    comp: 'custom'
  },
  {
    name: 'templateName',
    label: '模版名称',
    span: 6,
    props: {
      placeholder: '请输入模版名称',
      maxlength: 20
    }
  }
]
export default {
  components: { drugInfo, serviceSetItems, prescription, checkSubmit },
  mixins: [form],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.id = ''
    obj.type = ''
    obj.content = ''
    return {
      api,
      obj,
      schema,
      userId: this.$store.state.currentUser.userId,
      baseInfo: this.$route.query,
      visitType: this.$route.params.visitType ? parseInt(this.$route.params.visitType) : 1,
      dptData: [],
      waitSendData: [],
      callbackData: '',
      showAll: true,
      showSend: true,
      showAdd: false,
      subDisabled: false,
      showDpt: false,
      rules: {
        name: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  watch: {
    '$store.state.currentUser': {
      handler (val) {
        this.userId = val.userId
      },
      deep: true
    },
    'obj.dptId' (val) {
      if (!this.dptData[0]) {
        return false
      }
      this.obj.dptName = this.dptData.filter(v => {
        return val === v.id
      })[0].name
    }
  },
  created () {
    this.obj.id = this.$route.params.id
    this.obj.type = this.visitType === 1 ? 100 : 101
    this.baseInfo.userId = this.userId
    this.getDepts()
    this.setEditData()
  },
  methods: {
    async getDepts () {
      this.dptData = []
      const res = await agencysentence.getLocalSectionVoBySearch({relationType: 401, relationId: this.userId})
      this.showDpt = true
      if (res && res.length) {
        res.forEach(item => {
          if (item.sectionRecordId) {
            this.dptData.push({id: item.sectionRecordId, name: item.name})
          }
        })
        if (!this.obj.dptId) {
          this.obj.dptId = this.dptData[0].id
        }
      } else {
        this.subDisabled = true
      }
    },
    // 展开待发送医嘱
    showWaitEvent () {
      this.showSend = true
      this.showAll = false
    },
    // 展开添加医嘱区域
    showAddEvent () {
      this.showAdd = !this.showAdd
    },
    // 展开开医嘱区域
    openAddEvent () {
      this.showAll = false
      this.showSend = true
      this.showAdd = true
    },
    // 编辑等待区域的医嘱
    editWaitService (items) {
      this.callbackData = items
    },
    saveTemplate (val) {
      this.subDisabled = true
      this.obj.content = val
      this.$refs.tplForm.$refs.form.validate(v => {
        if (!v) {
          this.subDisabled = false
          return false
        }
        this.obj.content = JSON.stringify(val)
        this.api.createOrUpdate(this.obj).then(rs => {
          if (rs.head.errCode) {
            this.subDisabled = false
            return false
          }

          this.$notify({
            title: '成功',
            message: '处方模版保存成功',
            type: 'success'
          })
          storage.setLocalStorage('prescriptionTemplateType', '2')
          // 由于住院工作站，护士的计费模版和医生的医嘱模版都用templateList这个name跳转，有冲突，加个判断
          if (this.$route.matched[0].meta.space === 'resident') {
            this.$router.push({ name: 'residentTpleList', params: { query: { type: '2' } } })
          } else {
            this.$router.push({ name: 'templateList', params: { query: { type: '2' } } })
          }
        })
      })
    },
    submitEvent (val) {
      this.waitSendData = val
    },
    setEditData () {
      if (!this.obj.id) {
        return false
      }
      this.api.getById(this.obj.id).then(rs => {
        Object.assign(this.obj, rs.data)
        let _data = JSON.parse(rs.data.content)
        this.waitSendData = _data
      })
    }
  }
}
</script>

<style scoped>
.noRelateDpt {
  margin: 0;
  color: #ee4433;
}
#addtemplate {
  font-size: 14px;
}
#addtemplate .layout_inner {
  position: relative;
}
#addtemplate .mb20 {
  margin-bottom: 20px;
}
@media (min-height: 760px) {
  /*#addtemplate .footarea{position: absolute; bottom: 0;left: 0; right: 0;}*/
}
</style>
