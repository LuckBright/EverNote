<template>
  <el-card class="tcm-card" v-show="isShow">
    <el-row class="tcm-card-header">
      <el-col :span="23">
        <el-button
          :type="i === currentTag?'primary':'default'"
          v-for="(item,i) in list"
          :key="i"
          @click="currentTag=i"
        >{{item.name}}</el-button>
      </el-col>
      <el-col :span="1" align="right">
        <i class="el-icon-close" @click="isShow=false"></i>
      </el-col>
    </el-row>
    <div class="tcm-card-body">
      <el-row v-for="(item,i) in list[currentTag].list" :key="i">
        <el-col :span="2" align="right">
          <label class="title">{{item.name}}</label>
        </el-col>
        <el-col :span="22">
          <template v-if="item.type === 'button'">
            <el-button
              v-for="(arr,i) in item.list"
              class="el-button__tag"
              :key="i"
              size="small"
              @click="selectItem(arr)"
            >{{arr}}</el-button>
          </template>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
export default {
  props: ['inputvalue'],
  data () {
    return {
      isShow: false,
      currentTag: 0,
      list: [
        {
          name: '望',
          list: [
            {
              name: '神',
              type: 'button',
              list: ['神志清', '神昏', '痴呆', '淡漠', '狂躁'],
              selected: []
            },
            {
              name: '色',
              type: 'button',
              list: ['色青', '色赤', '色黄', '色白', '色黑'],
              selected: []
            },
            {
              name: '头面五官',
              type: 'button',
              list: ['面睑浮肿', '目赤睑肿', '眼睑下垂', '眼周黯黑', '眼突', '目黄', '耳肿流脓', '鼻翼煽动', '鼻唇干燥', '唇红', '唇紫', '口腔溃烂', '牙龈溃烂', '咽喉肿痛', '咽喉白膜', '耳轮干枯', '牙齿焦黑', '口腔白屑'],
              selected: []
            },
            {
              name: '颈胸腹部',
              type: 'button',
              list: ['瘿瘤', '腹露青筋', '腹硬满', '水肿', '尿痛'],
              selected: []
            },
            {
              name: '形体肌肤',
              type: 'button',
              list: ['体强', '体弱', '体胖', '体瘦', '局部水肿', '身黄', '皮肤色素沉着', '指端青紫', '指甲淡白', '水痘', '风疹', '风团', '痈疖痱子', '疱疹', '患部溃烂', '患部红肿', '角弓反张', '肢体抽搐', '四肢麻木', '关节/肢体活动不利', '肢体萎软', '肌肉萎缩', '关节晨僵', '关节红肿', '小儿生长发育迟缓', '下肢脉络曲张', '皮肤红斑'],
              selected: []
            },
            {
              name: '舌像',
              type: 'button',
              list: ['舌大', '舌小', '齿痕', '裂纹', '苔白', '苔黄', '苔黑', '苔灰', '镜面舌', '厚腻', '舌尖鲜红', '舌尖暗红', '颤动舌'],
              selected: []
            }
          ]
        },
        {
          name: '闻',
          list: [
            {
              name: '声音',
              type: 'button',
              list: ['喷嚏', '呵欠', '声低', '声音洪亮', '失声', '恶心', '呕吐', '嗳气', '呃逆', '谵语', '语言不利', '鼾声', '胃部振水音', '肠鸣', '关节内作响'],
              selected: []
            },
            {
              name: '气味',
              type: 'button',
              list: ['口臭'],
              selected: []
            }
          ]
        },
        {
          name: '问',
          list: [
            {
              name: '寒热',
              type: 'button',
              list: ['但寒不热', '但热不寒', '阴虚潮热', '阳明潮热'],
              selected: []
            },
            {
              name: '汗',
              type: 'button',
              list: ['头汗', '手足', '左半身汗', '右半身汗', '自汗', '盗汗'],
              selected: []
            },
            {
              name: '头部',
              type: 'button',
              list: ['头晕', '巅顶痛', '额痛', '侧痛', '头沉', '刺痛', '鼻炎/过敏性鼻炎'],
              selected: []
            }, {
              name: '身体四肢',
              type: 'button',
              list: ['颈肩酸痛', '背痛', '落枕', '腰痛', '肩关节疼痛', '肘关节疼痛', '膝关节疼痛', '颈部结节'],
              selected: []
            },
            {
              name: '胸胁',
              type: 'button',
              list: ['咳嗽', '心悸', '憋闷', '胸痛', '乳腺增生'],
              selected: []
            }, {
              name: '胃脘',
              type: 'button',
              list: ['恶心', '呕吐', '胃痛', '嗳气', '吐酸'],
              selected: []
            },
            {
              name: '饮食',
              type: 'button',
              list: ['多饮', '少饮', '多食', '少食', '热食', '冷饮', '喜酸', '喜辣', '喜苦', '喜甜', '喜咸', '喜涩'],
              selected: []
            },
            {
              name: '睡眠',
              type: 'button',
              list: ['失眠', '入睡困难', '嗜睡', '多梦', '早醒'],
              selected: []
            },
            {
              name: '情志',
              type: 'button',
              list: ['喜', '怒', '忧', '思', '惊'],
              selected: []
            },
            {
              name: '二便',
              type: 'button',
              list: ['便秘', '黏腻', '泄泻', '完谷不化', '五更泻', '食后泻', '脾虚泻', '小便频', '夜尿多', '尿潜血'],
              selected: []
            },
            {
              name: '妇女',
              type: 'button',
              list: ['月经过多', '月经过少', '痛经', '血块', '月经先后不定期', '月经先期', '月经后期', '妊娠', '产后', '经前易怒', '月经色暗', '白带异常'],
              selected: []
            }
          ]
        },
        {
          name: '切',
          list: [
            {
              name: '切脉',
              type: 'button',
              list: ['浮脉', '沉脉', '迟脉', '数脉', '滑脉', '涩脉', '虚脉', '实脉', '长脉', '短脉', '洪脉', '微脉', '紧脉', '缓脉', '芤脉', '弦脉', '弱脉', '结代脉'],
              selected: []
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectItem (val) {
      let textArr = this.inputvalue ? this.inputvalue.split('，') : []
      textArr.push(val)
      this.$emit('update:inputvalue', textArr.join('，'))
    }
  }
}

</script>
<style scoped>
.tcm-card {
  border-width: 1px;
  position: absolute;
  z-index: 9;
  width: 99%;
  top: 55px;
}
.tcm-card-header .el-button {
  width: 74px;
  height: 26px;
  line-height: 26px;
  padding: 0;
  text-align: center;
  border-radius: 100px;
}
.tcm-card-header .el-button--primary {
  background: #1c7bef;
  box-shadow: 0 0 4px 0 rgba(28, 123, 239, 0.83);
}
.tcm-card-header .el-button--default {
  background: #f5f5f5;
  border: none;
}
.tcm-card-header .el-icon-close {
  color: #cccccc;
  font-size: 15px;
  cursor: pointer;
}
.tcm-card .tcm-card-body {
  height: 160px;
  overflow-y: auto;
}
.tcm-card .el-row {
  margin-bottom: 20px;
}
.tcm-card .el-row label.title {
  display: inline-block;
  padding-right: 20px;
}
.tcm-card .el-checkbox-group {
  display: inline-block;
  color: #666;
}
.tcm-card .el-radio-group {
  padding-left: 0;
  padding-right: 20px;
  border-right: 1px solid #ddd;
}
.tcm-card .el-checkbox-group .el-checkbox,
.tcm-card .el-radio-group .el-radio {
  color: #666;
}
.tcm-card .el-checkbox-group .el-checkbox {
  margin-right: 15px;
}
.tcm-card .el-checkbox-group .el-checkbox + .el-checkbox {
  margin-right: 15px;
  margin-left: 0;
}
.tcm-card .el-button__tag {
  margin: 0 15px 0 0;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  padding: 7px 17px;
  color: #409eff;
  border-radius: 2px;
}
.tcm-card .el-button__tag + .el-button {
  margin-left: 0;
}
.tcm-card .el-button__tag:hover {
  background: #409eff;
  color: #ffffff;
  border-color: #409eff;
}
.tcm-card .el-radio-group + .el-radio-group {
  padding: 0 20px;
}
.tcm-card .el-radio-group + .el-radio-group:last-child {
  border-right: none;
}
.tcm-card .submit-btn {
  width: 156px;
  text-align: center;
}
</style>
