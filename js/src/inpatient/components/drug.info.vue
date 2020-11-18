<template>
  <span class="drug_info">
    <i class="iconfont icon-info" style="font-size: 12px;" v-if="icon" @click.prevent="showItemsInfo"></i>
    <span v-else class="link">
      <span 
        :class="{'lineThrough': String(drugObj.status) === '11'}"
        @click.prevent="showItemsInfo"
        >
        {{(drugObj && drugObj.doctorAdviceName || drugObj.adviceJson.doctorAdviceName)}}
      </span>
      <el-popover
        v-if="drugObj.employ === '7' && drugObj.visitType === 3 && drugObj.termType === 0"
        width="200"
        trigger="hover"
        @show="taskLog(drugObj)">
        <template>皮试结果：{{skinRes || '——'}}</template>
        <template v-if="skinRemarks"><br/>备注：{{skinRemarks || '——'}}</template>
        <template slot="reference">
          <span @click.prevent>
            <svg class="icon" aria-hidden="true" style="font-size: 18px;">
              <use xlink:href="#icon-pishi"></use>
            </svg>
          </span>
        </template>
      </el-popover>
    </span>
    <drug-instructions ref="drugTips" :objData="patchObj"></drug-instructions>
  </span>
</template>

<script>
import api from '@/warehouse/store/drugapi'
import adviceApi from '@/infusion/store/advice.patient/advice'
import drugInstructions from '@/warehouse/page/storages/dispensings/components/drug.instructions'
export default {
  props: ['drugObj', 'icon', 'recipe'],
  data () {
    return {
      api,
      adviceApi,
      skinRes: '',
      skinRemarks: '',
      patchObj: {
        list: [],
        localsettingId: ''
      }
    }
  },
  watch: {
  },
  computed: {
  },
  components: {
    drugInstructions
  },
  created () {
  },
  methods: {
    async showItemsInfo () {
      const res = await this.api.getById({ids: [this.drugObj.globalMaterialId]})
      if (res && res[0] && res[0].ext) {
        this.$set(this.patchObj, 'list', res[0].ext)
        this.$set(this.patchObj, 'localsettingId', this.drugObj.localMaterialId)
        this.$refs.drugTips.open()
      } else {
        this.patchObj = {list: [], localsettingId: ''}
      }
    },
    async taskLog (obj) {
      if (!obj.doctorAdviceId && !obj.id) {
        this.skinRes = ''
        this.skinRemarks = ''
        return false
      }
      const res = await adviceApi.querySkinTestResult({doctorAdviceId: obj.doctorAdviceId || obj.id})
      if (res && res[0]) {
        this.skinRes = res[0].result
        this.skinRemarks = res[0].remark
      } else {
        this.skinRes = ''
        this.skinRemarks = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drug_info {
  p {
    margin: 5px 0;
    span {
      display: block; padding-left: 7px;
    }
  }
  .link {
    cursor: pointer;
    &:hover {
      color: #1c7bef;
    }
  }
  .lineThrough {
    text-decoration: line-through;
  }
}
</style>
