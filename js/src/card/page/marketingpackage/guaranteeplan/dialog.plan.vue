<template>
  <el-dialog
    title="任务设置"
    width="1000px"
    :visible.sync="dialogVisible"
    class="ui_dialog_02"
    :close-on-click-modal="false"
    left
  >
    <div v-loading="loading">
      <div slot="title" class="">
        <el-tabs v-model="category" @tab-click="handleClick(true)">
          <el-tab-pane label="通知" name="1"></el-tab-pane>
          <el-tab-pane v-if="$route.query.activeName !== 3 && $route.query.categoryId !== '06'" label="医嘱" name="2"></el-tab-pane>
          <el-tab-pane label="患教内容" name="3"></el-tab-pane>
        </el-tabs>
      </div>
      <ever-form2
        :schema="schema"
        v-model="obj"
        :span="24"
        :api="api"
        :rules="rules"
        ref="planform"
      >
        <div slot="default"></div>
        <template slot="executeMethod">
          <el-radio
            v-model="obj.executeMethod"
            v-show="category !== '3'"
            :label="1"
            >短信</el-radio
          >
          <el-radio v-model="obj.executeMethod" :label="2">微信</el-radio>
        </template>
        <template slot="executeJson">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4 }"
            :maxlength="120"
            :minlength="2"
            placeholder="请输入内容"
            v-model="obj.executeJson"
          >
          </el-input>
          <div></div>
        </template>
        <template slot="executeExtendJson">
          <div class="dept">
            <ever-subject-select
              v-model="dept"
              placeholder="请选择科室"
              type="select"
              :props="{ clearable: true, size: 'small' }"
              clearable
              filterable
              @change="tplQueryList"
            ></ever-subject-select>
          </div>
          <div>
            <el-tag
              v-show="selectedObj.id"
              class="mr"
              closable
              @click="getInfo({ row: selectedObj }, $event)"
              @close="close()"
              >{{ selectedObj.templateName }}</el-tag
            >
          </div>
          <ever-table
            v-if="dept"
            ref="table"
            :columns="tempCol"
            :url="urls.tpl"
            :params.sync="tplParams"
            :row-class-name="rowClass"
            @row-click="rowClick"
            :el-table-attr="{ highlightCurrentRow: true }"
          >
            <template slot="doctorAdvice">
              <el-table-column label="医嘱项目">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click.native="getInfo(scope, $event)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </template>
          </ever-table>
          <el-dialog
            title="详情"
            append-to-body
            :visible.sync="visible"
            width="50%"
          >
            <ever-table :columns="tableCol" :data="tableData">
              <template slot="content">
                <el-table-column label="内容">
                  <template slot-scope="scope">
                    {{ formatContent(scope) }}
                  </template>
                </el-table-column>
              </template>
            </ever-table>
          </el-dialog>
        </template>
        <template slot="type">
          <el-radio v-model="radio" label="1">短视频</el-radio>
          <div>
            <el-tag
              class="mr"
              @click="openVideo"
              closable
              @close="close()"
              v-if="selectedObj.id"
              >{{ selectedObj.mark }}</el-tag
            >
          </div>
        </template>
        <template slot="content">
          <el-input
            v-model="params.keyword"
            placeholder="请输入视频描述/文章标题搜索"
            clearable
          ></el-input>
          <ever-table
            ref="table"
            :columns="columns"
            :url="url"
            :params.sync="params"
            :row-class-name="rowClass"
            request="requestIh"
            @row-click="rowClick"
            :el-table-attr="{ highlightCurrentRow: true }"
          >
          </ever-table>
        </template>

        <template slot="plantype">
          <div>
            <el-checkbox v-model="obj.isLoop" :checked="false"
              >周期内循环执行</el-checkbox
            >
            <div class="inline" v-show="obj.isLoop">
              任务周期<el-input class="wid40" v-model="obj.periodDay"></el-input
              >天 每隔<el-input
                class="wid40"
                v-model="obj.periodFrequency.day"
              ></el-input
              >天
              <el-input
                class="wid40"
                v-model="obj.periodFrequency.hour"
              ></el-input
              >时
              <el-input
                class="wid40"
                v-model="obj.periodFrequency.minute"
              ></el-input
              >分 启动
            </div>
          </div>
        </template>
      </ever-form2>
      <div slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="24" align="right">
            <el-button
              type="primary"
              @click="save"
              :disabled="btnDisabled && category === '2'"
              >确定</el-button
            >
            <el-button type="" @click="dialogVisible = false">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import api from '@/card/store/guaranteeplan/api.js'
