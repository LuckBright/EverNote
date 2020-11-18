<template>
  <span class="cell-component">
    <!--表格中需要使用组件的可以在这里加上-->
    <!--<template v-if="component.name === 'sys-value'">-->
    <!--  <sys-value v-if="getCode" :type="component.type" :code="getCode"></sys-value>-->
    <!--</template>-->
    <!--使用is属性-->
    <template v-if="!component.isSpecial">
      <component
        v-if="getCode"
        v-bind:is="component.name"
        v-bind="getProps"
      ></component>
      <span v-else>{{getDefaultCellValue()}}</span>
    </template>
    <!--特殊的组件可以在下面写-->
    <template v-else>
      <template v-if="component.name == 'sourceKey'">
        {{parserComplex({data: component.sourceKey ? scope.row[component.sourceKey] : scope.row, propertys: component.property, key: component.key, standard: component.standard}) || '-'}}
      </template>
      <template v-else-if="component.name == 'everSelect'">
        <ever-select :disabled="scope.row.compDisabled || scope.row.switchDisabled" v-model="scope.row[col.prop]" v-bind="component" @change="eventChange" size="small"></ever-select>
      </template>
      <template v-else-if="component.name == 'everRemoteMethod'">
        <!-- <ever-remote-select
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
        ></ever-remote-select> -->
        <ever-remote-select
          v-model="scope.row[col.prop]"
          v-bind="component"
          size="small"
          :disabled="scope.row.compDisabled || scope.row.switchDisabled"
          @change="eventChange"></ever-remote-select>
      </template>
      <template v-else-if="component.name == 'elSwitch'">
        <el-switch
          @change="eventChange"
          :active-value="1"
          :inactive-value="0"
          v-model="scope.row[col.prop]"
          :disabled="scope.row.compDisabled || scope.row.switchDisabled"
          >
        </el-switch>
      </template>
      <template v-else-if="component.name == 'multipleRows'">
        <multiple-row
          @updateList="eventChange"
          :list="scope.row[col.component.prop] || []"
          :attr="col.component">
        </multiple-row>
      </template>
    </template>
  </span>
</template>

<script>
import multipleRow from '@/manages/components/multiplerows'
import { parserJSON, parserComplex } from '@/util/materilconfig'
// 内置默认按钮映射关系
export default {
  props: ['scope', 'col', 'component'],
  data () {
    return {
      parserJSON,
      parserComplex
    }
  },
  computed: {
    getProps () {
      return {
        type: this.component.type,
        code: this.getCode
      }
    },
    getCode () {
      let value
      if (this.component.code) {
        const propPath = this.component.code.split('.')
        value = this.scope.row[propPath[0]]
        if (value && propPath.length > 1) {
          let i = 0
          while (i < propPath.length) {
            i++
            const tempValue = value[propPath[i]]
            if (tempValue === undefined) {
              break
            } else {
              value = tempValue
            }
          }
        }
      }
      return value
    }
  },
  methods: {
    eventChange (key, data) {
      if (key && data) this.scope.row[key] = data
      this.$emit('eventChange', this.col, this.component.method, this.scope.row)
    },
    getDefaultCellValue () {
      return this.$parent.$parent.getDefaultCellValue(this.col)
    }
  },
  components: {
    multipleRow,
  }
}
</script>

<style scoped lang="less">
</style>
