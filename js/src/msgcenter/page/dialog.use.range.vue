<template>
  <el-dialog
    title="批量修改范围"
    width="500"
    :visible.sync="visible"
    :before-close="handleClose"
    :close-on-click-modal="false">
    <div class="cnt">
      <set-use-range2 v-model="resObj"></set-use-range2>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="postData()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import setUseRange from './setuserange'
import setUseRange2 from './setuserange2'
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

export default {
  props: {
    'visible': {
      type: Boolean,
      default: false
    },
    'templateIds': {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      resObj: {
        applyOrgIds: [],
        applyDeptIds: []
      },
      isManage: this.$route.matched[0].meta.manage
    }
  },
  methods: {
    postData () {
      let params = {
        templateIds: this.templateIds,
        applyRanges: this.clinicAndDept,
        optType: (!this.isManage ? 1 : 0),
        orgIds: this.resObj.applyOrgIds,
        deptIds: this.resObj.applyDeptIds
      }
      request(urlMap.msg.msgTemplate.setApplyRange, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '批量设置成功')
          this.$emit('refresh')
          this.handleClose()
        }
      })
    },
    getData (data) {
      this.clinicAndDept = data
    },
    handleClose () {
      this.$emit('update:visible', false)
    },
  },
  components: {
    // setUseRange,
    setUseRange2
  }
}
</script>
<style scoped>
.cnt {
  max-height: 406px;
  overflow: auto;
}
</style>
