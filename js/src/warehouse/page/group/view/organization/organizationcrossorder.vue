<template>
  <div>
    <ever-bread-crumb name="库房权重设置" path="/manages/organizationscross?activeName=storage" showTitle="true" :pathTo="true"></ever-bread-crumb>
    <div class="layout_inner flex outer">
      <div class="main-head">
        <div>
          <span style="line-height: 36px; font-size: 14px">当前父节点为 <span class="blue">{{obj.clinicName}}</span> ，请设置子节点权重</span>
        </div>
      </div>
      <div class="main-body flex outer">
        <div class="custom-table flex outer">
          <div class="head">
            <el-row>
              <el-col :span="8">
                <div class="grid center">跨机构供应关系</div>
              </el-col>
              <el-col :span="16">
                <div class="grid center">设置</div>
              </el-col>
            </el-row>
          </div>
          <div class="body flex outer">
            <div v-if="obj.relations && !obj.relations.length" class="empty">
              <everNoData tipTxt="跨机构供应关系还未设置"></everNoData>
            </div>
            <div v-else class="content overflow item outer" style="overflow-x: hidden">
              <div>
                <el-row>
                  <el-col :span="24">
                    <div class="thead">
                      <el-row>
                        <el-col :span="24">
                          <div class="grid">
                            <span class="item-name">{{obj.clinicName}}</span>
                            <span class="item-tips">上下移动调整权重</span>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <SortableList axis="xy" :pressDelay="100" v-model="orderArr">
                      <SortableItem v-for="(item, index) in orderArr" :index="index" :key="index" :item="item"></SortableItem>
                    </SortableList>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-foot alg_c">
        <el-button size="small" type="primary" @click="orderItem" :loading="submitLoading">完成</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ContainerMixin, ElementMixin } from 'vue-slicksort'
import { debounce } from '@/util/common'
import organizationcrossApi from '@/warehouse/page/group/store/organizationcrossapi'
const SortableList = {
  mixins: [ContainerMixin],
  template: `<div class="tbody"><slot/></div>`
}
const SortableItem = {
  mixins: [ElementMixin],
  props: ['item'],
  template: `<el-row class="custom-row">
      <el-col :span="8"><div class="grid"></div></el-col>
      <el-col :span="7">
        <div class="grid middle-line">
          <span class="item-name">{{item.clinicName}} > {{item.storageRoomName}}</span>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid center middle-line">
          <span class="item-circle f12">{{index + 1}}</span>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="grid"></div>
      </el-col>
    </el-row>`
}
export default {
  data () {
    return {
      objId: this.$route.params.id, // 详情id
      obj: {}, // 详情数据
      orderArr: [], // 排过序的数组
      submitLoading: false // loading
    }
  },
  created () {
    this.fetchList(this.objId)
  },
  methods: {
    // 请求列表数据
    async fetchList (clinicId) {
      this.obj = await organizationcrossApi.getRelationListByClinicId(clinicId)
      this.orderArr = [...this.obj.relations]
    },
    // 设置权重
    orderItem: debounce(function () {
      if (this.submitLoading) return
      this.submitLoading = true
      let relations = []
      this.orderArr.forEach((v, i) => {
        let tempObj = {
          id: v.id,
          storageRoomId: v.storageRoomId,
          clinicId: v.clinicId,
          weight: this.orderArr.length - i
        }
        relations.push(tempObj)
      })
      organizationcrossApi.updateWeight({ relations }).then(res => {
        this.submitLoading = false
        if (res && res.flag) {
          this.$messageTips(this, 'success', '设置成功！', '提示')
          this.$router.push('/manages/organizationscross?activeName=storage')
        }
      })
    })
  },
  components: {
    SortableItem,
    SortableList
  }
}
</script>

<style lang="scss" scoped>
  @import 'index.scss';
  /deep/ .custom-row {
    background: #fff;
    border: 1px solid #ccc;
    margin: 0 -1px -1px;
    .el-col {
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      .grid {
        padding: 0 20px;
      }
      .center {
        text-align: center;
      }
      .middle-line {
        line-height: normal;
        margin-top: 5px;
      }
      .item-name {
        margin-right: 20px;
      }
      .item-circle {
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        min-width: 18px;
        height: 18px;
        line-height: 16px;
        color: #1c7bef;
        border-radius: 50%;
        border: 1px solid #1c7bef;
      }
    }
    .el-col:first-child {
      padding-left: 18%;
      cursor: auto;
    }
    .el-col:nth-child(n + 3) {
      border-left: none;
    }
  }
  .main-head {
    .blue {
      cursor: auto;
      text-decoration: none;
    }
  }
  /deep/ .main-body {
    .custom-table {
      border: 1px solid #ccc;
      .head {
        height: 32px;
        line-height: 32px;
        background: #ddd;
        font-weight: bold;
        .center {
          text-align: center;
        }
      }
      .body {
        .empty {
          padding: 0 60px;
          text-align: center;
        }
        .content {
          line-height: 32px;
          .thead {
            height: 34px;
            background: #f0f0f0;
            border-bottom: 1px solid #ccc;
            margin-bottom: -1px;
            border-top: 1px solid #ccc;
            .el-col:first-child .grid {
              border-left: none;
              padding-left: 10%
            }
            .grid {
              margin-left: -1px;
              border-left: 1px solid #ccc;
            }
          }
          .tbody {
            margin-top: 1px;
            .el-col:first-child {
              padding-left: 18%
            }
            .el-col {
              height: 32px;
            }
            .el-col:nth-child(n + 3) {
              border-left: none;
            }
          }
          .center {
            text-align: center;
          }
          .el-row {
            border-top: 1px solid #ccc
          }
          .el-row:first-child {
            border-top: none
          }
          .el-col {
            border-left: 1px solid #ccc;
          }
          .el-col:first-child {
            border-left: none;
          }
          .span_width {
            display: inline-block;
            padding: 0 20px;
          }
          .span_width span.title {
            color: #999;
          }
          .middle-line {
            line-height: normal;
            margin-top: 5px;
          }
          .item-name {
            margin-right: 20px;
          }
          .item-tips {
            color: #999;
            font-size: 14px;
          }
          .item-circle {
            display: inline-block;
            box-sizing: border-box;
            text-align: center;
            min-width: 18px;
            height: 18px;
            line-height: 16px;
            color: #1c7bef;
            border-radius: 50%;
            border: 1px solid #1c7bef;
          }
        }
      }
      .grid {
        padding: 0 20px;
      }
    }
  }
  .main-foot {
    margin-bottom: 0;
    margin-top: 10px;
  }
</style>
