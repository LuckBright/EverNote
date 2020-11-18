<template>
  <div>
    <div class="source">
      <div class="left-nav">
        <el-button
          style="margin: 0 0 20px 20px;"
          size="small"
          type="primary"
          @click="upDateImgDialog = true"
        >上传图片
        </el-button
        >

        <p
          :class="{ 'nav-tab': true, 'nav-bg': items.isCheck }"
          v-for="(items, index) in navs"
          :key="index"
          @click="tabClick(items)"
        >
          <span>{{ items.name }}</span>
          <span class="num-span">{{ items.num }}</span>
        </p>
      </div>
      <div class="right-imgs">
        <div class="top-title">{{ groupObj.name }}</div>
        <div class="imgs-box">
          <div
            :class="{ 'img-box': true, choose: items.isChoose }"
            v-for="(items, index) in imgs"
            :key="index"
            @click="chooseImg(items)"
          >
            <p class="img-p">
              <el-image
                class="img-p-image" :src="items.url.includes('https') ? items.url : imgUrl + items.url" fit="cover"/>
            </p>
            <span class="img-name-span">{{ items.name }}</span>
            <span v-if="items.isChoose" class="choose-num">
              <span>{{
                allInfo.indexOf(items.url) > -1
                  ? allInfo.indexOf(items.url) + 1
                  : ''
              }}</span>
            </span>
          </div>
        </div>
        <p class="page">
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
        </p>
        <div class="setting-btn">
          <el-button
            size="small" type="primary" @click="chooseImgBtn"
          >确定
          </el-button
          >
          <el-button
            size="small"
            @click="
              () => {
                $emit('close');
              }
            "
          >取消
          </el-button
          >
        </div>
      </div>
    </div>
    <el-dialog
      class="group-img"
      title="上传图片"
      :visible.sync="upDateImgDialog"
      width="80%"
      append-to-body
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <update-picture
        v-if="upDateImgDialog"
        @close="closeUpDateImgDialog"
      ></update-picture>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from '@/titanmall/mixins/pagination'
  import updatePicture from './update.picture'
  import api from './api'

  export default {
    mixins: [ pagination ],
    props: [ 'isMany' ],
    components: {
      updatePicture,
    },
    data () {
      return {
        navs: [],
        imgs: [],
        allInfo: [],
        groupObj: { name: '', id: '' },
        upDateImgDialog: false,
        imgUrl: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.getGroupList()
    },
    methods: {
      // 获取素材分组
      async getGroupList () {
        let arr = await api.groupListByMaterialGroup()
        arr.forEach((item, index) => {
          if (this.groupObj.id) {
            if (item.id === this.groupObj.id) {
              item.isCheck = true
            } else {
              item.isCheck = false
            }
          } else {
            if (index === 0) {
              item.isCheck = true
              this.groupObj = { ...this.groupObj, ...item }
            } else {
              item.isCheck = false
            }
          }
        })
        this.navs = arr
        let id = this.groupObj.id ? this.groupObj.id : this.navs[0].id
        this.getDataValues(id)
      },

      // 获取分组图片
      getDataValues (id) {
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          groupId: id ? id : this.groupObj.id,
        }
        api.materialConfigList(params).then(res => {
          if (res) {
            this.totalCount = res.totalCount
            // isChoose 用于切换图片是否选中状态
            res.resultList.forEach(async item => {
              item.isChoose = false
            })
            this.imgs = res.resultList
          }
        })
      },

      // 切换分组
      tabClick (row) {
        this.navs.forEach(item => {
          item.isCheck = false
        })
        row.isCheck = true
        this.imgs = []
        this.allInfo = []
        this.current = 1
        this.pagesize = 20
        this.showAllSettingBtn = false
        this.groupObj = { ...row }
        this.getDataValues(row.id)
      },

      // 选中图片
      chooseImg (row) {
        if (this.isMany) {
          // 多选
          row.isChoose = !row.isChoose
          if (row.isChoose) {
            // 选中
            this.allInfo.push(row.url)
          } else {
            // 取消选中
            let i
            this.allInfo.forEach((item, index) => {
              if (item === row.url) i = index
            })
            this.allInfo.splice(i, 1)
          }
        } else {
          // 单选
          this.imgs.forEach(item => {
            item.isChoose = false
          })
          row.isChoose = !row.isChoose
          this.allInfo = [ row.url ]
        }
      },

      // 确定选中图片
      chooseImgBtn () {
        this.$emit('choose', this.allInfo)
        this.setBodyStyle()
      },

      // 关闭上图图片弹框
      closeUpDateImgDialog () {
        this.getGroupList()
        this.upDateImgDialog = false
        this.setBodyStyle()
      },

      setBodyStyle () {
        let body = document.getElementsByTagName('body')
        body[0].style.overflow = 'auto'
      },
    },
  }
</script>
<style lang="less" scoped>
  .source {
    display: flex;

    .left-nav {
      width: 201px;
      padding-top: 20px;

      .nav-tab {
        line-height: 36px;
        cursor: pointer;
        padding: 0 20px;

        &:hover {
          background: #f2f7ff;
        }

        .num-span {
          float: right;
        }
      }

      .nav-bg {
        background: #f2f7ff;
      }
    }

    .right-imgs {
      flex-grow: 1;
      flex-basis: 0;
      border-left: 1px solid #f4f4f4;

      .top-title {
        height: 56px;
        line-height: 56px;
        font-size: 16px;
        padding-left: 24px;
      }

      .imgs-box {
        width: 100%;
        min-height: 178px;
        display: flex;
        flex-wrap: wrap;
        background: #f5f5f5;
        padding: 17px 24px;
        box-sizing: border-box;

        .img-box {
          flex-grow: 0;
          width: 176px;
          height: 134px;
          margin: 0 10px 10px;
          background: #ffffff;
          border-radius: 4px;

          img {
            width: 100%;
            height: 95px;
            border-radius: 4px 4px 0 0;
            vertical-align: middle;
          }

          .img-name-span {
            display: inline-block;
            height: 39px;
            line-height: 39px;
            margin-left: 6px;
          }

          &:hover {
            box-shadow: 0 14px 19px rgba(0, 0, 0, 0.13);
          }

          .img-p {
            width: 176px;
            height: 95px;

            .img-p-image {
              width: 100%;
              height: 100%;
              border-radius: 4px 4px 0 0;
            }
          }
        }
      }

      .page {
        background: #f5f5f5;
        padding-bottom: 10px;
        padding-right: 10px;
      }

      .setting-btn {
        height: 72px;
        line-height: 72px;
        padding-left: 23px;
      }

      .choose {
        background: #000;
        opacity: 0.6;
        position: relative;

        .choose-num {
          position: absolute;
          top: 0;
          right: 0;
          width: 30px;
          height: 30px;

          span {
            position: absolute;
            top: 0;
            right: 5px;
            color: #fff;
            z-index: 1;
          }

          &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 30px solid #fe4c31;
            border-left: 30px solid transparent;
          }
        }
      }
    }
  }

  .group-img /deep/ .el-dialog .el-dialog__header {
    border-bottom: 1px solid #f4f4f4;
  }
</style>
