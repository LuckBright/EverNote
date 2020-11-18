<template>
  <div class="ever_tpl_con">
    <template v-if="schema && schema.length && detailData">
      <div class="top_til">{{title}}<span class="quote_btn" @click="quoteHandle(detailData)">引用</span></div>
      <el-row class="detail_wrap">
        <el-col v-for="item,index in schema" :key="index" :span="24">
          <template v-if="detailData[item.name]">
            <template v-if="item.children && item.children.schema">
              <label :for="item.name">{{item.label}}：</label>
              <div class="detail_txt">
                <template v-for="sitem,sindex in item.children.schema">
                  <template v-if="sitem.name === 'bloodPressure'">
                    <em>{{sitem.label}}：{{detailData[item.name].highBloodPressure ? detailData[item.name].highBloodPressure : '--'}} - {{detailData[item.name].lowBloodPressure ? detailData[item.name].lowBloodPressure : '--'}}{{sitem.unit}}</em>
                  </template>
                  <template v-else>
                    <em>{{sitem.label}}：{{detailData[item.name][sitem.name]}}{{sitem.unit}}</em>
                  </template>
                </template>
                <span class="quote_btn" @click="quoteHandle(detailData[item.name], item.name)">引用</span>
              </div>
            </template>
            <template v-else>
              <template v-if="item.name === 'allergicHis' && detailData['hasAllergicHis'] === false">
                <label :for="item.name">{{item.label}}：</label>
                <div class="detail_txt">否认<span class="quote_btn" @click="quoteHandle(detailData['hasAllergicHis'], 'hasAllergicHis')">引用</span></div>
              </template>
              <template v-else-if="item.name === 'furTryHis' && detailData['hasFurTryHis'] === 0">
                <label :for="item.name">{{item.label}}：</label>
                <div class="detail_txt">否认<span class="quote_btn" @click="quoteHandle(detailData['hasFurTryHis'], 'hasFurTryHis')">引用</span></div>
              </template>
              <template v-else>
                <label :for="item.name">{{item.label}}：</label>
                <div class="detail_txt">
                  <template v-if="item.name === 'allergicHis'">
                    <template v-for="sitem,sindex in detailData[item.name]">
                      <template v-if="sitem.allergen">
                        <sys-value type="CV05.01.038" :code="sitem.allergen"></sys-value>
                        <span>{{sitem.remark ? (' - ' + sitem.remark) : ''}}</span>
                        <span v-if="detailData[item.name].length !== (sindex+1)">；</span>
                      </template>
                      <template v-else>——</template>
                    </template>
                  </template>
                  <template v-else-if="item.name === 'results'">
                    <template v-for="sitem,sindex in detailData[item.name]">
                      <template v-if="sitem.diseaseName">
                        <span>{{sitem.diseaseName}}</span>
                        <span>{{sitem.diseaseCode}}</span>
                        <span>{{sitem.comment ? (' - ' + sitem.comment) : ''}}</span>
                        <span>{{sitem.diagnoseType === 2 ? '【待查】' : ''}}</span>
                        <span v-if="detailData[item.name].length !== (sindex+1)">，</span>
                      </template>
                      <template v-else>——</template>
                    </template>
                  </template>
                  <template v-else-if="item.name === 'furTryHis'">
                    <template v-for="sitem,sindex in JSON.parse(detailData[item.name])">
                      <span>{{sitem.materialName}}</span>
                      <span>{{sitem.furTime ? (' - ' + sitem.furTime) : ''}}</span>
                      <template v-if="sitem.furSymptom === 1">-阳性</template>
                      <template v-else-if="sitem.furSymptom === 2">-阴性</template>
                      <template v-if="sitem.result">-{{sitem.result}}</template>
                      <span v-if="JSON.parse(detailData[item.name]).length !== (sindex+1)">；</span>
                    </template>
                  </template>
                  <template v-else-if="item.name === 'specExamine' || item.name === 'assistantExamine'">
                    <div class="rich_wrap" v-html="detailData[item.name]"></div>
                  </template>
                  <template v-else>
                    {{detailData[item.name]}}
                  </template>
                  <span class="quote_btn" @click="quoteHandle(detailData[item.name], item.name)">引用</span>
                </div>
              </template>
            </template>
          </template>
          <template v-else>
            <label :for="item.name">{{item.label}}：</label>
            <div class="detail_txt">——</div>
          </template>
        </el-col>
      </el-row>
    </template>
    <ever-no-data v-else></ever-no-data>
  </div>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    props: ['title', 'schema', 'detailData'],
    methods: {
      quoteHandle (data, item) {
        if (item) {
          let qdata = {}
          qdata[item] = data
          this.$emit('quote', qdata)
        } else {
          this.$emit('quote', data)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ever_tpl_con{
    padding: 10px 10px 40px;
    .top_til{
      padding: 15px;
      font-size: 14px;
      font-weight: 500;
    }
    .detail_wrap{
      .el-col{
        display: flex;
        line-height: 25px;
        padding: 8px 0;
        font-size: 14px;
        color: #666;
        label{
          flex: 1;
          color: #666;
          min-width: 100px;
          text-align: left;
          font-weight: 500;
          padding-left: 16px;
        }
        .detail_txt{
          flex: 6;
          word-wrap: break-word;
          word-break: break-all;
          em{
            font-style: normal;
            margin-right: 10px;
          }
          .rich_wrap {
            /deep/ table {
              width: 100%;
              font-size: 14px;
              border: 1px solid #ddd;
              line-height: 35px;
              border-spacing: 0;
              border-collapse: collapse;
              thead, tbody {
                width: 100%;
                tr{
                  border-bottom: 1px solid #ddd;
                  th{background:#e4e4e4}
                  th, td {
                    text-align:center;
                    padding:10px;
                    line-height:20px;
                    vertical-align:baseline;
                    border-right: 1px solid #ddd;
                    overflow: hidden;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
