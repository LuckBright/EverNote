<template>
  <div class="layout_inner">
    <p>年龄展示 by lvjiangtao@everjiankang.com</p>
    <p><b class="cRed">age</b></p>
    <ever-table
      :columns="columns"
      :data="tableData"
      :is-record-url-params="false"
      border
    ></ever-table>
    <el-row>
      <el-col :span="14">
        <p class="f_bold">obj1:{{obj1}}</p>
        <age v-model="obj1.birthday"></age>
        <hr>
      </el-col>
      <el-col :span="14">
        <p class="f_bold">obj2:{{obj2}}</p>
        <age v-model="obj2.birthday" :age-show-text="obj2.ageShowText"></age>
        <hr>
      </el-col>
      <el-col :span="14">
        <p class="f_bold">obj3:{{obj3}}</p>
        <age v-model="obj3.birthday" :age-show-text="obj3.ageShowText" :disabled="flag"></age>
        <hr>
      </el-col>
      <el-col :span="14">
        <p class="f_bold">obj4:{{obj4}}</p>
        <age v-model="obj4.birthday" :age-show-text="obj4.ageShowText" type="datetime"></age>
        <hr>
      </el-col>
    </el-row>
    <br><br><br><br><br><br><br>
  </div>
</template>
<script>
import age from '@/components/age'
import { demoTableColumnArr as columns } from '@/demo/store/config'
import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

export default {
  components: {
    age
  },
  data () {
    return {
      flag: true,
      obj1: {
        birthday: '',
        ageShowText: ''
      },
      obj2: {
        birthday: '2020-03-08',
        ageShowText: ''
      },
      obj3: {
        birthday: '2020-03-08',
        ageShowText: '2天19小时'
      },
      obj4: {
        birthday: '2020-03-03 10:23',
        ageShowText: '2天19小时'
      },
      ef: true,
      columns,
      tableData: [
        {
          id: U(),
          param: 'value/v-model',
          description: '绑定值',
          type: 'Date String',
          required: true,
          default: '',
        },
        {
          id: U(),
          param: 'age-show-text',
          description: '年龄字符串（显示用）',
          type: 'String',
          required: false,
          default: '',
        },
        {
          id: U(),
          param: 'type',
          description: '日期格式，date和datetime，时间格式不同『yyyy-MM-dd HH:mm』',
          type: 'String',
          required: false,
          default: 'date',
        },
        {
          id: U(),
          param: 'disabled',
          description: '是否可以编辑生日',
          type: 'Boolean',
          required: false,
          default: 'false',
        },
      ]
    }
  },
  methods: {
    get (data) {
      console.log(data, 'ddddd')
    }
  }
}
</script>
