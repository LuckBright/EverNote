<template>
  <div class="main coupon-edit">
    <div>
      <ever-bread-crumb name="优惠券"></ever-bread-crumb>
    </div>
    <div class="region z-coupon-bg">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            class="input-wd"
            size="small"
            v-model="ruleForm.name"
            maxlength="10"
            placeholder="请输入优惠券名称，最多10个字"
          ></el-input>
        </el-form-item>
        <el-form-item label="发放总量" prop="quota" class="coupon-num">
          <el-input
            class="input-wd"
            size="small"
            v-model="ruleForm.quota"
            maxlength="9"
            oninput="value=value.replace(/[^\d]/,'')"
            placeholder="最多100000000张"
          >
            <template slot="append">张</template>
          </el-input>
          <p class="tip-text">修改优惠券总量时只能增加不能减少，请谨慎设置</p>
        </el-form-item>

        <el-form-item label="适用商品" prop="applyScope">
          <el-radio-group v-model="ruleForm.applyScope" @change="changeRadio">
            <p style="margin-top: 10px;">
              <el-radio :label="0">全部商品可用</el-radio>
            </p>
            <p class="mt-20">
              <el-radio
                :label="1" style="margin-right:15px"
              >指定商品可用
              </el-radio
              >
              <span class="data-info" v-show="ruleForm.applyScope === 1">
                <el-button
                  type="text" @click="searchMallBtn"
                >选择商品</el-button
                >
                <span
                  class="add-mall" v-if="!chooseGroupArr.length"
                >当前已选择{{ cloneArr.length }}件商品</span
                >
                <span
                  class="add-mall" v-else
                >当前已选择{{ chooseGroupArr.length }}个商品分组</span
                >
                <el-button type="text" @click="seeInfoBtn">查看详情</el-button>
              </span>
            </p>
            <p class="mt-20">
              <el-radio :label="2">指定商品不可用</el-radio>
              <span class="data-info" v-show="ruleForm.applyScope === 2">
                <el-button
                  type="text" @click="searchMallBtn"
                >选择商品</el-button
                >
                <span
                  class="add-mall" v-if="!noChooseGroupArr.length"
                >当前已选择{{ noUse.length }}件商品</span
                >
                <span
                  class="add-mall" v-else
                >当前已选择{{ noChooseGroupArr.length }}个商品分组</span
                >
                <el-button type="text" @click="seeInfoBtn">查看详情</el-button>
              </span>
            </p>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="使用门槛" prop="isThreshold">
          <el-radio-group
            v-model="ruleForm.isThreshold"
            :disabled="disabled"
            @change="changeIsThreshold"
          >
            <p style="margin-top: 10px;">
              <el-radio :label="0">无门槛使用</el-radio>
            </p>
            <p class="mt-20">
              <el-radio :label="1" class="radio-label">订单满</el-radio>
              <el-input
                v-model="ruleForm.thresholdValue"
                :disabled="disabled || ruleForm.isThreshold === 0"
                size="small"
                maxlength="9"
                class="price-input-wd"
                oninput="value=value.replace(/[^\d]/,'')"
              >
                <template slot="append">¥</template>
              </el-input>
            </p>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠金额" prop="preferentialAmount">
          <el-input
            size="small"
            :disabled="disabled"
            v-model="ruleForm.preferentialAmount"
            class="input-wd-price ml-10"
            oninput="value=value.replace(/[^\d]/,'')"
          >
            <template slot="append">¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券有效期" prop="yxq">
          <el-date-picker
            class="input-wd"
            :disabled="disabled"
            v-model="ruleForm.yxq"
            type="daterange"
            align="right"
            size="small"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker
          >
        </el-form-item>
        <el-form-item label="每人限领次数" prop="limitSetType">
          <el-radio-group
            v-model="ruleForm.limitSetType"
            :disabled="disabled"
            @change="changeLimitSetType"
          >
            <p style="margin-top: 10px;">
              <el-radio :label="0">不限次数</el-radio>
            </p>
            <p class="mt-20">
              <el-radio :label="1" class="radio-label">
                <span style="display:none">1</span>
              </el-radio>
              <el-input
                v-model="ruleForm.takeLimit"
                :disabled="disabled || ruleForm.limitSetType === 0"
                size="small"
                maxlength="3"
                class="input-wd-xg"
                oninput="value=value.replace(/[^\d]/,'')"
              >
                <template slot="append">次</template>
              </el-input>
            </p>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="goBack">取消</el-button>
          <el-button
            size="small" type="primary" @click="sendInfoBtn"
          >保存
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="mallDialog">
      <template slot="title">
        <el-tabs v-model="tabName" @tab-click="handleClick">
          <el-tab-pane label="商品" name="first">
            <p>请选择商品</p>
            <mall-table
              v-if="mallDialog && tabName === 'first'"
              ref="mallRef"
              :type="1"
              :cloneArr="cloneArr"
              :noUse="noUse"
              :isTrue="false"
              :applyScopeType="applyScopeType"
            ></mall-table>
            <el-button
              type="primary" size="small" @click="sendMallBtn"
            >确认
            </el-button
            >
            <el-button
              size="small"
              @click="
                () => {
                  mallDialog = false;
                  tabName = 'first';
                }
              "
            >取消
            </el-button
            >
          </el-tab-pane>
          <el-tab-pane label="商品分组" name="second">
            <p>请选择商品分组</p>
            <grouping-table
              v-if="mallDialog && tabName === 'second'"
              ref="groupingRef"
              :type="1"
              :chooseFlag="false"
              :chooseGroupArr="chooseGroupArr"
              :noChooseGroupArr="noChooseGroupArr"
              :applyScopeType="applyScopeType"
            ></grouping-table>
            <el-button
              type="primary" size="small" @click="sendGroupingBtn"
            >确认
            </el-button
            >
            <el-button
              size="small"
              @click="
                () => {
                  mallDialog = false;
                  tabName = 'first';
                }
              "
            >取消
            </el-button
            >
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="mallInfoDialog">
      <template slot="title">
        <el-tabs v-model="choicingTabName" @tab-click="choicingClick">
          <el-tab-pane label="商品" name="first">
            <p>已选择商品</p>
            <mall-table
              v-if="mallInfoDialog && choicingTabName === 'first'"
              ref="mallInfoRef"
              :type="2"
              :isTrue="true"
              :cloneArr="cloneArr"
              :noUse="noUse"
              :applyScopeType="applyScopeType"
              @delete="deleteGoods"
            ></mall-table>
          </el-tab-pane>
          <el-tab-pane label="商品分组" name="second">
            <p>已选择商品分组</p>
            <grouping-table
              v-if="mallInfoDialog && choicingTabName === 'second'"
              :type="2"
              ref="groupInfoRef"
              :chooseFlag="true"
              :chooseGroupArr="chooseGroupArr"
              :noChooseGroupArr="noChooseGroupArr"
              :applyScopeType="applyScopeType"
              @delete="deleteGroup"
            ></grouping-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import mallTable from './mall.table'
  import GroupingTable from './group.table'
  import api from '../api'
  import publicApi from '@/titanmall/components/public'

  export default {
    components: {
      mallTable,
      GroupingTable,
    },
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入数量'))
        } else {
          if (value > 100000000) {
            callback(new Error('最多不能超过100000000张'))
          } else {
            callback()
          }
        }
      }

      return {
        api,
        ruleForm: {
          name: '',
          quota: '',
          applyScope: 0,
          isThreshold: 0,
          preferentialAmount: '',
          yxq: [],
          limitSetType: 0,
          takeLimit: '',
          thresholdValue: '',
          appointType: 0,
        },
        rules: {
          name: [
            { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          ],
          quota: [
            {
              required: true,
              validator: validatePass,
              trigger: [ 'blur', 'change' ],
            },
          ],
          applyScope: [
            { required: true, message: '请选择使用商品', trigger: 'blur' },
          ],
          isThreshold: [
            { required: true, message: '请输入金额', trigger: 'blur' },
          ],
          preferentialAmount: [
            { required: true, message: '请输入优惠金额', trigger: 'blur' },
          ],
          yxq: [ { required: true, message: '请选择有效期', trigger: 'blur' } ],
          limitSetType: [
            { required: true, message: '请输入限领次数', trigger: 'blur' },
          ],
        },
        mallDialog: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          },
        },
        mallInfoDialog: false,
        disabled: false,
        cloneArr: [],
        noUse: [],
        applyScopeType: '',
        tabName: 'first',
        choicingTabName: 'first',
        chooseGroupArr: [],
        noChooseGroupArr: [],
      }
    },
    created () {
      if (this.$route.query.id) {
        this.disabled = true
        this.getInfo(this.$route.query.id)
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },

      // 编辑获取数据
      getInfo (id) {
        this.api.couponView(id).then(res => {
          if (res) {
            res.preferentialAmount = res.preferentialAmount
              ? publicApi.narrowPrice(res.preferentialAmount, 100)
              : ''
            res.thresholdValue = res.thresholdValue
              ? publicApi.narrowPrice(res.thresholdValue, 100)
              : ''
            this.ruleForm.yxq.push(res.validStartTime.split(' ')[0])
            this.ruleForm.yxq.push(res.validEndTime.split(' ')[0])
            this.ruleForm = { ...this.ruleForm, ...res }
            delete this.ruleForm.validStartTime
            this.applyScopeType = res.applyScope
            if (res.applyScope === 1) {
              if (res.appointType) {
                this.chooseGroupArr = res.appointIds
              } else {
                this.cloneArr = res.appointIds
              }
            } else if (res.applyScope === 2) {
              if (res.appointType) {
                this.noChooseGroupArr = res.appointIds
              } else {
                this.noUse = res.appointIds
              }
            }
          }
        })
      },

      // 保存
      sendInfoBtn () {
        if (this.ruleForm.isThreshold === 1 && !this.ruleForm.thresholdValue) {
          this.$message({
            message: '请输入使用门槛',
            type: 'warning',
          })
          return
        }
        if (this.ruleForm.limitSetType === 1 && !this.ruleForm.takeLimit) {
          this.$message({
            message: '请输入限领次数',
            type: 'warning',
          })
          return
        }
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = { ...this.ruleForm }
            delete params.yxq
            params.validStartTime = this.ruleForm.yxq[0] + ' 00:00:00'
            params.validEndTime = this.ruleForm.yxq[1] + ' 23:59:59'
            if (this.ruleForm.isThreshold === 1) {
              params.thresholdValue = publicApi.enlargePrice(
                params.thresholdValue,
                100,
              )
            }
            params.preferentialAmount = publicApi.enlargePrice(
              params.preferentialAmount,
              100,
            )
            params.appointIds = []
            if (params.applyScope === 1) {
              params.appointIds = this.cloneArr.length
                ? this.cloneArr
                : this.chooseGroupArr
              params.appointType = this.cloneArr.length ? 0 : 1
            } else if (params.applyScope === 2) {
              params.appointIds = this.noUse.length
                ? this.noUse
                : this.noChooseGroupArr
              params.appointType = this.noUse.length ? 0 : 1
            }
            if (params.applyScope === 1 || params.applyScope === 2) {
              if (!params.appointIds.length) {
                this.$message({
                  message: '请选择指定商品或商品分组',
                  type: 'error',
                })
                return
              }
            }

            /**
             判断是否有id传入， 有id是编辑，无则新增
             */
            if (this.$route.query.id) {
              this.api.couponEdit(params).then(res => {
                if (res) {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                  })
                  this.goBack()
                }
              })
            } else {
              this.api.couponSave(params).then(res => {
                if (res) {
                  this.$message({
                    message: '保存成功',
                    type: 'success',
                  })
                  this.goBack()
                }
              })
            }
          }
        })
      },

      // 选择商品
      searchMallBtn () {
        this.tabName = 'first'
        this.mallDialog = true
      },

      // 查看详情点击事件
      seeInfoBtn () {
        this.choicingTabName = 'first'
        this.mallInfoDialog = true
      },

      // 选中商品
      sendMallBtn () {
        let newArr = this.$refs.mallRef.allArr
        // 判断 商品可用/商品不可用 cloneArr/noUse
        if (this.ruleForm.applyScope === 1) {
          this.chooseGroupArr = []
          this.infoData(newArr, this.cloneArr, 'spuId')
        } else if (this.ruleForm.applyScope === 2) {
          this.noChooseGroupArr = []
          this.infoData(newArr, this.noUse, 'spuId')
        }
        this.mallDialog = false
      },

      /**
       选中商品数据格式化
       newArr 选中数据
       data 过滤后总数据
       ID 区分商品和分组的id
       */
      infoData (newArr, data, id) {
        if (data.length) {
          newArr.forEach(items => {
            let values = []
            values = data.filter(item => {
              return item === items[id]
            })
            if (!values.length) data.push(items[id])
          })
        } else {
          newArr.forEach(item => {
            data.push(item[id])
          })
        }
      },

      // 选中分组
      sendGroupingBtn () {
        let newArr = this.$refs.groupingRef.allInfo
        // 判断 商品可用分组/商品不可用分组 chooseGroupArr/noChooseGroupArr
        if (this.ruleForm.applyScope === 1) {
          this.cloneArr = []
          this.infoData(newArr, this.chooseGroupArr, 'groupId')
        } else if (this.ruleForm.applyScope === 2) {
          this.noUse = []
          this.infoData(newArr, this.noChooseGroupArr, 'groupId')
        }
        this.mallDialog = false
      },

      // 限领
      changeLimitSetType (val) {
        if (!val) this.ruleForm.takeLimit = ''
      },

      // 使用门槛
      changeIsThreshold (val) {
        if (!val) this.ruleForm.thresholdValue = ''
      },

      // 删除商品
      deleteGoods (row) {
        if (this.ruleForm.applyScope === 1) {
          let arr = [ ...this.cloneArr ]
          this.cloneArr.length = 0
          this.cloneArr = arr.filter(item => {
            return item !== row.spuId
          })
          this.$refs.mallInfoRef.getInfo(this.cloneArr)
        } else if (this.ruleForm.applyScope === 2) {
          let arr = [ ...this.noUse ]
          this.noUse = []
          this.noUse = arr.filter(item => {
            return item !== row.spuId
          })
          this.$refs.mallInfoRef.getInfo(this.noUse)
        }
      },

      // 删除分组
      deleteGroup (row) {
        if (this.ruleForm.applyScope === 1) {
          let arr = [ ...this.chooseGroupArr ]
          this.chooseGroupArr.length = 0
          this.chooseGroupArr = arr.filter(item => {
            return item !== row.groupId
          })
          this.$refs.groupInfoRef.getInfo(this.chooseGroupArr)
        } else if (this.ruleForm.applyScope === 2) {
          let arr = [ ...this.noChooseGroupArr ]
          this.noChooseGroupArr = []
          this.noChooseGroupArr = arr.filter(item => {
            return item !== row.groupId
          })
          this.$refs.groupInfoRef.getInfo(this.noChooseGroupArr)
        }
      },

      // 切换使用商品
      changeRadio (val) {
        this.applyScopeType = val
      },

      // 选择商品切换标签
      handleClick (tab, event) {
        this.tabName = tab.name
      },

      // 已选择商品切换标签
      choicingClick (tab) {
        this.choicingTabName = tab.name
      },
    },
    watch: {
      ruleForm: {
        handler: function () {
          if (this.ruleForm.takeLimit > 500) {
            this.$message({
              message: '最多500次',
              type: 'warning',
            })
            this.ruleForm.takeLimit = 500
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .coupon-edit {
    height: 90vh;
    margin-top: 10px;
    .z-coupon-bg {
      background: #fff;
      padding: 20px;
    }
    .coupon-num {
      margin-bottom: 5px;
    }

    .input-wd {
      width: 298px;
    }

    .tip-text {
      font-size: 12px;
      color: #999;
    }

    .price-input-wd {
      width: 224px;
    }

    .input-wd-price {
      width: 287px;
    }

    .input-wd-xg {
      width: 150px;
    }

    .radio-label {
      margin: 8px 6px 0 0;
    }

    .data-info {
      .add-mall {
        font-size: 14px !important;
        margin: 0 20px;
      }
    }

    .mt-20 {
      margin-top: 20px;
    }

    .ml-10 {
      margin-left: 10px;
    }
  }
</style>
