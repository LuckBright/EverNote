<template>
    <!--弹出窗-->
    <el-dialog
      width="720px"
      class="add-new-step"
      :title="title"
      :visible.sync="visible"
    >
      <ever-form2
      class="gray-label-form follow-type-form"
      ref="obj"
      v-model="obj"
      :schema="schema"
      :rules="rules"
      :nosubmit="true"
      label-width="120px"
      append-to-body>
      <template slot="runMethod">
        <el-radio-group v-model="obj.runMethod">
          <el-radio :label="0">随计划启动</el-radio>
          <el-radio :label="1">依赖阶段启动</el-radio>
          <el-radio :label="2">事件触发</el-radio>
          <el-radio :label="3">自定义</el-radio>
        </el-radio-group>
        <el-row>
          <el-col :span="12">
            <div v-if="obj.runMethod === 1">
              距离
              <el-select v-model="obj.dependTaskId" class="mr5">
                <el-option
                  v-for="item in stageList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>阶段后
            </div>
          </el-col>
          <el-col :span="12">
            <el-row v-if="obj.runMethod === 2">
              <el-col :span="6">
                <el-select popper-class="follow-select-down"
                v-model="obj.typeId"
                clearable filterable placeholder="请选择"
                @change="getCategoryList(obj.typeId)">
                  <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="18">
                <el-select
                class="ml10"
                popper-class="follow-select-down"
                v-model="obj.dependTaskId"
                clearable filterable placeholder="请选择">
                  <el-option
                  v-for="item in sysnodeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.mark">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <div v-if="obj.runMethod !== 3">
              <el-input-number class="wid60 mr5"  v-model="obj.dependPeriod.day" :controls="false" :min="0"></el-input-number >天
              <el-input-number class="wid60 mr5"  v-model="obj.dependPeriod.hour" :controls="false" :min="0" :max="24"></el-input-number>时
              <el-input-number class="wid60 mr5" v-model="obj.dependPeriod.minute" :controls="false" :min="0" :max="60"></el-input-number>分
              <span class="ml10">启动</span>
            </div>
          </el-col>
        </el-row>
      </template>
      </ever-form2>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
        size="small"
        type="primary"
        @click="submit">确定</el-button>
      </span>
    </el-dialog>
</template>
<script>
import { debounce1 as debounce } from '@/util/common'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import { validateSpace } from '@/follow/util/fn'

const schema = [
  {
    label: '阶段名称',
    name: 'name',
  },
  {
    label: '启动方式',
    name: 'runMethod',
    comp: 'custom',
  }
]
export default {
  props: ['patternType', 'title', 'templateName'],
  async created () {
  },
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.runMethod = 0
    obj.dependTaskId = ''
    obj.name = ''
    obj.dependPeriod = {
      day: 0,
      hour: 0,
      minute: 0
    }
    obj.typeId = ''
    obj.id = ''
    return {
      schema,
      obj,
      visible: false,
      submitLoading: false,
      templateId: this.$route.params.id,
      stageList: [],
      typeList: [],
      sysnodeObj: {},
      sysnodeList: [],
      rules: {
        name: [
          { required: true, message: '请填写阶段名称', trigger: 'blur', validator: validateSpace },
          { min: 2, max: 120, message: '请输入2-15个字符', trigger: 'change' },
        ],
      },
    }
  },
  watch: {
    'visible' (val) {
      if (val) {
        this.title = this.title
      } else {
        this.obj.runMethod = 2
        this.close()
      }
    },
    'obj.runMethod': {
      handler (val) {
        if (val === 1) {
          this.getStage()
        } else if (val === 2) {
          this.getTypelist()
        }
      },
      deep: true
    },
    'obj.typeId': {
      handler (val) {
        val && this.getCategoryList(val)
      },
      deep: true
    }
  },
  methods: {
    open (val) {
      this.visible = true
      if (val) {
        this.obj.id = val.id
        this.getById(val.id)
      } else {
        this.resetForm()
      }
    },
    close () {
      this.visible = false
    },
    resetForm () {
      this.obj.runMethod = 0
      this.obj.id = ''
      this.obj.name = ''
      this.obj.dependPeriod.day = ''
      this.obj.dependPeriod.hour = 0
      this.obj.dependPeriod.minute = 0
      this.obj.dependTaskId = ''
      this.stageList = []
    },
    getById (id) {
      request(urlMap.follow.scheduledtask.getById, {id: id}, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.runMethod = rs.data.runMethod
          this.obj.name = rs.data.name
          this.obj.dependPeriod = rs.data.dependPeriodJson ? JSON.parse(rs.data.dependPeriodJson) : this.obj.dependPeriod
          this.obj.typeId = rs.data.sysEvent.categoryId
          this.$nextTick(_ => {
            this.obj.dependTaskId = rs.data.dependTaskId
          })
        }
      })
    },
    submit: debounce(function () {
      this.$refs.obj.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        let tempObj = {
          businessTemplateId: this.templateId,
          businessTemplateName: this.templateName
        }
        Object.assign(this.obj, tempObj)
        this.obj.id ? this.obj.id : delete this.obj.id
        request(urlMap.follow.scheduledtask[this.obj.id ? 'modify' : 'create'], this.obj).then(rs => {
          if (rs.head.errCode === 0) {
            this.close()
            this.$emit('update')
          }
        })
      })
    }),
    getStage () {
      // 阶段
      request(urlMap.follow.scheduledtask.getByParentId, {
        businessTemplateId: this.templateId,
        parentId: this.obj.parentId,
        templateId: this.obj.id ? this.obj.id : null
      }, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.stageList = rs.data
        }
      })
    },
    getTypelist () {
      request(urlMap.follow.sysEvent.searchEnableCategory, {}, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.typeList = rs.data
        }
      })
    },
    getCategoryList (val) {
      request(urlMap.follow.sysEvent.getEnableByCategoryId, {
        categoryId: val
      }, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.sysnodeList = rs.data
        }
      })
    }
  }
}

</script>
<style scoped>
.add-new-step /deep/ .el-dialog__body{padding: 0px;}
.follow-type-form{padding: 8px 10px;}
.wid60{width: 60px !important;}
</style>

