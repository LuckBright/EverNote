<template>
  <div class="layout_inner">
    <el-button type="primary" @click="printView">打印预览</el-button>
    <div id="page1" class="breakable" break-window="#break-table">
      <!-- 如果 下面第一个表格不需要跟着每页出现 把 break-window="#break-table" 这个去掉就可以了 -->
      <div class="jcpLayout">
        <table>
          <tr>
            <td>1111</td>
            <td>222</td>
            <td>333</td>
            <td>444</td>
          </tr>
          <tr>
            <td>1111</td>
            <td>222</td>
            <td>333</td>
            <td>444</td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="tb-table" id="break-table" headerRows="1">
          <thead>
            <tr>
              <th width="50">序号</th>
              <th>code</th>
              <th>name</th>
              <th>othername</th>
              <th>状态</th>
              <th>操作</th>
              <th>时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td height="25">{{index}}</td>
              <td>{{item.code}}</td>
              <td>{{item.name}}</td>
              <td>{{item.otherName}}</td>
              <td>{{item.status | formateValueToFnt({list: statusList, defaultFnt:'无'})}}</td>
              <td>操作</td>
              <td>2019-01-01 10:10:10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import jcpTool from 'jcpjs'

export default {
  data () {
    return {
      tableData: [
        {
          id: 1,
          code: 'XHT001',
          name: '阿莫西林克拉维酸钾分散片（7:1）说明书请仔细阅读说明书并在医师指导下使用',
          otherName: '心和堂',
          type: '集团',
          enableDate: '',
          status: 3
        }
      ],
      loading: false,
      statusList: [
        { name: '已删除', id: 1 },
        { name: '正常', id: 2 },
        { name: '已停用', id: 3 },
        { name: '已开业', id: 5 },
        { name: '已废弃', id: 4 }
      ]
    }
  },
  created () {
    this.tableData = Array(40).fill(this.tableData[0])
  },
  methods: {
    printView () {
      this.runPrintFun()
    },
    runPrintFun () {
      var settings = {
        portrait: true,
        paperName: 'A4',
        marginTop: 1,
        marginRight: 1,
        marginBottom: 1,
        marginLeft: 1
      }
      var myDoc = {
        documents: document,
        settings: settings,
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      myDoc.done = function (err) {
        if (!err) {
          console.log('打印完成')
        } else {
          console.log(err, 'err')
        }
      }
      jcpTool.getJCP().printPreview(myDoc, true)
    }
  }
}
</script>
<style>
.tb-table {
  border-left: 1px solid #000;
  border-top: 1px solid #000;
  line-height: 30px;
}
.tb-table td {
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  padding: 5px;
}
</style>

