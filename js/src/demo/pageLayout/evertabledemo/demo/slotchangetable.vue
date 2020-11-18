<template>
  <div>
    <el-button type="primary" @click="change(1)">改变列1</el-button>
    <el-button type="primary" @click="change(2)">改变列2</el-button>
    <el-button type="primary" @click="change(3)">改变列3</el-button>
    <ever-table
    :columns="columns"
    :data="tableData"
    @eventChange="eventChange"
    :is-record-url-params="false"
  >
    <template slot="codeCol1">
      <el-table-column prop="code" label="编号1" :formatter="codeFormatter">
      </el-table-column>
    </template>
    <template slot="codeCol2">
      <el-table-column prop="code" label="编号2" :formatter="codeFormatter"></el-table-column>
    </template>
    <template slot="codeCol3">
      <el-table-column prop="code" label="编号3" :formatter="codeFormatter"></el-table-column>
    </template>
    <template slot="codeCol4">
      <el-table-column prop="code" label="编号4" :formatter="codeFormatter"></el-table-column>
    </template>
    <template slot="opCol">
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary">编辑</el-button>
          <el-button type="text">详情</el-button>
        </template>
      </el-table-column>
    </template>
  </ever-table>
  </div>
</template>

<script>

  export default {
    created () {
      this.columns = [
        this.allColumns[0],
        this.allColumns[1],
        this.allColumns[4],
        this.allColumns[5],
        this.allColumns[6],
      ]
    },
    data: function () {
      return {
        allColumns: [
          {
            slotName: 'codeCol1'
          },
          {
            slotName: 'codeCol2'
          },
          {
            slotName: 'codeCol3'
          },
          {
            slotName: 'codeCol4'
          },
          {
            prop: 'name',
            label: '品牌'
          },
          {
            prop: 'version',
            label: '版本'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            slotName: 'opCol'
          }
        ],
        columns: [],
        tableData: [
          {
            code: '1',
            name: '苹果',
            version: 'iphonex max plus',
            price: '14,400.00'
          },
          {
            code: '2',
            name: '华为',
            version: 'ry max plus',
            price: '14,400.00'
          },
          {
            code: '3',
            name: '三星',
            version: '1.0 max plus',
            price: '4,400.00'
          }
        ]
      }
    },
    methods: {
      eventChange ({btnType, col, row}) {
        // 这里只是例子，实际开发时可以使用
        // this[prop] && this[prop](row)
        console.log(btnType, col, row)
      },
      codeFormatter (r, c, v) { // element 原生的formatter方法与everTable定义的formatter方法的参数顺序不一致，需要注意！
        return v + 'formatter'
      },
      change (type) {
        if (type === 1) {
          this.columns = [
            this.allColumns[0],
            this.allColumns[2],
            this.allColumns[4],
            this.allColumns[5],
            this.allColumns[6],
          ]
        } else if (type === 2) {
          this.columns = [
            this.allColumns[1],
            this.allColumns[2],
            this.allColumns[3],
            this.allColumns[5],
            this.allColumns[6],
          ]
        } else if (type === 3) {
          this.columns = [
            this.allColumns[0],
            this.allColumns[2],
            this.allColumns[5],
            this.allColumns[7],
          ]
        }
      }
    }
  }
</script>

