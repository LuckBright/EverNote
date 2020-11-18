<template>
  <el-dialog
    :visible.sync="visible"
    width="450px"
    class="correlation-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeCallback"
  >
    <div slot="title">
      <el-input class="office-input" v-model="officeInput" size="small" placeholder="查找科室" clearable></el-input>
      <el-button type="primary" plain class="plain-btn" size="small" @click="queryOffice">查询</el-button>
    </div>
    <div class="office-container" v-loading="loading">
      <div class="office-top">
        <div class="useable">可用科室</div>
        <div class="selected-count">已选择{{selectedList.length}}个科室</div>
      </div>
      <el-tree
        class="office-tree"
        v-if="!loading"
        ref="officeTree"
        :data="officeList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="defaultChecked.length ? defaultChecked : ['-1']"
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @check="checkChange"
        @check-change="nodeChange"
			>
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span>{{ node.label }}</span>
					<span v-if="data.status === 'N' || data.usePermissionStatus === 'N'" class="disabled">(已禁用)</span>
				</span>
			</el-tree>
    </div>
    <div slot="footer" class="office-footer">
      <el-button v-if="!disabled" type="primary" size="small" @click="sureSelect">确认选择</el-button>
      <el-button class="plain-btn" size="small" type=primary plain @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '../managesapi'
import { objFind, objRemove } from '@/util/common'

export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    selecteds: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      officeInput: '',
      loading: true,
      datas: [],
      defaultChecked: [],
      selectedList: []
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.dialogShow
      },
      set: function (val) {
        this.$emit('update:dialogShow', val)
      },

    },
    officeList () {
      if (this.datas.length) {
        this.datas.forEach(item => {
          item.disabled = this.disabled || item.disabled
        })
        return [{
          id: '-1',
          orgSubjectName: '全部',
          disabled: this.disabled,
          children: this.datas
        }]
      }
      return []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.defaultProps = {
        children: 'children',
        label: 'orgSubjectName'
      }
    },
    checkChange (data) {
      this.selectedList = this.$refs.officeTree.getCheckedNodes().filter(item => item.id !== '-1').map(item => {
        return {providerId: item.id, providerType: item.type2Code}
      })
    },
    sureSelect () {
      this.$emit('changeOffice', this.selectedList)
      this.close()
    },
    close () {
      this.$emit('update:dialogShow', false)
    },
    closeCallback () {
      this.$off('changeOffice')
    },
    queryOffice () {
      this.$refs.officeTree.filter(this.officeInput)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.orgSubjectName && data.orgSubjectName.indexOf(value) !== -1
    },
    officeFormatter (list) {
      let obj = {}
      let formatList = []
      obj.parents = []
      list.forEach(item => {
        item.disabled = (item.status === 'N' || item.usePermissionStatus === 'N') && !objFind(this.selectedList, {providerId: item.id})
        let parentId = item.parentId
        if (!parentId) {
          obj.parents.push(item)
          return
        }
        if (!obj[parentId]) {
          obj[parentId] = [item]
        } else {
          obj[parentId].push(item)
        }
      })
      function concatObj (parents, obj) {
        parents.children.forEach(item => {
          item.children = obj[item.id] || []
          concatObj(item, obj)
        })
      }
      formatList = obj.parents.map(item => {
        item.children = obj[item.id] || []
        concatObj(item, obj)
        return item
      })
      return formatList
    },
    getOffices (row, key) {
      this.officeInput = ''
      this.loading = true
      this.defaultChecked = row[key].map(item => item.providerId)
      this.selectedList = row[key]
      this.$once('changeOffice', (val) => {
        row[key] = val
        this.$emit('add', row)
      })
      /**
       * clinicId 机构id
       * 旧的值集 categoryIds 科室类型 [1972 - 临床, 1974 - 职能, af3bc6b3-02af-4f21-8736-decce395e883 - 医技]
       * 新的值集 categoryIds 科室类型 [01 - 临床, 03 - 职能, 02 - 医技]
       */
      api.getLocalSectionVoListForService({
        orgIdList: [row.orgId],
        type1CodeList: ['01', '02'],
        usePermissionStatus: 'A'
        // status: 'Y'
      }).then(res => {
        // 过滤掉没有临床类别的
        res = res || []
        this.datas = this.officeFormatter(res)
        this.loading = false
      })
    },
    nodeChange (data, checked) {
      if (!checked && (data.status === 'N' || data.usePermissionStatus === 'N')) {
        window.setTimeout(() => {
          objRemove(this.defaultChecked, (item) => item === data.id)
          data.disabled = true
        }, 0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .plain-btn {
      background-color: #fff;
    }
  .correlation-dialog {
    .office-footer {
      text-align: left;
    }
    .office-input {
      width: 200px;
    }
    .office-container {
      border: 1px solid #bbb;
      box-sizing: border-box;
      padding: 15px;
      min-height: 200px;
    }
    .office-top {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px rgba(28, 123, 239, 0.7) solid;
      padding: 0 5px;
      padding-bottom: 10px;
      font-size: 14px;
    }
    .selected-count {
      color: #1c7bef;
    }
    .office-tree {
      padding: 10px;
      max-height: 400px;
      overflow-y: auto;
    }
    .custom-tree-node {
      .disabled {
        color: red;
      }
    }
    /deep/ .el-dialog__footer {
      border-top: none;
    }
    /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: red;
    }
  }
</style>
