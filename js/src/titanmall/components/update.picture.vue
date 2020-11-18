<template>
  <div class="picture-container">
    <p style="margin-bottom: 10px">
      <span class="label-span">上传至分组</span>
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
        >
        </el-option>
      </el-select>
    </p>
    <div>
      <span class="label-span">本地图片</span>
      <upload-file2
        ref="uploadRef"
        @success1="uploadSuccess"
        @change="fileList"
        @preview="preview"
        @before="beforeImg"
        :list="imgArr"
        isMultiple="1"
        previewInline="true"
        uploadApiType="ever"
        listType="picture-card"
      ></upload-file2>
      <el-dialog :visible.sync="previewVisible" append-to-body>
        <img width="100%" :src="previewImageUrl" alt/>
      </el-dialog>
    </div>
    <div class="footer-btn">
      <el-button
        :disabled="isDisabled"
        size="small"
        type="primary"
        @click="sendImgBtn"
      >确认
      </el-button>
      <el-button size="small" @click="closeBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        groupName: '',
        options: [],
        imgArr: [],
        newArr: [],
        isDisabled: false,
        previewVisible: false,
        previewImageUrl: '',
      }
    },
    created () {
      this.getGroupList()
    },
    methods: {
      // 获取分组下拉列表
      async getGroupList () {
        this.options = await api.groupListByMaterialGroupBox()
        this.groupName = this.options[0].id
      },

      async uploadSuccess (file) {
        console.log('成功', file)
        // 上传成功赋值
        let textUrl = 'https://' + file.Location
        let url = await this.$_imgCut(textUrl, '147x80')
        this.imgArr.push({ url, fileUrl: url })
        this.newArr.push(textUrl)
        this.isDisabled = false
      },
      beforeImg (file) {
        this.isDisabled = true
      },
      fileList: function (file) {
        this.newArr = []

        if (file.length === 0) {
          this.imgArr = []
        } else {
          this.imgArr = file
          file.forEach(item => {
            this.newArr.push(item.url.split('?')[0])
          })
        }
      },
      preview (file) {
        this.previewImageUrl = ''
        this.previewImageUrl = file.url.split('?')[0]
        this.$nextTick(() => {
          this.previewVisible = true
        })
      },
      sendImgBtn () {
        if (!this.newArr.length) {
          this.$message({
            message: '请选择上传图片',
            type: 'error',
          })
          return
        }
        let arr = []
        this.newArr.forEach(item => {
          let obj = { name: '', url: '' }
          obj.url = item.split('.cn/')[1]
          arr.push(obj)
        })
        let params = {
          groupId: this.groupName,
          materialVOS: arr,
          type: 0,
        }
        api.materialConfigUpload(params).then(res => {
          if (res) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.$emit('close')
          }
        })
      },

      // 取消
      closeBtn () {
        this.$emit('close')
      },
    },
  }
</script>
<style lang="less" scoped>
  .picture-container {
    padding-bottom: 20px;

    .label-span {
      display: inline-block;
      width: 70px;
      height: 32px;
      line-height: 32px;
      color: #999;
      margin-right: 5px;
      text-align: right;
    }

    .footer-btn {
      margin: 20px 0 0 75px;
    }
  }
</style>
