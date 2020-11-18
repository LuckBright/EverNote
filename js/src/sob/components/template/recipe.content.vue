<template>
  <div class="advice_template_list" id="recipe" v-if="value">
    <el-row class="top_wrap">
      <el-col :span="24" class="title">
        <el-checkbox label="" v-model="allSelect" @change="allSelectChange" style="margin-right:5px;"></el-checkbox>
        <label>处方信息</label>
        <el-button
          type="primary"
          size="small"
          @click="quoteHandle"
          style="margin-left: 5px;"
        >引用</el-button>
      </el-col>
    </el-row>
    <div class="list_wrap">
      <el-checkbox-group class="list_box" v-model="selectRecipe" @change="selectChange">
        <div class="recipebox" v-for="(orders, i) in dataList" :key="i">
          <div class="recipeLeft">
            <el-checkbox :label="orders"></el-checkbox>
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="orders.serviceType" style="font-size:14px;"></sys-value>
          </div>
          <div class="recipeRight">
            <el-row :class="{mb5: j < orders.list.length - 1}" v-for="(order, j) in orders.list" :key="j" :gutter="10">
              <el-col :span="11" style="font-weight:bold;">
                <template v-if="['303', '304'].includes(order.serviceType)">
                  <el-row class="drug-name">
                    <span class="labWrap" v-for="(drug, d) in order.adviceFeesDtoList" :key="d">
                      <label class="bold">{{drug.serviceName}}</label>
                      <label style="top:-6px" class="lab" v-if="drug.footnote">
                        (<sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drug.footnote"></sys-value>)
                      </label>
                      <label style="bottom:-6px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
                    </span>
                  </el-row>
                </template>
                <el-row v-else class="name">
                  <el-col :span="24">
                    <span>{{adviceCon(orders.list.length, j)}}</span>
                    <drug-info v-if="['301', '302'].includes(order.serviceType)" :drug-obj="order"></drug-info>
                    <span v-else>{{order.serviceName}}</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="13">
                <el-row class="conent" v-if="order.serviceType === '800'">
                  <el-col
                    :span="12"
                    v-if="order.position && order.positionValueSetCode"
                  >检查部位：
                    <sys-value
                      :type="order.positionValueSetCode"
                      :code="order.position"
                    ></sys-value>
                  </el-col>
                  <el-col
                    :span="12"
                    v-if="order.illHis"
                  >病史摘要：{{order.illHis}}</el-col>
                  <el-col
                    :span="12"
                    v-if="order.examineTarget"
                  >临床检查：{{order.examineTarget}}</el-col>
                  <el-col
                    :span="12"
                    v-if="order.assistExamine"
                  >辅助检查：{{order.assistExamine}}</el-col>
                  <el-col
                    :span="12"
                    v-if="order.otherExamine"
                  >检查结果：{{order.otherExamine}}</el-col>
                </el-row>
                <el-row class="conent" v-if="order.serviceType === '801'">
                  <el-col :span="12" v-if="order.specimenType">标本类型：
                    <sys-value
                      type="THC_SOB_SPECIMEN_TYPE"
                      v-if="order.specimenType"
                      :code="order.specimenType"
                    ></sys-value>
                  </el-col>
                </el-row>
                <el-row class="conent" v-if="order.serviceType === '2125'">
                  <el-col :span="24" v-if="order.doctorItem && order.doctorItem.length">
                    手术医生：
                    <label
                      v-for="(doctor, d) in order.doctorItem"
                      :key="d"
                    >{{doctor.doctorName || doctor.name}}</label>
                  </el-col>
                  <el-col :span="24" v-if="order.assistantItem && order.assistantItem.length">
                    助理医生：
                    <label
                      v-for="(doctor, d) in order.assistantItem"
                      :key="d"
                    >{{doctor.doctorName || doctor.name}}</label>
                  </el-col>
                  <el-col
                    :span="24"
                    v-if="order.surgeryFreq"
                  >手术名称：{{order.surgeryFreq.name}}</el-col>
                  <el-col
                    :span="24"
                    v-if="order.position"
                  >手术部位：{{order.position.name}}</el-col>
                  <el-col :span="24" v-if="order.anaesthesiaId">麻醉方式：
                    <sys-value type="CV06.00.103" :code="order.anaesthesiaId"></sys-value>
                  </el-col>
                </el-row>
                <el-row class="conent" v-if="['301', '302', '303', '304'].includes(order.serviceType)">
                  <el-col :span="24">{{order.doctorAdviceContent}}</el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import drugInfo from '@/inpatient/components/drug.info'
export default {
  props: ['value'],
  data () {
    return {
      storage,
      dataList: [],
      selectRecipe: [],
      allSelect: true
    }
  },
  watch: {
    'value' (val) {
      this.selectRecipe = []
      if (!val) {
        return false
      }
      this.dataList = this.getList(val)
      this.selectAll()
    }
  },
  // mounted () {
  //   this.selectAll()
  // },
  methods: {
    getList (list) {
      let data = JSON.parse(JSON.stringify(list))
      let newList = []
      let mainGroupObj = {}
      data.forEach(item => {
        Object.assign(item, item.adviceJson)
        delete item.adviceJson
        delete item.extendFieldJson
        if (!mainGroupObj[item.mainGroupId]) {
          mainGroupObj[item.mainGroupId] = {}
          mainGroupObj[item.mainGroupId].sort = item.serialNumber // 排序
          mainGroupObj[item.mainGroupId].serviceType = item.serviceType // 类型
          mainGroupObj[item.mainGroupId].storageRoomName = item.storageRoomName // 库房
          mainGroupObj[item.mainGroupId].executeProviderName = item.executeProviderName // 执行科室
          mainGroupObj[item.mainGroupId].source = item.source // 执行科室
          mainGroupObj[item.mainGroupId].list = [item]
        } else {
          let mainGroup = mainGroupObj[item.mainGroupId]
          mainGroup.sort = mainGroup.sort > item.serialNumber ? item.serialNumber : mainGroup.sort
          if (item.mainFlag === 1) {
            mainGroup.list.unshift(item)
          } else {
            mainGroup.list.push(item)
          }
        }
      })
      newList = Object.values(mainGroupObj).sort((a, b) => {
        if (!a.sort || !b.sort) {
          return 0
        }
        return a.sort > b.sort ? 1 : -1
      })
      return newList
    },
    adviceCon (len, index) {
      if (len > 1) {
        if (index === 0) {
          return '┏'
        } else if (index === len - 1) {
          return '┗'
        } else {
          return '┣'
        }
      }
      return ''
    },
    // 选择一个模版之后全选里面的明细（有异步问题，所以等dom渲染之后再执行逻辑）
    // by lvjiangtao@everjiankang.com
    selectAll () {
      this.$nextTick(_ => {
        this.selectRecipe = this.dataList
      })
    },
    splitAdvide (arr) {
      let temp = {}
      let out = []
      arr.map(item => {
        if (temp[item.adviceId]) {
          temp[item.adviceId].push(item)
        } else {
          temp[item.adviceId] = [item]
        }
      })
      for (let key in temp) {
        out.push(temp[key])
      }
      return out
    },
    // 全选
    allSelectChange (data) {
      if (data) {
        this.selectRecipe = this.dataList
      } else {
        this.selectRecipe = []
      }
    },
    // 单独勾选
    selectChange (data) {
      if (this.selectRecipe.length === this.dataList.length) {
        this.allSelect = true
      } else {
        this.allSelect = false
      }
    },
    quoteHandle () {
      if (!this.selectRecipe.length) {
        return
      }
      let list = []
      this.selectRecipe.forEach(item => {
        list.push(...item.list)
      })
      this.$emit('quote', list)
      this.$bus.$emit('toggle_off')
    }
  },
  components: {
    drugInfo
  }
}
</script>
<style lang="scss" scoped>
.advice_template_list {
  display: flex;
  flex-direction: column;
  height: calc(100% - 15px);
  padding: 0 10px;
  .top_wrap{
    padding: 10px 0;
  }
  .list_wrap{
    flex: 1;
    overflow: auto;
  }
  .title {
    color: #000;
  }
  .ml20 {
    margin-left: 20px;
  }
  .name {
    color: #000;
    line-height: 24px;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .drug-name {
    color: #000;
    line-height: 24px;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .labWrap {
    position: relative;
    line-height: 30px;
    display: inline-block;
    margin-right: 35px;
  }
  .lab {
    font-size: 12px;
    position: absolute;
    right: -48px;
    width: 48px;
    transform: scale(0.9, 0.9);
    font-weight: 400;
  }
  .conent {
    font-size: 14px;
    color: 666;
    line-height: 2;
  }
  .el-button--primary {
    border: 1px solid #b3d8ff;
    color: #409eff;
    background: #ecf5ff;
  }
  .el-button--small {
    padding: 3px 5px;
    border-radius: 2px;
  }
  .recipebox {
    display: flex;
    &:last-child {
      border-bottom: 1px solid #ccc;
    }
    .recipeLeft {
      width: 80px;
      border: 1px solid #ccc;
      border-bottom: none;
      padding: 4px 8px;
    }
    .recipeRight {
      flex: 1;
      border: 1px solid #ccc;
      border-left: none;
      border-bottom: none;
      padding: 4px 8px;
    }
    .eline {
      font-size: 14px;
    }
    /deep/ .el-checkbox {
      margin-top: 5px;
      margin-right: 10px;
      /deep/ .el-checkbox__label {
        display: none;
      }
    }
  }
}
</style>
