<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%">
    <div v-if="haveData(arr)">
      <el-select v-model="selectedId" @change="change" class="sele">
        <el-option
          v-for="(item,i) in arr"
          :key="i"
          :label="`报告${i + 1 } ${item.relName ? item.relName : ''}`"
          :value="item.doctorAdviceId"
        ></el-option>
      </el-select>
      <el-button @click="openWin(0)" v-show="selectedItem.imageUrl">影像</el-button>
      <el-button @click="openWin(1)" v-show="selectedItem.pdfReportUrl" type="primary" title="在预览报告页可打印">预览报告</el-button>
      <!-- <el-button @click="print" v-show="selectedItem.pdfReportUrl">打印报告</el-button> -->
      <div class="border">
        <div>
          <el-row>
            <el-col :span="2.5" class="mr5">
              <span>检查所见:</span>
            </el-col>
            <el-col :span="21">{{formatContent(selectedItem.examineFinding)}}</el-col>
          </el-row>
        </div>
        <div class="mrt">
          <el-row>
            <el-col :span="2.5" class="mr5">
              <span>检查结论:</span>
            </el-col>
            <el-col :span="21">{{formatContent(selectedItem.examineImpression)}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="box">
        <p>医生解读:</p>
        <p class="color">{{formatContent(selectedItem.doctorReview)}}</p>
      </div>
    </div>
    <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
  </el-dialog>
</template>

<script>
function isArray (arr) {
  return Array.isArray(arr)
}
export default {
  props: {
    value: Object
  },
  data () {
    return {
      arr: [],
      selectedItem: {},
      map: {},
      dialogVisible: false,
      selectedId: ''
    }
  },
  computed: {},
  created () { },
  watch: {
    value: {
      handler (val) {
        if (Object.keys(val).length === 0) return
        this.init(val)
      },
      deep: true
    },
    dialogVisible (val) {
      if (!val) {
        this.$emit('input', {})
        this.clearOld()
      }
    }
  },
  methods: {
    haveData (val) {
      return val && val.length !== 0
    },
    formatContent (res) {
      if (res) {
        return res
      } else {
        return '暂无'
      }
    },
    init (val) {
      this.dialogVisible = true
      this.initArr(val.examineResults) // 一个结果对应多个报告
      this.map = {}
      this.arr.forEach(item => {
        this.map[item.doctorAdviceId] = item
      })
      this.selectedId = this.arr.length ? this.arr[0].doctorAdviceId : ''
      this.selectedItem = this.arr.length ? this.arr[0] : {}
    },
    clearOld () {
      this.arr = []
      this.map = {}
      this.selectedItem = {}
      this.selectedId = ''
    },
    initArr (results) {
      const arr = isArray(results) ? results : []
      arr.forEach(item => {
        try {
          // 一个检查结果 对应多个报告
          const pdfs = JSON.parse(item.pdfReportUrl)
          if (isArray(pdfs)) {
            pdfs.forEach((pdf, index) => {
              const obj = {}
              for (let key in item) {
                obj[key] = item[key]
              }
              obj.pdfReportUrl = this.$ever.fileUrl + pdf.url
              obj.relName = pdf.relName
              obj.doctorAdviceId = obj.doctorAdviceId + index
              this.arr.push(obj)
            })
          }
        } catch (err) {
          // 说明pdfReportUrl是单个字符串 不进行处理
          this.arr.push(item)
        }
      })
    },
    change (key) {
      this.selectedItem = this.map[key]
    },
    openWin (type) {
      if (type === 0) {
        // 影像
        window.open(this.selectedItem.imageUrl)
      } else {
        // 预览报告
        const url = this.selectedItem.pdfReportUrl
        window.open(url)
      }
    },
    print () {
      document.querySelector('#printIframe').contentWindow.print()
    }
  }
}
</script>
<style scoped lang="scss">
.sele {
  width: 260px;
  height: 36px;
  margin-right: 10px;
}
.border {
  border: 1px solid #dadce0;
  margin: 20px 0px;
  padding: 10px;
  color: #666666;
}
.color {
  font-size: 14px;
  color: #666666;
}
.margin {
  margin: 0 auto;
}
.box {
  padding: 0px 10px;
}
.mrt {
  margin-top: 15px;
}
.mr5 {
  margin-right: 5px;
}
</style>
