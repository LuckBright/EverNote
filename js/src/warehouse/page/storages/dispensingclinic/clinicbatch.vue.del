 <template>
  <div class="hospital-container">
    <!-- 搜索框 -->
    <div class="hospital-search">
      <div>
        <el-input v-model="codes" placeholder="备药单号" @keyup.enter.native="dispenseList"></el-input>
        <el-button @click="dispenseList">查询</el-button>
      </div>
    </div>
    <!-- 备药单数据 -->
    <div class="hospital-layout clinic-batch">
      <div class="hos-l">
        <div class="select-container">
          <el-select v-model="dataSource">
            <el-option
              v-for="(item, index) in dataSourceOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <span>共 {{dispenseTableData.length}} 条记录</span>
        </div>
        <el-table
          :data.sync="dispenseTableData"
          highlight-current-row
          :stripe="false"
          @row-click="handleDetails"
          style="width: 100%"
          height="calc(100vh - 243px)"
        >
          <el-table-column prop="codes" label="备药单号" width="142"></el-table-column>
          <el-table-column label="类型" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.relationType === 1 ? '处方发药' : '院内发药'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="hos-r">
        <div class="list-msg">
          <el-checkbox-group v-model="checkedItems">
            <div class="list" v-for="(item, index) in dispenseInfoData" :key="index">
              <div class="list-header">
                <!-- <div class="list-num">
                  <el-checkbox :label="item.outpatientDispense.recipeId">{{index + 1}}</el-checkbox>
                </div>-->
                <div class="list-content">
                  <p>
                    <span>张三丰</span>
                    <span>男</span>
                    <span>43岁</span>
                    <span>门诊号：{{item.outpatientDispense.visitSn}}</span>
                    <span>{{setName(DISPENSING_STATUS, item.outpatientDispense.status)}}</span>
                  </p>
                  <p style="margin-right: 10px;">
                    <el-button
                      type="text"
                      v-if="item.outpatientDispense.identification === 1"
                      @click="cancleException(item)"
                    >撤回异常</el-button>
                    <el-button type="text" v-else @click="handleException(item)">标记异常</el-button>
                  </p>
                </div>
              </div>
              <div class="list-table">
                <el-table
                  :data.sync="item.OutpatientDispenseItemDtoList"
                  style="width: 100%"
                  border
                  :row-class-name="tableCellClassName"
                >
                  <el-table-column label="药品名称">
                    <template slot-scope="scope">
                      <span v-if="scope.row.localSettingObject">
                        <wh-code-to-name
                          :patchObj="{
                            code: SEARCH_CODE,
                            list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                            isInfo: false
                          }"
                        ></wh-code-to-name>
                      </span>
                      <p
                        class="red"
                        v-if="scope.row.identification"
                      >{{`异常原因：${scope.row.exceptionCause}`}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="规格">
                    <template slot-scope="scope">
                      <span v-if="scope.row.localSettingObject">
                        <wh-code-to-name
                          :showIcon="false"
                          :patchObj="{
                            code: [SPU_SPEC_CODE],
                            list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                            isInfo: false
                          }"
                        ></wh-code-to-name>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="剂型">
                    <template slot-scope="scope">
                      <wh-single-code-to-name
                        v-if="scope.row.localSettingObject"
                        :patchObj="{
                          list: scope.row.localSettingObject.materialSkuObject.materialPropertys,
                          code: DOSAGE
                        }"
                      ></wh-single-code-to-name>
                    </template>
                  </el-table-column>
                  <el-table-column label="每次用量">
                    <template slot-scope="scope">{{scope.row.measure}}{{scope.row.unitName}}</template>
                  </el-table-column>
                  <!-- <el-table-column
                    label="频次">
                    <template slot-scope="scope">
                      <span>{{scope.row.useFreqTxt}}</span>
                    </template>
                  </el-table-column>-->
                  <el-table-column label="天数">
                    <template slot-scope="scope">
                      <span>{{`${scope.row.totalUseDay}天`}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="途径">
                    <template slot-scope="scope">
                      <span>
                        {{scope.row.employtxt}}
                        <sys-value
                          type="THC_CPOE_DropRate"
                          v-if="scope.row.dropSpeed"
                          :code="scope.row.dropSpeed"
                        ></sys-value>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column align="right" label="数量">
                    <template slot-scope="scope">
                      <span>{{scope.row.num}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="单位">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.localSettingObject"
                      >{{findBasesourceCode({arr: scope.row.localSettingObject.materialSkuObject.materialPropertys})}}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    label="货位号">
                    <template slot-scope="scope">
                      <span>{{scope.row.containerId}}</span>
                    </template>
                  </el-table-column>-->
                </el-table>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <div class="list-btn">
          <!-- <el-checkbox :indeterminate="checkedSome" v-model="checkedAll" @change="handleCheckAllChange">全选</el-checkbox> -->
          <!-- <el-button style="margin-left: 20px;" type="primary" :disabled="checkedItems.length === 0" @click="handleException">备药异常</el-button> -->
          <!-- <el-button type="primary" :disabled="checkedItems.length === 0" @click="updateDispense">备药完成</el-button> -->
          <el-button type="primary" :disabled="hasIdentification" @click="updateDispense">备药完成</el-button>
        </div>
      </div>
    </div>
    <!-- 异常标记 -->
    <exception-dialog
      :exceptionData="exceptionData"
      :visible.sync="dialogVisible"
      @confirm="handleSave"
    ></exception-dialog>
  </div>
</template>

<script>
import api from '../store/clinicapi'
import setName from '@/util/setstatusname'
import sendDrug from '@/warehouse/page/storages/mixins/senddrug'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import { OUTPATIENT_DATASOUCE, DISPENSING_STATUS, SEARCH_CODE, patch, DOSAGE, SPU_SPEC_CODE, debounce } from '@/util/common'
import exceptionDialog from '@/warehouse/page/storages/components/exceptiondialog'
export default {
  mixins: [setName, getStorage, sendDrug],
  data () {
    return {
      api,
      OUTPATIENT_DATASOUCE,
      DISPENSING_STATUS,
      SEARCH_CODE,
      DOSAGE,
      SPU_SPEC_CODE,
      codes: '', // 备药单号
      dataSource: 1000, // 备药单来源
      dispenseTableData: [], // 备药单数据
      dispenseInfoData: [], // 备药单详情
      checkedItems: [], // 选择的数组集合
      checkedSome: false, // 是否选择了一些
      checkedAll: false, // 是否选择了全部
      exceptionData: [], // 选择需要标记异常的数据
      dialogVisible: false,
      hasIdentification: true // 是否有异常
    }
  },
  created () {
    this.dispenseList()
  },
  computed: {
    // 添加全部选项
    dataSourceOptions () {
      let tempStatusData = JSON.parse(JSON.stringify(OUTPATIENT_DATASOUCE))
      tempStatusData.unshift({
        id: 1000, name: '全部'
      })
      return tempStatusData
    }
  },
  methods: {
    // 获取备药单号
    dispenseList () {
      this.dispenseTableData = []
      this.dispenseInfoData = []
      // 参数
      let params = {
        // storageRoomId: '1234'
        storageRoomId: this.storageId
      }
      if (this.dataSource !== 1000) params.dataSource = this.dataSource
      if (this.codes) params.codes = this.codes
      this.api.getBatchDispenseList(params).then(res => {
        if (res && res.dispenseList) {
          this.dispenseTableData = res.dispenseList
          if (this.dispenseTableData.length) {
            this.handleDispenseInfo(this.dispenseTableData[0].codes)
          }
        }
      })
    },
    // 根据备药单号请求备药详情
    handleDispenseInfo (codes) {
      this.dispenseInfoData = []
      this.api.getBatchDispenseInfoList({ codes: codes }).then(res => {
        if (res) {
          this.dispenseInfoData = res
        }
      })
    },
    // 选择备药单
    handleDetails: debounce(function (row, column, event) {
      this.handleDispenseInfo(row.codes)
    }),
    // 全选
    handleCheckAllChange (val) {
      if (val) {
        this.dispenseInfoData.forEach(v => {
          this.checkedItems.push(v.outpatientDispense.recipeId)
        })
      } else {
        this.checkedItems = []
      }
    },
    // 批量备药异常
    handleException (item) {
      this.exceptionData = []
      let tempObj = JSON.parse(JSON.stringify(item.outpatientDispense))
      tempObj.outpatientDispenseItemDtoList = JSON.parse(JSON.stringify(item.OutpatientDispenseItemDtoList))
      this.exceptionData.push(tempObj)
      this.dialogVisible = true
      // this.exceptionData = []
      // this.dispenseInfoData.forEach(val => {
      //   this.checkedItems.forEach(v => {
      //     let tempObj = {}
      //     if (val.outpatientDispense.recipeId === v) {
      //       tempObj = JSON.parse(JSON.stringify(val.outpatientDispense))
      //       tempObj.outpatientDispenseItemDtoList = JSON.parse(JSON.stringify(val.OutpatientDispenseItemDtoList))
      //       this.exceptionData.push(JSON.parse(JSON.stringify(tempObj)))
      //     }
      //   })
      // })
      // this.dialogVisible = true
    },
    // 标记异常 - 请求
    handleSave (val) {
      // console.log(val)
      let params = []
      // 处理标记异常数据
      val.checkedItems.forEach(v => {
        let tempObj = {}
        tempObj.exceptionCause = val.inputVal
        tempObj.id = v.id
        tempObj.identification = 1
        tempObj.recipeId = v.recipeId
        tempObj.localMaterialId = v.localMaterialId
        params.push(tempObj)
      })
      this.api.updateDispenseIdentification(params).then(res => {
        if (res.success === 0) {
          this.$messageTips(this, 'success', '标记异常成功')
          this.dialogVisible = false
          this.checkedItems = []
          this.dispenseList()
        }
      })
    },
    // 撤销异常
    cancleException (item) {
      let params = []
      // 处理标记异常数据
      item.OutpatientDispenseItemDtoList.forEach(v => {
        if (v.identification === 1) {
          let tempObj = {}
          tempObj.exceptionCause = ''
          tempObj.id = v.id
          tempObj.identification = 0
          tempObj.recipeId = v.recipeId
          tempObj.localMaterialId = v.localMaterialId
          params.push(tempObj)
        }
      })
      this.api.updateDispenseIdentification(params).then(res => {
        if (res.success === 0) {
          this.$messageTips(this, 'success', '撤回异常成功')
          this.dispenseList()
        }
      })
    },
    // 备药完成
    updateDispense () {
      if (this.dispenseInfoData.length) {
        let tempArr = []
        this.dispenseInfoData.forEach(value => {
          value.OutpatientDispenseItemDtoList.forEach(val => {
            tempArr.push(val.recipeId)
          })
        })
        tempArr = Array.from(new Set(tempArr))
        // 请求
        let tempObj = {
          recipeIds: tempArr,
          status: 4,
          newStatus: 5
        }
        this.api.updateDispenseType(tempObj).then(res => {
          if (res.success === 0) {
            this.$messageTips(this, 'success', `备药成功`)
            this.dispenseList()
          }
        })
      }
      // let tempArr = []
      // this.dispenseInfoData.forEach(value => {
      //   this.checkedItems.forEach(val => {
      //     if (value.outpatientDispense.recipeId === val) {
      //       value.OutpatientDispenseItemDtoList.forEach(v => {
      //         tempArr.push(v.recipeId)
      //       })
      //     }
      //   })
      // })
      // tempArr = Array.from(new Set(tempArr))
      // // 请求
      // let tempObj = {
      //   recipeIds: tempArr,
      //   status: 4,
      //   newStatus: 5
      // }
      // this.api.updateDispenseType(tempObj).then(res => {
      //   if (res.success === 0) {
      //     this.$messageTips(this, 'success', `备药成功`)
      //     this.checkedItems = []
      //     this.dispenseList()
      //   }
      // })
    },
    // 发药异常标记 - 添加class
    tableCellClassName ({ row }) {
      if (row.identification) {
        return 'danger-row'
      }
      return ''
    },
    ...patch
  },
  watch: {
    'dataSource' (val) {
      this.dispenseList()
    },
    'checkedItems' (val) {
      if (val.length) {
        this.checkedSome = true
        if (val.length === this.dispenseInfoData.length) {
          this.checkedAll = true
          this.checkedSome = false
        }
      } else {
        this.checkedAll = false
        this.checkedSome = false
      }
    },
    'dispenseInfoData' (val) {
      if (val.length) {
        this.hasIdentification = false
        val.forEach(v => {
          if (v.outpatientDispense.identification === 1) this.hasIdentification = true
          if (v.outpatientDispense.status !== 4) this.hasIdentification = true
        })
      }
    }
  },
  components: {
    exceptionDialog
  }
}
</script>

<style lang="less">
.list-table {
  .el-table__body {
    .danger-row {
      background: #ffdfdf;
    }
    .red {
      color: red;
    }
  }
}
</style>
<style lang="less" scoped>
.hospital-layout {
  position: relative;
  .hos-l {
    width: 240px;
    background: #ffffff;
    .select-container {
      padding: 15px;
      .el-select {
        width: 100px;
        height: 36px;
        margin-right: 15px;
      }
    }
  }
  .hos-r {
    width: 1170px;
    background: #fff;
    box-sizing: border-box;
    overflow: hidden;
    .list-msg {
      width: 100%;
      height: 100%;
      overflow: auto;
      .list:last-child {
        margin-bottom: 66px;
      }
      .list-header {
        width: 100%;
        height: 42px;
        display: flex;
        .list-num {
          width: 70px;
          text-align: center;
          line-height: 42px;
        }
        .list-content {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: space-between;
          > div {
            position: absolute;
            right: 14px;
            top: 12px;
            color: #1c7bef;
            .record {
              font-size: 14px;
            }
            .status {
              font-size: 18px;
              font-weight: bold;
            }
          }
          .red {
            color: #ee4433;
          }
          p {
            padding: 15px 0;
            // line-height: 14px;
            span {
              margin-left: 10px;
            }
          }
        }
      }
      .el-table {
        margin: 0;
      }
      .el-checkbox-group {
        font-size: 14px;
      }
      p {
        line-height: none;
        display: flex;
        align-items: center;
      }
    }
    .list-btn {
      box-sizing: border-box;
      padding-left: 18px;
      width: 100%;
      height: 56px;
      border-top: 1px solid #ccc;
      line-height: 56px;
      position: absolute;
      z-index: 1;
      left: 0;
      bottom: 0;
      background: #fff;
    }
  }
}
.clinic-batch {
  position: absolute;
  top: 150px;
  right: 20px;
  bottom: 15px;
  left: 20px;
  display: flex;
  margin-bottom: 0;
  .hos-l {
    position: relative;
    height: 100%;
    margin-right: 10px;
  }
  .hos-r {
    position: relative;
    width: calc(~"100vw - 290px");
    height: 100%;
  }
}
</style>
