<template>
  <div id="basicinfo">
    <ever-form2
      v-model="queryObj"
      :schema="querySchema"
      :rules="formrules"
      ref="form"
      :span="12"
      class="diy-star"
      :hideRequiredAsterisk="false"
    >
      <template slot="daterange">
        <ever-range-picker
          :start.sync="queryObj.startDate"
          :end.sync="queryObj.endDate"
          dateType="datetimerange"
          outformat="YYYY-MM-DD HH:mm:ss"
          startPlaceholder="_年_月_日 _时_分_秒"
          endPlaceholder="_年_月_日 _时_分_秒"
          :defaultTime="['00:00:00', '23:59:00']"
          autoWidth="true"
        ></ever-range-picker>
      </template>
      <template slot="canupdate">
        <el-checkbox v-model="queryObj.canupdate">下单可修改</el-checkbox>
      </template>
      <template slot="pictureUcloud">
        <el-col :span="24">
          <ever-upload1 v-model="queryObj.pictureUcloud" :limit="1" :tipsFlag="true"></ever-upload1>
        </el-col>
      </template>
      <template slot="serviceName" v-if="isPlan">
        <el-form-item label="项目名称" style="margin-left: -120px;">
          <el-checkbox v-model="isServiceVisible">展示给患者套餐项目明细</el-checkbox>
        </el-form-item>
      </template>
      <template slot="adviceOrgId" v-if="isPlan">
        <ever-org-select v-model="queryObj.adviceOrgId" fields='id' placeholder="执行机构">展示给患者套餐项目明细</ever-org-select>
      </template>
      <template slot="adviceDptId" v-if="isPlan">
          <ever-subject-select v-model="queryObj.adviceDptId" placeholder="执行科室"  type='select'
          fields='orgSubjectCode'></ever-subject-select>
      </template>
      <template slot="adviceDoctorId" v-if="isPlan">
        <el-row>
          <el-col :span="24">
            <!-- <ever-staff-select class="doctor-select" v-if="queryObj.doctorIdType === 1" ref="ess" placeholder="医生" v-model="queryObj.adviceDoctorId"></ever-staff-select> -->
            <el-select class="doctor-select" v-model="queryObj.adviceDoctorId" @focus="getDoctorTemList" @visible-change="getDoctorTemList" clearable filterable >
              <el-option v-for="item in doctorTeamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <span style="color: grey">（选中医生团队将自动加入与患者的群聊）</span><u @click="gotoDoctorTeam" class="goto-doctor-team-btn">医生团队设置</u>
          </el-col>
        </el-row>
      </template>
      <template slot="default">
        <el-col>
          <el-form-item>
            <el-button
              v-if="!isGroupControl && (packageDetails && !packageDetails.isClinic)"
              type="primary"
              class="querybtn"
              @click="submit"
              :disabled="loading"
            >确定</el-button>
            <el-button class="querybtn" @click="cancel">返回</el-button>
          </el-form-item>
        </el-col>
      </template>
      <template slot="curDptranges">
        <el-row v-if="isPlan">
          <el-col :span="24" style="color: grey">(患者可在选中科室内使用保障计划中项目)</el-col>
        </el-row>
        <el-form-item>
          <ever-subject-select
          ref="ess"
          v-model="queryObj.curDptranges"
          :params="subjectQuery"
          :props="{'check-strictly': true}"
          fields= 'orgSubjectCode'
          :isOrg="isOrg"
          type="tree"
          ></ever-subject-select>
        </el-form-item>
      </template>
      <template slot="detailsHtml">
        <el-row style="margin-left: -114px">
          <el-col :span="24">
            <span class="form-start">*</span><span>保障计划详情页</span>
            <span style="color: grey">示例
            <el-tooltip placement="right" effect="light">
              <img slot="content" src="../../assets/shili.png">
              <i class="el-icon-warning"></i>
            </el-tooltip>
            <span class="jianyi">（建议至少上传一张专家团队介绍照片，一张项目介绍照片，图片最大8Mb）</span>
            </span>
          </el-col>
        </el-row>
        <evereditor
          menu="base"
          :options="editorOpts"
          :html="queryObj.detailsHtml"
          :toolbars="toolbars"
          v-model="queryObj.detailsHtml"
          ref="htmlEditor">
        </evereditor>
      </template>
    </ever-form2>
  </div>
