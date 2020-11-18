<template>
  <div class="print-list">
      <ul class="print-header">
        <li>药品名称</li>
        <li>规格</li>
        <li>数量</li>
        <li>单位</li>
      </ul>
      <div class="print-container">
        <div v-for="item in data" :key="item">
          <div>
            <span>{{item.id}}</span>
            <span>床号：{{item.bednum}}</span>
            <span>{{item.name}}({{item.sex}}){{item.age}}岁</span>
            <span>{{item.type}}</span>
            <span>预执行时间：{{item.excutetime}}</span>
            <span>UDD药包：{{item.UDD}}</span>
          </div>
          <ul class="table" v-for="row in item.list" :key="row.id">
            <li>{{row.mechinename}}</li>
            <li>{{row.standard}}</li>
            <li>{{row.num}}</li>
            <li>{{row.unitId}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
const data = [
  {
    id: '001',
    bednum: '1001',
    name: '王晓丹',
    sex: '女',
    age: 26,
    type: '口服',
    excutetime: '2018-09-09 12:00',
    UDD: 2018090911321,
    list: [
      {
        id: 'aaa',
        mechinename: '乳酸钠林格注射液(乳酸钠林格)',
        standard: '250ml:2.25g   1瓶/瓶',
        num: 1,
        unitId: '瓶'
      }, {
        id: 'bbb',
        mechinename: '乳酸钠林格注射液(乳酸钠林格)',
        standard: '250ml:2.25g   1瓶/瓶',
        num: 1,
        unitId: '瓶'
      }
    ]

  },
  {
    id: '002',
    bednum: '1002',
    name: '张三',
    sex: '女',
    age: 26,
    type: '口服',
    excutetime: '2018-09-09 12:00',
    UDD: 2018090911321,
    list: [
      {
        mechinename: '乳酸钠林格注射液(乳酸钠林格)',
        standard: '250ml:2.25g   1瓶/瓶',
        num: 1,
        unitId: '瓶'
      }, {
        mechinename: '乳酸钠林格注射液(乳酸钠林格)',
        standard: '250ml:2.25g   1瓶/瓶',
        num: 1,
        unitId: '瓶'
      }
    ]

  }
]
export default {
  data () {
    return {
      data
    }
  }
}
</script>

<style lang="scss" scoped>
// 打印测试代码
.print-list {
  width: 800px;
  margin: 0 auto;
  border: 1px solid #000;
  height: auto;
  >div {
    height: 40px;
    line-height: 40px;
    background: #ebedef;
  }
  ul {
    display: flex;
    background: #fff;
    padding: 0;
    margin: 0;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #000;
    li {
      width: 25%;
      text-align: center;
      padding-left: 0px;
    }
  }
  .print-header {
    background: #cccccc;
    border-bottom: none;
  }
  .print-container {
    height: auto;
    span {
      padding: 0 10px;
    }
  }
}
</style>
