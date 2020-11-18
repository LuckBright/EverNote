<template>
  <div>
    <el-dialog
    title="添加优惠券"
    :visible.sync="show"
    :modal="false"
    class="ui_dialog_02"
    >
      <ever-form-model :schema="codeSchema" v-model="codeObj">
      </ever-form-model>
      <div slot="footer" class="footer">
        <el-button @click="addCode()"><i class="iconfont icon-tijiao"></i>添加</el-button>
      </div>
    </el-dialog>
    <el-button @click="show=true">添加优惠券</el-button>
    <el-table
      :data="gifts"
      style="width: 100%"
      ref="table"
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column   type="expand">
        <template slot-scope="scope">
          <el-table
            :data="getItems(scope.row.itemIds, scope.row.categoryIds)"
            style="width: 90%"
            >
            <el-table-column
              prop="itemcode"
              label="项目编号">
            </el-table-column>
            <el-table-column
              prop="itemname"
              label="项目名称">
            </el-table-column>
            <el-table-column
              label="数量">
              <template slot-scope="scope">
                {{scope.row.quantity }}
              </template>
            </el-table-column>
            <el-table-column
              prop="unit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="price"
              label="单价">
            </el-table-column>
            <el-table-column
              prop="fee"
              label="项目合计">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="giftBatch.name"
        label="名称">
      </el-table-column>
      <el-table-column
        label="优惠卷类型">
        <template slot-scope="scope">
          <sys-value :code="scope.row.giftBatch.type" type="THC_CARD_GIFTBATCH_TYPE"></sys-value>
        </template>
      </el-table-column>
      <el-table-column
        prop="giftBatch.money"
        label="面额">
      </el-table-column>
      <el-table-column
        prop="giftBatch.useStartTime"
        label="有效期起">
      </el-table-column>
      <el-table-column
        prop="giftBatch.useEndTime"
        label="有效期至">
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
  import giftcard from '../../card/store/giftbatchdetailapi'

  function merge (all = [], selected) {
    return all.map(v => {
      let obj = selected.filter(v1 => {
        return v1.code === v.code
      })
      if (obj.length) {
        obj = obj[0]
        v.itemAmount = obj.itemAmount
        v.disamount = obj.disamount
      }
      return v
    })
  }

  let codeSchema = [
    {
      name: 'code',
      label: '编号'
    }
  ]

  function validGift (gifts, items) {
    // return gifts
    return gifts.filter(gift => {
      return items
        .filter(item => {
          if (!item) {
            return false
          }
          gift.categoryIds = gift.categoryIds || []
          gift.itemIds = gift.itemIds || []
          return gift.categoryIds.indexOf(item.itemtype) > -1 || gift.itemIds.indexOf(item.itemid) > -1
        })
        .length > 0
    })
  }

  export default {
    props: ['patientid', 'value', 'init', 'items'],
    data () {
      let codeObj = this.$ever.createObjFromSchema(codeSchema)
      return {
        gifts: [],
        codeSchema,
        codeObj,
        show: false,
        all: []
      }
    },
    methods: {
      list: function () {
        giftcard.getByUser(this.patientid).then(result => {
          this.all = result.data.map(v => {
            v.couponID = v.id
            delete v.id
            return v
          })
          let tmp = validGift(this.all, this.items)
          this.gifts = merge(tmp, this.value)
          this.$nextTick(_ => {
            this.initSel()
          })
        })
      },
      handleSelectionChange: function (sel) {
        this.$emit('input', sel)
        // this.value = sel
      },
      initSel: function () {
        this.init.forEach(v => {
          let sel = this.gifts.filter(v1 => {
            return v.code === v1.code
          })[0]
          sel && this.$refs.table.toggleRowSelection(sel, true)
        })
      },
      getItems (ids = [], types = []) {
        ids = ids || []
        types = types || []
        return this.items.filter(item => {
          return ids.indexOf(item.itemid) > -1 || types.indexOf(item.itemtype) > -1
        })
      },
      addCode () {
        giftcard.bind(this.patientid, this.codeObj.code).then(_ => {
          this.list()
          this.show = false
        })
      }
    },
    watch: {
      'patientid': function () {
        if (this.patientid) {
          this.list()
        } else {
          this.gifts = []
        }
      },
      'init': function () {
        this.initSel()
      },
      'items': function () {
        this.gifts = validGift(this.all, this.items)
      }
    },
    created () {
      this.list()
    }
  }
</script>
