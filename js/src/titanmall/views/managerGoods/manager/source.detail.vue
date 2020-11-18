<template>
  <div class="main z-source">
    <div>
      <el-page-header @back="goBack" content="添加模板"></el-page-header>
    </div>
    <div class="region source-detail">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            size="small"
            style="width: 300px"
            placeholder="请输入模板名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="tempType" class="form-item-p">
          <el-radio-group
            v-model="ruleForm.tempType"
            @change="radioChange('day')"
          >
            <el-radio label="0">周模板</el-radio>
            <el-radio label="1">日历模板</el-radio>
          </el-radio-group>
          <span
            class="span-color ml10"
          >周模板会自动进行循环，更改周模板不会对已产生的预约造成影响。</span
          >
        </el-form-item>
        <el-form-item v-if="ruleForm.tempType === '1'" label="" prop="day">
          <p>
            <span>请选择起止日期</span>
            <el-date-picker
              class="mg"
              size="small"
              v-model="ruleForm.day"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @change="change"
            >
            </el-date-picker>
            <span class="span-color ml10">选择日历的起止日期，最长可选择90天。</span>
          </p>
        </el-form-item>
        <el-form-item label="时间颗粒" prop="timeType" class="form-item-p">
          <el-radio-group
            v-model="ruleForm.timeType"
            @change="radioChange('time', true)"
          >
            <el-radio label="0">按日期</el-radio>
            <el-radio label="1">按小时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.timeType === '1'" prop="time">
          <p>
            <span>营业时间</span>
            <el-time-picker
              class="mg"
              is-range
              v-model="ruleForm.time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
              format="HH:mm"
              value-format="HH:mm"
              @change="change"
            >
            </el-time-picker>
          </p>
        </el-form-item>
        <el-form-item label="" class="form-item-p">
          <el-switch v-model="ruleForm.isLimit" @change="change" class="mr10"></el-switch>
          <span v-if="ruleForm.timeType === '1'">限制每小时预约数量</span>
          <span v-else>限制每天预约数量</span>
        </el-form-item>
        <el-form-item v-if="ruleForm.isLimit" label="" prop="numLimit">
          <p v-if="ruleForm.timeType === '1' && ruleForm.isLimit">
            每小时限制
            <el-input
              class="mg"
              :disabled="!ruleForm.isLimit"
              v-model.trim="ruleForm.numLimit"
              size="small"
              style="width: 50px"
              maxlength="2"
              @change="change"
            ></el-input
            >
            人
          </p>
          <p v-if="ruleForm.timeType === '0' && ruleForm.isLimit">
            每天限制
            <el-input
              class="mg"
              :disabled="!ruleForm.isLimit"
              v-model.trim="ruleForm.numLimit"
              size="small"
              style="width: 50px"
              maxlength="2"
              @change="change"
            ></el-input
            >
            人
          </p>
        </el-form-item>
        <el-form-item label="可约范围" prop="timeLimit">
          当日及之后的
          <el-input
            class="mg"
            v-model.trim="ruleForm.timeLimit"
            size="small"
            style="width: 50px"
            maxlength="2"
            oninput="value=value.replace(/[^\d]/, '')"
            @blur="inputBlur"
          ></el-input
          >
          日可以预约，最多支持90天。
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary" size="small" @click="submitForm('ruleForm')"
          >下一步
          </el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        ruleForm: {
          name: '',
          tempType: '0',
          timeType: '0',
          day: [],
          time: [ '08:00:00', '18:00:00' ],
          timeLimit: '',
          numLimit: '',
          startDay: '',
          endDay: '',
          endTime: '',
          startTime: '',
          cntLimitVOS: [],
          isLimit: false,
        },
        rules: {
          name: [ { required: true, message: '请输入模板名称', trigger: 'blur' } ],
          day: [ { required: true, message: '请选择起止日期', trigger: 'blur' } ],
          time: [ { required: true, message: '请输入营业时间', trigger: 'blur' } ],
          timeLimit: [
            { required: true, message: '请输入可约范围', trigger: 'blur' },
          ],
          numLimit: [
            { required: true, message: '请输入限制人数', trigger: 'blur' },
          ],
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          },
        },
      }
    },
    created () {
      if (this.$route.query.form) {
        this.ruleForm = {
          ...this.ruleForm,
          ...JSON.parse(this.$route.query.form),
        }
        if (this.ruleForm.startTime) {
          this.ruleForm.time = [ this.ruleForm.startTime, this.ruleForm.endTime ]
        }
        if (this.ruleForm.startDay) {
          this.ruleForm.day = [ this.ruleForm.startDay, this.ruleForm.endDay ]
        }
      }
    },
    methods: {
      goBack () {
        this.$router.push({ path: '/titanmall/goodsmain/goodsmanager/sourcecomp' })
      },

      // 下一步
      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.ruleForm.tempType === '1') {
              let startDays = +new Date(this.ruleForm.day[0])
              let endDays = +new Date(this.ruleForm.day[1])
              let day = (endDays - startDays) / 1000 / 3600 / 24
              if (day >= 90) {
                return this.$message.error('起止日期相差不能大于90天')
              }
              this.ruleForm.startDay = this.ruleForm.day[0]
              this.ruleForm.endDay = this.ruleForm.day[1]
            }
            if (this.ruleForm.timeType === '1') {
              if (this.ruleForm.time[0] === this.ruleForm.time[1]) {
                return this.$message.error('营业起止时间不能相同')
              }
              this.ruleForm.startTime = this.ruleForm.time[0]
              this.ruleForm.endTime = this.ruleForm.time[1]
            }
            this.$router.push({
              path: '/titanmall/goodsmain/goodsmanager/sourcetemplate',
              query: { form: JSON.stringify(this.ruleForm) },
            })
          } else {
            return false
          }
        })
      },

      // 可约范围格式化数据
      inputBlur (v) {
        if (this.ruleForm.timeLimit > 90) {
          this.ruleForm.timeLimit = 90
        } else {
          if (this.ruleForm.timeLimit === '00' || this.ruleForm.timeLimit === '0') {
            this.ruleForm.timeLimit = 1
          } else {
            if (this.ruleForm.timeLimit[0] === '0') {
              this.ruleForm.timeLimit = this.ruleForm.timeLimit.slice(1)
            }
          }
        }
      },

      // 模板/日历  时间/日期 切换 (status = true)日期/时间
      radioChange (v, status) {
        if (status) {
          this.ruleForm.isLimit = false
          this.ruleForm.numLimit = ''
          this.ruleForm.startTime = ''
          this.ruleForm.endTime = ''
        } else {
          this.ruleForm.startDay = ''
          this.ruleForm.endDay = ''
        }
        this.ruleForm.cntLimitVOS = []
      },

      // change
      change (v) {
        this.ruleForm.cntLimitVOS = []
      },
    },
  }
</script>
<style lang="less" scoped>
  .z-source {
    margin: 10px;
  }
  .source-detail {
    .form-item-p {
      margin: 0 !important;
    }
  }

  .mg {
    margin: 0 10px;
  }

  .ml10 {
    margin-left: 10px;
  }
</style>
