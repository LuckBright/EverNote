<template>
  <div class="history page_layout_full_hidden">
    <el-row :gutter="10"
            class="container page_layout_full_hidden">
      <el-col class="flex_column_full_hidden" :span="6">
        <ever-form2 :schema="schema"
                    v-model="queryObj"
                    :inline="true"
                    :nosubmit="true">
          <template slot="vistType">
            <el-select v-model="recordId"
                       @change="changeTree"
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in record"
                         :key="item.visitSerialNumber"
                         :label="formatLabel(item)"
                         :value="item.visitSerialNumber"></el-option>
            </el-select>
          </template>
        </ever-form2>
        <el-tree class="flex_layout_scroll"
                 :default-expand-all="true"
                 :data="treeData"
                 :props="defaultProps"
                 @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="18"
              class="right">
        <tpl-doc :key="doc.id"
                 v-if="designerId === '2'"
                 :visit-id="doc.visitId"
                 :patient-id="patientId"
                 :dpt-id="doc.dptId"
                 :data-id="doc.id"
                 :schema-id="doc.formTemplateId"
                 :editable="false"></tpl-doc>
        <tpl-form :key="formObj.id"
                  v-if="designerId === '1'"
                  :data-id="formObj.id"
                  v-model="form"
                  :schema-id="formObj.formTemplateId"
                  :allDisabled="true"></tpl-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import tplDoc from '@/form/components/tpldoc'
import tplForm from '@/form/components/tplform'
const schema = [
  {
    name: 'vistType',
    label: '住院记录',
    comp: 'custom'
  }
]
const TEXT = '1'
const FORM = '1'
const DOC = '2'
export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String,
    curNode: Object
  },
  created () {
    this.list()
  },
  components: {
    tplDoc,
    tplForm
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      form: {},
      formObj: {},
      doc: {},
      designerId: '',
      record: [],
      recordId: '',
      url: urlMap.quote.history,
      schema,
      queryObj,
      treeData: [],
      columns: [
        {
          prop: 'name',
          label: '',
          showOverflowTooltip: true
        }
      ],
      defaultProps: {
        children: 'nodes',
        label: 'name'
      }
    }
  },
  methods: {
    changeTree (val) {
      this.recordId = val
      this.getTreedata()
    },
    handleNodeClick (node) {
      if ('nodes' in node) {
        return
      } else {
        if (node.designerId === DOC) {
          this.doc = node
        } else if (node.designerId === FORM) {
          this.formObj = node
        }
        this.designerId = node.designerId
      }
    },
    styleFn () {
      return { cursor: 'pointer' }
    },
    quote () {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append' + this.curNode.id, this.textFormat())
      }
    },
    textFormat () {
      let str = ''
      if (this.selected && this.select.length) {
        this.selected.map(item => {
          this.columns.map(columns => {
            str += `${columns.label}: ${this.isEmpty(item[columns.prop])} `
          })
        })
      }
      return str
    },
    isEmpty (val) {
      return val && val !== null ? val : '--'
    },
    async list () {
      const res = await request(this.url.all, {
        patientId: this.patientId,
        visitStatusCode: 9,
        tenantId: this.$store.state.currentUser.tenantId,
        visitOrgId: this.$store.state.currentUser.organizationId,
        visitTypeCode: this.$route.matched[0].meta.type
      })
      if (Array.isArray(res.data)) {
        this.record = res.data
        if (this.record.length > 0) {
          this.recordId = this.record[0].visitSerialNumber
          this.getTreedata()
        }
      }
    },
    async getTreedata () {
      const res = await request(this.url.tree, {
        visitNumber: this.recordId,
        type: 1
      })
      this.treeData = []
      if (Array.isArray(res.data) && res.data.length > 0) {
        res.data.map((item, index) => {
          if (item.code !== 'ZHU_YUAN_BING_AN_SHOU_YE' && item.code !== 'TI_WEN_DAN') {
            this.treeData.push(item)
          }
        })
      }
    },
    select (val) {
      this.selected = val
    },
    formatLabel (item) {
      if (typeof item.hospitalizedTime === 'string') {
        return item.hospitalizedTime.substr(0, 10) + ' ' + item.admissionTenantSubjectName
      } else {
        return item.admissionTenantSubjectName
      }
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
.margin {
  margin-top: -5px;
}
/deep/ .el-form {
  .el-form-item {
    display: flex;
    .el-form-item__content {
      flex: 1;
      .el-select {
        width: 100%;
      }
    }
  }
}
.history {
  .container {
    .right {
      height: 100%;
      /deep/ .tpldoc {
        height: 100%;
        /deep/ .medical {
          height: 100%;
          /deep/ .editor_content_wrap {
            height: 249px;
          }
        }
      }
    }
  }
}
</style>

