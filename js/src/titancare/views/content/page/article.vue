<template>
  <div class="layout_inner">
    <div class="main_head">
      <el-form :inline="true" :model="form">
        <el-form-item>文章搜索</el-form-item>
        <el-form-item>
          <el-input placeholder="请输入文章名称" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item>文章状态</el-form-item>
        <el-form-item>
          <el-select v-model="form.status" placeholder="全部" clearable>
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in options"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="list(true)">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button @click="create" type="primary">新建文章</el-button>
        </el-form-item>
      </el-form>
      <el-row class="p20_30_20_40">
        <el-table :data="tableData" class="tablestyle" border>
          <el-table-column prop="a" label="顺序" width="50" type="index"></el-table-column>
          <!-- <el-table-column label="权重" width="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sort" @change="changeSort" @focus="focus(scope.row)"></el-input>
            </template>
          </el-table-column>-->
          <el-table-column prop="title" label="文章标题"></el-table-column>
          <el-table-column label="feed样式" width="80">
            <template
              slot-scope="scope"
            >{{scope.row.style === 0?'无图':scope.row.style === 1?'1图':scope.row.style === 2?'大图':'3图'}}</template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column prop="releaseTime" label="发布时间"></el-table-column>
          <el-table-column label="文章状态">
            <template
              slot-scope="scope"
            >{{scope.row.status === 0?'草稿':scope.row.status === 1?'发布中':'已取消'}}</template>
          </el-table-column>
          <el-table-column prop="creatorName" label="创建者"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scoped">
              <el-link type="primary" @click="goto(scoped.row,'del')" style="margin-left:10px;">删除</el-link>
              <el-link
                v-if="scoped.row.status === 1"
                type="primary"
                @click="goto(scoped.row,'cancelpublic')"
                style="margin-left:10px;"
              >取消发布</el-link>
              <el-link
                v-if="scoped.row.status === 0 || scoped.row.status === 2"
                type="primary"
                @click="goto(scoped.row,'public')"
                style="margin-left:10px;"
              >发布</el-link>
              <el-link type="primary" @click="goto(scoped.row,'see')" style="margin-left:10px;">编辑</el-link>
              <el-link
                type="primary"
                @click="goto(scoped.row,'iftop')"
                style="margin-left:10px;"
                v-if="scoped.row.status === 1"
              >{{scoped.row.isRecommend?'取消推荐':'推荐到首页'}}</el-link>
            </template>
          </el-table-column>
          <div class="empty" slot="empty">
            您还没有发布任何文章，马上去
            <el-link
              type="primary"
              @click="create"
              style="margin-right:5px;margin-left:5px;font-size:16px;padding-bottom:2px;"
            >写一篇</el-link>吧
          </div>
        </el-table>
      </el-row>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pagesize="pagesize"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/content/article'
import list from '@/titancare/mixins/list'
import { debounce } from '@/titancare/utils/common'

export default {
  mixins: [list],
  data () {
    return {
      api,
      form: {
        title: '',
        status: ''
      },
      options: [
        {
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '发布中'
        }, {
          value: 2,
          label: '已取消'
        }
      ],
      tableData: [],
      totalCount: 0,
      pagesize: 20,
      chooseSortItem: ''
    }
  },
  mounted () {
    if (this.$route.query.queryobj) {
      this.form = Object.assign({}, JSON.parse(this.$route.query.queryobj))
    }
    this.list()
  },
  methods: {
    list: debounce(function (v) {
      if (v) {
        this.offset = 0
      }
      this.form.offset = this.offset
      this.form.pagesize = this.pagesize
      this.api.list(this.form).then(rs => {
        if (rs.errCode === 0 && rs.data && rs.data.resultList) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    }),
    focus (p) {
      this.chooseSortItem = p
    },
    // 修改权重
    // changeSort (v) {
    //   let obj = Object.assign({}, this.chooseSortItem)
    //   obj.sort = parseInt(v)
    //   this.api.update(obj).then(rs => {
    //     if (rs.errCode === 0) {
    //       this.$message({
    //         type: 'success',
    //         message: '设置成功!'
    //       })
    //     }
    //   })
    // },
    // 是否推荐到首页
    recommend (v) {
      let obj = Object.assign({}, this.chooseSortItem)
      obj.sort = parseInt(v)
      this.api.update(obj).then(rs => {
        if (rs.errCode === 0) {
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
        }
      })
    },
    reset () {
      this.form.title = ''
      this.form.status = ''
      this.list()
    },
    goto (v, type) {
      switch (type) {
        case 'del':
          this.$confirm('一旦删除将无法撤销，确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.api.remove({ id: v.id }).then(rs => {
              if (rs.errCode === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
            this.list()
          }).catch(() => { })
          break
        case 'cancelpublic':
          this.$confirm('一旦取消发布，用户将无法继续浏览文章?', '提示', {
            confirmButtonText: '我意已决',
            cancelButtonText: '再想想',
            type: 'warning'
          }).then(() => {
            this.api.updateStatus({ id: v.id, status: false }).then(rs => {
              if (rs.errCode === 0) {
                this.$message({
                  type: 'success',
                  message: '取消成功!'
                })
                this.list()
              }
            })
          }).catch(() => { })
          break
        case 'public':
          this.api.updateStatus({ id: v.id, status: true }).then(rs => {
            if (rs.errCode === 0) {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.list()
            }
          })
          break
        case 'iftop':
          this.api.recommend({ id: v.id, status: !v.isRecommend }).then(rs => {
            if (rs.errCode === 0) {
              this.$message({
                type: 'success',
                message: '设置成功!'
              })
              this.list()
            }
          })
          break
        default:
          this.$router.push({ name: 'articleDetail', query: { id: v.id, queryobj: JSON.stringify(this.form) } })
      }
    },
    create () {
      this.$router.push({ name: 'articleDetail' })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  padding-bottom: 20px;
}
.layout_inner {
  height: auto;
}
.pagination {
  float: right;
}
.tablestyle {
  min-height: 500px;
}
.empty {
  padding-top: 100px;
  font-size: 16px;
}
</style>
