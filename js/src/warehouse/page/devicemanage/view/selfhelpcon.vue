<template>
  <div>
    <ever-bread-crumb :name="breadCrumbName" path="/warehouse/devicelist" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="bg">
      <h2 class="mainTitle">{{breadCrumbName}}</h2>
      <div class="forms">
        <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :rules="rules">
          <div slot="default"></div>
        </ever-form2>
      </div>
      <div class="btns">
        <el-button class="querybtn" @click="cancel">取消</el-button>
        <el-button type="primary" class="querybtn" @click="saveForm">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/devicemanage/store/selfmachineapi'
import {TERMINAL_TYPE} from '@/util/common'
let options = []
let querySchema = [
  {
    name: 'sn',
    label: '自助机编号',
    span: 12,
    props: {
      placeholder: '请输入自助机编号'
    }
  },
  {
    name: 'name',
    label: '自助机名称',
    span: 12,
    props: {
      placeholder: '请输入自助机名称'
    }
  },
  {
    name: 'drawBloodRoomId',
    label: '抽血室',
    comp: 'ever-select',
    span: 12,
    props: {
      placeholder: '请选择抽血室',
      options: options
    }
  },
  {
    name: 'paperType',
    label: '纸张类型',
    comp: 'radio',
    span: 12,
    props: {
      options: [{name: 'A4', id: 'A4'}, {name: 'A5', id: 'A5'}]
    }
  },
  {
    name: 'screensaverTime',
    label: '屏保时间',
    comp: 'ever-select',
    span: 12,
    props: {
      placeholder: '请选择屏保时间',
      options: [{name: '10s', id: 10}, {name: '20s', id: 20}, {name: '30s', id: 30}, {name: '40s', id: 40}, {name: '50s', id: 50}, {name: '60s', id: 60}]
    }
  },
  {
    name: 'location',
    label: '自助机所在位置',
    comp: 'el-input',
    span: 12,
    props: {
      placeholder: '请输入自助机所在位置',
      type: 'textarea',
      rows: 20,
      minRows: 20,
      maxRows: 20
    }
  },
  {
    name: 'note',
    label: '备注',
    span: 12,
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '请输入备注',
      minRows: 20,
      maxRows: 20
    }
  }
]
export default {
  data () {
    var queryObj = this.$ever.createObjFromSchema(querySchema)
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('必填项'))
      } else if (!/^[\da-z]+$/i.test(value)) {
        callback(new Error('自助机编码只允许字母和数字'))
      } else {
        callback()
      }
    }
    return {
      breadCrumbName: this.$route.params.id ? `编辑${TERMINAL_TYPE[0].name}配置` : `新建${TERMINAL_TYPE[0].name}`,
      api,
      TERMINAL_TYPE,
      querySchema,
      queryObj,
      rules: {
        sn: [
          {required: true, trigger: ['blur', 'change'], type: 'string'},
          {validator: validatePass}
        ],
        name: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'string'}
        ],
        drawBloodRoomId: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'string'}
        ],
        paperType: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'string'}
        ],
        screensaverTime: [
            {required: true, message: '必填项', trigger: ['blur', 'change'], type: 'number'}
        ]
      },
      drawBloodRoomList: []
    }
  },
  computed: {
    currentSn () {
      return this.$route.params.sn
    }
  },
  created () {
    this.getDrawBloodRoomList()
    if (this.currentSn) {
      this.getSelfMachInfo()
      this.$ever.getFieldFromSchema(this.querySchema, 'sn').props.disabled = true
    } else {
      this.$ever.getFieldFromSchema(this.querySchema, 'sn').props.disabled = false
    }
  },
  methods: {
    // 获取所有抽血室列表
    getDrawBloodRoomList () {
      api.getDrawBloodRoomList().then(res => {
        if (res.head.errCode === 0 && res.data && res.data.length > 0) {
          this.drawBloodRoomList = res.data
          this.$ever.getFieldFromSchema(this.querySchema, 'drawBloodRoomId').props.options = res.data
        }
      })
    },
    // 编辑情况下，获取已有的信息并回显
    getSelfMachInfo () {
      let params = {
        selfMachineSn: this.currentSn
      }
      api.getSelfMachInfoBySn(params).then(res => {
        if (res.head.errCode === 0 && res.data) {
          this.queryObj = res.data
        }
      })
    },
    // 保存
    saveForm () {
      this.$refs.form.$refs.form.validate(validate => {
        if (validate) {
          let params = JSON.parse(JSON.stringify(this.queryObj))
          this.drawBloodRoomList.forEach((item, index) => {
            if (item.id === params.drawBloodRoomId) {
              params.drawBloodRoom = item.name
            }
          })
          if (this.currentSn) {   // 编辑
            api.updateSlefmachine(params).then(res => {
              if (res.head.errCode === 0 && res.data) {
                this.$messageTips(this, 'success', '保存成功', '提示')
                this.$router.back()
                this.$store.commit('setDevice', '101')
              }
            })
          } else {                // 新增
            api.createSlefmachine(params).then(res => {
              if (res.head.errCode === 0 && res.data) {
                this.$messageTips(this, 'success', '保存成功', '提示')
                this.$router.back()
                this.$store.commit('setDevice', '101')
              }
            })
          }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.back()
      this.$store.commit('setDevice', '101')
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
.bg {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  .mainTitle {
    text-align: center;
    margin: 20px 0;
  }
  .forms {
    margin-top: 40px;
  }
  .btns {
    margin-left: 120px;
    height: 80px;
    line-height: 80px;
  }
}
</style>
