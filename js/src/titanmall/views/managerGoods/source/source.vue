<template>
  <div class="main layout_inner">
    <div class="source-container">
      <div class="source">
        <div class="left-nav">
          <el-button
            class="up-btn"
            type="primary"
            size="small"
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
          <el-button
            class="add-btn"
            size="small"
            @click="
              () => {
                addGroupName = '';
                addGroupDialog = true;
              }
            "
          >+ 添加分组
          </el-button
          >
        </div>
        <div class="right-imgs">
          <div class="right-top">
            {{ groupObj.name }}
            <el-button
              v-if="groupObj.name !== '未分组'"
              style="margin-left:10px;font-size: 12px"
              type="text"
              @click="
                () => {
                  upDateName = groupObj.name;
                  upDateNameGroupOrImg = true;
                  upDateNameDialog = true;
                }
              "
            >重命名
            </el-button
            >
            <el-button
              v-if="groupObj.name !== '未分组'"
              style="font-size: 12px"
              type="text"
              @click="deleteGroupDialog = true"
            >删除分组
            </el-button
            >
            <el-button
              class="all-btn"
              v-if="!showAllSettingBtn"
              size="small"
              @click="showAllSettingBtn = true"
            >批量设置
            </el-button
            >
          </div>
          <div class="imgs-containter">
            <div
              :class="{ 'imgs-box': true, 'imgs-box-bot': showAllSettingBtn }"
            >
              <div
                :class="{
                  'img-box': true
                }"
                v-for="(items, index) in imgs"
                :key="index"
              >
                <p class="img-p">
                  <el-image
                    class="img-p-image"
                    :src="items.url.includes('https') ? items.url : imgUrl + items.url"
                    fit="cover"
                    :preview-src-list="allImangs"
                  >
                  </el-image>
                </p>
                <span class="img-name" @click="chooseImg(items)">{{ items.name }}</span>
                <p
                  :class="{
                    'img-setting-btn': !showAllSettingBtn,
                    'img-setting': showAllSettingBtn
                  }"
                >
                  <button
                    class="setting-btn"
                    @click="
                      () => {
                        upDateName = items.name;
                        selectionImgId = items.id;
                        upDateNameGroupOrImg = false;
                        upDateNameDialog = true;
                      }
                    "
                  >
                    改名
                  </button>
                  <button
                    class="setting-btn"
                    @click="selectionGroup(items, false)"
                  >
                    分组
                  </button>
                  <button
                    class="setting-btn"
                    @click="
                      () => {
                        selectionImgId = items.id;
                        allDeleteImg = false;
                        deleteImgDialog = true;
                      }
                    "
                  >
                    删除
                  </button>
                </p>
                <div
                  v-if="showAllSettingBtn"
                  @click="chooseImg(items)"
                  :class="{ choose: items.isChoose }"
                >
                  <i
                    v-if="items.isChoose" class="iconfont choose-icon"
                  >&#xe7e7;</i
                  >
                </div>
              </div>
            </div>
          </div>
          <el-pagination
            class="page-btn"
            align="right"
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
          <div v-if="showAllSettingBtn" class="all-choose-setting">
            <el-button
              v-if="showAllChooseBtn"
              type="primary"
              size="small"
              @click="allChooseImgsBtn"
            >全选
            </el-button
            >
            <el-button
              v-else
              size="small"
              type="primary"
              @click="unAllChooseImgsBtn"
            >取消全选
            </el-button
            >
            <span class="choose-setting">
              <el-button
                size="small" @click="selectionGroup('', true)"
              >修改分组</el-button
              >
              <el-button
                size="small" type="primary" @click="allDeleteBtn"
              >删除</el-button
              >
              <el-button size="small" @click="overBtn">完成</el-button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="添加分组" :visible.sync="addGroupDialog" width="30%">
      <el-input
        class="add-group-input"
        v-model.trim="addGroupName"
        placeholder="不超过6个字"
        size="small"
        maxlength="6"
      ></el-input>
      <p class="mt-15">
        <el-button
          size="small" type="primary" @click="addGroupBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="addGroupDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      title="修改名称"
      :visible.sync="upDateNameDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%">
      <el-input
        class="add-group-input"
        v-model.trim="upDateName"
        placeholder="修改名称"
        size="small"
        :maxlength="upDateNameGroupOrImg ? 6 : 20"
      ></el-input>
      <p class="mt-15">
        <el-button
          size="small" type="primary" @click="upDateNameBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="upDateNameDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      title="选择分组"
      :visible.sync="selectionGroupDialog"
      width="20%"
    >
      <el-select
        v-model="groupName"
        filterable
        size="small"
        placeholder="请选择"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          :disabled="disabledGroup(item)"
        >
        </el-option>
      </el-select>
      <p class="mt-15">
        <el-button
          size="small" type="primary" @click="selectionGroupBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="selectionGroupDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      title="确认删除该图片？"
      :visible.sync="deleteImgDialog"
      width="30%"
    >
      <span>若删除，不会对目前已使用该图片的相关业务造成影响。</span>
      <p class="mt-15">
        <el-button
          size="small" type="primary" @click="deletedImgBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="deleteImgDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      title="确认删除该分组？"
      :visible.sync="deleteGroupDialog"
      width="30%"
    >
      <span>仅删除分组，不删除图片，组内图片将自动归入未分组</span>
      <p class="mt-15">
        <el-button
          size="small" type="primary" @click="deletedGroupBtn"
        >确 定
        </el-button
        >
        <el-button
          size="small" @click="deleteGroupDialog = false"
        >取 消
        </el-button
        >
      </p>
    </el-dialog>
    <el-dialog
      title="上传图片"
      :visible.sync="upDateImgDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
    >
      <update-picture
        v-if="upDateImgDialog"
        @close="closeUpDateImgDialog"
      ></update-picture>
    </el-dialog>
  </div>
