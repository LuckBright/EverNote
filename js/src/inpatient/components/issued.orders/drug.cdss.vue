<template>
  <div v-if="wringData.length" id="drug-waring-wrapper" style="padding:20px;margin: 15px 0">
    <div v-if="wringData.length" style="margin:0;padding-left:20px">
      <el-row>
        <el-col>
          <ul style="padding: 0;margin: 0;">
            <li v-for="(item, index) in wringData" :key="index">
              <template v-if="item.type === 0">
                <p>
                  {{item.tipTypeName}}:
                  患者【<sys-value type="THC_SYS_DRUG_ALLERGEN_SECONDARY" :code="item.part"></sys-value>】过敏，
                  {{item.tipInfo}}【{{item.drugName}}】
                </p>
              </template>
              <template v-if="item.type === 1">
                <p>{{item.tipInfo}}</p>
              </template>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    wringData: {
      type: Array,
      default: []
    }
  }
}
</script>
<style scoped>
#drug-waring-wrapper {
  border: 1px solid #ee4433;
  border-radius: 4px;
  background: rgba(238, 68, 51, 0.12);
  box-shadow: none;
  color: #ee4433;
  margin-bottom: 20px;
  line-height: 22px;
}
</style>
