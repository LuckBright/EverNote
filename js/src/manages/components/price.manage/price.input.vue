<template>
  <div class="price-input" :class="type">
    <template v-if="type === 'edit'">
      <span class="edit-show" @click="changeEditStatus" v-if="!editStatus">
        <span class="price-txt">{{price === '' ? '-' : price}}<i class="is-change" v-if="isChange">*</i></span>
        <!-- {{price}} -->
        <i class="el-icon-edit edit-icon"></i>
      </span>
      <el-input-number
        ref="editInput"
        v-model="price"
        class="edit-input"
        v-if="editStatus"
        size="small"
        :autofocus="true"
        :controls="false"
        @blur="changePrice"
      ></el-input-number>
    </template>
    <template v-else-if="type === 'primary'">
      <el-tooltip class="item" effect="light" content="审批中" placement="top" :disabled="disabled" :open-delay="1000">
        <div class="price-txt">
          <span class="init-price">{{+value}}</span>
          <i class="el-icon-right green"></i>
          <span class="changed-price red">{{newPrice}}</span>
        </div>
      </el-tooltip>
    </template>
    <template v-else-if="type === 'delete'">
      <span class="price-txt">{{value}}</span>
    </template>
    <template v-else>
      <span class="price-txt">{{value || tableDefaultCellValue}}</span>
    </template>
  </div>
</template>
<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { config } from '@/manages/components/price.manage/price.config.js'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'edit'
    },
    newPrice: Number | String,
    value: Number | String
  },
  data () {
    return {
      tableDefaultCellValue,
      editStatus: false,
      price: this.value === '' ? '' : +this.value
    }
  },
  computed: {
    isChange () {
      if (String(this.price) === String(this.value)) {
        return false
      }
      return this.price !== '' && this.price !== this.value
    }
  },
  methods: {
    changeEditStatus () {
      this.editStatus = true
      this.$nextTick(() => {
        this.$refs.editInput.focus()
      })
    },
    changePrice () {
      if (this.price !== 0 && !this.price) {
        this.price = ''
      }
      this.editStatus = false
      this.$emit('change', {
        originalPrice: this.value === '' ? null : this.value,
        currentPrice: this.price
      })
    }
  },
  watch: {
    price (val, oldVal) {
      val = String(val)
      if (val.length > 16) {
        this.price = +val.slice(0, 16)
      }
      if (val.indexOf('.') !== -1 && val.split('.')[1].length > config.priceDecimal) {
        this.price = +(val.split('.')[0] + '.' + val.split('.')[1].slice(0, config.priceDecimal))
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .default {
    padding-right: 24px;
  }
  .price-input {
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
