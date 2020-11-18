<template>
  <div class="layout_inner">
    <div class="main-head oa">
      <el-row>
       <el-col :span="12">
         <ever-form2
           v-model="queryObj"
           ref="form"
           :schema="querySchema"
           :rules="rules"
           label-width="150px"
         >
           <template slot="bizCode">
             <el-col>
               <el-form-item>
                 <el-select
                   v-model="queryObj.bizCode"
                   class="w"
                   clearable filterable :placeholder="getPh('bizCode')">
                   <el-option
                     v-for="item in bizList"
                     :key="item.code"
                     :label="item.name + '(' + item.code + ')'"
                     :value="item.code">
                   </el-option>
                 </el-select>
               </el-form-item>
             </el-col>
           </template>
           <template slot="bizDomainCode">
             <el-col>
               <el-form-item>
                 <el-select
                   v-model="queryObj.bizDomainCode"
                   class="w"
                   clearable filterable :placeholder="getPh('bizDomainCode')">
                   <el-option
                     v-for="item in bizDomainList"
                     :key="item.code"
                     :label="item.name + '(' + item.code + ')'"
                     :value="item.code">
                   </el-option>
                 </el-select>
               </el-form-item>
             </el-col>
           </template>
           <template slot="sequenceBit">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.sequenceBit" :ph="getPh('sequenceBit')" @sort="handleSort('sequenceBit', $event)" :hide-up="isFirst('sequenceBit')" :hide-down="isLast('sequenceBit')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="businessCode">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.businessCode" :ph="getPh('businessCode')" @sort="handleSort('businessCode', $event)" :hide-up="isFirst('businessCode')" :hide-down="isLast('businessCode')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="dateStyle">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.dateStyle" :ph="getPh('dateStyle')" comp="select" :options="dateStyleList" @sort="handleSort('dateStyle', $event)" :hide-up="isFirst('dateStyle')" :hide-down="isLast('dateStyle')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="attr1">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.attr1" :ph="getPh('attr1')" @sort="handleSort('attr1', $event)" :hide-up="isFirst('attr1')" :hide-down="isLast('attr1')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="attr2">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.attr2" :ph="getPh('attr2')" @sort="handleSort('attr2', $event)" :hide-up="isFirst('attr2')" :hide-down="isLast('attr2')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="attr3">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.attr3" :ph="getPh('attr3')" @sort="handleSort('attr3', $event)" :hide-up="isFirst('attr3')" :hide-down="isLast('attr3')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="attr4">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.attr4" :ph="getPh('attr4')" @sort="handleSort('attr4', $event)" :hide-up="isFirst('attr4')" :hide-down="isLast('attr4')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="attr5">
             <el-col>
               <el-form-item>
                 <sort-input v-model="queryObj.attr5" :ph="getPh('attr5')" @sort="handleSort('attr5', $event)" :hide-up="isFirst('attr5')" :hide-down="isLast('attr5')"></sort-input>
               </el-form-item>
             </el-col>
           </template>
           <template slot="default">
             <el-col>
               <el-form-item>
                 <el-button size="small" type="primary" @click="save()">保存</el-button>
                 <el-button size="small" @click="back">返回</el-button>
               </el-form-item>
             </el-col>
           </template>
         </ever-form2>
       </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {pattern} from '@/follow/util/model'
  import {debounce1 as debounce, listDestValue} from '@/util/common'
  import {request} from '@/util/req'
  import urlMap from '@/systemset/urls'
  import commonUrlMap from '@/util/urls'
  import SortInput from '@/systemset/components/sortinput'
  import {dateStyleList} from '@/systemset/page/system/model'
  import './index.less'
  const numMap = {
    businessCode: 'businessNumber',
    dateStyle: 'dateNumber',
    sequenceBit: 'sequenceNumber',
    attr1: 'attr1Number',
    attr2: 'attr2Number',
    attr3: 'attr3Number',
    attr4: 'attr4Number',
    attr5: 'attr5Number',
  }
  const fixedFieldList = [
    'bizCode',
    'bizDomainCode',
    'currentNumber',
    'currentDate',
    'currentSequence',
  ]
  const querySchema = [
    {
      name: 'code',
      label: '唯一标识',
      span: 24
    },
    {
      name: 'bizCode',
      label: '业务模块',
      comp: 'custom',
      span: 24
    },
    {
      name: 'bizDomainCode',
      label: '业务域',
      comp: 'custom',
      span: 24
    },
    {
      name: 'currentNumber',
      label: '当前自增数',
      span: 24,
    },
    {
      name: 'currentDate',
      label: '当前日期',
      span: 24,
    },
    {
      name: 'currentSequence',
      label: '当前序列号',
      span: 24,
    },
    {
      name: 'businessCode',
      label: '业务编码',
      comp: 'custom',
      span: 24
    },
    {
      name: 'dateStyle',
      label: '日期格式',
      comp: 'custom',
      span: 24
    },
    {
      name: 'sequenceBit',
      label: '自增位数',
      comp: 'custom',
      span: 24
    },
    {
      name: 'attr1',
      label: '扩展属性1',
      comp: 'custom',
      span: 24
    },
    {
      name: 'attr2',
      label: '扩展属性2',
      comp: 'custom',
      span: 24
    },
    {
      name: 'attr3',
      label: '扩展属性3',
      comp: 'custom',
      span: 24
    },
    {
      name: 'attr4',
      label: '扩展属性4',
      comp: 'custom',
      span: 24
    },
    {
      name: 'attr5',
      label: '扩展属性5',
      comp: 'custom',
      span: 24
    },
  ]
  const rules = {
    code: {required: true},
    bizCode: {required: true},
    bizDomainCode: {required: true},
    sequenceBit: {required: true},
  }
  export default {
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        queryObj,
        rules,
        routeId: '',
        pagePattern: pattern.EDIT,
        pattern,
        bizList: [],
        bizDomainList: [],
        sortList: [],
        dateStyleList,
      }
    },
    created () {
      request(commonUrlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_BUSINESS']}).then(res => {
        if (res.head.errCode === 0) {
          this.bizDomainList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      request(commonUrlMap.valueSet.getValueListByCode, {setCode: ['THC_SYS_PROJECT']}).then(res => {
        if (res.head.errCode === 0) {
          this.bizList = res.data.resultList.map(item => ({id: item.code, name: item.name, code: item.code}))
        }
      })
      // request(commonUrlMap.nodeInfo.getBizMap).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.bizList = res.data
      //   }
      // })
      // request(commonUrlMap.nodeInfo.getBizDomainMap).then(res => {
      //   if (res.head.errCode === 0) {
      //     this.bizDomainList = res.data
      //   }
      // })
      this.routeId = this.$route.params.id
      if (this.routeId) {
        this.pagePattern = pattern.EDIT
        this.search()
      } else {
        this.pagePattern = pattern.CREATE
        this.getSort()
        this.changeSort()
      }
    },
    methods: {
      changeSort () {
        this.queryObj = {...this.queryObj, ...this.sortList.map(item => ({[item.numberKey]: item.value})).reduce((p, c) => ({...p, ...c}), {})}
      },
      search () {
        request(urlMap.sequenceRule.getSequenceRule, {id: this.routeId}).then(res => {
          if (res.head.errCode === 0) {
            this.queryObj = res.data
            this.getSort()
            this.setSort()
          }
        })
      },
      save: debounce(function () {
        this.$refs.form.$refs.form.validate(valid => {
          if (!valid) {
            return
          }
          request(urlMap.sequenceRule[this.pagePattern === pattern.CREATE ? 'createSequenceRule' : 'updateSequenceRule'], {
            ...this.queryObj,
            bizName: listDestValue(this.bizList, this.queryObj.bizCode, 'code', 'name'),
            bizDomainName: listDestValue(this.bizDomainList, this.queryObj.bizDomainCode, 'code', 'name'),
          }).then(res => {
            if (res.head.errCode === 0) {
              this.$messageTips(this, 'success', '保存成功')
              this.$router.push('/systemset/sequenceRule')
            }
          })
        })
      }, 200),
      back () {
        this.$router.push('/systemset/sequenceRule')
      },
      handleSort (name, command) {
        const crtSortItem = this.sortList.find(item => item.name === name)
        if (command === 'up') {
          if (crtSortItem.value !== 1) {
            const upOne = this.sortList.find(item => item.value === crtSortItem.value - 1)
            upOne.value = upOne.value + 1
            crtSortItem.value = crtSortItem.value - 1
          }
        } else {
          if (crtSortItem.value !== this.sortList.length) {
            const downOne = this.sortList.find(item => item.value === crtSortItem.value + 1)
            downOne.value = downOne.value - 1
            crtSortItem.value = crtSortItem.value + 1
          }
        }
        this.sortList.sort((a, b) => {
          return a.value - b.value
        })
        // 改变schema的顺序
        this.setSort()
        // query 改变顺序值
        this.changeSort()
      },
      setSort () {
        this.querySchema = [
          ...fixedFieldList.map(item => this.querySchema.find(s => s.name === item)),
          ...this.sortList.map(item => this.querySchema.find(s => s.name === item.name)),
        ]
      },
      getSort () {
        const numKeys = Object.keys(numMap)
        if (this.routeId) {
          // 当有routeId时根据queryObj确定顺序
          const me = this
          numKeys.forEach((item, i) => {
            me.sortList[i] = {
              name: item,
              numberKey: numMap[item],
              // 自动补全value
              value: me.queryObj[numMap[item]] || (i + 1)
            }
          })
        } else {
          // 当无routeId时，按照默认的顺序
          this.querySchema.filter(item => numKeys.includes(item.name)).forEach((item, i) => {
            this.sortList[i] = {
              name: item.name,
              numberKey: numMap[item.name],
              value: i + 1,
            }
          })
        }
      },
      isFirst (name) {
        const item = this.sortList.find(item => item.name === name)
        return item && item.value === 1
      },
      isLast (name) {
        const item = this.sortList.find(item => item.name === name)
        return item && item.value === this.sortList.length
      },
      getPh (prop) {
        return this.querySchema.find(item => item.name === prop).label
      },
    },
    components: {SortInput}
  }
</script>
<style scoped lang="less">
</style>
