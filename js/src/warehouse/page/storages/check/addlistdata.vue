<template>
  <div>
    <el-row v-for="(item, index) in formData" :key="index" style="margin-top: 15px">
      <el-col class="textCol">
        <i>*</i>生产批号
      </el-col>
      <el-col class="typeSelect">
        <ever-select
          v-model="item.batchNum"
          customValue="batchNum"
          :options="item.options"
          @change="hanldSelect"
          placeholder="生产批号"
          :index="index">
        </ever-select>
      </el-col>
      <el-col class="textCol">
        <i>*</i>生产日期
      </el-col>
      <el-col class="typeSelect">
        <el-input readonly v-model="item.enableDate"></el-input>
      </el-col>
      <el-col class="textCol">
        <i>*</i>到期日期
      </el-col>
      <el-col class="typeSelect">
        <el-input readonly v-model="item.disableDate"></el-input>
      </el-col>
      <el-col class="textCol">
        <i>*</i>实物数量
      </el-col>
      <el-col class="typeSelect" style="width: 100px">
        <el-input v-model="item.num" type="number" @blur="handleBlur($event, item)" min="0"></el-input>
      </el-col>
      <el-col :span="4">
        <i class="iconfont icon-delete" v-if="formData.length > 1" @click="deleteThisData(index)"></i>
        <i class="iconfont icon-tianjia" v-if="index === formData.length - 1 && formData.length !== dataList.length" @click="addThisData(item)"></i>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {FLOAT_REG, PARSE_REG, CHINESE_MEDICINE_TYPE, DRUGTYPE} from '@/util/common'
export default {
  props: ['dataList', 'classifyId'],
  data () {
    return {
      formData: []
    }
  },
  created () {
    this._pushData()
  },
  methods: {
    _pushData (falg) {
      let newData = {}
      newData.options = [...this.dataList]
      this.formData.forEach(is => {
        newData.options.forEach((item, index) => {
          if (is.id === item.id) {
            newData.options.splice(index, 1)
          }
        })
      })
      if (!falg) {
        Object.assign(newData, this.dataList[0])
        newData.options.splice(0, 1)
      } else {
        newData = Object.assign({}, newData, newData.options[0])
      }
      this.formData.push(newData)
      this._findListData()
    },
    _findListData () {
      this.formData.forEach((item, index) => {
        item.options = this.dataList.slice(0)
        this.formData.forEach((ite, m) => {
          const dI = item.options.findIndex(opt => {
            return opt.id === ite.id
          })
          if (item.id !== ite.id) item.options.splice(dI, 1)
        })
      })
    },
    hanldSelect (v, i) {
      if (i === undefined) return
      this.dataList.forEach(item => {
        if (item.batchNum === v) {
          let index = this.formData.findIndex(is => {
            return is.batchNum === v
          })
          Object.assign(this.formData[index], item)
          if (index > -1) {
            this.formData[index].createTime = item.createTime
            this.formData[index].validityDate = item.validityDate
          }
        }
      })
      this._findListData()
    },
    deleteThisData (index) {
      this.formData.forEach(item => {
        item.options.push(this.dataList[index])
      })
      this.formData.splice(index, 1)
      this._findListData()
    },
    addThisData (data) {
      if (data.batchNum && data.num !== '') {
        if (this.formData.length !== this.dataList.length) {
          this._pushData(true)
        } else {
          this.$messageTips(this, 'error', '当前物资批号已经被选择完')
        }
      } else {
        this.$messageTips(this, 'error', '当前批号或实物数量为空')
      }
    },
    handleBlur (e, data) {
      if (data.materialType === DRUGTYPE) {
        if (CHINESE_MEDICINE_TYPE.includes(this.classifyId)) {
          if (!FLOAT_REG.test(e.target.value)) {
            this.$messageTips(this, 'error', '请输入不小于0的值')
            e.target.value = ''
          }
        } else {
          if (!PARSE_REG.test(e.target.value)) {
            this.$messageTips(this, 'error', '请输入正整数')
            e.target.value = ''
          }
        }
      }
    }
  },
  watch: {
    'formData': {
      handler (v) {
        this.$emit('dataUpdate', v)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  .textCol {
    width: 80px;
    height: 36px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #2A2A2A;
    line-height: 36px;
    text-align: center;
    i{
      color: #ff0000;
      font-style: normal;
    }
  }
  .typeSelect {
    width: 206px;
    height: 32px;
    margin-right: 10px;
    i{
      color: #ff0000;
      font-style: normal;
    }
  }
  .dueDate {
    height: 35px;
    line-height: 35px;
    ont-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
  }
  .iconfont{
    color: #999;
    margin-top: 7px;
    font-size: 16px;
    display: inline-block;
  }
</style>
