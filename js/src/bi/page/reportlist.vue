<template>
  <div class="layout_inner">
    <div class="main-head" v-if="this.$route.meta.searchMode">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="hisSubModule">
          <sys-type
            code="THC_SYS_REPORT_TYPE"
            type="cascader"
            v-model="queryHisSubModuleArr"
            :use-value="true"
            placeholder=""
            :clearable="true"
          ></sys-type>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
          <el-form-item class="fr" v-if="this.$route.meta.addMode">
            <el-button type="primary" @click="sortVisible = true">排序设置</el-button>
            <el-button type="primary" @click="batchSetVerVisible = true">批量设置报表版本</el-button>
            <el-button type="primary" @click="add()">添加报表</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="allColumns"
      :url="url"
      :params.sync="queryObj"
      :show-index="true"
      :handleResult="handleResult"
      is-single-table
      is-auto-height
      @eventChange="eventChange">
      <template slot="moudleName" slot-scope="scope">
        <sys-value type="THC_SYS_REPORT_TYPE" :code="scope.row.hisSubModule" split="> "></sys-value>
      </template>
      <template slot="versions" slot-scope="scope">
        <el-select v-model="scope.row.version" value-key="versionCode" @change="(ver) => { changeVersion({ version: ver }) }" placeholder="请选择版本">
          <el-option
            v-for="item in scope.row.details"
            :key="item.versionCode"
            :label="item.versionName"
            :value="item">
          </el-option>
        </el-select>
      </template>
    </ever-table>
    <el-dialog
      title="报表信息"
      class="ui_dialog_02 spe"
      width="800px"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <div class="cnt">
        <p class="tit">本页面只提供统计类报表注册功能，病历等单据请使用新工具制作。</p>
        <ever-form2 v-model="obj" ref="formEdit" :schema="schema" :rules="rules">
          <template slot="default">
            <span></span>
          </template>
          <template slot="clinic">
            <ever-org-select ref="eos" v-model="obj.clinic" type="select" placeholder="请选择所属机构" clearable></ever-org-select>
          </template>
          <template slot="reportUseType">
            <el-select v-model="obj.reportUseType" placeholder="请选择报表类型，新加报表请选择润乾" clearable="" style="width: 100%">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot="versions">
            <div class="versions">
              <ever-form2
                v-for="(urlForm, index) in urlFormList"
                v-model="urlForm.form"
                :ref="'urlForm' + urlForm.index"
                :schema="urlForm.schema"
                :rules="urlForm.versionRules"
                :inline="true"
                :key="urlForm.index">
                <template slot="file">
                  <span class="handler">
                    <i class="el-icon-download cGray"
                      v-if="urlForm.form.fileName && urlForm.form.id"
                      :title="urlForm.form.fileName"
                      @click="handleDownFile(urlForm.form)"></i>
                  </span>
                  <span class="handler">
                    <i class="el-icon-close cGray"
                      v-if="urlForm.form.fileName && urlForm.form.id"
                      title="删除文件"
                      @click="handleRemoveFile(urlForm.form)"></i>
                  </span>
                  <el-button v-model="urlForm.file" @click="triggerFile(urlForm.index)">上传</el-button>
                  <input type="file" :id="'urlForm' + urlForm.index" style="width:0;height:0;display:none;" @change="val => { fileChange(val, urlForm.form) }">
                </template>
                <template slot="default">
                  <el-form-item>
                    <el-button icon="el-icon-plus" v-if="index === urlFormList.length - 1" @click="addBedForm(urlForm.index)"></el-button>
                    <el-button icon="el-icon-minus" v-if="index !== 0" @click="minusBedForm(urlForm.index)"></el-button>
                  </el-form-item>
                </template>
              </ever-form2>
            </div>
          </template>
        </ever-form2>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSet()">确定</el-button>
      </div>
    </el-dialog>
    <set-version v-if="batchSetVerVisible" :visible.sync="batchSetVerVisible" @chgVersion="changeVersion"></set-version>
    <sortreport v-if="sortVisible" :visible.sync="sortVisible"></sortreport>
  </div>
</template>
<script>
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'
import { tableColWidth } from '@/util/table-config'
// import { validateURL } from '@/util/validate'
import setVersion from './setversion'
import sortreport from '@/bi/page/statistics/sortreport'
import axios from 'axios'

// 报表版本校验，不能为空
let validateCode = (rule, value, callback) => {
  if (!value.code) {
    callback(new Error('请选择版本号'))
  } else {
    callback()
  }
}

let querySchema = [
  {
    name: 'hisSubModule',
    label: '选择模块',
    comp: 'custom',
  },
  {
    name: 'hisReportName',
    label: '报表名称',
    props: {
      clearable: true,
    }
  },
  {
    name: 'hisReportCode',
    label: '报表code',
    props: {
      clearable: true,
    }
  },
]

