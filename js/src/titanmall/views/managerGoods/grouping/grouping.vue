<template>
  <div class="main layout_inner">
    <div class="region grouping">
      <p class="p-btn">
        <el-button
          size="small"
          style="color: #000"
          @click="
            () => {
              newGrouping = true;
              newGroupingName = '';
            }
          "
        >新建商品分组
        </el-button
        >
      </p>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column label="操作" width="300">
          <template slot-scope="scoped">
            <el-button
              type="text" @click="openGoodsDialog(scoped.row)"
            >查看商品
            </el-button
            >
            <el-button
              type="text"
              @click="
                () => {
                  deleteGroupingId = scoped.row.id;
                  deleteGroupName = scoped.row.name;
                  deleteGrouping = true;
                }
              "
            >删除分组
            </el-button
            >
            <el-button type="text" @click="onOpenGroupsDialog(scoped.row)">商品分组链接</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分组名称"></el-table-column>
        <el-table-column prop="num" label="商品数"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="pageSize"
        :page-size="pagesize"
        :layout="pageLayout"
        :total="totalCount"
        background
      >
      </el-pagination>
    </div>
    <el-dialog title="新建分组" :visible.sync="newGrouping" width="30%">
      <p>
        <span class="span-color">分组名称</span>
        <el-input
          v-model.trim="newGroupingName"
          size="small"
          maxlength="10"
          style="width: 80%"
          placeholder="请输入分组名称(最多10个汉字)"
        ></el-input>
      </p>
      <p class="footer-btn">
        <el-button
          size="small" type="primary" @click="sendGroupName"
        >确 定
        </el-button
        >
        <el-button size="small" @click="newGrouping = false">取 消</el-button>
      </p>
    </el-dialog>
    <el-dialog title="删除分组" :visible.sync="deleteGrouping" width="30%">
      <p>删除分组不会删除商品，是否删除分组 {{ deleteGroupName }}?</p>
      <p style="margin-top: 15px">
        <el-button
          size="small" type="primary" @click="deleteGroupingBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="deleteGrouping = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog :visible.sync="goodsDialog">
      <template slot="title">
        <el-tabs v-model="tabName" @tab-click="handleClick">
          <el-tab-pane :label="labelName" name="first">
            <grouping-table
              v-if="goodsDialog && tabName === 'first'"
              :groupId="groupId"
              @deleted="getDataValues"
            ></grouping-table>
            <el-button
              type="primary"
              size="small"
              @click="
                () => {
                  goodsDialog = false;
                  tabName = 'first';
                }
              "
            >确认
            </el-button
            >
            <el-button
              size="small"
              @click="
                () => {
                  goodsDialog = false;
                  tabName = 'first';
                }
              "
            >取消
            </el-button
            >
          </el-tab-pane>
          <el-tab-pane label="添加商品" name="second">
            <add-info
              v-if="goodsDialog && tabName === 'second'"
              :groupId="groupId"
              ref="addInfoRef"
            ></add-info>
            <el-button
              type="primary" size="small" @click="sendAllInfoBtn"
            >确认
            </el-button
            >
            <el-button
              size="small"
              @click="
                () => {
                  goodsDialog = false;
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
    <el-dialog title="商品链接" :visible.sync="groupsDialog" width="30%">
      <el-input
        type="textarea"
        :disabled="true"
        :rows="2"
        v-model="linkObj.url"
      ></el-input>
      <p style="margin-top: 20px">
        <el-button
          type="primary"
          v-clipboard:copy="linkObj.url"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >复制链接
        </el-button
        >
        <el-button @click="groupsDialog = false">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import api from '../api'
  import groupingTable from './grouping.table'
  import addInfo from './add.info'

  export default {
    mixins: [ pagination ],
    components: {
      groupingTable,
      addInfo,
    },
    data () {
      return {
        tableData: [],
        newGrouping: false,
        newGroupingName: '',
        deleteGrouping: false,
        deleteGroupingId: '',
        deleteGroupName: '',
        loading: false,
        goodsDialog: false,
        tabName: 'first',
        labelName: '',
        groupId: '',
        groupsDialog: false,
        linkObj: {
          title: '',
          url: '',
        },
      }
    },
    created () {
      this.getDataValues()
    },
    methods: {
      // 获取列表数据
      getDataValues () {
        this.loading = true
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
        }
        api.groupListBySpuGroup(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            this.tableData = res.resultList
            this.loading = false
          }
        })
      },

      // 删除分组
      deleteGroupingBtn () {
        api.spuGroupDeleteGroupById(this.deleteGroupingId).then(res => {
          if (res) {
            this.$message({
              message: '删除分组成功',
              type: 'success',
            })
            this.getDataValues()
            this.deleteGrouping = false
          }
        })
      },

      // 新建分组名称保存
      sendGroupName () {
        if (!this.newGroupingName) {
          this.$message({
            message: '分组名称不能为空',
            type: 'error',
          })
          return
        }
        api.groupCreateSpu({ name: this.newGroupingName }).then(res => {
          if (res) {
            this.$message({
              message: '创建分组成功',
              type: 'success',
            })
            this.getDataValues()
            this.newGrouping = false
          }
        })
      },

      // 查看商品tabs切换
      handleClick (tab) {
        this.tabName = tab.name
      },

      // 查看商品
      openGoodsDialog (row) {
        this.labelName = row.name
        this.tabName = 'first'
        this.groupId = row.id
        this.goodsDialog = true
      },

      // 添加商品
      sendAllInfoBtn () {
        let arr = this.$refs.addInfoRef.allInfo
        let spuIds = arr.map(item => {
          return item.spuId
        })
        let params = {
          groupId: this.groupId,
          spuIds,
        }
        api.spuGroupAddSpu(params).then(res => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.getDataValues()
            this.goodsDialog = false
          }
        })
      },

      // 商品分组链接
      onOpenGroupsDialog (row) {
        const len = 11
        const chars = 'ABC1DEFGH2IJK3LMNOQP4RSTU5VWXYZab6cdef8ghij7kmlnopq9rest0uvwxyz'
        const maxLength = chars.length
        let result = ''
        for (let i = 0; i < len; i++) {
          result += chars.charAt(Math.floor(Math.random() * maxLength))
        }
        let url = `${this.$ever.mallHost}${this.$ever.h5MallIndex}/group?id=${row.id}&title=${row.name}&shop=${row.shop}&random=${result}`
        this.linkObj.url = url
        this.groupsDialog = true
      },
      // 复制链接
      onCopy (e) {
        this.$message({
          message: '复制成功',
          type: 'success',
        })
        this.groupsDialog = false
      },
      onError (e) {
        this.$message.error('复制失败')
      },
    },
  }
</script>
<style lang="less" scoped>
  .grouping {
    .p-btn {
      margin-bottom: 15px;
    }
  }
  .footer-btn {
    margin: 20px 0 10px;
    padding-left: 67px;
  }
</style>
