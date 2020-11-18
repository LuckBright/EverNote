<template>
  <div>
    <el-form
      :model="obj"
      ref="form"
      class="form ever_query_from"
      :inline="true"
      @keyup.enter.native="query"
      onsubmit="return false;"
      size="small"
    >
      <template v-for="field in schema">
        <el-form-item
          :label="field.label"
          :prop="field.name"
          :label-width="field.width"
          :span="field.span"
          :key="field.name"
        >
          <template v-if="field.type=='empty'">
            <div style="height:36px"></div>
          </template>
          <template v-else-if="field.type=='patientselect'">
            <ever-patient-select
              v-model="obj[field.name]"
              :queryObj="obj"
              :use-text="field.useText"
              :placeholder="field.placeholder || '请输入关键词'"
              @change="query"
            ></ever-patient-select>
          </template>
          <template v-else-if="field.type=='recallpatientselect'">
            <ever-recall-patient-select
              v-model="obj[field.name]"
              :queryObj="obj"
              :use-text="field.useText"
              :placeholder="field.placeholder || '请输入关键词'"
              @change="query"
            ></ever-recall-patient-select>
          </template>
          <template v-else-if="field.type=='remotemethod'">
            <ever-remote-method
              :showKeys="field.showKeys"
              :style="field.style"
              :apiName="field.apiName"
              :params="field.params"
              v-model="obj[field.name]"
              :disabled="field.disabled"
              :placeholder="field.placeholder || field.label"
              :api="field.api"
              :initoptions="field.initoptions"
              :showName="field.showName"
              :userType="field.userType"
              :retain="field.retain"
              :retainEqual="field.retainEqual"
              :isLocalSettingSearch="field.isLocalSettingSearch"
              :needObjFlag="field.needObjFlag"
              :isObjSearch="field.isObjSearch"
              :paramsNameToCustom="field.paramsNameToCustom"
              :paramsNameToCustomType="field.paramsNameToCustomType"
              :isSilentQuery="field.isSilentQuery"
              @change="query"
            ></ever-remote-method>
          </template>
          <!-- <template v-else-if="field.type=='medicalselect'">
            <ever-medical-select
              v-model="obj[field.name]"
              :clearable="(field && (field.clearable || field.clearable === undefined)) ? true : false"
              @change="query"
            ></ever-medical-select>
          </template> -->
          <template v-else-if="!field.type || field.type=='text'">
            <el-input
              :style="field.style || {}"
              v-model="obj[field.name]"
              :class="field.class"
              :placeholder="field.placeholder ? field.placeholder : field.label"
              :disabled="field.disabled ? true : false"
              :clearable="(field && (field.clearable || field.clearable === undefined)) ? true : false"
            ></el-input>
          </template>
          <template v-else-if="field.type=='daterange'">
            <!--######################
            startName: '后端约定的起始时间字段name',
            endName: '后端约定的结束时间字段name',
            name: '标识表单，用于在同一个表单下多个daterange类型辨识，当datepick选择是一个值时是后端预定字段',
            type: 'daterange', // 固定值
            dateType: 'year/month/date/week/ datetime/datetimerange/daterange', // 日期类型
            label: '文字标识，可为空',
            placeholder: 'placeholder',
            format: '约定日期格式，YYYY-MM-DD、YYYY-MM-DD HH:mm:ss等',
            editable: false  // 是否可编辑 默认为true
            ###########################-->
            <div class="range-picker">
              <el-date-picker
                v-model="obj[field.name]"
                :type="field.dateType || 'daterange'"
                :placeholder="field.placeholder ? field.placeholder : field.label"
                :disabled="field.disabled"
                :editable="field.editable"
                :readonly="field.readonly ? true : false"
                :picker-options="field.pickerOptions"
                :clearable="(field && (field.clearable || field.clearable === undefined)) ? true : false"
                @change="query"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </div>
          </template>
          <template v-else-if="field.type=='rangedate'">
            <div class="range-picker">
              <date-picker
                v-model="obj[field.startName]"
                value-format="yyyy-MM-dd"
                :autoWidth="true"
                :type="field.dateType"
                :outformat="field.outformat"
              ></date-picker>
              <span style="display: inline-block;padding: 0 5px;color: #ddd;">{{field.split || '至'}}</span>
              <date-picker
                v-model="obj[field.endName]"
                :autoWidth="true"
                :type="field.dateType"
                :outformat="field.outformat"
              ></date-picker>
            </div>
          </template>
          <template v-else-if="field.type=='number'">
            <el-input
              v-model.number="obj[field.name]"
              :placeholder="field.placeholder"
              :style="field.style || {}"
              type="number"
            ></el-input>
          </template>
          <template v-else-if="field.type=='systype'">
            <sys-type
              v-if="field.code=='CV02.01.101'"
              :style="field.style"
              :code="field.code"
              :disabled="field.disabled"
              :multiple="field.multiple"
              :filterable="field.filterable"
              :use-value="field.useValue"
              :placeholder="field.placeholder"
              :clearable="(field && (field.clearable || field.clearable === undefined)) ? true : false"
              v-model="obj[field.name]"
            ></sys-type>
            <sys-type
              v-else
              :style="field.style"
              :code="field.code"
              :disabled="field.disabled"
              :multiple="field.multiple"
              :filterable="field.filterable"
              :use-value="field.useValue"
              :placeholder="field.placeholder"
              :clearable="(field && (field.clearable || field.clearable === undefined)) ? true : false"
              v-model="obj[field.name]"
              @change="query"
            ></sys-type>
          </template>
          <template v-else-if="field.type=='cascader'">
            <el-cascader
              :options="field.options"
              v-model="obj[field.name]"
              :clearable="true"
              :disabled="field.disabled"
              :filterable="field.filterable"
              :placeholder="field.placeholder"
              style="width:100%"
              :style="field.style || {}"
              @change="query"
            ></el-cascader>
          </template>
          <template v-else-if="field.type=='select'">
            <el-select
              v-model="obj[field.name]"
              :filterable="field.filterable"
              :disabled="field.disabled"
              :placeholder="field.placeholder ? field.placeholder : '请选择'"
              style="width: 100%"
              :style="field.style || {}"
              :clearable="(field.clearable || field.clearable === undefined) ? true : false"
              @change="query"
            >
              <el-option
                v-for="option in field.options"
                :key="option.id"
                :label="option.name"
                :value="field.useValue ? option.value : option.id"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="field.type=='remote'">
            <el-select
              v-model="obj[field.name]"
              filterable
              remote
              clearable
              :disabled="field.disabled"
              :placeholder="field.placeholder"
              :remote-method="field.funs"
              :loading="field.loading"
              :style="field.style || {}"
              @change="query"
            >
              <el-option
                v-for="item in field.options"
                :key="item.id"
                :label="item.name"
                :value="item.objectId || item.id"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="field.type=='radio'">
            <el-radio-group v-model="obj[field.name]" :style="field.style || {}">
              <el-radio
                :label="option.id"
                :key="option.id"
                v-for="option in field.options"
                @change="query"
              >{{option.name}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="field.type=='checkbox'">
            <el-checkbox-group v-model="obj[field.name]" @change="query" :style="field.style || {}">
              <el-checkbox
                v-for="option in field.options"
                :label="option.id"
                :key="option.id"
              >{{option.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="field.type=='checkbox_single'">
            <el-checkbox
              v-model="obj[field.name]"
              :true-label="field.truelabel"
              :false-label="field.falselabel"
              :style="field.style || {}"
              @change="query"
            >{{field.optionname}}</el-checkbox>
          </template>
          <template v-else-if="field.type=='date'">
            <date-picker
              v-model="obj[field.name]"
              :type="field.dateType"
              :outformat="field.outformat"
              @change="query(field.isQuery)"
            ></date-picker>
          </template>
          <template v-else-if="field.type=='month'">
            <date-picker
              v-model="obj[field.name]"
              type="month"
              placeholder="选择月"
              :outformat="field.outformat"
            ></date-picker>
          </template>
          <template v-else-if="field.type=='time'">
            <el-time-picker
              v-model="obj[field.name]"
              :editable="false"
              format="HH:mm"
              placeholder="选择时间"
            ></el-time-picker>
          </template>
          <template v-else-if="field.type=='autocomplete'">
            <el-autocomplete
              v-model="obj[field.name]"
              :fetch-suggestions="field.funs || querySearch"
              :placeholder="field.placeholder ? field.placeholder : field.label"
            ></el-autocomplete>
          </template>
          <template v-else-if="field.type=='sex'">
            <sex-select v-model="obj[field.name]"></sex-select>
          </template>
          <template v-else-if="field.type=='textarea'">
            <el-input
              type="textarea"
              :rows="2"
              :placeholder="field.label"
              v-model="obj[field.name]"
            ></el-input>
          </template>
          <template v-else-if="field.type=='custom'">
            <slot :name="field.name" :obj="obj"></slot>
          </template>
          <template v-else-if="field.type=='valueSet'">
            <el-select
              v-model="obj[field.name]"
              :disabled="field.disabled"
              :placeholder="field.placeholder ? field.placeholder : '请选择'"
              style="width: 100%"
              :clearable="(field.clearable || field.clearable === undefined) ? true : false"
              @change="query"
            >
              <el-option
                v-for="(key,value) in field.options"
                :key="value"
                :label="key"
                :value="value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          v-if="updateCreate"
          @click="update()"
          :icon="icon ? icon : 'search'"
        >{{btnName ? btnName : '更新'}}</el-button>
        <el-button
          v-else
          @click="query()"
          :disabled="loading"
          :icon="!loading ? 'search' : 'loading'"
          @keyup.enter.native="query"
          type="primary"
          class="search_btn"
        >{{btnName ? btnName : '查询'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { dateFormat, debounce } from '@/util/common'
export default {
  props: ['schema', 'value', 'labelPosition', 'labelWidth', 'span', 'btnName', 'loading', 'updateCreate', 'icon'],
  data () {
    return {
      gutter: 20,
      obj: this.value,
      dateFormat
    }
  },
  mounted () {
    this.$watch('obj', (newVal, val) => {
      if (newVal.enableDate) {
        if (!newVal.enableDate) return false
        if (newVal.disableDate && (newVal.enableDate > newVal.disableDate)) {
          newVal.disableDate = this.addDate(newVal.enableDate, 0)
        }
      }
      if (newVal.startDate) {
        if (!newVal.startDate) return false
        if (newVal.endDate && (newVal.startDate > newVal.endDate)) {
          newVal.endDate = this.addDate(newVal.startDate, 0)
        }
      }
      if (newVal.startTime) {
        if (!newVal.startTime) return false
        if (newVal.endTime && (newVal.startTime > newVal.endTime)) {
          newVal.endTime = this.addDate(newVal.startTime, 0)
        }
      }
      for (let item in newVal) {
        let schemaItem = this.$ever.getFieldFromSchema(this.schema, item)
        // 自定义结束时间 添加 23：59：59
        if (schemaItem && schemaItem.lastDate && newVal[schemaItem.name]) {
          this.value[schemaItem.name] = this.dateFormat(newVal[schemaItem.name], false, 'endDay')
        }
        if (schemaItem && schemaItem.type === 'daterange' && newVal[item]) {
          if (schemaItem.startName && newVal[item][0]) {
            this.value[schemaItem.startName] = schemaItem.format ? this.dateFormat(newVal[item][0], schemaItem.format) : newVal[item][0]
          } else {
            this.value[schemaItem.startName] = ''
          }
          if (schemaItem.endName && newVal[item][1]) {
            if (schemaItem.format === 'unix') {
              this.value[schemaItem.endName] = this.dateFormat(newVal[item][1], schemaItem.format, 'endDay')
            } else {
              this.value[schemaItem.endName] = schemaItem.format ? this.dateFormat(newVal[item][1], schemaItem.format) : newVal[item][1]
            }
          } else {
            this.value[schemaItem.endName] = ''
          }
          // 处理 year/month/date/week 类型
          if (!schemaItem.startName && !schemaItem.endName) {
            if (schemaItem.format) {
              this.value[schemaItem.name] = this.dateFormat(newVal[item], schemaItem.format)
            } else {
              if (schemaItem && schemaItem.dateType === 'week') {
                this.value[schemaItem.name] = this.dateFormat(newVal[item], 'week')
              } else {
                this.value[schemaItem.name] = newVal[item]
              }
            }
          }
        }
        if (schemaItem && schemaItem.type === 'daterange' && newVal[item] === null) {
          this.value[schemaItem.startName] = ''
          this.value[schemaItem.endName] = ''
        }
      }
    }, { deep: true })
  },
  methods: {
    query: debounce(function (isQuery) { // 由于带有初始值的 obj 会触发多次查询，使用 debounce 限制只进行一次
      if (isQuery === false) return false  //  增加当前元素是否需要触发query事件 默认设置了query事件就会触发 增加 isQuery: false = 不触发；
      if (!this.obj.u) {
        this.$emit('query', this.obj)
      }
      delete this.obj.u
    }),
    update () {
      this.$emit('update', this.obj)
      this.$emit('submit')
    },
    addDate (date, days) {
      var d = new Date(date)
      d.setDate(d.getDate() + days)
      var m = d.getMonth() + 1
      return Date.parse(new Date(d.getFullYear() + '-' + m + '-' + d.getDate()))
    },
    handleSelect (item) {
      console.log(item)
    },
    querySearch (queryString) {
      console.log(queryString)
    }
  }
}
</script>
<style lang="scss" scoped>
.form.ever_query_from {
  .el-form-item {
    margin-bottom: 10px;
  }
  .range-picker {
    /deep/ .el-date-editor--daterange.el-input {
      min-width: 240px;
    }
    /deep/ .el-date-editor--datetimerange.el-input {
      min-width: 360px;
    }
  }
}
</style>
