<template>
  <div class="page-wrap">
    <div class="layout_inner">
      <el-divider content-position="left">在线问诊常见疾病</el-divider>
      <div class="page-container">
        <div class="item">患者端是否展示常见疾病：<el-switch
          v-model="show">
        </el-switch>
          {{show ? '展示' : '不展示'}}
        </div>
        <div class="item">设置后，患者可快速查找全部擅长此疾病的医生。</div>
        <div class="item">设置常见疾病：<el-select v-model="list"
                                            placeholder="请选择疾病标签，最多10个"
                                            multiple
                                            class="w400"
                                            filterable
                                            clearable
                                            value-key="code"
                                            @change="changeDisease"
        >
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select></div>
        <div class="item">
          <el-button @click="save" type="primary">保存</el-button>
        </div>
      </div>
    </div>
    <div class="layout_inner">
      <el-divider content-position="left">在线咨询常见疾病</el-divider>
      <div class="page-container">
        <div class="item">患者端是否展示常见疾病：<el-switch
          v-model="show2">
        </el-switch>
          {{show2 ? '展示' : '不展示'}}
        </div>
        <div class="item">设置后，患者可快速查找全部擅长此疾病的医生。</div>
        <div class="item">设置常见疾病：<el-select v-model="list2"
                                            placeholder="请选择疾病标签，最多10个"
                                            multiple
                                            class="w400"
                                            filterable
                                            clearable
                                            value-key="code"
                                            @change="changeDisease2"
        >
          <el-option
            v-for="item in options"
            :key="item.code"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select></div>
        <div class="item">
          <el-button @click="save2" type="primary">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      show2: false,
      options: [],
      list: [],
      list2: [],
    }
  },
  created () {
    // 获取所有常见疾病
    this.$post(`v1.0/valueSet/getValueListBySetCode`, { setCode: ['THC_STAFF_INFOTEXT'] }).then(res => {
      if (res.errCode === 0) {
        this.options = res.data.resultList
      }
    })
    // 查询已设置的常见疾病
    this.$post('config/getSickConfig', {}).then(res => {
      if (res.head.errCode === 0) {
        this.show = res.data.show
        if (res.data.tags) {
          this.list = res.data.tags
        } else {
          this.list = []
        }
      }
    })
    this.$post('config/getConsultSickConfig', {}).then(res => {
      if (res.head.errCode === 0) {
        this.show2 = res.data.show
        if (res.data.tags) {
          this.list2 = res.data.tags
        } else {
          this.list2 = []
        }
      }
    })
  },
  methods: {
    changeDisease (val) {
      if (val.length) {
        if (val.length > 10) {
          this.list = val.slice(val.length - 10)
        }
      }
    },
    save () {
      this.$post(`config/createOrUpdateSickConfig`, {
        show: this.show,
        tags: this.list.map(item => ({ code: item.code, name: item.name })),
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    changeDisease2 (val) {
      if (val.length) {
        if (val.length > 10) {
          this.list2 = val.slice(val.length - 10)
        }
      }
    },
    save2 () {
      this.$post(`config/createOrUpdateConsultSickConfig`, {
        show: this.show2,
        tags: this.list2.map(item => ({ code: item.code, name: item.name })),
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .w400 {
    width: 400px;
  }
  .page-wrap {
    height: 100%;
    /*background-color: #fff;*/
    .page-container {
      padding: 20px;
      .item {
        line-height: 40px;
      }
    }
  }
</style>
