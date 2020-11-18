<template>
  <el-form
    :model="obj"
    ref="form"
    class="form"
    :label-width="labelWidth || '120px'"
    :label-position="labelPosition || 'top'"
    :rules="rules"
    :inline="inline"
    size="small"
  >
    <el-row :gutter="gutter">
      <template v-for="(field, index) in schema">
        <el-col v-if="field.type=='slice'" :span="24" :key="index">
          <h4 v-if="field.label" :class="field.className">{{field.label}}</h4>
        </el-col>
        <el-col
          v-else-if="field.type!='slice' && !field.hidden"
          :span="field.span || span || 12"
          :key="index"
        >
          <el-form-item :label="field.label" :prop="field.name" :class="field.className">
            <template v-if="field.type=='empty'">
              <div style="height:36px"></div>
            </template>
            <template v-else-if="field.type=='readonly'">
              <span>{{obj[field.name]}}</span>
            </template>
            <template v-else-if="field.type=='remote'">
              <el-select
                v-model="obj[field.name]"
                filterable
                remote
                clearable
                :width="field.width || '100%'"
                style="display: block"
                :disabled="field.disabled"
                :placeholder="field.placeholder"
                :remote-method="field.funs"
                :loading="field.loading"
              >
                <el-option
                  v-for="item in field.options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.objectId || item.id"
                ></el-option>
              </el-select>
            </template>
            <template v-else-if="!field.type || field.type=='text'">
              <el-input
                v-model.trim="obj[field.name]"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :disabled="field.disabled"
                :readonly="field.readonly ? true : false"
                :minlength="field.min"
                :maxlength="field.max ? field.max : 2000"
                :clearable="field.clearable"
              >
                <template slot="prepend" v-if="field.prepend">{{ field.prepend }}</template>
                <template slot="append" v-if="field.append">{{ field.append }}</template>
              </el-input>
            </template>
            <template v-else-if="!field.type || field.type=='spanTxt'">
              <span>{{obj[field.name]}}</span>
            </template>
            <template v-else-if="!field.type || field.type=='inputBtn'">
              <el-input
                v-model="obj[field.name]"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :disabled="field.disabled"
                :readonly="field.readonly ? true : false"
                :minlength="field.min"
                :maxlength="field.max ? field.max : 2000"
              >
                <!-- <el-button type="primary"  @click="selectUser(field.name)">选择用户</el-button> -->
                <template slot="append" v-if="field.btnName">
                  <el-button type="primary" @click="countNum(obj[field.name])">{{field.btnName}}</el-button>
                </template>
              </el-input>
            </template>
            <template v-else-if="!field.type || field.type=='inputSerBtn'">
              <el-input
                v-model="obj[field.name]"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :disabled="field.disabled"
                :readonly="field.readonly ? true : false"
                :minlength="field.min"
                :maxlength="field.max ? field.max : 2000"
              >
                <!-- <el-button type="primary"  @click="selectUser(field.name)">选择用户</el-button> -->
                <template slot="append" v-if="field.btnName">
                  <el-button type="primary" @click="searchCard(obj[field.name])">{{field.btnName}}</el-button>
                </template>
              </el-input>
            </template>

            <template v-else-if="field.type=='textWithTip'">
              <span :span="24">
                <el-col>
                  <el-input
                    v-model="obj[field.name]"
                    :placeholder="field.placeholder ? field.placeholder : field.label"
                    :disabled="field.disabled"
                    :inputWidth="field.inputWidth"
                    :span="12"
                    :minlength="field.min"
                    :maxlength="field.max"
                    :readonly="field.readonly ? true : false"
                  ></el-input>
                  <span :span="12">{{field.text || '请输入联系方式'}}</span>
                </el-col>
              </span>
            </template>
            <template v-else-if="field.type=='float'">
              <sys-float
                :disabled="field.disabled"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :use-prepend="field.prepend"
                :use-append="field.append"
                :use-unit="field.unit"
                v-model="obj[field.name]"
              ></sys-float>
            </template>
            <template v-else-if="field.type=='number'">
              <el-input
                v-model.number="obj[field.name]"
                type="number"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :disabled="field.disabled"
                :minlength="field.minlength"
                :maxlength="field.maxlength"
                :max="field.max"
                :min="field.min"
                :step="field.step"
              >
                <template slot="prepend" v-if="field.prepend">{{ field.prepend }}</template>
                <template slot="append" v-if="field.append">{{ field.append }}</template>
              </el-input>
            </template>
            <template v-else-if="field.type=='inputnumber'">
              <el-input-number
                v-model="obj[field.name]"
                :min="field.min"
                :max="field.max"
                :disabled="field.disabled"
              ></el-input-number>
            </template>
            <template v-else-if="field.type=='systype'">
              <sys-type
                :code="field.code"
                :firstDefault="field.firstDefault"
                :disabled="field.disabled"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :multiple="field.multiple"
                :filterable="field.filterable"
                :clearable="field.clearable"
                :use-value="field.useValue"
                :use-object="field.useObject"
                :cache="field.cache"
                v-model="obj[field.name]"
                :class="field.className"
                :ref="field.refValue"
                :obj-name="field.name"
                @change="change"
              ></sys-type>
            </template>
            <template v-else-if="field.type=='systyperadio'">
              <sys-type
                :code="field.code"
                v-model="obj[field.name]"
                :use-value="field.useValue"
                :disabled="field.disabled"
                :use-object="field.useObject"
                type="radio"
              ></sys-type>
            </template>
            <template v-else-if="field.type=='cascader'">
              <el-cascader
                :options="field.options"
                v-model="obj[field.name]"
                :clearable="true"
                filterable
                :disabled="field.disabled"
                style="width:100%"
              ></el-cascader>
            </template>
            <template v-else-if="field.type=='select'">
              <ever-select
                v-model="obj[field.name]"
                :width="field.width || '100%'"
                :needObjFlag="field.needObjFlag"
                :options="field.options"
                :disabled="field.disabled"
                :multiple="field.multiple"
                :placeholder="field.placeholder"
                :nodatatext="field.nodatatext"
                filterable
                :clearable="field.clearable"
                :allowCreate="field.allowCreate"
              ></ever-select>
            </template>
            <!-- <template v-else-if="field.type=='medicalselect'">
              <ever-medical-select
                v-model="obj[field.name]"
                :width="field.width || '100%'"
                :needObjFlag="field.needObjFlag"
                :options="field.options"
                :disabled="field.disabled"
                :multiple="field.multiple"
                :placeholder="field.placeholder"
                :nodatatext="field.nodatatext"
                :filterable="field.filterable"
                :clearable="field.clearable"
                :allowCreate="field.allowCreate"
              ></ever-medical-select>
            </template> -->
            <template v-else-if="field.type=='remoteselect'">
              <ever-remote-select
                v-model="obj[field.name]"
                :focus="field.focus"
                :remote="field.remote"
                :remote-method="field.remoteMethod"
                :disabled="field.disabled"
                :obj="field.objFlag"
                :placeholder="field.placeholder"
                :params="field.params"
                :initoptions="field.initoptions"
                :showKeys="field.showKeys"
              ></ever-remote-select>
            </template>
            <template v-else-if="field.type=='radio'">
              <el-radio-group v-model="obj[field.name]" :disabled="field.disabled">
                <el-radio
                  :label="option.id"
                  :key="option.id"
                  v-for="option in field.options"
                >{{option.name}}</el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="field.type=='radiotext'">
              <div class="fl">
                <el-radio-group v-model="obj[field.radioval]">
                  <el-radio
                    :label="option.id"
                    :key="option.id"
                    v-for="option in field.options"
                  >{{option.name}}</el-radio>
                </el-radio-group>
              </div>
              <div class="fl">
                <ever-price
                  v-if="obj[field.radioval ]== 1"
                  v-model="obj[field.name]"
                  :placeholder="field.placeholder"
                  :append="field.append"
                  style="margin-left:20px"
                  width="120px"
                  :max="field.max || 99999999"
                >
                </ever-price>
                <!-- <el-input
                  :placeholder="field.placeholder"
                  v-model="obj[field.name]"
                  v-if="obj[field.radioval]==1"
                  size="small"
                  style="margin-left:20px;width:120px;"
                  :minlength="field.min"
                  :maxlength="field.max"
                ></el-input> -->
              </div>
            </template>

            <template v-else-if="field.type=='addInput'">
              <div class="fl">
                <span v-for="(item, index) in obj[field.name]" :key="index">
                  <el-input
                    :placeholder="field.placeholder"
                    v-model="obj[field.name][index]"
                    size="small"
                    style="margin-right:20px;width:120px;"
                    :minlength="field.min"
                    :maxlength="field.max"
                  ></el-input>
                </span>
                <el-button type="primary" size="small" @click="addInput(obj[field.name])">+</el-button>
              </div>
            </template>
            <template v-else-if="field.type=='radiotext2'">
              <div class="fl">
                <el-radio-group v-model="obj[field.radioval]">
                  <el-radio
                    :label="option.id"
                    :key="option.id"
                    v-for="option in field.options"
                  >{{option.name}}</el-radio>
                </el-radio-group>
              </div>
              <div
                class="fl"
                v-for="(item, index) in field.placeholder1"
                v-if="obj[field.radioval]==1"
                :prop="item.name"
                :key="index"
              >
                <el-form-item :label="item.label">
                  <ever-price
                    v-model="obj[item.name]"
                    :placeholder="item.placeholder ? item.placeholder : item.label"
                    :append="item.append"
                    style="margin-left:20px"
                    width="120px"
                    :max="item.max || 99999999"
                  >
                  </ever-price>
                </el-form-item>
              </div>
            </template>
            <template v-else-if="field.type=='checkbox'">
              <el-checkbox-group v-model="obj[field.name]">
                <el-checkbox
                  v-for="option in field.options"
                  :label="option.id"
                  :disabled="field.disabled"
                  :key="option.id"
                >{{option.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
            <template
              v-else-if="field.type=='date' || field.type=='month' || field.type=='year' || field.type=='datetime'"
            >
              <date-picker
                v-model="obj[field.name]"
                :disabled="field.disabled"
                :type="field.type"
                :picker-options="field.pickerOptions"
                :outformat="field.outformat"
              ></date-picker>
            </template>
            <template v-else-if="field.type=='time'">
              <el-time-select
                v-model="obj[field.name]"
                :editable="false"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30'
                }"
                placeholder="选择时间"
              ></el-time-select>
            </template>
            <template v-else-if="field.type=='rangedate'">
              <div class="range-picker">
                <date-picker
                  v-model="obj[field.startName]"
                  style="width:125px"
                  :formatString="field.formatString"
                  :outformat="field.outformat"
                  @blur="compareFn"
                ></date-picker>至
                <date-picker
                  v-model="obj[field.endName]"
                  style="width:125px"
                  :formatString="field.formatString"
                  :outformat="field.outformat"
                ></date-picker>
              </div>
            </template>
            <template v-else-if="field.type=='daterange'">
              <div class="range-picker">
                <el-date-picker
                  v-model="obj[field.name]"
                  type="daterange"
                  :placeholder="field.placeholder ? field.placeholder : field.label"
                  :disabled="field.disabled"
                  :readonly="field.readonly ? true : false"
                  :editable="field.editable ? true : false"
                ></el-date-picker>
              </div>
            </template>
            <template v-else-if="field.type=='sex'">
              <sex-select v-model="obj[field.name]"></sex-select>
            </template>
            <template v-else-if="field.type=='textarea'">
              <el-input
                type="textarea"
                :rows="field.rows || 3"
                :autosize="field.autosize"
                :minlength="field.min"
                :maxlength="field.max ? field.max : 2000"
                :disabled="field.disabled"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                v-model="obj[field.name]"
              ></el-input>
            </template>
            <template v-else-if="field.type=='custom'">
              <slot :name="field.name" :obj="obj"></slot>
            </template>
            <template v-else-if="field.type=='selectuser'">
              <span v-if="field.shareCount">
                <label v-if="field.style=='label'">
                  <el-tag
                    @close="deleteUser(i,obj[field.name],field.name)"
                    :key="item.userName"
                    v-for="(item,i) in obj[field.name]"
                    type="primary"
                    :closable="true"
                    close-transition
                  >{{item.userName}}</el-tag>
                </label>
                <el-button size="small" @click="selectUser(field.name)">选择用户</el-button>
                <label
                  v-if="field.placeholder"
                  style="margin-left:10px;color:#999"
                >{{field.placeholder}}</label>
                <el-table :data="obj[field.name]" v-if="field.style=='table'" border>
                  <el-table-column type="index" width="55" align="center" label=" "></el-table-column>
                  <el-table-column prop="patientName" label="患者姓名"></el-table-column>
                  <el-table-column label="最高共享额度">
                    <template slot-scope="scope">
                      <el-input
                        placeholder="请输入共享额度"
                        v-model="obj[field.name][scope.$index]['maxShareMoney']"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="操作" width="200" align="center">
                    <template slot-scope="scope">
                      <el-button
                        size="small"
                        type="info"
                        v-if="scope.row.status === 1 && scope.row.id"
                        @click="startUser(scope.$index, obj[field.name],field.name)"
                      >启用</el-button>
                      <el-button
                        size="small"
                        type="danger"
                        v-if="scope.row.status === 0 && scope.row.id"
                        @click="stopUser(scope.$index, obj[field.name],field.name)"
                      >停用</el-button>
                      <el-button
                        size="small"
                        type="danger"
                        v-if="!scope.row.id"
                        @click="deleteUser(scope.$index, obj[field.name],field.name)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </span>
              <span v-else>此卡没有设置共享人数</span>
            </template>
            <template v-else-if="field.type=='ransfer'">
              <el-transfer
                filterable
                filter-placeholder="请输入分类名称"
                v-model="obj[field.name]"
                :data="field.data"
                :titles="['待选项', '已选项']"
              ></el-transfer>
            </template>
            <template v-else-if="field.type=='textgroup'">
              <div
                v-for="(key,i) in obj[field.name]"
                :style="{marginTop: i > 0?'10px':'0'}"
                :key="i"
              >
                <el-input
                  style="width:75%"
                  v-model="obj[field.name][i]"
                  :placeholder="field.placeholder ? field.placeholder : field.label"
                  :minlength="field.min"
                  :maxlength="field.max"
                  :prop="obj[field.name][i]"
                  :rules="{required: true, message: '不能为空', trigger: 'blur'}"
                ></el-input>
                <el-button
                  v-if="i === 0"
                  style="width:90px;margin-left:10px"
                  type="primary"
                  @click="addInputItem(i,obj[field.name])"
                >{{field.btnName[0]}}</el-button>
                <el-button
                  v-if="i > 0"
                  style="width:90px;margin-left:10px"
                  @click="delInputItem(i,obj[field.name])"
                >{{field.btnName[1]}}</el-button>
              </div>
            </template>
            <template v-else-if="field.type=='remotemethod'">
              <ever-remote-method
                v-model="obj[field.name]"
                :disabled="field.disabled"
                :placeholder="field.placeholder || field.label"
                :api="field.api"
                :initoptions="field.initoptions"
                :showName="field.showName"
              ></ever-remote-method>
            </template>
            <template v-else-if="field.type=='patientselect'">
              <ever-patient-select v-model="obj[field.name]" :placeholder="field.placeholder"></ever-patient-select>
            </template>
            <template v-else-if="field.type=='label'">
              <label>{{obj[field.name]}}</label>
            </template>
            <template v-else-if="field.type=='content'">
              <label v-html="obj[field.name]"></label>
            </template>
            <template v-if="field.append">
              <slot :name="field.name"></slot>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <slot></slot>
  </el-form>
</template>

<script>
export default {
  props: ['schema', 'value', 'labelPosition', 'labelWidth', 'span', 'rules', 'inline', 'size'],
  data () {
    return {
      gutter: 20,
      obj: {}
    }
  },
  created () {
    this.obj = this.value
  },
  beforeCreated () {
    if (!this.obj && this.schema) {
      this.obj = {}
      this.schema.forEach(item => {
        this.obj[item.name] = ''
      })
    }
  },
  methods: {
    uploadSuccess (file) {
      this.$emit('uploadSuccess', file)
    },
    uploadChange (fileList) {
      this.$emit('uploadChange', fileList)
    },
    addInput (data) {
      this.$emit('addInput', data)
    },
    searchCard (data) {
      this.$emit('searchCard', data)
    },
    countNum (data) {
      this.$emit('countNum', data)
    },
    selectUser (name) {
      this.$emit('selectuser', name)
    },
    deleteUser (index, rows, name) {
      rows.splice(index, 1)
      this.$emit('deleteuser', index, name)
    },
    stopUser (index, rows, name) {
      this.$emit('stopUser', index, name)
    },
    startUser (index, rows, name) {
      this.$emit('startUser', index, name)
    },
    addInputItem (i, rs) {
      rs.push('')
      this.$emit('addinputitem', i)
    },
    delInputItem (i, rs) {
      rs.splice(i, 1)
      this.$emit('delinputitem', i)
    },
    addDate (date, days) {
      var d = new Date(date)
      d.setDate(d.getDate() + days)
      var m = d.getMonth() + 1
      return Date.parse(new Date(d.getFullYear() + '-' + m + '-' + d.getDate()))
    },
    change (val, name, obj) {
      this.$emit('change', name, obj)
    }
  },
  mounted () {
    this.$watch('obj', (newVal, val) => {
      if (newVal.enableDate) {
        if (!newVal.enableDate) return false
        if (newVal.disableDate && (newVal.enableDate > newVal.disableDate)) {
          newVal.disableDate = this.addDate(newVal.enableDate, 1)
        }
      }
      if (newVal.startDate) {
        if (!newVal.startDate) return false
        if (newVal.endDate && (newVal.startDate > newVal.endDate)) {
          newVal.endDate = this.addDate(newVal.startDate, 1)
        }
      }
      if (newVal.startTime) {
        if (!newVal.startTime) return false
        if (newVal.endTime && (newVal.startTime > newVal.endTime)) {
          newVal.endTime = this.addDate(newVal.startTime, 1)
        }
      }
    }, { deep: true })
  },
  watch: {
    'value': {
      handler (cur, old) {
        this.obj = cur
      },
      deep: true
    }
  }
}
</script>
<style scoped>
/* .form /deep/ .el-form-item__content {
  line-height: 34px;
} */
</style>
