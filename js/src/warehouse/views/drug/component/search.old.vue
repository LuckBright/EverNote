<template>
  <ever-form2
    onsubmit="return false;"
    :schema="querySchema"
    v-model="queryObj"
    ref="form"
    class="query-style custom-form-item"
    :inline="true"
    :is-query="true"
    :input-query="true"
    @query="list(true)">
    <template slot="patientId">
      <ever-patient-select
        v-model="queryObj.patientId"
        :selectIfOnePatient="true"
        @change="list"
        @select="list"
        @clear="clear"
        :placeholder="placeholder"
      ></ever-patient-select>
    </template>
    <template slot="default">
      <el-form-item :class="{ml10: isShowSearchBtn}">
        <el-button v-if="isShowSearchBtn" size="small" type="primary" @keyup.enter.native="list" @click="list">查询</el-button>
      </el-form-item>
    </template>
  </ever-form2>
</template>

<script>
import { debounce1, delObjIsNull } from '@/util/common'
const patientObj = [{
  name: 'patientId',
  comp: 'custom',
}]
const querySchema = [
  {
    name: 'searchCode',
    props: {
      clearable: true,
      'suffix-icon': 'el-icon-search'
    },
  }
]
export default {
  props: {
    // 查询所需其他组件中参数
    otherArgs: {
      type: Object,
      default: () => ({})
    },
    isShowSearchBtn: { // 是否展示查询按钮
      type: Boolean,
      default: false
    },
    isAudit: Boolean, // 是否是审核页面
    noClearSearchValue: Boolean // 不清空搜索框内查询内容
  },
  data () {
    const path = this.$route.path
    // 只有任务列表 添加 udd药包号
    const placeholder = path.indexOf('hospitaludd') !== -1 ? '输入患者姓名、患者档案号、就诊卡号、住院病案号' + (path.indexOf('uddtask') !== -1 ? '、UUD药包号' : '') : '输入患者姓名、就诊卡号、患者档案号、处方号' + `${!this.isAudit ? '/业务单号' : ''}` + '、执行单号'
    querySchema.find(schema => schema.name === 'searchCode').props.placeholder = placeholder
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj,
      patientObj,
      placeholder
    }
  },
  created () {
    this.queryObj.patientId = this.$route.query.patientId
    if (this.queryObj.patientId) this.list()
  },
  methods: {
    clear () {
      this.initQuery()
    },
    list: debounce1(function () {
      // this.noClearSearchValue && this.initQuery()
      if (!this.queryObj.searchCode && !this.queryObj.patientId) {
        setTimeout(_ => {
          this.queryObj.patientId = ''
        }, 200)
        this.querySchema = JSON.parse(JSON.stringify(querySchema))
        this.$emit('query', delObjIsNull(Object.assign({}, this.queryObj)))
      } else {
        // 处方单号、执行单号 R、A、Q开头的code(为了匹配新增的业务单号（补费任务）修改正则匹配内容大写开头)
        if (/^[A-Z]+\d+$/.test(this.queryObj.searchCode || this.queryObj.patientId)) {
          setTimeout(_ => {
            this.queryObj.patientId = ''
          }, 200)
          this.querySchema = JSON.parse(JSON.stringify(querySchema))
          this.$emit('query', delObjIsNull(Object.assign({}, this.queryObj)), false)
          !this.noClearSearchValue && this.initQuery()
        } else {
          setTimeout(_ => {
            this.queryObj.searchCode = ''
          }, 200)
          this.querySchema = JSON.parse(JSON.stringify(this.patientObj))
          this.queryObj.patientId = this.queryObj.patientId ? this.queryObj.patientId : this.queryObj.searchCode
          if (this.queryObj.searchCode !== this.queryObj.patientId) {
            const patientId = typeof this.queryObj.patientId === 'object' ? this.queryObj.patientId.id : this.queryObj.patientId
            this.$emit('query', delObjIsNull(Object.assign({}, this.queryObj, { patientId })), true)
            !this.noClearSearchValue && this.initQuery()
          }
          this.$nextTick(() => {
            this.$refs.form.$el[0].focus()
          })
        }
      }
    }),
    initQuery () {
      this.queryObj.searchCode = ''
      this.queryObj.patientId = ''
      this.querySchema = JSON.parse(JSON.stringify(querySchema))
    }
  },
  watch: {
    otherArgs: {
      handler (obj) {
        this.queryObj = Object.assign({}, this.queryObj, obj)
        // todo: 是否需要立即调用list方法
      },
      deep: true
    }
  }
}
</script>

