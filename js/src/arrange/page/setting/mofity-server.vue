<template>
  <el-dialog
    title="修改服务"
    :visible.sync="show"
    @closed="closed"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="40%"
  >
    <el-form>
      <el-form-item label="服务" :label-width="formLabelWidth">
        <el-select v-model="nowserviceList" multiple style="width:100%" value-key="id">
          <el-option v-for="item in serviceList" :key="item.id" :value="item" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import arrangeapi from '@/arrange/store/schedulingapi'
export default {
  props: ['dialogTableVisible', 'info', 'serviceList'],
  data () {
    return {
      arrangeapi,
      show: false,
      nowserviceList: [],
      formLabelWidth: '40px',
      lastserviceList: []
    }
  },
  watch: {
    dialogTableVisible (val) {
      this.show = val
    },
    show (val) {
      this.$emit('update:dialogTableVisible', val)
    }
  },
  methods: {
    confirm () {
      this.show = false
      let arrList = []
      this.nowserviceList.map(item => {
        arrList.push({ serviceId: item.id, serviceName: item.name })
      })
      let params = {
        id: this.info.basesetResourceId,
        serviceRelList: arrList
      }
      this.arrangeapi.updateServiceRelList(params)
        .then(rs => {
          if (rs.errCode) {
            return false
          }
          this.$notify({
            title: '提示',
            message: '修改服务成功',
            type: 'success',
            duration: 2000
          })
          this.$emit('refresh', '')
        })
    },
    closed () {
      this.nowserviceList = []
    }
  }
}
</script>
