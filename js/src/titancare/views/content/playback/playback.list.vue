<!--  -->
<template>
  <div>
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip label="开播标题" prop="liveTitle">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="开播时间"
        prop="startTime"
      ></el-table-column>
      <el-table-column show-overflow-tooltip label="主播医生" prop="doctorName">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" prop="mobile">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goLivePage(scope.row)"
            >回放</el-button
          >
          <el-popconfirm
            @onConfirm="deleteItem(scope.row)"
            title="删除后将无法再查看回放？确认要删除？"
          >
            <el-button type="primary" slot="reference" size="small"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import keymap from '@/titancare/views/content/playback/keymap'
import api from '@/titancare/api/content/playback'

export default {
  props: {
    data: Array
  },
  data () {
    return {
      keymap
    }
  },

  components: {},

  computed: {},

  mounted () { },

  methods: {
    async deleteItem (data) {
      const { id, root } = data
      const res = await api.del({ id })
      if (res && res.errCode === 0) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success'
        })
        root.handleCurrentChange(1)
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
        videoRecordId,
      }
      this.$router.push({ name: 'liveplayback', query: { liveRoom: JSON.stringify(obj) } })
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
