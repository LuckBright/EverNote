<template>
  <el-dialog
    :title="obj.id ? '编辑随访子任务' : '添加随访子任务'"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="closeEvent"
  >
    <el-col :span="20" class="title">
      <span class="name">随访时间</span>
    </el-col>
    <ever-form2
      class="yellow"
      :schema="schema"
      v-model="obj"
      :api="api"
      :rules="rules"
      :info="true"
      ref="addtask"
      :inline="true"
      label-position="left"
    >
      <!-- <div slot="default"></div> -->
      <!-- <template slot="triggerType">
        <span>
          <sys-type
            code="THC_FOLLOW_UP_TIME"
            v-model="obj.triggerType"
            :disabled="isDisabled"
            :useValue="true"
          ></sys-type>
        </span>
      </template> -->
      <template slot="timeNum">
        <el-input
          style="width:80px;background-color:#fef5be"
          v-model.number="obj.timeNum"
          type="number"
          min="1"
          :disabled="isDisabled"
        ></el-input>
      </template>
      <template slot="timeType">
        <el-select v-model="obj.timeType" :disabled="isDisabled">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </ever-form2>
    <el-col :span="20" class="title">
      <span class="name">随访任务</span>
    </el-col>
    <el-form label-width="10px">
      <el-row v-for="(temp, index) in taskArr" :key="index" :index="index">
        <el-col>
          <span style="display: flex">
            <el-form-item :prop="'taskArr' + index + '.category'">
              <el-select
                v-model="temp.category"
                placeholder="选择分类"
                @change="val => {getByCategory(val, temp.category)}"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'taskArr.' + index + '.materialId'">
              <el-select v-model="temp.materialId" placeholder="选择图文或表单">
                <el-option
                  v-for="item in imgOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :prop="'taskArr.' + index + '.way'">
              <sys-type
                code="THC_CC_FOLLOWUP"
                v-model="temp.way"
                :placeholder="'随访方式'"
                :useValue="true"
              ></sys-type>
            </el-form-item>
            <el-form-item v-if="isCreate">
              <el-button type="text" v-if="index === 0 && !this.id" @click="addrow">
                <i class="iconfont icon-tianjia"></i>
              </el-button>
              <el-button type="text" v-if="index > 0" @click="delrow(index)">
                <i class="iconfont icon-delete"></i>
              </el-button>
            </el-form-item>
          </span>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeEvent">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
let schema = [
  // {
  //   name: 'triggerType',
  //   comp: 'custom'
  // },
  {
    name: 'timeNum',
    comp: 'custom'
  },
  {
    name: 'timeType',
    comp: 'custom'
  }
]
export default {
  props: ['visible', 'id'],
  data () {
    let validateTimeNum = function (rule, value, callback) {
      if (!value) {
        callback(new Error('必填'))
      } else if (value < 1) {
        callback(new Error('区间大于等于1'))
      } else {
        callback()
      }
    }
    const validateValue = (rule, value, callback) => {
      if (!value) {
        callback(new Error('必填'))
      } else {
        callback()
      }
    }
    var obj = this.$ever.createObjFromSchema(schema)
    // obj.triggerType = ''
    obj.timeType = ''
    return {
      obj,
      api,
      schema,
      dialogVisible: false,
      templateId: this.$route.params.id,
      options: [
        {
          value: 5,
          label: '天'
        },
        {
          value: 4,
          label: '周'
        },
        {
          value: 2,
          label: '月'
        }
      ],
      taskArr: [
        {
          category: '',
          materialId: '',
          way: ''
        }
      ],
      categoryOptions: [],
      imgOptions: [],
      maxLength: 10,
      tempCategory: '',
      tempimgId: '',
      isDisabled: false,
      validateTimeNum: validateTimeNum,
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        timeNum: [{ validator: validateTimeNum, trigger: 'blur' }],
        // triggerType: [{ validator: validateValue, trigger: 'blur' }],
        timeType: [{ validator: validateValue, trigger: 'blur' }]
      },
      isCreate: true
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        this.dialogVisible = val
        if (!this.id) {
          this.getAllImageText()
          this.isDisabled = false
          this.taskArr = [
            {
              category: '',
              materialId: '',
              way: ''
            }
          ]
        }
      },
      deep: true
    },
    id: {
      handler: function (val) {
        val && this.getById(val)
      }
    }
  },
  methods: {
    closeEvent () {
      this.$emit('close', false)
    },
    save () {
      this.$refs.addtask.$refs.form.validate(valid => {
        if (valid) {
          this.obj.templateId = this.templateId
          this.obj.tasks = this.taskArr
          // 修改无法编辑的错误
          if (!this.isCreate) {
            this.obj.materialId = this.taskArr[0].materialId
            this.obj.category = this.taskArr[0].category
            this.obj.way = this.taskArr[0].way
          }
          api.createTask(this.obj, this.isCreate).then(rs => {
            if (rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.$emit('update')
            }
          })
        }
      })
    },
    getById (id) {
      api.getTaskDetail({ id: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj = rs.data
          this.obj.id = rs.data.id
          this.taskArr[0].way = rs.data.way
          this.getByCategory(rs.data.category)
          this.getAllImageText()
          this.tempimgId = rs.data.materialId
          this.tempCategory = rs.data.category
          this.isDisabled = true
        }
      })
    },
    addrow () {
      if (this.taskArr.length < this.maxLength) {
        this.taskArr.push({
          category: '',
          materialId: '',
          way: ''
        })
      } else {
        this.$messageTips(this, 'warning', '已达到上限')
      }
    },
    delrow (index) {
      this.taskArr.splice(index, 1)
    },
    getAllImageText () {
      api.getAllImageText().then(rs => {
        if (rs.head.errCode === 0) {
          this.categoryOptions = rs.data
          if (this.id) {
            this.taskArr[0].category = this.tempCategory
          } else {
            // this.$refs.addtask.$refs.form.resetFields() is done but no rendering
            // this.obj.triggerType = ''
            this.obj.timeNum = ''
            this.obj.timeType = ''
          }
        }
      })
    },
    getByCategory (id, val) {
      api.getByCategoryAll({ category: id }).then(rs => {
        if (rs.head.errCode === 0) {
          this.imgOptions = rs.data
          if (this.id) {
            this.taskArr[0].materialId = this.tempimgId
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.yellow {
  /deep/ .el-input__inner {
  background-color: #fef5be
}

}
</style>

