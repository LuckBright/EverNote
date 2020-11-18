<template>
  <div>
    <el-table
      :data="memcards"
      style="width: 100%"
      ref="table"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="code"
        label="会员卡编号">
      </el-table-column>
      <el-table-column
        label="会员卡类型">
        <template slot-scope="scope">
          <span>
            <sys-value :code="scope.row.batchType" type="THC_CARD_MEMBERCARD_TYPE"></sys-value>
            <span v-if="scope.row.memberCardShare">
              （共享）
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="折扣">
        <template slot-scope="scope">
          <span v-if="scope.row.memberCardBatch && scope.row.memberCardBatch.discount">
            {{scope.row.memberCardBatch.discount/10}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="卡可用余额">
        <template slot-scope="scope">
          <span v-if="!(scope.row.memberCardShare && scope.row.memberCardShare.maxShareMoney)">
            {{scope.row.storedMoney}} 元
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="卡点可用余额">
        <template slot-scope="scope">
          <span v-if="!(scope.row.memberCardShare && scope.row.memberCardShare.maxShareMoney)">
            {{scope.row.givedMoney}} 元
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="共享可用余额">
        <template slot-scope="scope">
          <span v-if="scope.row.memberCardShare && scope.row.memberCardShare.maxShareMoney">
            {{scope.row.memberCardShare.maxShareMoney - scope.row.memberCardShare.usedShareMoney}} 元
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="有效期起"
        width="170">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="有效期至"
        width="170">
      </el-table-column>
<!--       <el-table-column
        prop="usePreAmount"
        label="赠送使用金额">
      </el-table-column> -->
      <el-table-column
        label="排序">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="up(scope.row)">上升</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import memcard from '../../card/store/cardapi'

  function merge (all, selected) {
    return all.map(v => {
      let obj = selected.filter(v1 => {
        return v1.code === v.code
      })
      if (obj.length) {
        obj = obj[0]
        v.useAmount = obj.useAmount
      }
      return v
    })
  }

  export default {
    props: ['patientid', 'value', 'init'],
    data () {
      return {
        memcards: []
      }
    },
    methods: {
      list: function () {
        memcard.getCardsByUser(this.patientid).then(result => {
          console.log(result, 8008)
          if (!result.data) {
            this.memcards = []
            return
          }
          result.data = result.data.map(v => {
            v.memberCardID = v.id
            v.batchID = v.batchId
            delete v.id
            return v
          })

          this.memcards = merge(result.data, this.value)
          this.$nextTick(_ => {
            this.initSel()
          })
        })
      },
      initSel: function () {
        this.init.forEach(v => {
          let sel = this.memcards.filter(v1 => {
            return v.code === v1.code
          })[0]
          sel && this.$refs.table.toggleRowSelection(sel, true)
        })
      },
      handleSelectionChange: function (sel) {
        this.$emit('input', sel)
      },
      up: function (row) {
        let i = 0
        for (i; i < this.memcards.length; i++) {
          if (row.id === this.memcards[i].id) {
            break
          }
        }
        if (i > 0) {
          let cards = this.memcards.slice(0)
          let pre = cards[i - 1]
          cards[i - 1] = cards[i]
          cards[i] = pre
          this.memcards = cards
        }
      }
    },
    watch: {
      'patientid': function () {
        if (this.patientid) {
          this.list()
        } else {
          this.memcards = []
        }
      },
      'init': function () {
        this.$refs.table.clearSelection()
        this.initSel()
      }
    },
    created () {
      if (this.patientid) {
        this.list()
      } else {
        this.memcards = []
      }
    }
  }
</script>

