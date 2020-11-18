<template>
  <el-dialog :visible.sync="visible" :key="currentDate" :title="title" width="700" :close-on-click-modal="false">
    <div style="padding: 10px 20px">
      <span style="color:#fff; height:0; line-height:0; position:absolute;">{{autosql}}</span>
      <ever-form2 v-model="authObj" ref="formEdit" :schema="schema" :rules="rules">
        <template slot="range">
          <el-row style="margin-top: 5px">
            <el-col :span="12">
              <el-input size="small" v-model="authObj.ziduan" placeholder="请输入字段名"></el-input>
            </el-col>
            <el-col :span="12">
              <sys-type code="THC_SQL_SYMBOL" v-model="authObj.symbol" placeholder="请选择操作符"></sys-type>
            </el-col>
          </el-row>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="机构" name="org">
              <div>
                <ever-org-select ref="eos" v-model="authObj.orgList" type="cascader" :multiple="true" fields="id"></ever-org-select>
              </div>
            </el-tab-pane>
            <el-tab-pane label="科室" name="subject">
              <div>
                <ever-subject-select ref="esus" v-model="authObj.subjectList" fields="orgSubjectCode" type="select" :clearable="true" :multiple="true"></ever-subject-select>
              </div>
            </el-tab-pane>
            <el-tab-pane label="人员" name="staff">
              <div>
                <ever-staff-select ref="ess" v-model="authObj.staffList" :multiple="true" :clearable="true" :props="{clearable: false}"></ever-staff-select>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
        <template slot="default">
          <span></span>
        </template>
      </ever-form2>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleValue()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlMap from '@/auth/store/urls'
import { request } from '@/util/req'

