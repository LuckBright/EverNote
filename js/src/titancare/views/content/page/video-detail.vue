<template>
  <div class="layout_inner">
    <!-- <p class="topClose">
      <span @click="close">&lt;&nbsp;&nbsp;返回</span>
    </p> -->
    <ever-bread-crumb  is-custom-back @back="close"></ever-bread-crumb>
    <div class="wrap">
      <div class="left">
        <videoplayer v-if="src" :src="src" :short-video="true"></videoplayer>
      </div>
      <div class="right">
        <!-- 视频信息 -->
        <div>
          <div class="head">
            <span class="icon"></span>
            <b>视频信息</b>
          </div>
          <div class="miaosu">
            <span class="title miaosu_left">描述内容：</span>
            <pre class="miaosu_right">{{
              obj.mark && obj.mark.replace(/↵/g, '\n')
            }}</pre>
          </div>
          <p>
            <span class="title">上传时间：</span>
            <span class="b15">{{ obj.createTime }}</span>
          </p>
        </div>
        <!-- 医生信息 -->
        <div class="mgt30">
          <div class="head">
            <span class="icon"></span>
            <b>医生信息</b>
          </div>
          <p>
            <span class="title">医生信息：</span>
            <span class="b15">{{ obj.uploaderName }} {{ obj.uploaderTitle }}</span>
          </p>
        </div>
        <!-- 商品推荐 -->
        <div class="mgt30">
          <div class="head">
            <span class="icon"></span>
            <b>商品推荐</b>
          </div>
          <div class="mgt10">
            <span
              class="title"
              style="display:inline-block;vertical-align: top;padding-top:10px;"
            >商品推荐：</span>
            <div class="goodsstyle">
              <div v-if="$route.query.type === 'not' || $route.query.goods">
                <el-button
                  type="primary"
                  plain
                  @click="chooosegoods"
                  style="background:#ffffff;color:#1c7bef"
                >
                  {{
                  obj.goodsDesc || obj.photoUrl || obj.goodsPrice
                  ? '重新选择商品'
                  : '选择商品'
                  }}
                </el-button>
              </div>
              <div class="goodscontent" v-if="obj.goodsDesc || obj.photoUrl || obj.goodsPrice">
                <div
                  class="good_left"
                  :style="{
                    backgroundImage: 'url(' + obj.photoUrl + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                  }"
                >
                  <img
                    src="../../../assets/img-titan-care/guanbi.png"
                    class="del"
                    @click="del"
                    v-if="$route.query.type === 'not' || $route.query.goods"
                  />
                </div>
                <div class="good_middle">
                  <el-input
                    v-if="canedit"
                    class="inputstyle"
                    type="textarea"
                    v-model="obj.goodsDesc"
                    placeholder="请输入商品名称,最多15字"
                    maxlength="15"
                  ></el-input>
                  <div v-if="!canedit">{{ obj.goodsDesc }}</div>
                  <p v-if="obj.goodsPrice">￥ {{ (obj.goodsPrice / 100) | formatToFinacial }}</p>
                </div>
                <div class="good_right" v-if="$route.query.type === 'not' || $route.query.goods">
                  <img src="../../../assets/img-titan-care/bianji.png" @click="edit" class="edit" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 操作日志 -->
        <div class="mgt30" v-if="history.length">
          <div class="head">
            <span class="icon"></span>
            <b>操作日志</b>
            <a href @click="seemore" v-if="history.length > 5">查看更多</a>
          </div>
          <div class="history" v-for="(item, index) in history.slice(0, 5)" :key="index">
            <div class="his_left">
              <span class="title">操作人：</span>
              <span class="b15">{{ item.operatorName }}</span>
              <span class="mgl10 b15">{{ item.context }}</span>
            </div>
            <div class="his_right">
              <span class="title">时间：</span>
              <span class="b15">{{ item.operationTime || '--' }}</span>
            </div>
          </div>
        </div>
        <!-- 不合规原因 -->
        <div class="mgt30" v-if="$route.query.type === 'no'">
          <div class="head">
            <span class="icon"></span>
            <b>不合规原因</b>
          </div>
          <p>
            <span class="title">不合规原因：</span>
            <span class="b15">内容不健康</span>
          </p>
        </div>
        <!-- footer -->
        <div class="mgt30">
          <template v-if="$route.query.type === 'not' || $route.query.goods">
            <el-button type="primary" @click.stop="set(1)">审核通过</el-button>
            <el-button type="primary" @click.stop="set(2)">审核通过并推荐到首页</el-button>
            <el-button @click="showdialog()">设为不合规视频</el-button>
          </template>
          <template v-if="$route.query.type === 'yes'">
            <el-button type="primary" @click.stop="set(3)" v-if="!obj.top">推荐到首页</el-button>
            <el-button @click.stop="set(4)" v-if="obj.top">取消推荐到首页</el-button>
            <el-button @click.stop="set(5)">撤回到未审核</el-button>
            <el-button @click="showdialog()">设为不合规视频</el-button>
          </template>
          <template v-if="$route.query.type === 'no'">
            <el-button type="primary" @click.stop="set(6)">审核通过</el-button>
            <el-button @click.stop="set(7)">移回未审核</el-button>
          </template>
        </div>
      </div>
    </div>
    <el-dialog title="请选择视频不合规理由" :visible.sync="dialogVisible" width="395px">
      <el-select v-model="reasontype" style="width:100%">
        <el-option v-for="item in options" :key="item.id" :label="item.value" :value="item.id"></el-option>
      </el-select>
      <div style="margin-top:20px">
        <el-button type="primary" @click="sub">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="操作日志" :visible.sync="dialogVisible1" width="600px" class="hisbody">
      <div class="historyspec">
        <div class="history" v-for="(item, index) in history" :key="index">
          <div class="his_left">
            <span class="title">操作人：</span>
            <span class="b15">{{ item.operatorName }}</span>
            <span class="mgl10 b15">{{ item.context }}</span>
          </div>
          <div class="his_right">
            <span class="title">时间：</span>
            <span class="b15">{{ item.operationTime || '--' }}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:20px;text-align:right;">
        <el-button @click="dialogVisible1 = false">返回</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推荐到首页" :visible.sync="dialogVisible2" width="400px">
      <div class="fl mb10">
        视频权重：
        <el-input class="inline-block sort" v-model="sort" type="number" min="1"></el-input>
      </div>
      <div class="cb alg_c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="set(3)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/titancare/api/content/index'
