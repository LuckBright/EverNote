<template>
  <div>
    <div v-for="(item, index) in materialBarCodes" :key="index" class="flex mb5">
      <el-input
        ref="input"
        type="text"
        v-model="item.code"
        placeholder="请输入13位或8位数字"
        :class="{error: item.error || item.repeat}"
        @keyup.enter.native="enterNext(item, $event)"
        @focus="handlerInput(item, $event)"
        @input="handlerCode(item, index, $event)"
        @blur="handlerNumberCheck(item, index)">
        <i slot="suffix" class="iconfont icon-saomiao mr10"></i>
      </el-input>
      <div v-if="item.error || item.repeat" class="el-form-item__error" style="top: 33px!important;">
        {{![8, 13].includes(item.code.length) ? '请填写13位或8位数字' : item.repeat ? '该商品条形码系统中已经存在，请核实后重新录入' : '该商品条形码当前列表重复'}}
      </div>
      <span class="btn pl10">
        <i v-if="materialBarCodes.length > 1" @click="deleteNumbers(index)" class="iconfont icon-bingli-shanchu cRed f18 mr5"></i>
        <i v-if="index === materialBarCodes.length - 1" @click="addNumbers" class="iconfont icon-tianjiabingli f18 cBlue"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/common'
export default {
  props: {
    objData: {
      type: Array,
      default: () => []
    },
    classifyId: String,
    checkMaterialBarCode: Function
  },
  data () {
    return {
      materialBarCodes: [],
      objId: this.$route.params.id
    }
  },
  created () {
    if (!this.materialBarCodes.length) this.materialBarCodes = [{ code: '', error: false, repeat: false }]
  },
  methods: {
    // 输入框点击  回车键 或者 扫码枪 扫码的时候
    async enterNext (item, $event) {
      if ([8, 13].includes(item.code.length)) {
        this.checkArr()
        if (item.error || item.repeat) {
          $event.target.select()
          return
        }
        if (!item.error) {
          await this.checkCodes(item, () => {
            if (item.error || item.repeat) {
              $event.target.select()
              return
            }
            const index = this.materialBarCodes.findIndex(item => item.error || ![8, 13].includes(item.code.length) || item.repeat)
            if (~index) {
              this.$refs.input[index].focus()
            }
          })
        }
      } else {
        if (item.code) {
          item.error = true
          $event.target.select()
        }
      }
    },
    // 光标点上去的时候自动选择上所有输入的内容
    handlerInput (item, $event) {
      if (item.error) $event.target.select()
    },
    // 输入框失去焦点的时候
    handlerNumberCheck (item, index) {
      if (item.code && ![8, 13].includes(item.code.length)) item.error = true
    },
    // 输入框内容发生变化的时候
    handlerCode (item) {
      item.code = item.code.replace(/[^\d]/g, '')
      if (item.code) {
        if ([8, 13].includes(item.code.length)) {
          this.checkArr()
          if (!item.error || item.repeat) this.checkCodes(item)
        }
      } else {
        item.error = false
      }
    },
    // 调用后台接口查询当前条码是否已经存在
    checkCodes: debounce(async function (item, callBack) {
      let params = {materialBarCode: item.code}
      if (this.objId) params.id = this.objId
      await this.checkMaterialBarCode(params).then(res => {
        if (res.data.flag) {
          item.repeat = false
        } else {
          item.repeat = true
          this.$messageTips(this, 'warning', res.data.message)
        }
        callBack && callBack()
      })
    }),
    // 添加新的条码
    addNumbers () {
      if (this.materialBarCodes.some(item => item.error || !item.code)) return this.$messageTips(this, 'warning', '请先完善当前商品条形码的数据')
      this.materialBarCodes.push({ code: '', error: false, repeat: false })
      this.$nextTick(_ => {
        this.$refs.input[this.materialBarCodes.length - 1].focus()
      })
    },
    // 删除当前条码
    deleteNumbers (index) {
      this.materialBarCodes.splice(index, 1)
      this.checkArr()
    },
    // 验证条码是否在当前列表已经存在
    checkArr () {
      this.materialBarCodes.forEach((data, index) => {
        if ([8, 13].includes(data.code.length)) {
          let count = 0
          this.materialBarCodes.forEach((item, childIndex) => {
            if (item.code === data.code && index !== childIndex) count++
          })
          data.error = count > 0
        }
      })
    }
  },
  watch: {
    'objData': {
      handler (v) {
        this.materialBarCodes = v.map(item => {
          item = { code: item, error: false, repeat: false }
          return item
        })
        this.$emit('emitMaterialBarCodes', this.materialBarCodes)
      },
      deep: true,
      immediate: true
    },
    'materialBarCodes': {
      handler (v) {
        this.$emit('emitMaterialBarCodes', v)
      },
      deep: true
    },
    'classifyId' (v) {
      this.materialBarCodes = [{ code: '', error: false, repeat: false }]
    }
  }
}
</script>

<style lang="scss" scoped>
.flex{
  display: flex;
  position: relative;
  .btn {
    position: absolute;
    right: -70px;
    width: 60px;
  }
  /deep/ .error {
    input {
      border: 1px solid #ff0000;
      background: #ffdede;
      color: #e43;
    }
  }
}
</style>

