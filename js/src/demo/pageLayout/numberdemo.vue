<template>
  <div>
    amount0:{{amount0}}（数字，非数字字符（0-9，小数点，符号之外的符号）会主动替换掉）<br>
    <ever-number v-model="amount0" width="180px" number-type="number"></ever-number>
    <hr>
    amount:{{amount}}（数字，非数字字符（0-9，小数点，符号之外的符号）会主动替换掉）保留4位小数<br>
    <ever-number v-model="amount" width="180px" number-type="number" :to-fixed-len="4"></ever-number>
    <hr>
    amount1:{{amount1}}（整数，非数字字符（0-9，负号之外的负号）会主动替换掉）<br>
    <ever-number v-model="amount1" width="180px" number-type="integer"></ever-number>
    <hr>
    amount2:{{amount2}}（正整数，非数字字符（0-9之外的符号）会主动替换掉）<br>
    <ever-number v-model="amount2" width="180px" number-type="posinteger"></ever-number>
    <!-- <ever-price v-model="amount" type="text" placeholder="请输入催款金额"></ever-price> -->
    <hr>
    {{obj}}
    <ever-form2
      style="width: 400px"
      v-model="obj"
      ref="form"
      :schema="schema"
      :rules="rules"
      :hideRequiredAsterisk="false"
      @submit="submitForm()">
    </ever-form2>
  </div>
</template>

<script>
import { formCheckPositiveInt, formCheckFloat, formCheckNonnegativeInt } from '@/util/validate'
// type: 'number', // el-input type=number时候maxlength 不生效 看情况使用

let schema = [
  {
    name: 'textintger',
    label: '正整数',
    props: {
      maxlength: 6,
    }
  },
  {
    name: 'nonnegativeint',
    label: '非负整数',
    props: {
      maxlength: 6,
    }
  },
  {
    name: 'textfloat',
    label: '正数',
    props: {
      type: 'number',
    }
  },
  {
    name: 'num1',
    label: '数字',
    comp: 'ever-number',
    props: {
      numberType: 'number'
    }
  },
  {
    name: 'num11',
    label: '数字(保留3位小数)',
    comp: 'ever-number',
    props: {
      numberType: 'number',
      toFixedLen: 3
    }
  },
  {
    name: 'num2',
    label: '整数',
    comp: 'ever-number',
    props: {
      numberType: 'integer'
    }
  },
  {
    name: 'num3',
    label: '正整数',
    comp: 'ever-number',
    props: {
      numberType: 'posinteger'
    }
  },
  {
    name: 'num1',
    label: '数字',
    comp: 'ever-number',
    props: {
      numberType: 'number'
    }
  },
  {
    name: 'num2',
    label: '整数',
    comp: 'ever-number',
    props: {
      numberType: 'integer'
    }
  },
  {
    name: 'num3',
    label: '正整数',
    comp: 'ever-number',
    props: {
      numberType: 'posinteger'
    }
  }
]

export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      obj,
      schema,
      rules: {
        textintger: [
          { required: true, validator: formCheckPositiveInt, maxValue: 9999, minValue: 10, trigger: 'change' }
        ],
        nonnegativeint: [
          { required: true, validator: formCheckNonnegativeInt, trigger: 'change' }
        ],
        num2: [
          { required: true, validator: formCheckPositiveInt, maxValue: 9999, minValue: 10, trigger: 'change' }
        ],
        textfloat: [
          { validator: formCheckFloat, maxValue: 9999, minValue: 1, trigger: 'change' }
        ],
        num3: [
          { required: true, validator: formCheckPositiveInt, maxValue: 9999, minValue: 10, trigger: 'change' }
        ],
      },
      amount0: '',
      amount: 0,
      amount1: '',
      amount2: ''
    }
  },
  methods: {
    submitForm () {
      // this.$emit('handleSelect', this.obj)
    }
  },
  components: {
  }
}
</script>