</template>
<script>
  // import axios from 'axios'
  import pagination from '@/titanmall/mixins/pagination'
  import updatePicture from '@/titanmall/components/update.picture'
  import api from '../api'

  export default {
    mixins: [ pagination ],
    components: { updatePicture },
    data () {
      return {
        navs: [],
        imgs: [],
        allInfo: [],
        groupObj: { name: '', id: '' },
        addGroupDialog: false,
        addGroupName: '',
        upDateNameDialog: false,
        upDateName: '',
        selectionImgId: '',
        deleteImgDialog: false,
        selectionGroupDialog: false,
        groupName: '',
        options: [],
        deleteGroupDialog: false,
        upDateNameGroupOrImg: false, // 判断修改分组名称/图片名称 true/false
        showAllSettingBtn: false,
        allDeleteImg: true, // 判断批量/单个删除图片 true/false
        allUpdateGroupImg: true, // 判断批量/单个图片分组 true/false
        upDateImgDialog: false,
        allImgs: [],
        showAllChooseBtn: true,
        imgUrl: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.getGroupList()
    },
    methods: {
      // 获取素材分组列表
      async getGroupList () {
        let arr = await api.groupListByMaterialGroup()
        arr.forEach((item, index) => {
          // 当前选中分组
          if (this.groupObj.id) {
            if (item.id === this.groupObj.id) {
              item.isCheck = true
              this.groupObj = { ...this.groupObj, ...item }
            } else {
              item.isCheck = false
            }
          } else {
            // 为选中分组
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
        let newId = id ? id : this.groupObj.id
        let params = {
          currentPage: this.current,
          pageSize: this.pagesize,
          groupId: newId,
        }
        api.materialConfigList(params).then(res => {
          if (res) {
            this.allImangs = []
            this.totalCount = res.totalCount
            // isChoose 用于切换图片是否选中状态
            res.resultList.forEach(async item => {
              item.isChoose = false
              let url
              if (item.url.includes('https')) {
                url = item.url
              } else {
                url = this.imgUrl + item.url
              }
              this.allImangs.push(url)
              // item.url = url;
            })
            this.imgs = res.resultList
            if (!this.imgs.length) this.showAllSettingBtn = false
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
        console.log('row', row)
        if (!this.showAllSettingBtn) return
        row.isChoose = !row.isChoose
        if (row.isChoose) {
          // 选中
          this.allInfo.push(row.id)
        } else {
          // 取消选中
          let i
          this.allInfo.forEach((item, index) => {
            if (item === row.id) i = index
          })
          this.allInfo.splice(i, 1)
        }
        console.log('all', this.allInfo)
      },

      // 添加分组保存
      addGroupBtn () {
        api.groupCreateMaterial({ name: this.addGroupName }).then(res => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.getGroupList()
            this.addGroupDialog = false
          }
        })
      },

      // 修改分组/图片名称
      upDateNameBtn () {
        if (this.upDateNameGroupOrImg) {
          // 修改分组名称
          let params = {
            id: this.groupObj.id,
            name: this.upDateName,
          }
          api.groupChangeGroupNameById(params).then(res => {
            if (res) {
              this.$message({
                message: '修改分组名称成功',
                type: 'success',
              })
              this.getGroupList()
              this.upDateNameDialog = false
            }
          })
        } else {
          // 修改图片名称
          let params = {
            id: this.selectionImgId,
            name: this.upDateName,
          }
          api.materialConfigChangeName(params).then(res => {
            if (res) {
              this.$message({
                message: '修改图片名称成功',
                type: 'success',
              })
              this.getDataValues(this.groupObj.id)
              this.upDateNameDialog = false
            }
          })
        }
      },

      // 删除图片
      deletedImgBtn () {
        if (this.allDeleteImg) {
          api.materialConfigDeleteBatch({ ids: [ ...this.allInfo ] }).then(res => {
            this.$message({
              message: '删除图片成功',
              type: 'success',
            })
            this.getGroupList()
            this.deleteImgDialog = false
          })
        } else {
          api.materialConfigDelete(this.selectionImgId).then(res => {
            if (res) {
              this.$message({
                message: '删除图片成功',
                type: 'success',
              })
              this.getGroupList()
              this.deleteImgDialog = false
            }
          })
        }
      },

      // 点击分组
      selectionGroup (items, isAll) {
        if (isAll) {
          if (!this.allInfo.length) {
            this.$message({
              message: '请选择要分组的图片',
              type: 'error',
            })
            return
          }
        } else {
          this.selectionImgId = items.id
        }
        this.groupName = ''
        this.allUpdateGroupImg = isAll
        this.getGroupOptions()
        this.selectionGroupDialog = true
      },

      // 选择分组
      selectionGroupBtn () {
        if (this.allUpdateGroupImg) {
          let params = {
            groupId: this.groupName,
            ids: this.allInfo,
          }
          api.materialConfigChangeGroupBatch(params).then(res => {
            if (res) {
              this.$message({
                message: '修改分组成功',
                type: 'success',
              })
              this.getGroupList()
              this.selectionGroupDialog = false
            }
          })
        } else {
          let params = {
            groupId: this.groupName,
            id: this.selectionImgId,
          }
          api.materialConfigChangeGroup(params).then(res => {
            if (res) {
              this.$message({
                message: '修改分组成功',
                type: 'success',
              })
              this.getGroupList()
              this.selectionGroupDialog = false
            }
          })
        }
      },

      // 分组下拉框禁用当前分组
      disabledGroup (item) {
        return item.id === this.groupObj.id
      },

      // 获取素材分组下拉列表
      async getGroupOptions () {
        let options = await api.groupListByMaterialGroupBox()
        this.options = options
      },

      // 删除分组
      deletedGroupBtn () {
        api.groupDeleteMaterialGroupById(this.groupObj.id).then(res => {
          if (res) {
            this.$message({
              message: '删除分组成功',
              type: 'success',
            })
            this.groupObj = { name: '', id: '' }
            this.getGroupList()
            this.deleteGroupDialog = false
          }
        })
      },

      // 取消全选
      unAllChooseImgsBtn () {
        this.showAllChooseBtn = true
        this.allInfo = []
        this.imgs.forEach(item => {
          item.isChoose = false
        })
      },

      // 全选
      allChooseImgsBtn () {
        this.showAllChooseBtn = false
        this.allInfo = []
        this.imgs.forEach(item => {
          item.isChoose = true
          this.allInfo.push(item.id)
        })
      },

      // 完成
      overBtn () {
        this.imgs.forEach(item => {
          item.isChoose = false
        })
        this.showAllSettingBtn = false
      },

      // 批量删除
      allDeleteBtn () {
        if (!this.allInfo.length) {
          this.$message({
            message: '请选择要删除的图片',
            type: 'error',
          })
          return
        }
        this.allDeleteImg = true
        this.deleteImgDialog = true
      },

      // 关闭上传图片弹框
      closeUpDateImgDialog () {
        this.getGroupList()
        this.upDateImgDialog = false
      },
    },
  }
</script>
<style lang="less" scoped>
  .source-container {
    .source {
      display: flex;

      .left-nav {
        width: 240px;
        height: 100vh;
        background: #fff;
        margin-right: 1px;
        box-sizing: border-box;
        padding-bottom: 50px;

        .up-btn {
          width: 86px;
          margin: 20px 0 20px 20px;
          font-size: 14px;
        }

        .add-btn {
          width: 95px;
          margin-left: 20px;
          margin-top: 10px;
          font-size: 14px;
        }

        .nav-tab {
          line-height: 36px;
          cursor: pointer;
          padding: 0 20px;
          font-size: 14px;

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
        position: relative;
        background: #ededed;

        .right-top {
          height: 72px;
          line-height: 72px;
          background: #fff;
          padding: 0 30px;

          .all-btn {
            font-size: 14px;
            float: right;
            margin-top: 20px;
          }
        }

        .imgs-containter {
          padding: 20px 0 0 25px;
          overflow: scroll;

          .imgs-box {
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 60px;

            .img-box {
              width: 210px;
              margin: 0 14px 20px 0;
              background: #fff;
              border-radius: 4px;
              position: relative;

              .img-p {
                width: 210px;
                height: 114px;

                .img-p-image {
                  width: 100%;
                  height: 100%;
                  border-radius: 4px 4px 0 0;
                }
              }

              .img-name {
                display: inline-block;
                height: 46px;
                line-height: 46px;
                width: 96%;
                margin-left: 8px;
                overflow: hidden;
              }

              .img-setting-btn {
                position: absolute;
                top: 10px;
                right: 0;
                display: none;

                .setting-btn {
                  width: 48px;
                  height: 28px;
                  font-size: 14px;
                  background: #000;
                  color: #fff;
                  opacity: 0.6;
                  cursor: pointer;
                  margin-right: 8px;
                  border-radius: 4px;
                  border: 0;
                }
              }

              .img-setting {
                display: none;
              }

              &:hover .img-setting-btn {
                display: block;
              }

              &:hover {
                box-shadow: 0 14px 19px rgba(0, 0, 0, 0.13);
              }
            }
          }

          .imgs-box-bot {
            padding-bottom: 145px;
          }
        }

        .choose {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: #fff;
          opacity: 0.6;

          .choose-icon {
            position: absolute;
            top: 5px;
            right: 5px;
            color: #1c7bef;
          }
        }

        /deep/ .page-btn {
          position: fixed;
          bottom: 0;
          right: 10px;
          left: 20px;
          background: #fff;
          padding: 20px 10px;
        }

        .all-choose-setting {
          height: 72px;
          line-height: 72px;
          background: rgba(0, 0, 0, 0.6);
          padding: 0 30px;
          position: fixed;
          bottom: 69px;
          left: 271px;
          right: 10px;

          .choose-setting {
            dispaly: inline-block;
            float: right;
          }
        }
      }
    }
  }

  .add-group-input {
    width: 90%;
  }

  .mt-15 {
    margin-top: 15px;
  }
</style>
