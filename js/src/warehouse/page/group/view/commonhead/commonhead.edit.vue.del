<template>
  <div id="wh_commonhead_edit">
    <ever-bread-crumb :name="'返回'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>

    <el-row class="query" v-if="!$route.query.code">
      适用模块：
      <el-select v-model="templetCode" placeholder="选择模版">
        <el-option
          v-for="item in templetCodeArr"
          :label="item.name"
          :value="item.code"
          :key="item.code"
        ></el-option>
      </el-select>
    </el-row>
    <div class="checkbox">
      <el-checkbox-group v-model="checkList">
        <div class="item" v-for="(item,index) in template" :key="index">
          <div class="title">{{index}}.{{title[index] || '新增信息'}}</div>
          <el-checkbox v-for="li in item" :label="li.paramValue" :key="li.id"></el-checkbox>
        </div>
      </el-checkbox-group>
      <el-row v-if="templetCode">
        <el-col :span="4">
          <el-button @click="updata" v-if="templateId" type="primary">保存</el-button>
          <el-button @click="add" v-else type="primary">新建</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/common.head'
import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  props: [],
  data () {
    return {
      api,
      templateId: '',
      templetCode: '',
      templetCodeArr: [],
      tableData: [],
      template: {},
      checkList: [],
      title: [
        '',
        '患者基本信息',
        '医保信息',
        '在院信息',
        '体征信息',
        '健康状况',
        '费用信息'
      ],
      useful: []
    }
  },
  async mounted () {
    if (this.$route.query.id) {
      // 编辑
      this.templetCode = this.$route.query.code
      this.templetName = this.$route.query.name
      this.templateId = this.$route.query.id
      this.getCheckBox()
    } else {
      // 添加
      this.addInit()
    }
  },
  watch: {
    templetCode: {
      handler (val) {
        this.templetCodeArr.forEach(v => {
          if (v.code === val) this.templetName = v.name
        })
        if (!this.copyTemplate) {
          // 防止反复获取
          this.getCheckBox('add')
        } else {
          // 清空已选项
          this.checkList = []
        }
      }
    }
  },
  methods: {
    async addInit () {
      const arrs = await sysvalue.listOnce('THC_PATIENT_HEADER')
      const allArr = arrs // 获取所有模板
      const hadArr = await api.getAllTemplate() // 获取所有已新建的模板
      const hadCodes = []
      hadArr.data.forEach(item => {
        hadCodes.push(item.code)
      })
      allArr.forEach(item => {
        if (!hadCodes.includes(item.code)) {
          // 排除已有模板
          this.templetCodeArr.push(item)
        }
      })
      if (this.templetCodeArr.length > 0) {
        // 初发获取所有checkbox
        this.templetCode = this.templetCodeArr[0].code
        this.templetName = this.templetCodeArr[0].name
      }
    },
    back () {
      this.$router.go(-1)
    },
    async getCheckBox (type) {
      // 获取模版
      this.checkList = []
      this.useful = []
      this.template = {}
      let res
      if (type === 'add') {
        res = await api.getBox()
      } else {
        res = await this.api.getCheckBox(this.templateId)
      }
      const template = {}
      if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          if (template[item.sourceType]) {
            template[item.sourceType].push(item)
          } else {
            template[item.sourceType] = []
            template[item.sourceType].push(item)
          }
        })
      } else {
        return
      }
      this.template = template
      let arr = JSON.parse(JSON.stringify(this.template))
      this.copyTemplate = JSON.parse(JSON.stringify(this.template))
      for (let item in arr) {
        arr[item].forEach(val => {
          this.useful.push(val)
          if (val.isActive) {
            this.checkList.push(val.paramValue)
          }
        })
      }
    },
    async add () {
      const ids = []
      this.useful.forEach(val => {
        if (this.checkList.includes(val.paramValue) && !ids.includes(val.id)) {
          ids.push(val.id)
        }
      })
      let res = await this.api.addTemplate({
        code: this.templetCode,
        name: this.templetName,
        pageHeadConfigIds: ids
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '新建成功',
          type: 'success'
        })
        this.$router.go(-1)
      }
    },
    async updata () {
      const ids = []
      this.useful.forEach(val => {
        if (this.checkList.includes(val.paramValue) && !ids.includes(val.id)) {
          ids.push(val.id)
        }
      })
      let res = await this.api.updateTemplet({
        id: this.templateId,
        pageHeadConfigIds: ids
      })
      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success'
        })
        this.$router.go(-1)
      }
    }
  },
  computed: {}
}
</script>
<style lang='scss'>
#wh_commonhead_edit {
  &.flex_column_full_hidden {
    overflow-y: auto;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 15px;
  }
  .btn {
    margin-bottom: 10px;
    i {
      cursor: pointer;
    }
  }
  .query {
    background: #fff;
    line-height: 60px;
    padding: 0px 0 0 15px;
  }
  .checkbox {
    background: #fff;
    padding: 10px 15px 30px 15px;
    .item {
      line-height: 45px;
      .title {
        line-height: 40px;
        color: #000;
        font-size: 14px;
      }
    }
  }
}
</style>

