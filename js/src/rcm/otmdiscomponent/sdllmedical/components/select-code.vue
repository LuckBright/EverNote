<template>
  <ever-select v-model="val" :options="innerOptions"></ever-select>
</template>

<script>
import { getListByCode } from '@/rcm/store/otmdiscomponent/sdllyb-api.js'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  // code,获取字典编码的编号
  // firstDefault,是否设置第一个为默认
  props: ['value', 'code', 'firstDefault'],
  data () {
    return {
      sdllCode,
      innerOptions: []
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    getListByCode () {
      const params = {
        macId: this.macId,
        insuranceOrgId: this.sdllCode,
        sbjgbh: '37140101', // 社保机构编号写死的
        jsonPara: {
          dmbh: this.code
        }
      }
      getListByCode(params).then(res => {
        let result = res.data && res.data.code_ds.map(item => {
          item.id = item.code
          item.name = item.content
          return item
        })
        this.innerOptions = result
        if (this.firstDefault) {
          const first = result && result[0]
          this.val = first && first.id
        }
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
  created () {
    this.getListByCode()
  },
}
</script>
