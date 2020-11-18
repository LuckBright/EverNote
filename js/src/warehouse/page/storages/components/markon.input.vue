<template>
  <div class="markon-input">
    <template v-if="type === 'edit'">
      <span class="edit-show" @click="changeEditStatus" v-if="!editStatus">
        <span class="bonusRate-txt">{{bonusRate === '' ? '-' : bonusRate}}<i class="is-change" v-if="isChange">*</i></span>
        <i class="el-icon-edit edit-icon"></i>
      </span>
      <el-input-number
        ref="editInput"
        v-model="bonusRate"
        class="edit-input"
        v-if="editStatus"
        size="small"
        :autofocus="true"
        :controls="false"
        @blur="changeMarkon"
      ></el-input-number>
    </template>
    <template v-else-if="type === 'primary'">
      <el-tooltip class="item" effect="light" content="审批中" placement="top" :disabled="false" :open-delay="1000">
        <div class="price-txt">
          <span class="init-price">{{+bonusRate}}</span>
          <i class="el-icon-right green"></i>
          <span class="changed-price red">{{newPrice}}</span>
        </div>
      </el-tooltip>
    </template>
  </div>
</template>

<script>
import { priceChang } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  props: {
    value: Number | String,
    newPrice: Number | String,
    tdKey: String,
    type: {
      type: String,
      default: 'edit'
    },
  },
  data () {
    return {
      editStatus: false,
      bonusRate: '',
      originalPrice: ''
    }
  },
  computed: {
    isChange () {
      if (String(this.bonusRate) === String(this.value)) {
        return false
      }
      return this.bonusRate !== '' && this.bonusRate !== this.value
    }
  },
  watch: {
    value: {
      handler (v) {
        this.bonusRate = ['null', 'undefined', ''].includes(`${v}`) ? '' : v
      },
      deep: true,
      immediate: true
    },
    bonusRate (val) {
      this.bonusRate = priceChang(val, this.tdKey)
    }
  },
  created () {
    // 初始化的时候存存储一遍原价
    this.originalPrice = this.value
  },
  methods: {
    changeEditStatus () {
      this.editStatus = true
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    changeMarkon () {
      if (this.bonusRate !== 0 && !this.bonusRate) {
        this.bonusRate = ''
      }
      this.editStatus = false
      this.$emit('change', this.bonusRate, this.originalPrice === '' ? null : this.originalPrice)
    }
  }
}

</script>
<style lang="scss" scoped>
  .markon-input {
    position: relative;
    line-height: 30px;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    .green {
      color: green;
    }
    .red {
      color: red;
    }
    .edit-show {
      display: block;
      position: relative;
      width: 100%;
      padding-right: 34px;
      height: 30px;
      border: 1px solid transparent;
      box-sizing: border-box;
      margin-left: 17px;
      &:hover {
        border-color: #ccc;
        .edit-icon {
          display: block;
        }
      }
    }
    .edit-icon {
      display: none;
      top: 0;
      position: absolute;
      right: 0;
      background-color: #ccc;
      height: 100%;
      line-height: 30px;
      width: 30px;
    }
    .edit-input {
      width: 80px;
    }
    .is-change {
      color: red;
    }
  }
  .primary {
    cursor: not-allowed;
  }
  .edit {
    cursor: text;
  }
  .delete {
    color: #ddd;
    cursor: not-allowed;
  }
  .delete::before {
    content: '';
    display: block;
    height: 1px;
    background-color: #ccc;
    position: absolute;
    top: 50%;
    left: 15%;
    width: 70%;
  }
</style>