import urls from '@/card/urls'
import req from '@/util/req'
const request = req.request
let schema = [
  {
    name: 'name',
    label: '子任务名称'
  },
  {
    name: 'executeMethod',
    label: '发送通道',
    comp: 'custom'
  },
  {
    name: 'executeJson',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
]
let schema2 = [
  {
    name: 'name',
    label: '子任务名称'
  },
  {
    label: '医嘱内容',
    name: 'executeExtendJson',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
]
let schema3 = [
  {
    name: 'name',
    label: '子任务名称'
  },
  {
    name: 'type',
    label: '内容类型',
    comp: 'custom'
  },
  {
    name: 'content',
    label: '内容正文',
    comp: 'custom'
  },
  {
    name: 'executeMethod',
    label: '发送通道',
    comp: 'custom'
  },
  {
    name: 'executeJson',
    comp: 'custom'
  },
  {
    name: 'plantype',
    label: '任务执行',
    comp: 'custom'
  },
]
export default {
  props: {
    packageId: {
      type: String,
      default: ''
    },
    packageName: {
      type: String,
      default: ''
    },
    detailId: {
      type: String,
      default: ''
    },
    parentId: {
      type: String,
      default: ''
    }
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.executeMethod = null
    obj.executeJson = ''
    obj.periodDay = ''
    obj.isLoop = false
    obj.periodFrequency = {
      day: 0,
      hour: 0,
      minute: 0
    }
    return {
      loading: false,
      btnDisabled: true,
      hadId: [],
      tplParams: {
        offset: 0,
        pagesize: 1000,
        templateType: 2,
        sceneType: 1,
        providerId: '',
        templateSource: 1
      },
      selectedObj: {},
      tagList: [],
      tagIdMap: {},
      urls,
      url: urls.videoList,
      params: { keyword: '', status: 1 },
      columns: [
        {
          prop: 'mark',
          label: '标题',
          showOverflowTooltip: true,
        },
        {
          prop: 'uploaderName',
          label: '发布医生',
        },
      ],
      tableData: [],
      tableCol: [
        {
          prop: 'serviceName',
          label: '名称',
          showOverflowTooltip: true,
        },
        {
          slotName: 'content'
        }
      ],
      tempCol: [
        {
          prop: 'templateName',
          label: '模板名称',
          showOverflowTooltip: true,
        },
        {
          slotName: 'doctorAdvice'
        }
      ],
      dept: '',
      category: '1',
      visible: false,
      radio: '1',
      text: '',
      api,
      obj,
      schema: [],
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        executeMethod: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        executeJson: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getHadId()
  },
  computed: {},
  methods: {
    openVideo () {
      window.open(this.selectedObj.url)
    },
    formatContent (a) {
      const data = a.row
      return data.count + data.countUnitName
    },
    async getHadId () {
      let params = { id: this.packageId, isGroup: 0 }
      if (this.$route.meta.type === 'plan') {
        params.orderId = this.$route.query.orderId
      }
      const res = await req.get(urls.hadId, params)
      if (res && res.data && Array.isArray(res.data.setMealCatalogs)) {
        res.data.setMealCatalogs.map(item => {
          if (Array.isArray(item.setMealDetails) && item.setMealDetails.length > 0) {
            item.setMealDetails.map(item => {
              this.hadId.push(item.serviceId)
            })
          }
        })
      }
    },
    async getInfo (item, event) {
      this.tableData = []
      event && event.stopPropagation()
      const id = item.row.id
      const res = await request(urls.info, { id })
      if (event) {
        this.visible = true
      }
      const arr = JSON.parse(res.data.content)
      arr.map(item => {
        item.adviceFeesDtoList.map(a => {
          this.tableData.push(a)
        })
      })
      if (!event) {
        const flag = this.isHaveServiceId(res.data.content)
        if (!flag) {
          this.$messageTips(this, 'warning', '处方模版包含医嘱项，保障计划套餐不包含不能使用')
        } else {
          this.selectedObj = res.data
        }
      }
    },
    isHaveServiceId (str) {
      const keyValArr = str.match(/"serviceId":([^,]*)/g)
      for (let i = 0; i < keyValArr.length; i++) {
        const id = keyValArr[i].replace(/"serviceId":"([^"]*)"/, '$1')
        if (!this.hadId.includes(id)) {
          return false
        }
      }
      return true
    },
    rowClick (item) {
      if (this.category === '2') {
        if (this.hadId.length === 0) {
          this.$messageTips(this, 'warning', '处方模版包含医嘱项，保障计划套餐不包含不能使用')
          return
        }
        this.getInfo(item)
        return
      }
      this.selectedObj = item.row
    },
    close (data) {
      this.selectedObj = {}
    },
    rowClass () {
      return 'pointer'
    },
    tplQueryList () {
      this.tplParams.providerId = this.dept ? this.dept.id : ''
    },
    async beforeLeave () {
      if (this.checked) { // 说明查过了
        if (this.btnDisabled) {
          this.$messageTips(this, 'warning', '请先设置保障计划套餐基本信息中医嘱任务执行机构、科室、医生')
        }
        return
      }
      const res = await req.get(urls.checkById, { id: this.packageId })
      if (res.data) {
        this.btnDisabled = !res.data
      } else {
        this.$messageTips(this, 'warning', '请先设置保障计划套餐基本信息中医嘱任务执行机构、科室、医生')
      }
      this.checked = true
    },
    async handleClick (flag) {
      if (flag) {
        this.selectedObj = {}
        this.obj.name = ''
        this.obj.executeJson = ''
        this.obj.periodFrequency = {
          day: 0,
          hour: 0,
          minute: 0
        }
        this.obj.isLoop = false
        if (this.category === this.oldCategory) {
          this.obj.name = this.oldName
          this.obj.executeJson = this.oldExecuteJson
          this.obj.isLoop = this.oldLoop
          this.obj.periodFrequency = this.oldperiodFrequency
        }
      }
      if (this.category === '2') {
        this.beforeLeave()
        this.schema = schema2
      } else if (this.category === '3') {
        this.schema = schema3
        this.obj.executeMethod = 2
      } else {
        this.schema = schema
      }
    },
    open () {
      this.$nextTick(_ => {
        this.resetForm()
        if (this.detailId) {
          this.loading = true
          this.getById()
        } else {
          Reflect.ownKeys(this.obj).map(item => {
            if (!['id', 'name', 'executeMethod', 'executeJson', 'periodDay', 'periodFrequency', 'isLoop'].includes(item)) {
              delete this.obj[item]
            }
          })
        }
        this.dialogVisible = true
      })
    },
    resetForm () {
      this.oldCategory = ''
      this.oldName = ''
      this.oldExecuteJson = ''
      this.checked = false
      this.obj.id = ''
      this.obj.name = ''
      this.obj.executeMethod = null
      this.obj.executeJson = ''
      this.obj.periodDay = ''
      this.obj.isLoop = false
      this.dept = ''
      this.text = ''
      this.category = '1'
      this.tagList = []
      this.tagIdMap = {}
      this.selectedObj = {}
      this.handleClick(true)
      this.obj.periodFrequency = {
        day: 0,
        hour: 0,
        minute: 0
      }
    },
    save () {
      this.obj.businessTemplateId = this.packageId
      this.obj.businessTemplateName = this.packageName
      this.obj.parentId = this.parentId
      this.obj.category = this.category
      this.obj.executeExtendJson = JSON.stringify(this.selectedObj)
      if (this.category === '3') {
        this.obj.contentType = 1
      } else {
        this.obj.contentType = 0
      }
      if (this.obj.isLoop && this.obj.periodDay && Reflect.ownKeys(this.obj.periodFrequency).some(item => {
        return this.obj.periodFrequency[item] !== 0
      })) {
        this.$refs.planform.$refs.form.validate(valid => {
          if (valid) {
            this.getTaskList()
          }
        })
      } else if (!this.obj.isLoop) {
        this.$refs.planform.$refs.form.validate(valid => {
          if (valid) {
            this.getTaskList()
          }
        })
      } else {
        this.$messageTips(this, 'warning', '请输入正确的时间')
        return
      }
    },
    getTaskList() {
      if (this.$route.meta.type === 'plan' && this.$route.query.instanceId) {
        this.obj.businessInstanceId = this.$route.query.instanceId
        if (this.detailId) {
          api.instanceModify(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$parent.getDetails()
              this.dialogVisible = false
            }
          })
        } else {
          api.instanceCreate(this.obj).then(rs => {
            if (rs.head.errCode === 0) {
              this.$parent.getDetails()
              this.dialogVisible = false
            }
          })
        }
      } else {
        api.createOrModify(this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.$parent.getDetails()
            this.dialogVisible = false
          }
        })
      }
    },
    initData(rs) {
      if (rs.head.errCode === 0) {
        this.obj = { ...rs.data }
        this.oldCategory = this.obj.category + ''
        this.oldName = this.obj.name
        this.oldExecuteJson = this.obj.executeJson
        this.oldLoop = this.obj.isLoop
        this.oldperiodFrequency = this.obj.periodFrequency == null ? { day: 0, hour: 0, minute: 0 } : this.obj.periodFrequency
        this.category = this.obj.category + ''
        this.obj.periodFrequency = rs.data.periodFrequency || {}
        if (rs.data.executeExtendJson) {
          this.selectedObj = JSON.parse(rs.data.executeExtendJson)
        }
        this.handleClick(false)
      }
      this.loading = false
    },
    getById () {
      if (this.$route.path.indexOf('ordermarketingplanedit') >= 0) {
        api.getInstance({
          id: this.detailId
        }).then(rs => {
          this.initData(rs)
        })
      } else {
        api.getById({
          id: this.detailId
        }).then(rs => {
          this.initData(rs)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wid40 {
  width: 60px;
}
.dept {
  display: inline-block;
  width: 200px;
}
.pointer {
  cursor: pointer;
}
.mr {
  margin: 5px;
  cursor: pointer;
}
.inline {
  display: inline-block;
}
</style>
