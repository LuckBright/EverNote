<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="10">
        <p>下拉选择列表</p>
        <p>一：值集下拉选择 systype 组件</p>
        {{sel1}}
        <!-- <sys-type code="THC_WH_PERSON_CATEGORY" v-model="sel1"></sys-type> -->
        <sys-type code="CT01.00.002" v-model="sel1"></sys-type>
        {{sel6}}
        <sys-type code="CT01.00.002" v-model="sel6" type="checkbox"></sys-type>

        <p>二：值集下拉选择 sysselect 组件</p>
        <p>{{sel2}}</p>
        <p>
          <sys-select v-model="sel2" :options="options1"></sys-select>
        </p>
        <p>{{sel21}}</p>
        <p>
          <sys-select
            v-model="sel21"
            :apiUrl="'/thc-platform-core/tsOrganizationSubject/pageList/'"
          ></sys-select>
        </p>
        <p>三：值集下拉选择 sysRemoteSelect 组件(依赖后端数据需要传apiUrl)</p>
        <p>{{sel3}}</p>
        <p>
          <sys-remote-select
            v-model="sel3"
            :apiUrl="'/thc-platform-core/tsOrganizationSubject/pageList/'"
          ></sys-remote-select>
        </p>
        <p>四：级联选择 sysTypeCascader 组件</p>
        <p>{{sel4}}</p>
        <p>
          <sys-type-cascader
            v-model="sel4"
            :filterable="true"
            code="CV06.00.228"
            api-url="/sob/frequencyItem/getFrequencyItemsByFrequencyCode"
            :api-params="[{code:'frequencyCode',value:'frequencyCode'}]"
            :change-select="true"
            :cache="true"
          ></sys-type-cascader>
        </p>
        <p>{{sel5}}</p>
        <p>
          <sys-type-cascader v-model="sel5" :filterable="true" code="CV06.00.102"></sys-type-cascader>
        </p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import sysTypeNew from '@/components/systypenew'
// import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  data () {
    return {
      sel1: '',
      sel2: '',
      sel21: '',
      sel3: '',
      sel4: '',
      sel5: '',
      sel6: [],
      options1: [
        {
          id: '阴性',
          name: '阴性'
        },
        {
          id: '阳性',
          name: '阳性'
        }
      ]
    }
  },
  created () {
    // 值集修改：
    // 例如：B。await sysvalue.listOnce(this.code)  -> await sysvalue.listOnce([this.code])
    // 如果有业务处理的，需要自己校验后端返回的格式是否够用，像下面这种，后端新接口没有parentid了，需要协商修改（后端添加还是前端用另外的方式实现）
    // sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
    //   this.typeoptions = []
    //   let Arr = []
    //   res.forEach(item => {
    //     if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
    //       this.typeoptions.push(item)
    //       Arr.push(item.id)
    //     }
    //   })
    //   // this.categoryArr = Arr
    //   // this.$ever.getFieldFromSchema(this.schema, 'categoryIds').options = this.typeoptions
    // })

    // 根据集code和值code换名字的方法如下：
    // sysvalue.getValByCode('THC_WH_DRUG_FORM', 1000000).then(res => {
    //   console.log(res, 'dddddddddddddddd')
    // })
    // sysvalue.getValByCode('THC_WH_DRUG_FORM', 1000002).then(res => {
    //   console.log(res, '222222')
    // })
    // sysvalue.getValByCode('THC_WH_DRUG_FORM', '180300').then(res => {
    //   console.log(res, '222222')
    // })
    // sysvalue.getValByCode('THC_WH_DRUG_FORM', '180301').then(res => {
    //   console.log(res, '222222')
    // })
    // sysvalue.getValByCode('THC_WH_DRUG_FORM', '180500').then(res => {
    //   console.log(res, '222222')
    // })
  },
  components: {
    // sysTypeNew
  }
}
</script>