import storage from '@/util/storage'
import { debounce } from '@/titancare/utils/common'
import videoplayer from '@/titancare/views/content/live/customer/videoplayer'
export default {
  data () {
    return {
      api,
      storage,
      dialogVisible: false,
      dialogVisible1: false,
      canedit: false,
      options: [{ id: 1, value: '内容不健康' }, { id: 2, value: '内容不符合要求' }],
      reasontype: 1,
      history: [],
      obj: {
        mark: '',
        url: '',
        createTime: '',
        uploaderName: '',
        uploaderTitle: '',
        goodsDesc: '',
        photoUrl: '',
        goodsPrice: '',
        top: ''
      },
      src: '',
      playerOptions: {
        preload: 'auto',
        autoplay: true,
        muted: false,
        controlBar: {
          volumePanel: { inline: false },
          remainingTimeDisplay: false
        },
        sources: []
      },
      dialogVisible2: false,
      sort: 1
    }
  },
  mounted () {
    this.getVideo()
    this.queryOperationById()
  },
  components: {
    videoplayer
  },
  methods: {
    set: debounce(function (type) {
      let params = {
        goodsDesc: this.obj.goodsDesc,
        goodsId: this.obj.goodsId,
        shopId: this.obj.shop,
        goodsPhoto: this.obj.photoUrl,
        goodsPrice: this.obj.goodsPrice / 100,
        id: this.obj.id,
        link: this.obj.link,
        operator: this.storage.getLocalStorage('DISPLAYNAME'),
        operatorId: this.storage.getLocalStorage('USERID'),
        videoGoodsId: this.obj.videoGoodsId
      }
      if (type === 3 && !this.dialogVisible2) {
        this.dialogVisible2 = true
        return
      } else {
        params.sort = this.sort
      }
      switch (type) {
        case 1:
        case 4:
        case 6:
          params.status = 1
          params.top = 0
          break
        case 2:
          delete params.sort
          params.top = 1
          params.status = 1
          break
        case 3:
          params.status = 1
          params.top = 1
          break
        case 5:
        case 7:
          params.status = 0
          params.top = 0
          break
        // 拒绝的时候
        default:
          params.status = 2
          params.reason = this.reasontype === 1 ? '内容不健康' : '内容不符合要求'
      }
      this.api.modified(params).then(rs => {
        if (rs.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          })
          this.close()
        }
      })
    }),
    initvideo () {
      this.$nextTick(() => {
        this.src = this.obj.url
      })
    },
    getVideo () {
      this.api.getVideo(this.$route.query.id).then(rs => {
        if (rs.errCode === 0 && rs.data) {
          Object.assign(this.obj, rs.data)
          if (this.$route.query && this.$route.query.goods) {
            Object.assign(this.obj, JSON.parse(this.$route.query.goods))
          }
          this.initvideo()
        }
      })
    },
    queryOperationById () {
      this.api.queryOperationById(this.$route.query.id).then(rs => {
        if (rs.errCode === 0 && rs.data && rs.data.resultList) {
          this.history = rs.data.resultList
        } else {
          this.history = []
        }
      })
    },
    del () {
      this.obj.photoUrl = ''
      this.obj.goodsDesc = ''
      this.obj.goodsPrice = ''
    },
    edit () {
      this.canedit = !this.canedit
    },
    chooosegoods () {
      this.$router.push({ name: 'goods', query: { id: this.$route.query.id, type: this.$route.query.type, queryobj: this.$route.query.queryobj } })
    },
    sub () {
      // 调保存接口
      this.dialogVisible = false
      this.set(8)
    },
    // 选择不合规理由
    showdialog () {
      this.dialogVisible = true
    },
    // 查看更更多
    seemore (e) {
      e.preventDefault()
      this.dialogVisible1 = true
    },
    // 返回
    close () {
      this.$router.push({ name: 'shortvideo', query: { type: this.$route.query.type, queryobj: this.$route.query.queryobj } })
    }
  }
}
</script>
<style lang='less' scoped>
.layout_inner {
  padding: 20px;
  margin-right: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  /*margin-top: none;*/
  .topClose {
    color: #666;
    margin: 0;
    span {
      cursor: pointer;
    }
    &:hover {
      color: #1c7bef;
    }
  }
  .hisbody {
    /deep/ .el-dialog__body {
      padding: 0px 20px 20px 20px;
    }
  }
  .mgt10 {
    margin-top: 15px;
  }
  .historyspec {
    height: 200px;
    overflow-y: scroll;
  }
  .b15 {
    color: #151515;
  }
  .history {
    width: 100%;
    display: flex;
    margin-top: 15px;
    .his_left {
      width: 330px;
    }
    .his_right {
      flex: 1;
      margin-left: 10px;
    }
    .title {
      color: #999999;
    }
    .mgl10 {
      margin-left: 10px;
    }
  }
  .wrap {
    display: flex;
    margin-top: 20px;
    .left {
      min-width: 340px;
      height: 600px;
      // /deep/ .vjs-big-play-button {
      //   display: none !important;
      // }
      // /deep/ .video-js {
      //   height: 600px !important;
      //   width: 340px !important;
      // }
    }
    .right {
      flex: 1;
      padding-left: 20px;
      font-size: 14px;
      .title {
        color: #999999;
      }
      .mgt30 {
        margin-top: 30px;
      }
      .miaosu {
        margin-top: 10px;
        .miaosu_left {
          display: inline-block;
          vertical-align: top;
          width: 70px;
        }
        .miaosu_right {
          margin: 0px;
          display: inline-block;
          vertical-align: top;
          width: 434px;
          white-space: normal;
        }
      }
      .head {
        display: flex;
        align-items: center;
        a {
          color: #1c7bef;
          margin-left: 10px;
        }
        .icon {
          display: inline-block;
          width: 4px;
          height: 14px;
          background: #1c7bef;
          border-radius: 2px;
          border-radius: 2px;
          margin-right: 5px;
        }
      }
      .goodsstyle {
        display: inline-block;
        vertical-align: top;
        width: 600px;
        .goodscontent {
          margin-top: 10px;
          .good_left {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: 100px;
            height: 100px;
            margin-right: 15px;
            .del {
              position: absolute;
              right: -5px;
              top: -5px;
              color: #1c7bef;
              width: 14px;
            }
          }
          .good_middle {
            display: inline-block;
            vertical-align: top;
            max-width: 300px;
            .inputstyle {
              width: 280px;
            }
            height: 60px;
          }
          .good_right {
            display: inline-block;
            vertical-align: top;
            margin-left: 10px;
            .edit {
              width: 16px;
            }
          }
        }
      }
    }
  }
  .sort {
    width: 200px;
  }
  .cb {
    clear: both;
    margin-top: 20px;
  }
}
</style>
