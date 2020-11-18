<template>
  <div>
    <div class="product">
      <el-row>
        <el-col :span="24" class="product-col border-bottom">
          <div>
            <el-col :span="14" class="product-col"></el-col>
            <el-col :span="10" class="product-col">
              <div class="rightHeader">
                <el-input
                  placeholder="直接扫描唯一码出库"
                  @keyup.enter.native="handleEnterAddUniqueCode"
                  v-model="uniqueCode"
                  clearable
                ></el-input>
              </div>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24" class="product-col">
          <el-col :span="14" class="product-col"></el-col>
          <el-col :span="10" class="product-col">
            <div class="rightBody">
              <div class="rightBody" v-if="codes.length">
                <!-- <h5>已扫描商品 {{codes.length}} 个</h5> -->
                <!-- <ul class="list">
                  <li v-for="(code, index) in codes" :key="index"><span>{{code}}</span><el-button type="text" class="red" @click="handleDeleteRow(index)">删除</el-button></li>
                </ul>-->
                <div class="custom_popover pos_re">
                  <span class="pos_ab"></span>
                  <ul v-if="codes && codes.length">
                    <li v-for="(code, index) in codes" :key="index">
                      <span style="padding-right: 20px">{{code}}</span>
                      <span class="btn-del">
                        <el-button type="text" class="red" @click="handleDeleteRow(index)">删除</el-button>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
        </el-col>
        <!-- 扫描结果 -->
        <!-- <el-col :span="10" class="product-col">

        </el-col>-->
      </el-row>
    </div>
  </div>
</template>
<script>
import uniqueCodeApi from '@/warehouse/page/storages/store/uniquecodeapi'
import addProductMethods from '@/warehouse/page/storages/util/addproduct'
export default {
  name: 'uniqueoutput',
  mixins: [addProductMethods],
  props: ['tableData', 'popDeleteCode', 'storageRoomId', 'billCode'],
  data () {
    return {
      uniqueCode: '',
      codes: []
    }
  },
  methods: {
    handleEnterAddUniqueCode () {
      let params = {
        code: this.uniqueCode
      }
      if (this.storageRoomId) params.storageRoomId = this.storageRoomId
      // 申领入库 -- 原样出库原样入库
      if (this.billCode) params.billCode = this.billCode
      uniqueCodeApi.getOutput(params).then(res => {
        if (res && res.stockContainerItemObject && res.stockContainerItemObject.localMaterialId && res.uniqueCodeAllDetailVoObject) {
          let resUniqueCode = res.uniqueCodeAllDetailVoObject.uniqueCode
          let resOwnUniqueCodes = res.uniqueCodeAllDetailVoObject.ownUniqueCodes
          let localMaterialId = res.stockContainerItemObject.localMaterialId
          let compareData = this.billCode && this.tableData[0].item ? this.tableData[0].item : this.tableData
          if (this._fieldCompare(compareData, 'localMaterialId', localMaterialId)) {
            this.$messageTips(this, 'warning', '该唯一码绑定商品在当前出库单明细中不存在，请核实后再扫码')
          } else {
            let codeAlls = []
            for (let i = 0; i < compareData.length; i++) {
              if (compareData[i].localMaterialId === localMaterialId && compareData[i].num + 1 > compareData[i].expectNum) {
                this.uniqueCode = ''
                return this.$messageTips(this, 'warning', '该商品出库数量不能大于预期数量')
              }
              if (compareData[i].localMaterialId === localMaterialId) {
                let item = compareData[i]
                if (!this.tableData[0].item) {
                  item.outStockItemDetailStockContainerList.forEach(row => {
                    codeAlls.push(row)
                  })
                  item.outStockItemDetailStockSysBatchList.forEach(row => {
                    codeAlls.push(row)
                  })
                }
                // 申领入库 -- 原样出库原样入库
                this.billCode && this.tableData[0].item && item.inStockItemDetailStockContainerList.forEach(row => {
                  codeAlls.push(row)
                })
              }
            }
            if (codeAlls[0]) {
              for (let i = 0; i < codeAlls.length; i++) {
                if (codeAlls[i].uniqueCode === resUniqueCode) {
                  this.uniqueCode = ''
                  this.$messageTips(this, 'warning', '该唯一码商品出库明细中已存在')
                  return
                }
                if (resOwnUniqueCodes && codeAlls[i].ownUniqueCodes === resOwnUniqueCodes) {
                  this.uniqueCode = ''
                  this.$messageTips(this, 'warning', '该商品码商品出库明细中已存在')
                  return
                }
              }
              this._addCodes(res)
              return
            }
            this._addCodes(res)
          }
        }
        setTimeout(() => {
          this.uniqueCode = ''
        }, 500)
      })
    },
    handleDeleteRow (index) {
      let curUniqueCode = this.codes.splice(index, 1)
      this.$emit('deleteAfter', curUniqueCode[0])
    },
    _addCodes (res) {
      if (res.uniqueCodeAllDetailVoObject && this.uniqueCode === res.uniqueCodeAllDetailVoObject.ownUniqueCodes) {
        this.codes.push(res.uniqueCodeAllDetailVoObject.uniqueCode)
      } else {
        this.codes.push(this.uniqueCode)
      }
      this.$emit('queryCodeAfter', res)
      setTimeout(() => {
        this.uniqueCode = ''
      }, 500)
    },
    _remove (arr, val) {
      var index = arr.findIndex(item => {
        return item + '' === val + ''
      })

      if (index > -1) {
        arr.splice(index, 1)
      }
      return arr
    }
  },
  watch: {
    'popDeleteCode' (val, old) {
      let tempArr = val.split(',')
      this.codes = this._remove(this.codes, tempArr[0])
      this.codes = this._remove(this.codes, tempArr[1])
      this.$nextTick(() => {
        this.codes = Object.assign(this.codes)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.product {
  background: #f9f9f9;
  margin-top: 15px;
  border-radius: 5px;
  padding: 10px 0;
  border: 3px solid #eee;
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
  .product-col.el-col:first-child {
    padding-bottom: 10px;
  }
  .product-col.el-col:last-child {
    // border-left: 1px solid #eee;
    padding-left: 30px;
    .rightHeader {
      padding: 10px 0;
      width: 80%;
    }
    .rightBody {
      h5 {
        font-size: 14px;
        margin: 10px 0;
      }
      .list {
        margin: 0;
        padding-bottom: 20px;
        padding-left: 30px;
        overflow-y: auto;
        max-height: 130px;
        li {
          line-height: 30px;
          height: 30px;
          font-size: 14px;
          color: #000;
          span {
            min-width: 100px;
            padding-right: 10px;
            display: inline-block;
          }
        }
        //  visibility: hidden;
        .el-button.red {
          width: 10%;
          color: #e43;
        }
        li:hover .el-button.red {
          visibility: inherit;
        }
      }
    }
  }
}
.custom_popover {
  background: #fff;
  width: 100%;
  float: right;
  clear: both;
  margin: 20px;
  border: 1px solid #e9e9e9;
}
.custom_popover span.pos_ab {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 10px solid #fff;
  top: -5px;
  left: 90px;
}
.custom_popover ul li {
  line-height: 30px;
  height: 30px;
  position: relative;
}
.custom_popover ul li span {
  min-width: 120px;
  display: inline-block;
}
.custom_popover ul li span.btn-del {
  position: absolute;
  right: 10px;
  width: 50px;
}
</style>
