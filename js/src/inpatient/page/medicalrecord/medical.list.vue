<template>
  <div class="medical_list">
    <el-menu
          ref="medical_tree"
          :default-openeds="opens"
          class="el-menu-style"
          theme="light"
          :router="false"
          :key="recordRandom"
          @select="menuSelect">
      <div v-for="item in menuList" :key="item.id">
          <sub-menu
              ref="submenu"
              :readonly="readonly"
              :param="item"
              :visitId="visitId"
              :patient-name="patientName"
              :patient-id="patientId"
              @select="menuSelect"
              @quoteTpl="quoteTpl">
          </sub-menu>
      </div>
    </el-menu>
  </div>
</template>
<script>
import { uniqBy, remove, uniq } from 'lodash'
import subMenu from './submenu.vue'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
// import { menuList } from './data.js'
export default {
  name: 'medicalList',
  components: {
    subMenu
  },
  props: {
    isUpdate: {// 判断是否更新，有更新未保存为true
      type: Boolean
    },
    menuList: {
      type: Array
    },
    readonly: {
      type: Boolean
    },
    visitId: {
      type: String
    },
    patientId: {
      type: String
    },
    patientName: {
      type: String
    }
  },
  data () {
    return {
      unSaveIds: [],
      checked: false,
      curNode: {},
      recordRandom: Math.random(),
      binganCode: 'ZHU_YUAN_BING_AN_SHOU_YE',
      opens: []
    }
  },
  computed: {
    // defaultOpenMenu () {
    //   this.openAllMenu(this.menuList)
    //   return Array.from(this.opens)
    // }
  },
  mounted () {
    this.openAllMenu(this.menuList)
    // this.$refs.medical_tree.openedMenus = this.opens
  },
  methods: {
    openAllMenu (list) {
      list.forEach(item => {
        if (item.isInstance) return
        this.$refs.submenu.forEach(subItem => {
          this.opens.push(subItem.setIndex(item))
        })
        if (item.nodes && item.nodes.length > 0) {
          this.openAllMenu(item.nodes)
        }
      })
      this.opens = uniq(this.opens)
    },
    quoteTpl (val) {
      this.$emit('quoteTpl', val)
    },
    getNode (arr, id) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i]
        }
        if (arr[i].children) {
          var n = this.getNode(arr[i].children, id)
          if (n) {
            return n
          }
        }
      }
    },
    initTabs () {
      request(urlMap.medicalRecord.getCategoryByCode, {
        code: this.binganCode
      }).then(result => {
        if (result.head.errCode === 0) {
          this.curNode = {
            code: this.binganCode,
            type: 'bingli',
            id: result.data.id,
            title: result.data.name,
            isUpdate: false
          }
          return this.curNode
        }
      })
    },
    getInstanceInfo (id, callback) {
      request(urlMap.medicalRecord.getInstance, {id}, 'get').then(res => {
        if (res.head.errCode === 0) {
          callback && callback(res.data)
        }
      })
    },
    menuSelect (index, indexPath) {
      const recordObj = JSON.parse(index)
      if (recordObj.code === this.binganCode && (recordObj.isInstance)) {
        this.curNode = {
          code: recordObj.code,
          type: 'bingli',
          id: recordObj.id,
          title: '病案首页',
          isUpdate: false,
          recordType: 1,
          categoryName: '病案首页',
          isRecall: recordObj.isRecall
        }
        this.$emit('menuSelect', this.curNode)
      } else if (recordObj.code === 'TI_WEN_DAN') {
        this.curNode = {
          code: recordObj.code,
          type: 'signentry',
          id: recordObj.id,
          title: '体温单录入',
          isUpdate: false,
          recordType: 3,
          categoryName: '体温单录入'
          // name: 'sign',

        }
        this.$emit('menuSelect', this.curNode)
      } else if (recordObj.code === 'TI_WEN_JI_LU_DAN') {
        this.curNode = {
          code: recordObj.code,
          type: 'signcheck',
          id: 'TI_WEN_JI_LU_DAN',
          title: '体温单',
          isUpdate: false,
          recordType: 3,
          categoryName: '体温记录单'
        }
        this.$emit('menuSelect', this.curNode)
      } else {
        if (!recordObj.isInstance) return false
        this.curNode = {
          designerId: recordObj.designerId,
          id: recordObj.id,
          status: recordObj.status, // 提交状态1保存状态2是提交状态
          title: recordObj.title,
          type: 'bingli',
          formTemplateId: recordObj.formTemplateId,
          isUpdate: false,
          isInstance: recordObj.isInstance,
          categoryName: recordObj.categoryName,
          categoryId: recordObj.categoryId,
          code: recordObj.code,
          recordType: Number(recordObj.type),
          templateScopeId: recordObj.templateScopeId,
          isRecall: recordObj.isRecall
          // rootCode: tmpArr[12],
          // scrollIndex: tmpArr[13]
        }
        this.$emit('menuSelect', this.curNode)
      }
    },
    menuSelectOld (index, indexPath) {
      let tmpArr = index.split('ā')
      console.log(tmpArr, tmpArr[4])
      // 0当前节点id，
      // 1是否提交，
      // 2病历名称，
      // 3病历模版id,
      // 4病历是否更新,
      // 5判断是不是实例是否可以引用模版,
      // 6模版类型name（确定在哪个节点上建立的病历）
      // 7,模版类型id
      // 8,模版code
      // 9，模版类型1表单2模版
      // 10，// 1-住院 2-门诊 3-护理
      // 11,模版关联id，通过templateScopeId可以知道当前模版在某个集团或者科室下面的门诊还是住院
      if (tmpArr[8] === this.binganCode && (tmpArr[5] === 'true')) {
        this.curNode = {
          code: this.binganCode,
          type: 'bingli',
          id: tmpArr[0],
          title: '病案首页',
          isUpdate: false,
          recordType: 1,
          categoryName: '病案首页'
        }
        this.$emit('menuSelect', this.curNode)
      } else if (tmpArr[8] === 'TI_WEN_DAN') {
        this.curNode = {
          code: tmpArr[8],
          type: 'signentry',
          id: tmpArr[0],
          title: tmpArr[2],
          isUpdate: false,
          recordType: 3,
          categoryName: '体温单录入'
          // name: 'sign',

        }
        this.$emit('menuSelect', this.curNode)
      } else if (tmpArr[8] === 'TI_WEN_JI_LU_DAN') {
        this.curNode = {
          code: tmpArr[8],
          type: 'signcheck',
          id: 'TI_WEN_JI_LU_DAN',
          title: '体温单',
          isUpdate: false,
          recordType: 3,
          categoryName: '体温记录单'
        }
        this.$emit('menuSelect', this.curNode)
      } else {
        this.curNode = {
          designerId: tmpArr[9],
          id: tmpArr[0],
          status: Number(tmpArr[1]), // 提交状态1保存状态2是提交状态
          title: tmpArr[2],
          type: 'bingli',
          formTemplateId: tmpArr[3],
          isUpdate: false,
          editable: false,
          isInstance: tmpArr[5] === 'true',
          categoryName: tmpArr[6],
          categoryId: tmpArr[7],
          code: tmpArr[8],
          recordType: Number(tmpArr[10]),
          templateScopeId: tmpArr[11],
          rootCode: tmpArr[12],
          scrollIndex: tmpArr[13]
        }
        if (!this.curNode.isInstance) return false
        this.$emit('menuSelect', this.curNode)
      }
    },
    change (val) {
      if (val) { // val为true表示修改了未保存
        this.unSaveIds.push(this.curNode)
      } else { // 为false需要移除该项
        remove(this.unSaveIds, (item) => {
          return item.id === this.curNode.id
        })
      }
      this.curNode.isSave = val
      this.unSaveIds = uniqBy(this.unSaveIds, 'id')
      let item = this.getNode(this.menuList, Number(this.curNode.id))
      this.$set(item, 'isSave', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.medical_list {
  background: #f9f9f9;
  /deep/.el-menu-item {
    height: 30px;
    line-height: 30px;
    background: #f9f9f9;
  }
  .el-submenu__title {
    height: 30px;
    line-height: 30px;
    background: #f9f9f9;
  }
}
</style>
