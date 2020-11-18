<template>
  <div class="ever_allergichis_wrap" style="padding-right:10px">
    <el-form v-for="(item, i) in input" :key="i" style="margin-bottom:22px" :rules="rules" :model="item" ref="form">
      <el-row>
        <!--日视图-->
        <template v-if="type === '1'">
          <el-col :span="22">
            <el-form-item prop="time">
              <sys-select class="w" v-model="item.time" :options="timeData" :field="{multiple: true, multipleLimit: maxNum}"></sys-select>
            </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col :span="22">
            <week-time-picker v-model="item.time" :max-num="maxNum" :options="weekOptions"></week-time-picker>
          </el-col>
        </template>
        <el-col :span="2" class="handle_btn">
          <i class="iconfont icon-delete" @click="delItem(i)" v-if="input.length > 1"></i>
          <i class="iconfont icon-tianjia" @click="addItem(i)" v-if="(i + 1) === (input.length)"></i>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import weekTimePicker from './week.time.picker'
  export default {
    props: ['value', 'type', 'time', 'maxNum'],
    data () {
      let defValue = {time: ''}
      let rules = {
        time: [
          {required: true, message: '必填项', trigger: ['blur', 'change']}
        ]
      }
      return {
        defValue,
        disabled: true,
        input: this.value || [JSON.parse(JSON.stringify(defValue))],
        timeData: [],
        start: (this.time && this.time.start) || '00:00',
        end: (this.time && this.time.end) || '23:00',
        step: (this.time && this.time.step) || '01:00',
        weekOptions: [],
        rules
      }
    },
    components: {
      weekTimePicker
    },
    created () {
      let steps = this.step.split(':')
      let step = parseInt(steps[0], 10) * 60 + parseInt(steps[1], 10)
      let nowDate = this.$moment().format('YYYY-MM-DD')
      let start = this.$moment(`${nowDate} ${this.start}`)
      this.timeData.push({
        id: start.format('HH:mm'),
        name: start.format('HH:mm'),
        value: start.format('HH:mm'),
        label: start.format('HH:mm')
      })
      let end = this.$moment(`${nowDate} ${this.end}`)
      let current = start.add(step, 'm')
      while (current <= end) {
        this.timeData.push({
          id: current.format('HH:mm'),
          name: current.format('HH:mm'),
          value: current.format('HH:mm'),
          label: current.format('HH:mm')
        })
        current = current.add(step, 'm')
      }
      if (this.type === '2') {
        this.setWeekOptions()
      }
    },
    methods: {
      validate () {
        let allValid = true
        this.$refs.form.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              allValid = false
            }
          })
        })
        this.input.forEach(item => {
          if (!item || !item.time || item.time.length < this.maxNum) {
            allValid = false
          } else {
            let len = 0
            item.time.map(sitem => {
              len += 1
              if (!sitem) {
                allValid = false
              }
            })
            if (len !== this.maxNum) {
              allValid = false
            }
          }
        })
        return allValid
      },
      setWeekOptions () {
        const days = ['日', '一', '二', '三', '四', '五', '六']
        days.forEach(item => {
          this.weekOptions.push({
            value: `周${item}`,
            label: `周${item}`,
            children: this.timeData
          })
        })
      },
      addItem () {
        let isValid = true
        isValid = this.validate()
        if (isValid) this.input.push(JSON.parse(JSON.stringify(this.defValue)))
      },
      delItem (i) {
        this.input.splice(i, 1)
      }
    },
    watch: {
      value (val) {
        if (val && val.length) {
          this.input = val
        } else {
          this.input = [JSON.parse(JSON.stringify(this.defValue))]
        }
      },
      input: {
        handler (val) {
          this.$emit('input', val)
        },
        deep: true
      },
      type (val) {
        this.input = [JSON.parse(JSON.stringify(this.defValue))]
        if (val === '1') {
        } else if (val === '2') {
          this.setWeekOptions()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_allergichis_wrap{
    .handle_btn{
      white-space: nowrap;
      .iconfont{
        padding: 5px;
        color: #aaa;
        &:nth-child(1){
          margin-left: 10px;
         }
      }
    }
  }
</style>
