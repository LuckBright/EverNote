<template>
  <div class="layout_inner">
    <div class="wrap">
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane
          label="未审核"
          name="not"
          :disabled="tabdisabled"
        ></el-tab-pane>
        <el-tab-pane
          label="审核通过"
          name="yes"
          :disabled="tabdisabled"
        ></el-tab-pane>
        <el-tab-pane
          label="过滤视频"
          name="no"
          :disabled="tabdisabled"
        ></el-tab-pane>
      </el-tabs>

      <div class="content" v-if="videoarr.length" v-loading="tabdisabled">
        <div class="search">
          <el-input
            placeholder="医生名称"
            v-model="query.uploadName"
            clearable
            class="widthinput"
          ></el-input>
          <el-input
            placeholder="关键字"
            v-model="query.keyword"
            clearable
            class="widthinput"
          ></el-input>
          <el-button type="primary" @click="list(true)">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
        <div class="box" v-for="(item, index) in videoarr" :key="index" :class="{'n': (index+ 1) % 6 === 0 }">
          <div
            class="bgimg"
            :style="{
              backgroundImage: 'url(' + `${item.coverUrl || coverimg}` + ')',
            }"
            @mouseenter="showDialog(index)"
            @mouseleave="hideDialog(index)"
          >
            <!-- not -->
            <div
              v-if="activeName === 'not' && index === currentchoose"
              @click="goDetail(item)"
            >
              <div class="mgt60">
                <el-button
                  type="primary"
                  class="blue"
                  @click.stop="set(item, 1)"
                  >审核通过</el-button
                >
              </div>
              <div>
                <el-button type="primary" @click.stop="set(item, 2)"
                  >审核通过并推荐到首页</el-button
                >
              </div>
            </div>
            <!-- yes -->
            <div class="top" v-if="activeName === 'yes' && item.top">
              已推荐至首页 {{ item.sort }}
            </div>
            <div
              v-if="activeName === 'yes' && index === currentchoose"
              @click="goDetail(item)"
            >
              <div class="mgt60" v-if="activeName === 'yes' && item.top === 0">
                <el-button type="primary" @click.stop="set(item, 3)"
                  >推荐到首页</el-button
                >
              </div>
              <div class="mgt60" v-if="activeName === 'yes' && item.top === 1">
                <el-button plain class="write" @click.stop="set(item, 4)"
                  >取消推荐到首页</el-button
                >
              </div>
              <div>
                <el-button plain @click.stop="set(item, 5)"
                  >撤回到未审核</el-button
                >
              </div>
            </div>
            <!-- no -->
            <div
              v-if="activeName === 'no' && index === currentchoose"
              @click="goDetail(item)"
            >
              <div class="mgt60">
                <el-button type="primary" @click.stop="set(item, 6)"
                  >审核通过</el-button
                >
              </div>
              <div>
                <el-button plain @click.stop="set(item, 7)"
                  >移回未审核</el-button
                >
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info_up">
              <div class="left">
                <ever-image class="img" :src="item.uploadFace"></ever-image>
                <div style="min-height: 18px">{{ item.uploaderName }}</div>
              </div>
              <div class="right">{{ item.createTime | timeset }}</div>
            </div>
            <div class="info_down ellipsis">{{ item.mark }}</div>
          </div>
        </div>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </div>
      <div class="content nocontent" v-else>
        <p>暂无数据</p>
      </div>
      <el-dialog title="推荐到首页" :visible.sync="dialogVisible" width="400px">
        <div class="fl mb10">
          视频权重：<el-input
            class="inline-block sort"
            v-model="maxSort"
            type="number"
            min="1"
          ></el-input>
        </div>
        <div class="cb alg_c">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="set()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/content/index'
import storage from '@/util/storage'
import list from '@/titancare/mixins/list'
import { debounce } from '@/titancare/utils/common'
import coverimg from '@/titancare/assets/img-titan-care/wutouying.png'

