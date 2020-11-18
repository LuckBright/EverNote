<!--  -->
<template>
  <div class="m10 image-box inline-block">
    <div>
      <img :src="videoFaceUrl" class="image" />
    </div>
    <div class="bottom_box">
      <div class="">{{ liveTitle }}</div>
      <div>
        <el-button
          class="mini b"
          type="primary"
          size="mini"
          @click="goLivePage(data)"
          >回放</el-button
        >
        <el-popconfirm
          @onConfirm="deleteItem"
          title="删除后将无法再查看回放？确认要删除？"
        >
          <el-button class="mini"  slot="reference" size="small">删除</el-button>
        </el-popconfirm>
      </div>
    </div>
    <div class="avatar1">
      <ever-image class="img" :src="doctorFaceUrl"></ever-image>
      <span class="opacity inline-block"></span>
      <span class="name ellipsis" :title="doctorName">{{ doctorName }}</span>
    </div>
  </div>
</template>

<script>
import api from '@/titancare/api/content/playback'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      ...this.data
    }
  },
  methods: {
    async deleteItem () {
      const res = await api.del({ id: this.id })
      if (res && res.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        this.root.handleCurrentChange(1)
      } else {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'warning'
        })
      }
    },
    goLivePage (row) {
      const { playbackUrl, videoFaceUrl, id, videoRecordId } = row
      const obj = {
        playbackUrl,
        videoFaceUrl,
        id,
        videoRecordId
      }
      this.$router.push({ name: 'liveplayback', query: { liveRoom: JSON.stringify(obj) } })
    }
  }
}
</script>
<style lang='scss' scoped>
.image-box {
  position: relative;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
  width: 378px;
  height: 288px;
  border-radius: 4px;
  .bottom_box {
    margin-top: 3px;
    margin-left: 10px;
    padding: 5px;
    box-sizing: border-box;
    height: 78px;
  }
  .mini {
    margin-top: 5px;
    margin-right: 10px;
    width: 64px;
    height: 32px;
    font-size: 14px;
  }
  .b {
    line-height: 21px;
  }
  .image {
    width: 378px;
    height: 210px;
    border-radius: 4px 4px 0px 0px;
  }
  .label-text {
    position: absolute;
    right: 5px;
    top: 35px;
  }
  .avatar1 {
    position: absolute;
    top: 11px;
    left: 10px;
    .opacity {
      background-color: black;
      opacity: 0.1;
      width: 104px;
      height: 40px;
      border-radius: 20px;
      padding-left: 42px;
      font-size: 15px;
      line-height: 40px;
      box-sizing: border-box;
      color: white;
    }
    .name {
      position: absolute;
      top: 12px;
      left: 42px;
      color: white;
      width: 48px;
    }
    .img {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 5px;
      left: 4px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
</style>
