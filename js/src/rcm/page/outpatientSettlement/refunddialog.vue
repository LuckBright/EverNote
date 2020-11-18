<template>
  <el-dialog
    title="退费"
    :visible.sync="v"
    class="refund"
    v-loading="refundLoading"
    :close-on-click-modal="false"
    :modal-append-to-body="true"
    :append-to-body="true"
  >
    <div class="check">
      <div class="diy-tbody">
        <span>项目名称</span>
        <span>退款数量</span>
        <span>执行状态</span>
      </div>
      <el-tree
        :data="checkdata"
        class="checktree"
        ref="tree"
        node-key="id"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultexpandedarr"
        @check="treecheck"
        :props="defaultProps"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-checkbox
            v-if="data.level<3"
            :disabled="data.disabled"
            v-model="data.checked"
            @change="treecheck(data,node)"
          ></el-checkbox>
          <span>{{ data.label }}</span>
          <span class="diy-tr">{{ data.remainQuantity}}</span>
          <span class="diy-tr" v-if="data.level==3">{{ data.statusName}}</span>
        </span>
      </el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="v = false">取 消</el-button>
      <el-button type="primary" @click="surebtn">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    refundvisiable: {
      type: Boolean,
      required: true
    },
    refundTableData: {
      type: Array,
      required: true
    }
  },
  computed: {
    v: {
      get () {
        if (this.refundvisiable) {
          this.getcheckdata(this.refundTableData)
        }
        return this.refundvisiable
      },
      set (v) {
        this.$emit('update:refundvisiable', v)
      }
    }
  },
  data () {
    return {
      refundLoading: false,
      checkdata: [],
      defaultexpandedarr: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 节点点击触发
    treecheck (data, node) {
      this.handleTreeNodes(data)
    },
    handleTreeNodes (data) {
      data.children.filter(child => !child.disabled).forEach(child => {
        child.checked = data.checked
      })
      // 如果当前操作节点是二级，检查一级checkbox状态
      if (data.level === 2) {
        let isAllChecked = this.checkdata[0].children.filter(child => !child.disabled).every(item => item.checked)
        this.checkdata[0].checked = isAllChecked
      }
    },
    // 限制数量
    limitDecimal (data) {
      if (data.refundQuantity > data.remainQuantity) {
        data.refundQuantity = data.remainQuantity
        this.$messageTips(this, 'warning', '退款数量不能大于可退数量', '提示')
      }
      if (data.refundQuantity === '0') {
        data.refundQuantity = data.remainQuantity
        this.$messageTips(this, 'warning', '退款数量不能为0', '提示')
      }
    },
    // 禁止鼠标事件
    mousewheelevent (event) {
      event = event || window.event
      event.preventDefault()
    },
    // 根据参数配置返回是否可选
    getdisablestatus (itemtype, status) {
      // 301西药302中成药303中药饮片304中药颗粒(药品)
      let typearr = ['301', '302', '303', '304']
      if (typearr.includes(itemtype)) {
        // 药品，已提交可退
        return status !== 1 && status !== 2
      } else if (itemtype === '799') {
        return status !== 1
      } else {
        // 非药品
        // 非已提交状态，则不能退费
        return status !== 1
      }
    },
    // 处理树形数据
    getcheckdata (arr) {
      this.defaultexpandedarr = []
      let obj = {}
      let result = arr.reduce((total, cur) => {
        let item = {
          ...cur,
          id: cur.recipeId,
          children: cur.recipes.map(child => {
            let thirdUnit = {
              ...child,
              label: child.itemName,
              level: 3,
              disabled: true,
              refundQuantity: child.remainQuantity
            }
            return thirdUnit
          }),
          checked: false,
          disabled: this.getdisablestatus(cur.recipes[0].recipeType, cur.status),
          level: 2,
          label: `${cur.recipeName}（处方）`
        }
        obj[cur.recipeId]
          ? ''
          : (obj[cur.recipeId] =
            true &&
            total.push(item) &&
            this.defaultexpandedarr.push(cur.recipeId))
        return total
      }, [])
      let alldata = [
        {
          id: 1,
          checked: false,
          disabled: false,
          label: '全部',
          level: 1,
          children: []
        }
      ]
      alldata[0].children = result
      this.checkdata = alldata
    },
    // 保存
    surebtn () {
      let checkedData = this.checkdata[0].children.filter(item => item.checked)
      if (checkedData.length > 0) {
        let AllChildren = []
        let params = {
          details: checkedData.reduce((total, cur) => {
            let children = cur.children
            let childrenIds = []
            if (children) {
              childrenIds = children.map(child => child.id)
              AllChildren = AllChildren.concat(children)
            }
            total = total.concat(childrenIds)
            return total
          }, []),
          visitNumber: checkedData[0].visitNumber,
          macId: this.macId
        }
        if (AllChildren.some(recipt => recipt.registerFlag)) {
          // 挂号退费标识
          params.registerFlag = true
        }
        this.$emit('savedata', params)
      } else {
        this.$messageTips(this, 'warning', '请勾选要退费的处方')
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.check {
  margin-top: 20px;
}
.diy-tbody {
  height: 50px;
  line-height: 50px;
  background-color: #eeeeee;
  span {
    float: right;
    width: 100px;
  }
  :first-child {
    float: left;
    padding-left: 10px;
  }
}
.custom-tree-node {
  margin: 15px 0;
  position: relative;
  width: 100%;
  font-size: 16px;
}
.refund /deep/ .el-tree-node__content {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eeeeee;
}
.diy-tr {
  width: 100px;
  height: 10px;
  float: right;
}
.check /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 80px;
}
.checktree {
  height: 300px;
  overflow-y: overlay;
  border: 1px solid #eaeaea;
}
.el-tree-node {
  border-bottom: 1px solid #eeeeee;
}
.check /deep/ input::-webkit-outer-spin-button,
.check /deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.check /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
</style>

