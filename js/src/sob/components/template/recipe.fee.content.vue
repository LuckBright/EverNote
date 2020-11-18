<template>
  <div class="advice_template_list" id="recipe" v-if="value">
    <el-row class="top_wrap">
      <el-col :span="24" class="title">
        <el-checkbox label="" v-model="allSelect" @change="allSelectChange" style="margin-right:5px;"></el-checkbox>
        <label>费用信息</label>
        <el-button
          type="primary"
          class="ml20"
          size="small"
          @click="quoteHandle"
          style="margin-left: 5px;"
        >引用</el-button>
      </el-col>
    </el-row>
    <el-checkbox-group v-model="selectRecipe" @change="selectChange">
      <div class="list_wrap">
        <div class="list_box">
          <el-row class="recipebox" v-for="(item, i) in dataList" :key="i">
            <el-col class="ml20" :span="4">
              <el-checkbox :label="item"></el-checkbox>
              <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.serviceType" style="font-size:14px;"></sys-value>
            </el-col>
            <el-col :span="14">
              <span class="name">{{item.serviceName}}</span>  <span>{{item.spec}}</span>
            </el-col>
            <el-col :span="7">
              <el-row class="conent" :gutter="5">
                <el-col
                  :span="24"
                >数量：
                  {{item.count}}{{item.countUnitName}}
                </el-col>
                <!-- <el-col
                  :span="14"
                >金额：
                  {{item.price.toFixed(2)}}元
                </el-col> -->
              </el-row>
            </el-col>
            <!-- <div class="recipeRight">
              <el-row :class="{mb20: j < arr.orderItemList.length - 1}" v-for="(item, j) in arr.orderItemList" :key="j" :gutter="10">
                <el-col :span="11">
                  <span class="name">{{item.serviceName}}</span>  <span>{{item.spec}}</span>
                </el-col>
                <el-col :span="13">
                  <el-row class="conent" :gutter="10">
                    <el-col
                      :span="12"
                    >数量：
                      {{item.quantity}}{{item.unitName}}
                    </el-col>
                    <el-col
                      :span="12"
                    >金额：
                      {{item.price}}元
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div> -->
          </el-row>
        </div>
      </div>
    </el-checkbox-group>
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
      this.dataList = val
      this.selectAll()
      this.allSelect = true
    }
  },
  created () {
    this.selectAll()
  },
  methods: {
    // 选择一个模版之后全选里面的明细（有异步问题，所以等dom渲染之后再执行逻辑）
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
    quoteHandle (items) {
      this.$emit('quote', this.selectRecipe)
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
  height: 100%;
  .top_wrap{
    padding: 10px 0;
  }
  .list_wrap{
    flex: 1;
    overflow: auto;
  }
  .title {
    color: #000;
    padding: 0 10px;
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
  .el-checkbox-group {
    padding: 0 10px;
  }
  .recipebox {
    display: flex;
    border: 1px solid #ccc;
    border-bottom: none; 
    &:last-child {
      border-bottom: 1px solid #ccc;
    }
    // .recipeLeft {
    //   width: 70px;
    //   border: 1px solid #ccc;
    //   border-bottom: none;
    //   padding: 4px 8px;
    // }
    // .recipeRight {
    //   flex: 1;
    //   border: 1px solid #ccc;
    //   border-left: none;
    //   border-bottom: none;
    //   padding: 4px 8px;
    // }
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