const schema = [
  {
    name: 'name',
    label: '权限名称',
    props: {
      placeholder: '输入数据权限名称',
    }
  },
  {
    name: 'sendBiz',
    label: '业务组',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_PROJECT',
      placeholder: '业务组',
      useObject: true,
      objSimple: true,
    }
  },
  {
    name: 'sendBizDomain',
    label: '业务域',
    comp: 'sys-type',
    props: {
      code: 'THC_SYS_BUSINESS',
      placeholder: '选择业务域',
      useObject: true,
      objSimple: true,
    }
  },
  {
    name: 'groupCode',
    label: '分组名',
    parentClass: 'w',
  },
  {
    name: 'dataType',
    label: '数据权限类型',
    placeholder: '输入数据权限类型',
    comp: 'radio',
    props: {
      options: [
        { id: '包含', name: '1' },
        { id: '排除', name: '2' },
      ]
    },
    parentClass: 'dn'
  },
  {
    name: 'ctrl',
    label: '',
    comp: 'radio',
    parentClass: 'w',
    props: {
      options: [
        { name: '1', id: 'SQL输入' },
        { name: '2', id: '组件选择' }
      ]
    }
  },
  {
    name: 'content',
    label: '字段列表',
    comp: 'textarea',
    props: {
      rows: 2,
      placeholder: '请输入字段名称，逗号分隔'
    }
  },
  {
    name: 'range',
    label: '',
    comp: 'custom',
    parentClass: 'w'
  },
  {
    name: 'remark',
    label: '备注',
    comp: 'textarea',
    props: {
      placeholder: '输入备注'
    }
  },
]
const rules = {
  name: [
    { required: true, message: '请输入行数据名称', trigger: 'blur' }
  ],
  sendBiz: [
    { required: true, message: '请选择业务组', trigger: 'blur' }
  ],
  sendBizDomain: [
    { required: true, message: '请选择业务域', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入sql条件', trigger: 'blur' }
  ]
}
export default {
  data () {
    var authObj = this.$ever.createObjFromSchema(schema)
    authObj.ziduan = ''
    authObj.symbol = ''
    authObj.orgList = []
    authObj.subjectList = []
    authObj.staffList = []
    authObj.ctrl = '1'
    return {
      schema,
      authObj,
      rules,
      visible: false,
      rowData: {},
      activeName: 'org',
      orgList: [],
      subjectList: [],
      staffList: [],
      currentDate: new Date().getTime(),
      type: 'row',
      title: '数据行权限'
    }
  },
  created () {
  },
  computed: {
    autosql () {
      let str1
      if (this.type === 'row' && this.authObj.ctrl === '2') {
        str1 = this.authObj.ziduan + ' ' + this.authObj.symbol + ' '
        let ids = this.authObj[this.activeName + 'List']
        if (this.authObj.symbol === 'like' || this.authObj.symbol === 'not like') {
          ids = '\'%' + ids + '%\''
        } else if (this.authObj.symbol === 'in' || this.authObj.symbol === 'not in') {
          ids = ids.join('\',\'')
          ids = '(\'' + ids + '\')'
        } else {
          ids = '\'' + ids + '\''
        }
        str1 += ids
        this.authObj.content = str1.trim()
      }
      return str1
    }
  },
  watch: {
    'authObj.ctrl': {
      handler (val) {
        let urlItemrange = this.schema.find(item => item.name === 'range')
        let urlItemcontent = this.schema.find(item => item.name === 'content')
        if (val === '1') {
          urlItemrange.parentClass = 'dn'
          urlItemcontent.props.disabled = false
        } else {
          urlItemrange.parentClass = 'w'
          urlItemcontent.props.disabled = true
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick () {
    },
    fixSchema () {
      let urlItem = this.schema.find(item => item.name === 'dataType')
      let urlItemrange = this.schema.find(item => item.name === 'range')
      let urlItemcontent = this.schema.find(item => item.name === 'content')
      let urlItemctrl = this.schema.find(item => item.name === 'ctrl')
      let urlItemgroupCode = this.schema.find(item => item.name === 'groupCode')

      if (this.type === 'col') {
        urlItem.parentClass = 'w'
        urlItemrange.parentClass = 'dn'
        urlItemctrl.parentClass = 'dn'
        urlItemcontent.label = '字段列表'
        urlItemcontent.props.placeholder = '请输入字段名称，逗号分隔'
        urlItemgroupCode.parentClass = 'dn'
      } else {
        urlItem.parentClass = 'dn'
        urlItemrange.parentClass = 'w'
        urlItemctrl.parentClass = 'w'
        urlItemcontent.label = 'sql条件'
        urlItemcontent.props.placeholder = '请输入sql条件'
        urlItemgroupCode.parentClass = 'w'
      }
    },
    open (row, type) {
      this.type = type
      this.authObj = {
        rid: row.rid,
        name: '',
        sendBiz: '',
        sendBizDomain: '',
        content: '',
        range: '',
        remark: '',
        sqlContent: '',
        dataType: '',
        ziduan: '',
        symbol: '',
        orgList: [],
        subjectList: [],
        staffList: [],
        ctrl: '1',
        groupCode: ''
      }
      this.activeName = 'org'
      this.fixSchema()
      if (type === 'col') {
        this.title = '数据列权限添加'
      } else {
        this.title = '数据行权限添加'
        let urlItemrange = this.schema.find(item => item.name === 'range')
        if (this.authObj.ctrl === '1') {
          urlItemrange.parentClass = 'dn'
        } else {
          urlItemrange.parentClass = 'w'
        }
      }
      this.visible = true
    },
    cancel () {
      this.visible = false
    },
    // 添加新的行数据资源
    handleValue () {
      this.$refs.formEdit.$refs.form.validate((valid) => {
        if (valid) {
          let url = (this.type === 'row') ? urlMap.dataRowAccess.createDataRowAccess : urlMap.dataColAccess.createDataColAccess
          if (this.authObj.id) {
            url = (this.type === 'row') ? urlMap.dataRowAccess.updateDataRowAccess : urlMap.dataColAccess.updateDataColAccess
          }
          this.authObj.sendBizCode = this.authObj.sendBiz.code || ''
          this.authObj.sendBizName = this.authObj.sendBiz.name || ''
          this.authObj.sendBizDomainCode = this.authObj.sendBizDomain.code || ''
          this.authObj.sendBizDomainName = this.authObj.sendBizDomain.name || ''
          let sql = {
            ctrl: this.authObj.ctrl,
            ziduan: this.authObj.ziduan,
            symbol: this.authObj.symbol,
            activeName: this.activeName,
            orgList: this.authObj.orgList,
            subjectList: this.authObj.subjectList,
            staffList: this.authObj.staffList
          }
          delete this.authObj.ctrl
          delete this.authObj.ziduan
          delete this.authObj.symbol
          delete this.authObj.ziduan
          delete this.authObj.orgList
          delete this.authObj.subjectList
          delete this.authObj.staffList
          delete this.authObj.activeName

          this.authObj.sqlContent = JSON.stringify(sql)
          request(url, this.authObj).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.visible = false
              this.$emit('success', this.rowData)
            }
          })
        }
      })
    },
    edit (auth, type) {
      this.type = type
      this.fixSchema()
      this.authObj.name = auth.name
      this.authObj.sendBiz = {
        code: auth.sendBizCode,
        name: auth.sendBizName
      }
      this.authObj.sendBizDomain = {
        code: auth.sendBizDomainCode,
        name: auth.sendBizDomainName
      }
      this.authObj.content = auth.content
      this.authObj.remark = auth.remark
      this.authObj.id = auth.id
      this.authObj.dataType = auth.dataType
      this.authObj.groupCode = auth.groupCode
      if (type === 'col') {
        this.title = '数据列权限管理（' + auth.name + '）'
      } else {
        this.title = '数据行权限管理（' + auth.name + '）'
      }
      if (!auth.sqlContent) {
        this.authObj.ziduan = ''
        this.authObj.symbol = ''
        this.activeName = 'org'
        this.authObj.ctrl = '1'
        this.authObj.orgList = []
        this.authObj.subjectList = []
        this.authObj.staffList = []
      } else {
        try {
          if (auth.sqlContent) {
            this.authObj.ziduan = JSON.parse(auth.sqlContent).ziduan || ''
            this.authObj.ctrl = JSON.parse(auth.sqlContent).ctrl
            this.authObj.symbol = JSON.parse(auth.sqlContent).symbol
            this.activeName = JSON.parse(auth.sqlContent).activeName
            this.authObj.orgList = JSON.parse(auth.sqlContent).orgList
            this.authObj.subjectList = JSON.parse(auth.sqlContent).subjectList
            this.authObj.staffList = JSON.parse(auth.sqlContent).staffList
          }
        } catch (e) {
          console.log(e + 'parse json error')
        }
      }
      if (type === 'row') {
        let urlItemrange = this.schema.find(item => item.name === 'range')
        let urlItemcontent = this.schema.find(item => item.name === 'content')
        if (this.authObj.ctrl === '1') {
          urlItemrange.parentClass = 'dn'
          urlItemcontent.props.disabled = false
        } else {
          urlItemrange.parentClass = 'w'
          urlItemcontent.props.disabled = true
        }
      }
      this.visible = true
    }
  },
}
</script>