let schema = [
  {
    name: 'hisSubModule',
    label: '选择模块',
    comp: 'sys-type',
    style: {
      width: '100%'
    },
    props: {
      code: 'THC_SYS_REPORT_TYPE',
      type: 'cascader',
      showAllLevels: false,
      clearable: true,
    }
  },
  {
    name: 'hisReportName',
    label: '报表名称',
  },
  {
    name: 'hisReportCode',
    label: '报表编码',
  },
  {
    name: 'reportUseType',
    comp: 'custom',
    label: '报表类型',
  },
  {
    name: 'clinic',
    label: '所属机构',
    comp: 'custom',
    parentClass: 'w',
  },
  {
    name: 'versions',
    comp: 'custom',
    label: '报表版本',
  },
]

let urlSchema = [
  {
    name: 'version',
    comp: 'sys-type',
    props: {
      code: 'THC_PRINT_TEMPLATE',
      placeholder: '请选择版本号',
      useObject: true
    },
    style: {
      width: '150px'
    }
  },
  {
    name: 'biUrl',
    style: {
      width: '220px'
    },
    props: {
      placeholder: '请输入报表URL'
    }
  },
  {
    name: 'file',
    comp: 'custom',
  },
]

const versionRules = {
  version: [
    { required: true, message: '必填项', trigger: 'change' },
    { validator: validateCode, trigger: 'change' }
  ],
  biUrl: [
    { required: false, message: '请输入报表地址', trigger: 'change' },
    // { validator: validateURL, trigger: 'change' }
  ]
}
// 通过meta会传一些参数过来，来控制页面里的逻辑 by lvjiangtao@everjiankang.com
// editMode: false,  // 是否可以编辑 (控制行内是否出现删除和编辑)
// moduleSelect: false,  // 是否可以选择模块搜索，配合某些业务内只查询一个模块下的报表的需求
// searchMode: false,  // 是否有查询和新增区域 某些页面纯表格展示，不需要搜索条件区域
// thirdActiveIndex: '', // 菜单高亮补丁
// secActiveIndex: ''  // 菜单高亮补丁

