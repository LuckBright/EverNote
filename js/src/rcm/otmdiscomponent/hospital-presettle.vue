<template>
  <el-dialog :visible.sync="v" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="bigTitle">
      <h2>定时任务设置</h2>
    </div>
    <el-divider></el-divider>
    <div class="content" v-loading="loading">
      <div class="upper">
        <div class="capter"></div>
        <div class="rightArea">
          <el-row class="timepickerRow">
            <div class="leftLabel">保险机构:</div>
            <div class="rightContent">
              <medicalOrgList
                v-model="insuranceOrgId"
                @change="getPresettleList"
                :defaultFirst="true"
              ></medicalOrgList>
            </div>
          </el-row>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="below">
        <div class="capter"></div>
        <div class="rightArea">
          <el-row
            class="timepickerRow"
            :key="`${index}_row`"
            v-for="(item,index) in customTimeList"
          >
            <div :key="`${index}_leftLabel`" class="leftLabel">执行时间:</div>
            <div :key="`${index}_rightContent`" class="rightContent">
              <el-time-picker
                :key="`${index}_datepicker`"
                v-model="item.time"
                :picker-options="{
                  selectableRange: '00:00:00 - 23:59:59'
                }"
                placeholder="任意时间点"
              ></el-time-picker>
              <el-button type="primary" size="small" @click="addNewRow">
                <i class="iconfont icon-tianjia"></i>
              </el-button>
              <el-button type="danger" size="small" @click="deleteRow(index)">
                <i class="iconfont icon-delete"></i>
              </el-button>
            </div>
          </el-row>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" size="small" @click="newOrUpdate">确定</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { timerSearch, timerSave, timerUpdate } from '@/rcm/store/otmdiscomponent/medicalsettle.js'
export default {
  props: ['hospitalSettleTimer'],
  data () {
    return {
      id: '',
      insuranceOrgId: '',
      // 自定义执行时间
      customTimeList: [{ index: 0, time: '' }],
      loading: false
    }
  },
  computed: {
    v: {
      get () {
        return this.hospitalSettleTimer
      },
      set (val) {
        this.$emit('update:hospitalSettleTimer', val)
      }
    }
  },
  methods: {
    addNewRow () {
      let length = this.customTimeList.length
      this.customTimeList.push({ index: length, time: '' })
    },
    deleteRow (index) {
      if (this.customTimeList.length > 1) {
        this.customTimeList.splice(index, 1)
      } else {
        // 要求点击最后一行的减号时，清空当前行数据，减号消失，加号留着
        this.customTimeList.length = 0
        this.addNewRow()
      }
    },
    cancel () {
      this.v = false
    },
    getPresettleList () {
      this.loading = true
      let params = { insuranceOrgId: this.insuranceOrgId }
      timerSearch(params).then(res => {
        let data = res.data
        let normalTimeList = this.getNormalizeTimeList(data.customTimeList)
        let customTimeList = normalTimeList && normalTimeList.map((item, index) => {
          let ret = {}
          ret.index = index
          ret.time = new Date(new Date().toLocaleDateString() + ' ' + item)
          return ret
        })
        this.id = data.id // 保存该设置的标识id
        if (!customTimeList || customTimeList.length === 0) {
          this.customTimeList = [{ index: 0, time: '' }]
        } else {
          this.customTimeList = customTimeList
        }
        this.loading = false
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    newOrUpdate () {
      if (!this.id) {
        // 没有id为新增
        this.saveTimer()
      } else {
        this.updateTimer()
      }
    },
    saveTimer () {
      this.loading = true
      let normalTimeList = this.postNormalizeTimeList(this.customTimeList)
      if (normalTimeList.length === 0) {
        this.$messageTips(this, 'error', '该机构为新增设置，有效的时间设置不能为空')
        this.loading = false
        return false
      }
      let params = {
        insuranceOrgId: this.insuranceOrgId,
        customTimeList: normalTimeList.map(item => this.$moment(item.time).format('HH:mm:ss'))
      }
      timerSave(params).then(res => {
        this.loading = false
        this.id = res.data && res.data.id
        this.$messageTips(this, 'success', '设置成功')
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    updateTimer () {
      let normalTimeList = this.postNormalizeTimeList(this.customTimeList)
      if (normalTimeList.length === 0) {
        this.$confirm('该机构没有进行有效的时间设置，继续保存将按删除本机构的预结算设置，确定要继续吗?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          closeOnClickModal: false, // 禁止点背景时关闭
          closeOnPressEscape: false // 禁止按esc关闭确认框
        }).then(() => {
          this.doUpdate(normalTimeList)
        }).catch(() => {

        })
      } else {
        this.doUpdate(normalTimeList)
      }
    },
    doUpdate (normalTimeList) {
      this.loading = true
      let params = {
        id: this.id,
        insuranceOrgId: this.insuranceOrgId,
        customTimeList: normalTimeList.map(item => this.$moment(item.time).format('HH:mm:ss'))
      }
      timerUpdate(params).then(res => {
        this.loading = false
        this.$messageTips(this, 'success', '保存成功')
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    getNormalizeTimeList (list) {
      if (!list) {
        return
      }
      return list.filter(item => item !== 'Invalid date')
    },
    postNormalizeTimeList (list) {
      if (!list) {
        return
      }
      return list.filter(item => item !== 'Invalid date' && item.time !== '')
    }
  },
  components: {
    medicalOrgList
  },
}
</script>

<style scoped>
.bigTitle h2 {
  text-align: center;
}
.content .upper,
.content .below {
  display: flex;
  align-items: center;
}
.content .below {
  height: 300px;
  overflow: scroll;
}
.capter {
  width: 14px;
  height: 14px;
  border: 1px solid #000;
  border-radius: 50%;
}
.rightArea {
  margin-left: 15px;
  line-height: 39px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.rightArea .timepickerRow {
  margin-bottom: 5px;
}
.rightArea .timepickerRow .leftLabel {
  float: left;
  width: 120px;
  text-align: right;
}
.rightArea .timepickerRow .rightContent {
  float: left;
  display: flex;
  margin-left: 15px;
}
.rightArea .timepickerRow .rightContent .el-button {
  margin-left: 15px;
}
.buttons {
  text-align: right;
}
</style>
