<template>
  <div v-show="isShow">
    <div class="title">
      <el-button size="small" type="primary" @click="selToothType(1)">恒牙</el-button>
      <el-button size="small" type="primary" @click="selToothType(2)">乳牙</el-button>
      <el-button size="small" type="primary" @click="selComplateTooth(1)" v-show="fullSelect">全口</el-button>
      <el-button size="small" type="primary" @click="selComplateTooth(2)" v-show="clearSelect">重置</el-button>
    </div>
    <div class="toothImgs clearfix" v-show="currentType1">
      <div class="box" v-for="(arr, i) in toothImgArr.adult" :key="i">
        <tooth-one
          @getToothMsg="readToothSel"
          v-for="(item, i) in arr.list"
          :key="i"
          :pos="arr.pos"
          :type="1"
          :value="item.value"
          :imgsrc="item.imgsrc"
          :selected="computeSelect(arr.pos, item.value)"
        ></tooth-one>
      </div>
    </div>

    <div class="toothImgs clearfix" v-show="currentType2">
      <div class="box" v-for="(arr, i) in toothImgArr.milk" :key="i">
        <tooth-one
          @getToothMsg="readToothSel"
          v-for="(item, i) in arr.list"
          :key="i"
          :pos="arr.pos"
          :type="2"
          :value="item.value"
          :imgsrc="item.imgsrc"
          :selected="computeSelect(arr.pos, item.value)"
        ></tooth-one>
      </div>
    </div>
  </div>
</template>

<script>
import toothOne from './tooth.one'
import { toothImgArr } from './tooth.dict'