export default {
  mixins: [list],
  data () {
    return {
      api,
      storage,
      coverimg,
      activeName: this.$route.query.type || 'not',
      videoarr: [],
      currentchoose: '',
      pagesize: Number(this.$route.query.pagesize) || 10,
      pageSizes: [20, 50],
      tabdisabled: false,
      ellipsis: false,
      query: {
        uploadName: '',
        keyword: ''
      },
      dialogVisible: false,
      sort: 1,
      maxSort: 0
    }
  },
  watch: {
    'activeName': {
      handler (v) {
        this.query.uploadName = ''
        this.query.keyword = ''
        this.init()
        this.list()
      },
      immediate: true
    }
  },
  mounted () {
    if (this.$route.query.queryobj) {
      this.query = JSON.parse(this.$route.query.queryobj)
    }
  },
  methods: {
    list (bol) {
      this.tabdisabled = true
      if (bol) {
        this.videoarr = []
        this.offset = 0
      }
      let params = {
        keyword: this.query.keyword,
        uploadName: this.query.uploadName,
        offset: this.offset,
        pagesize: this.pagesize,
        status: this.activeName === 'not' ? 0 : this.activeName === 'yes' ? 1 : 2
      }
      this.maxSort = 0
      this.api.query(params).then(rs => {
        if (rs.errCode === 0 && rs.data.resultList) {
          this.videoarr = rs.data.resultList
          this.totalCount = rs.data.totalCount
        } else {
          this.videoarr = []
        }
        this.videoarr.map(item => {
          if (item.sort > this.maxSort) {
            this.maxSort = item.sort
          }
        })
        this.maxSort += 1
        this.tabdisabled = false
      })
    },
    reset () {
      this.query.uploadName = ''
      this.query.keyword = ''
      this.list(true)
    },
    // 不进详情直接设置
    set: debounce(function (item, type) {
      if (!item) {
        item = this.item
        type = 3
      }
      var params = {
        id: item.id, // 视频id
        link: item.goodsLink,
        operator: this.storage.getLocalStorage('DISPLAYNAME'),
        operatorId: this.storage.getLocalStorage('USERID')
      }
      if (type === 1 || type === 4 || type === 6) {
        params.status = 1
        params.top = 0
      } else if (type === 2 || type === 3) {
        if (type === 3 && !this.dialogVisible) {
          this.dialogVisible = true
          this.item = item
          return
        } else {
          if (type !== 2) {
            if (Number(this.maxSort) <= 0) {
              this.$notify({
                message: '视频权重必须大于0',
                type: 'warning'
              })
              return
            }
            params.sort = Math.ceil(this.maxSort)
          }
        }
        params.status = 1
        params.top = 1
      } else {
        params.status = 0
        params.top = 0
      }
      this.tabdisabled = true
      this.api.modified(params).then(rs => {
        if (rs.errCode === 0) {
          this.$notify({
            message: '保存成功',
            type: 'success'
          })
          this.list()
        }
        this.tabdisabled = false
        this.dialogVisible = false
      })
    }, 800),
    // 进入详情页
    goDetail (v) {
      this.$router.push({ name: 'videodetail', query: { id: v.id, type: this.activeName, queryobj: JSON.stringify(this.query) } })
    },
    showDialog (index) {
      this.currentchoose = index
    },
    hideDialog (index) {
      this.currentchoose = ''
    },
    init () {
      this.current = 1
      this.offset = 0
    }
  }

}
</script>

<style scoped lang="less">
.tt {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.sort {
  width: 200px;
}
.cb {
  clear: both;
  margin-top: 20px;
}
.wrap {
  padding: 10px 21px 21px 21px;
  .widthinput {
    width: 200px;
    margin-right: 10px;
  }
  .tab {
    width: 1410px;
    margin: 0 auto;
    /deep/ .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #bbbbbb;
    }
  }
  .nocontent {
    text-align: center;
    p {
      margin-top: 200px;
    }
  }
  .content {
    min-height: 550px;
    width: 1410px;
    margin: 0 auto;
    .box {
      display: inline-block;
      width: 210px;
      margin-right: 30px;
      margin-top: 20px;
      margin-bottom: 30px;
      .bgimg {
        position: relative;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        height: 227px;
        border-radius: 4px;
        .top {
          position: absolute;
          left: 0px;
          top: 0px;
          z-index: 1;
          width: 120px;
          height: 20px;
          color: #ffffff;
          background-color: red;
          font-size: 14px;
          text-align: center;
          line-height: 20px;
          border-radius: 4px;
        }
        > div {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 4px;
          .mgt60 {
            margin-top: 60px;
          }
          > div {
            text-align: center;
            margin: 14px;
            .write {
              border: 1px solid #666666;
              border-radius: 2px;
              background-color: #ffffff;
              font-size: 14px;
              color: #333333;
              padding: 5px;
            }
            .blue {
              background: #1c7bef;
              border-radius: 2px;
              color: #ffffff;
            }
          }
        }
      }
      .info {
        height: 70px;
        .info_up {
          height: 40px;
          .left {
            display: inline-block;
            max-width: 119px;
            position: relative;
            height: 40px;
            > .img {
              position: absolute;
              z-index: 10;
              left: 0px;
              top: 5px;
              width: 30px;
              height: 30px;
              border-radius: 30px;
              overflow: hidden;
            }
            > div {
              position: absolute;
              min-width: 50px;
              max-width: 80px;
              top: 10px;
              z-index: 9;
              left: 16px;
              padding: 2px 5px 2px 20px;
              font-size: 14px;
              color: #333333;
              background: #dddddd;
              border-radius: 10px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .right {
            float: right;
            width: 70px;
            line-height: 40px;
            text-align: right;
            height: 40px;
            font-size: 12px;
            color: #666666;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .info_down {
          height: 30px;
          font-size: 12px;
          line-height: 16px;
          color: #666666;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          margin-top: 8px;
        }
      }
    }
    .n {
      margin-right: 0px;
    }
  }
}
.mgl15 {
  margin-left: 15px;
}
.mgt15 {
  margin-top: 15px;
}
</style>