</template>
<script>
import api from '@/card/store/packagemanagement/api'
import { editorBaseOpts, DISCOUNT_METHOD, debounce1 as debounce } from '@/util/common'
import { CATEGORYIDS_TYPE } from '@/card/util/cardcommon'
import evereditor from 'evereditor'
editorBaseOpts.image.dropzoneOptions = {
  maxFilesize: 8
}

let codeCheck = (rule, value, callback) => {
  let res = /^([0-9a-zA-Z]){1,10}$/
  if (!res.test(value)) {
    callback(new Error('编码格式不正确'))
  } else {
    callback()
  }
}
let querySchema = [
  {
    label: '编码',
    name: 'code',
    props: {
      placeholder: '请输入编码'
    }
  },
  {
    label: '名称',
    name: 'name',
    comp: 'sys-text',
    props: {
      maxlength: 20,
      placeholder: '请输入名称'
    }
  },
  {
    label: '套餐分类',
    name: 'categoryId',
    comp: 'sys-type',
    props: {
      placeholder: '请选择套餐所属分类',
      code: 'THC_MEAL_CLASSIFY_CODE',
      filtercodes: ['01', '02', '03']
    }
  },
  {
    label: '折扣方式',
    name: 'discountSet',
    comp: 'ever-select',
    props: {
      placeholder: '请选择折扣方式',
      options: []
    }
  },
  {
    name: 'serviceName',
    comp: 'custom'
  },
  {
    name: 'curDptranges',
    label: '适用科室',
    comp: 'custom',
    span: 24
  },
  {
    label: '可售有效期',
    name: 'daterange',
    comp: 'custom',
    span: 24
  },
  {
    label: '最低起售数量',
    name: 'minCount',
    comp: 'ever-price',
    props: {
      placeholder: '请输入最低起售数量',
      append: '次'
    }
  },
  {
    label: '使用有效期',
    name: 'validPeriod',
    comp: 'ever-price',
    props: {
      placeholder: '自下单之日起',
      append: '天',
      max: 9999
    },
    newRow: true,
    span: 10
  },
  {
    // 是否下单可修改
    label: '',
    name: 'canupdate',
    comp: 'custom',
    span: 2,
    labelWidth: '10px',
  },
  {
    label: '套餐图片',
    name: 'pictureUcloud',
    comp: 'custom',
    span: 24
  },
  {
    label: '',
    name: 'detailsHtml',
    comp: 'custom',
    span: 24
  },
  {
    label: '使用说明',
    name: 'instructions',
    comp: 'textarea',
    span: 24,
    props: {
      disabled: false,
      placeholder: '使用说明',
      maxlength: 40,
      'show-word-limit': true
    }
  },
  {
    label: '执行机构',
    name: 'adviceOrgId',
    comp: 'custom',
  },
  {
    label: '执行科室',
    name: 'adviceDptId',
    comp: 'custom',
  },
  {
    label: '执行人',
    name: 'adviceDoctorId',
    comp: 'custom',
    span: 24,
  },
  {
    label: '参与人数',
    name: 'participants',
    comp: 'ever-price',
    props: {
      placeholder: '填写人数将用于保障计划详情页展示，患者端展示数据=填写参与人数+实际参与人数',
      append: '人',
      max: 9999
    },
    span: 12
  },
]
let formrules = {
  code: [{
    required: 'true',
    validator: codeCheck,
    trigger: 'blur'
  }],
  name: [{
    required: 'true',
    message: '请填入名称',
    trigger: 'blur'
  }],
  categoryId: [{
    required: 'true',
    message: '请选择所属分类',
    trigger: ['blur', 'change']
  }],
  discountSet: [{
    required: 'true',
    message: '请选择折扣方式',
    trigger: ['blur', 'change']
  }],
  curDptranges: [{
    required: 'true',
    message: '请选择适用科室',
    trigger: ['blur', 'change']
  }],
  validPeriod: [{
    required: 'true',
    message: '请填入套餐使用有效期',
    trigger: 'blur'
  }],
  instructions: [{
    required: 'true',
    message: '请输入保障目标或使用说明',
    trigger: 'blur',
  }],
  participants: [{
    required: 'true',
    message: '请输入参与人数',
    trigger: 'blur'
  }],
  doctorIdType: [{
    required: 'true',
    message: '请选择参执行医生类型',
    trigger: 'blur'
  }],
  adviceDoctorId: [{
    required: 'true',
    message: '请选择医生团队',
    trigger: 'blur'
  }],
  adviceOrgId: [{
    required: 'true',
    message: '请选择执行机构',
    trigger: 'blur'
  }],
  adviceDptId: [{
    required: 'true',
    message: '请选择执行科室',
    trigger: 'blur'
  }],
}
export default {
  props: ['packageDetails', 'isGroupControl'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startDate = ''
    queryObj.endDate = ''
    queryObj.id = undefined
    queryObj.canupdate = true
    return {
      categoryids: CATEGORYIDS_TYPE,
      querySchema,
      queryObj,
      formrules,
      loading: false,
      fitOrigIdsDic: {}, // 定义数组存储机构的id与名字键值对，方便科室的时候查
      pictureName: '',
      imageArr: [], // 定义回显图片的数组
      isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      packageDetailsArr: [],
      isServiceVisible: true,
      editorOpts: {
        ...editorBaseOpts,
      },
      doctorTeamList: [],  // 医生团队列表
      subjectQuery: {}, // 适用科室查询参数
      isOrg: true, // 适用科室查询
      toolbars: ['Undo', 'Redo', 'Table', 'Image', 'Link', 'Pagebreak', 'Special Character', 'Bold', 'Italic', 'Strike', 'Underline', 'Superscript', 'Subscript', 'heading', 'fontSize', 'fontFamily', 'Text Color', 'Text Background Color', 'LineSpacing', 'Align Left', 'Align Center', 'Align Right', 'Align Justify', 'Label', 'Input', 'Checkbox', 'Radio', 'InputArea', 'Checkbox List', 'Bullet List', 'Ordered List', 'Paragraph Before Margin', 'Paragraph After Margin', 'Increase Indent', 'Decrease Indent', 'Format Clear', 'Fullsrceen'],
    }
  },
  components: {
    evereditor
  },
  mounted () {
    this.getDoctorTemList()
    this.queryObj.doctorIdType = this.queryObj.doctorIdType || 2
    this.$ever.getFieldFromSchema(this.querySchema, 'discountSet').props.options = DISCOUNT_METHOD
    let instructionsIndex = this.querySchema.findIndex(item => item.name === 'instructions')
    this.querySchema[instructionsIndex].props.placeholder = '请描述使用说明或保障目标'
    this.querySchema[instructionsIndex].label = this.isPlan ? '保障目标' : '使用说明'
    if (this.isPlan) {
      this.querySchema = this.querySchema.filter(item => !['pictureUcloud', 'categoryId', 'minCount', 'serviceName'].includes(item.name))
    } else {
      this.querySchema = this.querySchema.filter(item => !['doctorIdType', 'detailsHtml', 'target', 'orgId', 'deptId', 'participants', 'adviceDoctorId', 'adviceOrgId', 'adviceDptId'].includes(item.name))
      this.subjectQuery = {type1CodeList: [this.categoryids[0].id]}
    }
  },
  computed: {
    isPlan () {
      return this.$route.meta.type === 'plan'
    }
  },
  methods: {
    getDoctorTemList() {
      api.getDoctorTeamList().then(res => {
        if (res.head.errCode === 0) {
          this.doctorTeamList = res.data
        }
      })
    },
    gotoDoctorTeam() {
      window.open(this.$ever.titanCareIndex + '/titancare/patientclient/team')
    },
    editorHtmlSubstr(text) {
      var str = text
      var p = document.createElement('p')
      p.innerHTML = str
      return p.innerHTML
    },
    submit: debounce(function () {
      if (this.isPlan) {
        let editorText = this.editorHtmlSubstr(this.$refs.htmlEditor.getHtml())
        if (!editorText) {
          this.$message.error('请输入保障计划详情内容')
          return
        }
      }
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = Object.assign({}, this.queryObj)
          if (this.isPlan) {
            params.minCount = 1
          }
          params.canupdate = Number(this.queryObj.canupdate)
          params.pictureName = this.pictureName
          params.isGroup = this.isGroup
          params.isServiceVisible = this.isServiceVisible
          let arrs = []
          params.curDptranges.map(item => { arrs.push({ rangeId: item, rangeCode: item }) })
          params['fitDptIds'] = arrs
          if (this.isPlan) {
            params.detailsHtml = this.$refs.htmlEditor.getHtml()
            params.categoryId = '06'
          }
          api.createOrUpdate(params).then(result => {
            this.$messageTips(this, 'success', '套餐保存成功')
            if (result && result.data) {
              this.queryObj.id = result.data.id
              this.$router.replace({
                path: this.$route.path,
                query: { ...this.$route.query, packageId: this.queryObj.id, categoryId: result.data.categoryId }
              })
              this.$bus.$emit('package-tab', { name: '2' })
              this.$emit('updateInfo', this.queryObj.id)
              // this.$bus.$emit('refresh:AdviceAfterQuote')
            }
            this.loading = false
          }).catch(
            this.loading = false
          )
        } else {
          console.log('基本信息校验失败')
        }
      })
    }, 500),
    refreshAfterEdit (data) {
      let resData = JSON.parse(JSON.stringify(data))
      if (resData.adviceOrgId) resData.adviceOrgId = resData.adviceOrgId.toString() // 机构Number => String
      this.imageArr = []
      let initDptranges = resData.fitDptIds || [] // 回显科室
      let dptranges = []
      initDptranges.map(item => { dptranges.push(item.rangeCode) })
      resData.curDptranges = dptranges
      delete resData.setMealCatalogs
      if (!resData.startDate) resData.startDate = ''
      if (!resData.endDate) resData.endDate = ''
      Object.assign(this.queryObj, resData)
      if (this.queryObj.doctorIdType === 2 && this.isPlan) {
        this.queryObj.doctorTeamId = this.queryObj.adviceDoctorId
      }
      this.queryObj.canupdate = Boolean(this.queryObj.canupdate)
      if (resData.pictureName) this.pictureName = resData.pictureName
      this.isServiceVisible = resData.isServiceVisible
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  watch: {
    'packageDetails': {
      handler: function (val) {
        if (val) {
          this.refreshAfterEdit(val)
        } else {
          // 新建时套餐默认套餐有效使用期从配置项读取
          api.getValueByCode({ code: 'setmeal_expiry_date' }).then(result => {
            this.queryObj.validPeriod = result.data
          })
        }
      },
      immediate: true,
      deep: true
    },
    'queryObj.orgId' (val) {
      this.$ever.getFieldFromSchema(this.querySchema, 'deptId') && (this.$ever.getFieldFromSchema(this.querySchema, 'deptId').props.params.orgIdList = Array.isArray(val) ? [...val] : [val])
      this.querySchema = JSON.parse(JSON.stringify(this.querySchema))
    },
  }
}
</script>
<style lang="scss" scoped>
.el-icon-warning {
  color: grey;
}

/deep/ .ever__editor .ever__editor .medical .editor_content_wrap {
  max-height: 400px;
}

/deep/ .ever__editor.base .editor_edit_wrap .editor__content .ProseMirror {
  min-height: 280px;
}
.jianyi {
  position: relative;
  left: 10px;
}
.doctor-select {
  width: 50%;
}
.goto-doctor-team-btn {
  margin-left: 70px;
  color: #1c7bef;
}
.form-start {
  color: #f56c6c;
  margin-right: 4px;
}
</style>