export default {
  props: ['value', 'selectd'],
  data () {
    return {
      input: '',
      toothAdultArr: {
        lefttop: [],
        righttop: [],
        leftbottom: [],
        rightbottom: []
      },
      toothMilkArr: {
        lefttop: [],
        righttop: [],
        leftbottom: [],
        rightbottom: []
      },
      toothSelArr: {
        lefttop: [],
        righttop: [],
        leftbottom: [],
        rightbottom: []
      },
      toothSelStatus: {
        lefttop: [{key: '8', status: false}, {key: '7', status: false}, {key: '6', status: false}, {key: '5', status: false}, {key: 'E', status: false}, {key: '4', status: false}, {key: 'D', status: false}, {key: '3', status: false}, {key: 'C', status: false}, {key: '2', status: false}, {key: 'B', status: false}, {key: '1', status: false}, {key: 'A', status: false}],
        righttop: [{key: 'A', status: false}, {key: '1', status: false}, {key: 'B', status: false}, {key: '2', status: false}, {key: 'C', status: false}, {key: '3', status: false}, {key: 'D', status: false}, {key: '4', status: false}, {key: 'E', status: false}, {key: '5', status: false}, {key: '6', status: false}, {key: '7', status: false}, {key: '8', status: false}],
        leftbottom: [{key: '8', status: false}, {key: '7', status: false}, {key: '6', status: false}, {key: '5', status: false}, {key: 'E', status: false}, {key: '4', status: false}, {key: 'D', status: false}, {key: '3', status: false}, {key: 'C', status: false}, {key: '2', status: false}, {key: 'B', status: false}, {key: '1', status: false}, {key: 'A', status: false}],
        rightbottom: [{key: 'A', status: false}, {key: '1', status: false}, {key: 'B', status: false}, {key: '2', status: false}, {key: 'C', status: false}, {key: '3', status: false}, {key: 'D', status: false}, {key: '4', status: false}, {key: 'E', status: false}, {key: '5', status: false}, {key: '6', status: false}, {key: '7', status: false}, {key: '8', status: false}]
      },
      currentType1: true,
      currentType2: false,
      fullSelect: true,
      clearSelect: false,
      isShow: true,
      toothImgArr: toothImgArr
    }
  },
  watch: {
    'value' (val) {
      this.input = val
    },
    'input' (val) {
      this.$emit('update:value', val)
    },
    'toothSelArr.lefttop': {
      handler (val) {
        this.toothStatus('lefttop')
      },
      deep: true
    },
    'toothSelArr.righttop': {
      handler (val) {
        this.toothStatus('righttop')
      },
      deep: true
    },
    'toothSelArr.leftbottom': {
      handler (val) {
        this.toothStatus('leftbottom')
      },
      deep: true
    },
    'toothSelArr.rightbottom': {
      handler (val) {
        this.toothStatus('rightbottom')
      },
      deep: true
    },
    toothSelStatus: {
      handler () {
        this.$emit('status', this.toothSelStatus)
      },
      deep: true
    }
  },
  created () {
    this.initSelected(this.selectd)
    // this.input = this.value
  },
  methods: {
    initSelected (selectd) {
      for (let item in selectd) {
        if (selectd[item]) {
          this.toothSelArr[item] = selectd[item].split('')
          this.toothSelArr[item].forEach(sitem => {
            if (isNaN(Number(sitem))) {
              this.toothMilkArr[item].push(sitem)
            } else {
              this.toothAdultArr[item].push(sitem)
            }
          })
        }
      }
    },
    toothStatus (pos) {
      this.toothSelStatus[pos].map(item => {
        if (this.toothSelArr[pos].includes(item.key)) {
          item.status = !0
        } else {
          item.status = !1
        }
      })
    },
    computeSelect (pos, value) {
      return this.toothSelArr[pos].includes(value)
    },
    readToothSel (pos, val, type) {
      this.selectTooth(pos, val, type)
    },
    selToothType (type) {
      if (type === 1) {
        this.currentType1 = true
        this.currentType2 = false
      } else {
        this.currentType1 = false
        this.currentType2 = true
      }
    },
    selComplateTooth (flag, event) {
      if (flag === 1) {
        this.fullSelect = false
        this.clearSelect = true
        if (this.currentType1) {
          this.toothAdultArr = {
            lefttop: [8, 7, 6, 5, 4, 3, 2, 1],
            righttop: [1, 2, 3, 4, 5, 6, 7, 8],
            leftbottom: [8, 7, 6, 5, 4, 3, 2, 1],
            rightbottom: [1, 2, 3, 4, 5, 6, 7, 8]
          }
        } else {
          this.toothMilkArr = {
            lefttop: ['E', 'D', 'C', 'B', 'A'],
            righttop: ['A', 'B', 'C', 'D', 'E'],
            leftbottom: ['E', 'D', 'C', 'B', 'A'],
            rightbottom: ['A', 'B', 'C', 'D', 'E']
          }
        }
      } else {
        this.fullSelect = true
        this.clearSelect = false
        if (this.currentType1) {
          this.toothAdultArr = {
            lefttop: [],
            righttop: [],
            leftbottom: [],
            rightbottom: []
          }
        } else {
          this.toothMilkArr = {
            lefttop: [],
            righttop: [],
            leftbottom: [],
            rightbottom: []
          }
        }
      }
      this.mergeToothSel()
    },
    mergeToothSel () {
      this.toothSelArr.lefttop = this.toothAdultArr.lefttop.concat(this.toothMilkArr.lefttop).join('')
      this.toothSelArr.righttop = this.toothAdultArr.righttop.concat(this.toothMilkArr.righttop).join('')
      this.toothSelArr.leftbottom = this.toothAdultArr.leftbottom.concat(this.toothMilkArr.leftbottom).join('')
      this.toothSelArr.rightbottom = this.toothAdultArr.rightbottom.concat(this.toothMilkArr.rightbottom).join('')
      this.$emit('toothSelArr', this.toothSelArr)
    },
    selectTooth (pos, val, type) {
      var arr = this.toothAdultArr[pos] || []
      if (type === 2) {
        arr = this.toothMilkArr[pos] || []
      }
      var index = arr.indexOf(val)
      if (index > -1) {
        arr.splice(index, 1)
      } else {
        arr.push(val)
      }
      if (type === 2) {
        this.toothMilkArr[pos] = arr
      } else {
        this.toothAdultArr[pos] = arr
      }
      this.mergeToothSel()
    }
  },
  components: {
    toothOne
  }
}
</script>

<style scoped>
.toothImgs {
  border: 1px solid #666;
  background: #808080;
  width: 641px;
  text-align: center;
}
.title {
  padding-bottom: 5px;
}
.toothImgs .box {
  float: left;
  width: 320px;
}
.toothImgs .box:nth-child(1) {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  text-align: right;
}
.toothImgs .box:nth-child(2) {
  border-bottom: 1px solid #000;
  text-align: left;
}
.toothImgs .box:nth-child(3) {
  border-right: 1px solid #000;
  text-align: right;
}
.toothImgs .box:nth-child(4) {
  text-align: left;
}
.toothImgs .tooth {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  padding: 5px 2px;
  border-radius: 1px;
}
.toothImgs .tooth:hover {
  background: #f1f1f1;
}
.toothImgs .tooth.selected {
  background: #f1f1f1;
}
.toothImgs .tooth .img {
  width: 30px;
  height: 80px;
}
.toothImgs .tooth .p {
  background: #fff;
  margin: 2px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
