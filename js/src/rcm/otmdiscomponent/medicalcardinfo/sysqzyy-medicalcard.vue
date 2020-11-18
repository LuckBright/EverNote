<template>
  <div>
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="queryPersonInfo">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <!-- tabs -->
    <el-tabs v-model="selectPersonInfo" tab-position="left" @tab-click="tabChanged">
      <template v-for="item in medicalArr">
        <el-tab-pane :data="item" :label="item.name" :key="item.personNo" :name="item.personNo">
          <card-unit :medicalObj="item"></card-unit>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import cardUnit from '@/rcm/otmdiscomponent/sysqzyy-medical/medical-card/medicalcard-unit.vue'
import { queryPersonInfo } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
import getmacId from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { insuranceType } from '@/rcm/otmdiscomponent/config-js/sysqzyy-config.js'
const schema = [{
  label: '个人编号',
  name: 'personNo',
},
{
  label: '身份证号',
  name: 'idNo',
},
{
  label: '家庭编号',
  name: 'familyNo',
},
{
  label: '险种类型',
  name: 'insuredType',
  comp: 'ever-select',
  props: {
    options: insuranceType
  },
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}]
export default {
  mixins: [getmacId],
  props: ['medicalObj'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      sysqzyyCode
    }
  },
  methods: {
    queryPersonInfo () {
      let params = Object.assign({
        macId: this.macId,
        insuranceOrgId: this.sysqzyyCode
      }, { param: this.queryObj })
      queryPersonInfo(params).then(res => {
        let result = res.data && res.data.data.map(item => {
          // 对外的参数映射
          item.personname = item.name
          item.personno = item.personNo
          item.idno = item.idNo
          return item
        })
        this.medicalArr = result || []
      }).catch((err) => {
        console.log('err', err)
      })
    },
    tabChanged (tab) {
      this.$emit('selectedPersonInfo', tab.$attrs.data)
    }
  },
  computed: {
    medicalArr: {
      get () {
        return this.medicalObj
      },
      set (val) {
        this.$emit('update:medicalObj', val)
        this.$nextTick(_ => {
          this.$emit('selectedPersonInfo', val[0])
        })
      }
    },
    selectPersonInfo: {
      get () {
        if (this.medicalArr.length > 0) {
          return this.medicalArr[0].personNo
        }
        return ''
      },
      set (val) {

      }
    }
  },
  components: {
    cardUnit
  }
}
</script>
