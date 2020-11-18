<template>
  <div v-if="wringData.length" id="drug-waring-wrapper" style="padding:20px;margin: 15px 0">
    <div v-if="wringData.length" style="margin:0;padding-left:20px">
      <el-row>
        <el-col>
          <ol style="padding: 0;margin: 0;">
            <li v-for="key,i in wringData" style="list-style-type: decimal;">
              <template v-if="key.drugName">【{{key.drugName}}】</template>
              {{key.errorInfo ? key.errorInfo : ''}} {{key.advice ? key.advice : ''}}
            </li>
          </ol>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: ['wringData']
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
