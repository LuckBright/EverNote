<template>
  <div class="flex outer">
    <div class="layout_inner flex outer">
      <el-tabs class="tabs flex outer" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="跨机构供应关系设置" name="cross" class="flex outer">
          <div class="flex outer">
            <div class="main-head mb5">
              <div class="main-option">
                <span class="fl" v-if="tableData.length" style="line-height: 36px; font-size: 14px">总共{{tableData.length}}条记录</span>
                <el-button class="fr" size="small" type="primary" @click="$router.push('/manages/organizationscrossadd')">创建跨机构供应关系</el-button>
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
                  <div v-if="!tableData.length" class="empty">
                    <everNoData tipTxt="跨机构供应关系还未设置"></everNoData>
                  </div>
                  <div v-else class="content overflow item outer">
                    <div v-for="(item, index) in tableData" :key="index">
                      <el-row>
                        <el-col :span="24">
                          <div class="thead">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid">
                                  <span class="item-name">{{item.clinicName}} > {{item.storageRoomName}}</span>
                                </div>
                              </el-col>
                              <el-col :span="7">
                                <div class="grid">&nbsp;</div>
                              </el-col>
                              <el-col :span="2">
                                <div class="grid center">
                                  <el-button type="text" @click="editItem(item)">编辑</el-button>
                                  <el-button type="text" @click="deleteItem(item)">删除</el-button>
                                </div>
                              </el-col>
                              <el-col :span="7"><div class="grid"></div></el-col>
                            </el-row>
                          </div>
                          <div class="tbody">
                            <el-row v-for="(items, n) in item.relations" :key="n">
                              <el-col :span="8">
                                <div class="grid"></div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid">{{items.clinicName}}</div>
                              </el-col>
                            </el-row>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="库房权重设置" name="storage" class="flex outer">
          <div class="flex outer">
            <div class="main-head" v-if="tableData.length">
              <div class="main-option">
                <span class="fl" style="line-height: 36px; font-size: 14px">总共{{tableData.length}}条记录</span>
                <div style="clear: both"></div>
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
                  <div v-if="!tableData.length" class="empty">
                    <everNoData tipTxt="跨机构供应关系还未设置"></everNoData>
                  </div>
                  <div v-else class="content overflow item outer">
                    <div v-for="(item, index) in tableData" :key="index">
                      <el-row>
                        <el-col :span="24">
                          <div class="thead">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid">
                                  <span class="item-name">{{item.clinicName}}</span>
                                </div>
                              </el-col>
                              <el-col :span="7">
                                <div class="grid">&nbsp;</div>
                              </el-col>
                              <el-col :span="2">
                                <div class="grid center" v-if="item.relations.length > 1">
                                  <el-button type="text" @click="orderItem(item)">权重设置</el-button>
                                </div>
                              </el-col>
                              <el-col :span="7"><div class="grid"></div></el-col>
                            </el-row>
                          </div>
                          <div class="tbody">
                            <el-row v-for="(items, n) in item.relations" :key="n">
                              <el-col :span="8">
                                <div class="grid"></div>
                              </el-col>
                              <el-col :span="7">
                                <div class="grid">
                                  <span class="item-name">{{items.clinicName}} > {{items.storageRoomName}}</span>
                                </div>
                              </el-col>
                              <el-col :span="2">
                                <div class="grid center middle-line">
                                  <span class="item-circle f12">{{n + 1}}</span>
                                </div>
                              </el-col>
                              <el-col :span="7"><div class="grid"></div></el-col>
                            </el-row>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/common'
import organizationcrossApi from '@/warehouse/page/group/store/organizationcrossapi'
export default {
  data () {
    return {
      activeName: this.$route.query.activeName || 'cross', // 当前tab
      tableData: [] // 表格数据
    }
  },
  created () {
    this.fetchList(this.activeName)
  },
  methods: {
    // 切换tab
    handleClick: debounce(function (tab) {
      if (tab.name === 'cross' && this.$route.query.activeName) this.$router.push(`/manages/organizationscross`) // 还原路由
      this.fetchList(tab.name)
    }),
    // 请求列表数据
    async fetchList (activeName) {
      this.tableData = []
      if (activeName === 'cross') { // 跨机构供应
        this.tableData = await organizationcrossApi.getAllRelationListOfRoom()
      } else if (activeName === 'storage') { // 库房权重
        this.tableData = await organizationcrossApi.getAllRelationListOfClinic()
      }
    },
    // 编辑节点
    editItem: debounce(function (item) {
      this.$router.push(`/manages/organizationscrossdetail/${item.storageRoomId}`)
    }),
    // 删除节点
    deleteItem: debounce(function (item) {
      this.$confirm('删除该节点后，其对应的所有节点会同步被删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        organizationcrossApi.deleteOfStorageRoom(item.storageRoomId).then(res => {
          if (res && res.flag) {
            this.$messageTips(this, 'success', '父节点删除成功！', '提示')
            this.fetchList(this.activeName)
          }
        })
      }).catch(() => { })
    }),
    // 设置权重
    orderItem: debounce(function (item) {
      this.$router.push(`/manages/organizationscrossorder/${item.clinicId}`)
    })
  }
}
</script>

<style lang="scss" scoped>
  @import 'index.scss';
  .main-body {
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
        height: 100%;
        .empty {
          padding: 0 60px;
          text-align: center;
        }
        .content {
          line-height:33px;
          .thead {
            height:35px;
            background: #f0f0f0;
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
            .el-col:first-child .grid {
              border-left: none;
              padding-left: 20%
            }
          }
          .tbody {
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
            border-top: 1px solid #ccc;
          }
          .el-row:first-child {
            border-top: none;
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
        line-height: 35px;
      }
    }
  }
</style>
