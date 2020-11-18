<template>
  <div class="packed_change">
    <dialogCom v-model='visible' :title='title' :hospitalizedNumber='patient.hospitalizedNumber' @save='save' :dis='!(form.change.length || form.bedIds.length)'>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
           <el-row>
                <el-col :span='12'>
                    <el-form-item label="当前床号:" prop="bed">
                        {{patient.bedName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="包床床号:" prop="newbed" v-if='type === "package"'>
                <el-select filterable multiple clearable placeholder="请选择" class="wb100" v-model="form.bedIds" value-key="doctorId">
                  <el-option
                      v-for="item in bedIds"
                      :key="item.bedId"
                      :label="item.bedName"
                      :value="item.bedId">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="新床号:" prop="newbed" v-if='type === "change"'>
                <el-select filterable clearable placeholder="请选择" class="wb100" v-model="form.change" value-key="doctorId">
                <el-option
                    v-for="item in changeList"
                    :key="item.bedId"
                    :label="item.showName"
                    :value="item.bedId">
                </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </dialogCom>
    <el-dialog
      width="30%"
      title="提示"
      :visible.sync="innerVisible"
      append-to-body>
      <span>{{rightBed.patientName}}占用当前床位，确定要互换床位么?</span>
         <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeBedSubmit">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import dialogCom from './dialog.vue'
import api from '@/inpatient/store/resident.js'
export default {
  props: ['areaId'],
  data () {
    return {
      api,
      title: '',
      visible: false,
      patient: {},
      form: {
        bedIds: [],
        change: ''
      },
      bedIds: [],
      changeList: [],
      rules: {
        bedIds: [
            { required: true, message: '请选择床位', trigger: 'change', type: 'string' }
        ],
        change: [
            { required: true, message: '请选择新床号', trigger: 'change', type: 'string' }
        ],
      },
      type: '',
      innerVisible: false,
      rightBed: {},
    }
  },
  watch: {

  },
  components: {
    dialogCom
  },
  mounted () {
  },
  methods: {
    async package () {
      let res = await this.api.getRoomNullBedList({
        roomId: this.patient.roomId,
        areaId: this.areaId
      })
      this.bedIds = res.data
    },
    async submitpackage () {
      let res = await this.api.packedBed({
        bedIds: this.form.bedIds,
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      .catch(_ => {
        this.$emit('success')
        this.visible = false
      })
      this.success(res)
    },
    success (res) {
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: this.type === 'package' ? '包床成功!' : '换床成功'
        })
        this.$bus.$emit('global:listwating')
        this.$emit('success')
        this.visible = false
        this.innerVisible = false
      }
    },
    async open (patient, type, list) {
      this.visible = true
      this.type = type
      this.patient = JSON.parse(JSON.stringify(patient))
      if (type === 'package') {
        this.rules.change = null
        this.title = '包床'
        this.package()
      }
      if (type === 'change') {
        this.rules.bedIds = null
        this.title = '换床'
        let result = await this.api.getAllBedList({
          areaId: this.areaId,
        })
        let arr = result.data
        this.changeList = arr.filter(ele => {
          ele.showName = ele.bedType === 1 ? ele.bedName : ele.bedName + ' (空)'
          return ele.bedId !== this.patient.bedId && ele.bedType !== 2 && ele.bedType !== 3
        })
      }
    },
    async changeBedSubmit () {
      let res = await this.api.changeBed({
        leftBed: this.patient,
        rightBed: this.rightBed
      })
      this.success(res)
    },
    async changeBed () {
      let res = await this.api.getBedById({ // 校验换床发起者的床位
        bedId: this.patient.bedId
      })
      let data = res.data || {}
      if (data.bedType !== this.patient.bedType || data.patientId !== this.patient.patientId) {
        this.$notify({
          type: 'error',
          message: '当前床位信息发生变化，请刷新后重试！'
        })
        this.$emit('success')
        this.visible = false
      } else {
        let rightBed = {}
        this.changeList.forEach(ele => {
          if (ele.bedId === this.form.change)rightBed = ele
        })
        this.rightBed = rightBed
        let res = await this.api.getBedById({ // 校验被换的床位
          bedId: rightBed.bedId
        })
        let obj = res.data || {}
        this.rightBed.hospitalizedNumber = obj.hospitalizedNumber
        if (obj.bedType) this.rightBed.bedType = obj.bedType
        if (this.rightBed.bedType === 3 || this.rightBed.bedType === 2) {
          this.$notify({
            type: 'error',
            message: '当前床位信息发生变化，请刷新后重试！'
          })
          this.$emit('success')
          this.visible = false
        } else if (this.rightBed.bedType === 1) {
          this.innerVisible = true
        } else {
          this.changeBedSubmit()
        }
      }
    },
    save () {
      if (this.type === 'package') this.submitpackage()
      if (this.type === 'change') this.changeBed()
    },
    cancle () {

    }
  }
}
</script>
<style lang='scss' scoped>

</style>