export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    let obj = this.$ever.createObjFromSchema(schema)
    let urlForm = this.$ever.createObjFromSchema(urlSchema)
    urlForm.version = {
      code: 'master',
      name: '标准版'
    }
    return {
      queryHisSubModuleArr: [],
      typeOptions: [
        {
          value: 2,
          label: '润乾'
        },
        {
          value: 3,
          label: '尚医自定义'
        },
        {
          value: 1,
          label: '帆软',
          // disabled: true
        },
      ],
      url: urlMap.report.search,
      dialogVisible: false,
      batchSetVerVisible: false,
      sortVisible: false,
      allColumns: [
        {
          // 插槽内容 需要配合prop label等，相比slotName的优势是：可以支持拖拽，自定义表头样式等
          slot: 'moudleName',
          label: '所属模块',
          prop: 'hisSubModule',
        },
        {
          prop: 'hisReportCode',
          label: '报表编码',
        },
        {
          prop: 'hisReportName',
          label: '报表名称',
        },
        {
          prop: 'reportUseType',
          label: '报表类型',
          width: '100',
          customCellSpanClassFormatter ({ value }) {
            return value === 3 || value === 1 ? 'cRed' : ''
          },
          formatter: ({ value }) => {
            if (value === 2) {
              return '润乾'
            } else if (value === 1) {
              return '帆软报表'
            } else if (value === 3) {
              return '自定义报表'
            }
          },
        },
        {
          prop: 'hisReportUrl',
          label: '报表URL',
          width: '200',
          showOverflowTooltip: true,
        },
        {
          slot: 'versions',
          label: '版本',
          width: '130'
        },
        {
          prop: 'createTime',
          label: '修改时间',
          align: 'center',
          width: tableColWidth.datetimeAllW160
        },
        {
          prop: 'ever-op',
          type: 'btns',
          label: '操作',
          width: '250',
          align: 'center',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'handleValueDetail',
                label: '查看详情',
              },
              'edit',
              'del',
            ]
            if (!this.$route.meta.editMode) {
              baseBtns.splice(1, 2) // 查看模式 去掉编辑和删除按钮
            }
            return baseBtns
          },
        },
      ],
      querySchema: querySchema.slice(),
      queryObj,
      schema,
      obj,
      hisSubModule: this.$route.params.code,
      urlFormList: [
        {
          form: urlForm,
          schema: urlSchema,
          versionRules,
          index: 0,
        }
      ],
      rules: {
        hisSubModule: [
          { required: true, message: '请选择所属模块', trigger: 'blur' }
        ],
        hisReportName: [
          { required: true, message: '请输入报表名称', trigger: 'blur' }
        ],
        reportUseType: [
          { required: true, message: '请选择报表分类', trigger: 'blur' }
        ],
        hisReportCode: [
          { required: true, message: '请输入报表编码', trigger: 'blur' }
        ]
      },
      currentTime: new Date().getTime(),
      hisSubModuleArr: []
    }
  },
  watch: {
    '$route.params.code': {
      handler (val) {
        if (val) {
          this.queryObj.hisSubModule = this.$route.params.code
        }
      },
      immediate: true
    },
    // hisSubModuleArr (val) {
    //   this.obj.hisSubModule = val.join(',')
    // },
    queryHisSubModuleArr (val) {
      this.queryObj.hisSubModule = val.join(',')
    }
  },
  created () {
    // 如果为单模块表单查询模式，把搜索条件和表格第一列去掉
    if (!this.$route.meta.moduleSelect) {
      this.querySchema.shift()
      this.allColumns.shift()
    }
  },
  methods: {
    // 下载文件
    handleDownFile (obj) {
      let url = this.$ever.api + '/' + urlMap.report.download.prefix + urlMap.report.download.url + '/' + obj.id
      window.open(url, '_self')
    },
    // 删除文件
    handleRemoveFile (obj) {
      this.$set(obj, 'fileName', '')
    },
    // 上传文件触发入口
    triggerFile (index) {
      document.querySelector('#urlForm' + index).click()
    },
    fileChange (file, obj) {
      this.$set(obj, 'file', file.target.files[0])
      this.$set(obj, 'fileName', file.target.files[0].name)
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    // 需要手动触发list方法 传false表示当页查（保留翻页信息），true表示从第一页查
    list (flag) {
      this.$refs.table.list(flag)
    },
    // 把接口里面的currentVersionCode放到version对象里，为了回显用
    handleResult (res) {
      let arr = res.data.resultList.map(item => {
        item.version = {
          versionCode: item.currentVersionCode || 'master',
        }
        return item
      })
      return arr
    },
    // 列表里面修改版本号，批量修改版本号
    changeVersion (data) {
      let params = {}
      let msg = '更新成功'
      if (data.batchFlag) {
        params = {
          versionCode: data.version.versionCode,
          versionName: data.version.versionName,
        }
        msg = '批量更新成功'
      } else {
        params = {
          reportId: data.version.reportId,
          versionCode: data.version.versionCode,
          versionName: data.version.versionName,
          biUrl: data.version.biUrl
        }
      }
      request(urlMap.report.updateVersion, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', msg)
          this.batchSetVerVisible = false
          this.list()
        }
      })
    },
    // 增加一个version
    addBedForm (index) {
      const urlForm = this.$ever.createObjFromSchema(urlSchema)
      urlForm.version = {
        code: '',
        name: ''
      }
      this.urlFormList.push({
        index: index + 1,
        form: urlForm,
        schema: urlSchema,
        versionRules,
      })
    },
    // 减少versionlist
    minusBedForm (index) {
      // const delItem = this.urlFormList.find(item => item.index === index)
      // if (delItem && delItem.form.id) {
      //   this.deletedIdList.push(delItem.form.id)
      // }
      this.urlFormList = this.urlFormList.filter(item => item.index !== index)
    },
    // 添加报表 第一个版本号为默认（code:master）
    add () {
      this.obj.hisSubModule = []
      this.obj.hisReportName = ''
      this.obj.hisReportCode = ''
      this.obj.reportUseType = 2
      // this.hisSubModuleArr = []
      this.obj.clinic = {}
      delete this.obj.id
      this.urlForm = {
        version: {
          code: 'master',
          name: '标准版'
        },
        biUrl: '',
        file: null,
        fileName: '',
        id: ''
      }
      this.urlFormList.length = 1
      this.urlFormList[0].form.biUrl = ''
      this.urlFormList[0].form.id = ''
      this.urlFormList[0].form.fileName = ''
      this.urlFormList[0].form.file = null
      this.currentTime = new Date().getTime()
      this.dialogVisible = true
    },
    // 修改报表
    edit (row) {
      this.obj.hisSubModule = row.hisSubModule.split(',')
      this.$nextTick(() => {
        this.$refs.formEdit.value.hisSubModule = row.hisSubModule.split(',') // 编辑回显
      })
      this.obj.hisReportName = row.hisReportName
      this.obj.hisReportCode = row.hisReportCode
      this.obj.reportUseType = row.reportUseType
      // this.hisSubModuleArr = row.hisSubModule.split(',')
      // 组建机构的数据对象
      this.obj.clinic = {
        id: (row.clinicId || '').toString(),
        code: (row.clinicId || '').toString(),
        name: row.clinicName || '',
      }
      this.obj.id = row.id
      this.urlFormList = []
      if (row.details.length === 0) {
        let ver = {
          'form': {
            'version': {
              'code': 'master',
              'name': '标准版'
            }
          }
        }
        row.details.push(ver)
      }
      row.details.forEach((item, index) => {
        this.urlFormList.push({
          form: {
            version: {
              code: item.versionCode || 'master',
              name: item.versionName || '标准版'
            },
            biUrl: item.biUrl,
            file: null,
            fileName: item.fileName,
            id: item.id
          },
          schema: urlSchema,
          versionRules,
          index,
        })
      })
      this.currentTime = new Date().getTime()
      this.dialogVisible = true
    },
    // 修改，新增之后post数据方法
    handleEditSet () {
      Promise.all(this.urlFormList.map((item) => {
        return this.$refs['urlForm' + item.index][0].$refs.form.validate()
      })).then(validList => {
        if (validList.every(valid => !!valid)) {
          const params = Object.assign({}, this.obj)
          // 判断报表版本是否有重复的
          const tempObj = {}
          for (let i = 0; i < this.urlFormList.length; i++) {
            const item = this.urlFormList[i]
            if (tempObj[item.form.version.code]) {
              this.$messageTips(this, 'error', '报表有重复版本，请修改。')
              return
            } else {
              tempObj[item.form.version.code] = 1
            }
          }
          // 判断是够有一个标准版
          if (!tempObj['master']) {
            this.$messageTips(this, 'error', '报表版本中必须含有一个标准版')
            return
          }
          params.details = this.urlFormList.map(urlForm => {
            const form = urlForm.form
            return {
              versionCode: form.version.code,
              versionName: form.version.name,
              biUrl: form.biUrl,
              file: form.file,
              fileName: form.fileName,
              id: form.id
            }
          })
          delete params.versions
          this.$refs.formEdit.$refs.form.validate(valid => {
            if (valid) {
              let url = this.$ever.api + '/' + urlMap.report.modify.prefix + urlMap.report.create.url
              let msg = '新增报表成功'
              if (this.obj.id) {
                url = this.$ever.api + '/' + urlMap.report.modify.prefix + urlMap.report.modify.url
                msg = '更新成功'
              } else {
                params.currentVersionCode = params.details[0].versionCode
                params.currentVersionName = params.details[0].versionName
                params.hisReportUrl = params.details[0].biUrl
              }
              params.clinicId = this.obj.clinic.id
              params.clinicName = this.obj.clinic.name
              delete params.clinic
              params.hisSubModule = this.obj.hisSubModule.join()
              let tmp = this.objectToFormData(params)
              const options = {
                method: 'POST',
                headers: {
                  'x-rid': sessionStorage.getItem('x-rid'),
                  'x-access-token': localStorage.getItem('TOKEN'),
                  'lang': localStorage.getItem('LANG'),
                  'x-tenant-id': localStorage.getItem('TENANTID'),
                  'x-user-ip': localStorage.getItem('x-user-ip'),
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: tmp,
                url: url
              }
              axios(options).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', msg)
                  this.dialogVisible = false
                  this.list(!this.obj.id) // 操作完数据之后查询的时候 需要注意：新增的时候需要从第一页查，修改的时候不需要重第一页查
                } else {
                  this.$messageTips(this, 'error', res.head.errMsg)
                }
              })
            } else {
              return false
            }
          })
        }
      })
    },
    // 查看值对应的集列表
    handleValueDetail (row) {
      this.$router.push({
        name: 'bicatalog',
        query: { code: row.hisReportCode }
      })
    },
    // 删除报表
    async del (row) {
      let rs = await request(urlMap.report.delete, { id: row.id })
      if (rs.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功')
        this.list(false)
      }
    },
    // json 转成 formdata 格式（结合提交的数据结构，只变量了一层，并没有用递归的方式完整遍历）
    objectToFormData (obj, form, namespace) {
      const fd = form || new FormData()
      for (var property in obj) {
        if (obj.hasOwnProperty(property) && obj[property]) {
          if (Array.isArray(obj[property])) {
            obj[property].forEach((item, index) => {
              for (var key in item) {
                if (item[key]) {
                  let a = property + '[' + index + '].' + key
                  fd.append(a, item[key])
                }
              }
            })
          } else {
            fd.append(property, obj[property])
          }
        }
      }
      return fd
    }
  },
  components: {
    setVersion,
    sortreport
  }
}
</script>
<style scoped>
.tit {
  color: #f60;
  text-align: center;
  padding: 0 0 15px;
  margin: 0;
}
.versions {
  border: 1px solid #ccc;
  padding: 15px;
}
.fileName{width: 50px; overflow: hidden;}
.handler{display: inline-block; width: 17px}
</style>
