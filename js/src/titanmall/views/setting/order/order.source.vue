<template>
  <div class="main">
    <div class="region order-source">
      <p>
        设置后，订单管理功能中会记录订单来源信息。
      </p>
      <div class="source-box">
        <p class="source-title">
          <span style="width: 150px">来源记录类型：</span>
          <span style="width: 200px">ID信息：</span>
          <span style="width: 150px">来源名称：</span>
        </p>
        <div
          class="source-list"
          v-for="(item, index) in sourceList"
          :key="index"
        >
          <el-select
            class="mr20"
            v-model="item.sourceType"
            placeholder="请选择"
            size="small"
            style="width: 150px"
            :disabled="!!item.id"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            class="mr20"
            size="small"
            :disabled="!!item.id"
            v-model.trim="item.sourceId"
            style="width: 200px"
            placeholder="请填写ID信息"
          ></el-input>
          <el-input
            class="mr20"
            size="small"
            v-model.trim="item.sourceName"
            style="width: 150px"
            placeholder="请填写来源名称"
          ></el-input>
          <el-button
            v-if="item.id && item.sourceType !== 0"
            size="small"
            v-clipboard:copy="item.url"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="text"
          >复制商城网址
          </el-button
          >

          <i class="el-icon-delete delete-icon" @click="deleteClick(index)"></i>
        </div>
        <p class="mt10">
          <el-button
            size="small" type="primary" @click="addClick"
          >添加
          </el-button
          >
          <el-button
            :disabled="disabledAddBtn"
            size="small"
            type="primary"
            @click="sendClick"
          >保存
          </el-button
          >
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        options: [
          { label: 'THC租户ID', value: 0 },
          { label: '微信公众号APPID', value: 1 },
          { label: '微信小程序APPID', value: 2 },
        ],
        sourceObj: {
          sourceType: 0,
          sourceName: '',
          sourceId: '',
          id: '',
        },
        sourceList: [],
        disabledAddBtn: false,
      }
    },
    created () {
      this.getList()
    },
    methods: {
      // 获取列表
      async getList () {
        let url = await api.shopDomain()
        api.orderSourceList().then(res => {
          res.forEach(item => {
            item.url = 'https://' + url + this.$ever.h5MallIndex + 'home?shop=' + localStorage.getItem('MALLSHOPID') +
            '&sourceType=' + item.sourceType + '&sourceId=' + item.sourceId
          })
          this.sourceList = res
        })
      },

      // 添加
      addClick () {
        this.sourceList.push({
          sourceType: 0,
          sourceName: '',
          sourceId: '',
          id: '',
        })
      },

      // 删除
      deleteClick (index) {
        this.sourceList.splice(index, 1)
      },

      // 保存
      sendClick () {
        let sourceNameArr = this.sourceList.filter(item => !item.sourceName)
        let sourceIdArr = this.sourceList.filter(item => !item.sourceId)
        if (sourceIdArr.length) {
          this.$message.error('请输入ID信息')
          return
        }
        if (sourceNameArr.length) {
          this.$message.error('请输入来源名称')
          return
        }
        this.disabledAddBtn = true
        let params = this.sourceList
        api.orderSourceSave(params).then(res => {
          if (res) {
            this.$message.success('保存成功')
          }
          this.getList()
          setTimeout(() => {
            this.disabledAddBtn = false
          }, 1000)
        })
      },

      onCopy (e) {
        this.$message.success('复制成功')
      },
      onError (e) {
        this.$message.error('复制失败')
      },
    },
  }
</script>
<style lang="less" scoped>
  .order-source {

    .source-box {
      margin-top: 30px;

      .source-title {
        span {
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          color: #999;
        }
      }

      .source-list {
        margin: 20px 0;
      }
    }

    .mr20 {
      margin-right: 20px;
    }

    .delete-icon {
      margin-left: 15px;
      cursor: pointer;
    }
  }
</style>
