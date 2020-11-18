<template>
  <div id="examine" class="layout_box">
    <div class="layout_inner">
      <el-row class="header">
        <el-col :span="20">
          <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary">通过</el-button>
          <el-button type="">驳回</el-button>
        </el-col>
      </el-row>
      <div class="body">
        <table class="table-wrap" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <th align="left" width="130">
              <el-checkbox>床号/姓名</el-checkbox>
            </th>
            <th align="center" width="20"></th>
            <th align="left" width="80">医嘱号</th>
            <th align="left" width="260">医嘱名称</th>
            <th align="center" width="50">类型</th>
            <th align="left" width="280">处置内容</th>
            <th align="left" width="150">嘱托</th>
            <th align="center" width="80">长/临</th>
            <th align="center" width="60">状态</th>
            <th align="left" width="150">开医嘱时间</th>
            <th align="left" width="120">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="i in 5">
            <td class="firstspan"><el-checkbox>021/张奇峰</el-checkbox></td>
            <td colspan="10">
              <table width="100%" cellpadding="0" cellspacing="0" class="table-item" v-for="j in 3">
                <tr v-for="k in 4">
                  <td align="center" width="20"><el-checkbox v-if="k===1"></el-checkbox></td>
                  <td align="left" width="80" class="line" :class="{noline: j===3 && i===5 && k===4}"><label>00000001</label></td>
                  <td align="left" width="260" class="line" :class="{noline: j===3 && i===5 && k===4}">
                    <label v-if="k===1">┏</label>
                    <label v-if="k===4">┗</label>
                    <label v-if="k > 1 && k < 4">┣</label>
                    <label>0.9%氯化钠注射液 250ml:12.5g</label>
                  </td>
                  <td align="center" width="50" class="line" :class="{noline: j===3 && i===5 && k===4}">药品</td>
                  <td align="left" width="280" class="line" :class="{noline: j===3 && i===5 && k===4}">口服， 每晚一次 ， 每次 2 g， 共计 1 天</td>
                  <td align="left" width="150" class="line" :class="{noline: j===3 && i===5 && k===4}">记得每天一次</td>
                  <td align="center" width="80" :class="{line: k===4, noline: j===3 && i===5 && k===4}">长期</td>
                  <td align="center" width="60" :class="{line: k===4, noline: j===3 && i===5 && k===4}"><i class="iconfont icon-Star"></i></td>
                  <td align="left" width="150" :class="{line: k===4, noline: j===3 && i===5 && k===4}">2018-03-28  17:30:01</td>
                  <td align="left" width="120" class="leftline" :class="{line: k===4, noline: j===3 && i===5 && k===4}">
                    <template v-if="k===1">
                      <el-button type="success" :plain="true" size="small">通过</el-button>
                      <el-button type="danger" :plain="true" size="small">驳回</el-button>
                    </template>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  let querySchema = [
    {
      name: 'type',
      placeholder: '医嘱类型',
      type: 'select',
      options: []
    },
    {
      name: 'state',
      placeholder: '状态',
      type: 'select',
      options: []
    },
    {
      name: 'date',
      placeholder: '选择日期',
      type: 'daterange'
    },
    {
      name: 'name',
      placeholder: '患者姓名',
      type: 'text'
    },
    {
      name: 'doctorName',
      placeholder: '医生姓名',
      type: 'text'
    }
  ]
  export default {
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      return {
        querySchema,
        queryObj
      }
    },
    created () {},
    methods: {
      query () {
        return false
      }
    }
  }
</script>
<style scoped>
  #examine{padding: 20px 0;}
  #examine .layout_inner{font-size: 14px;}
  #examine .body{overflow: auto; border-top:1px solid #ddd;}
  #examine .table-wrap{border-left:1px solid #ddd;border-right:1px solid #ddd; border-bottom:1px solid #ddd; width: 1714px;}
  #examine .table-wrap thead tr th{height: 50px; line-height: 50px; background: #f4f4f4;padding: 0 15px;}
  #examine .table-wrap .firstspan{padding: 15px;vertical-align: top;border-right: 1px solid #ddd;}
  #examine .table-wrap > tbody > tr:nth-child(even) > td{background: #f8f8f8;}
  #examine .table-wrap .firstspan .el-checkbox__label{color: #1C7BEF;}
  #examine .table-item .line{border-bottom:1px solid #ddd;}
  #examine .table-item .leftline{border-left: 1px solid #ddd;}
  #examine .table-item .noline{border-bottom: none;}
  #examine .table-item tr td{line-height:25px; padding: 12px 15px; vertical-align: top;}
  #examine table .el-button--danger{color: #fa5555; background: #fee; border-color: #fdbbbb;}
  #examine table .el-button--primary{color: #409eff;background: #ecf5ff; border-color: #b3d8ff;}
  #examine table .el-button--info{color: #878D99;background: #F3F4F5; border-color: #CFD1D6;}
  #examine table .el-button--success{color: #67C23A;background: #F0F9EB; border-color: #C2E7B0;}
</style>
