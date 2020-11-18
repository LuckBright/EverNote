<template>
  <div id="tree">
    <div v-if="ifShowTitle && clinicName">
      <el-button size="small" v-if="select != FRAMEWORK[0] && rootId" class="f14" type="text" @click="handelCustomDetails">&lsaquo;&lsaquo; 返回架构详情</el-button>
    </div>
    <div class="body_head" v-if="clinicName">
      <el-row type="flex" align="middle" justify="space-around">
        <el-col :span="24" v-if="!isClinicTotal">
          <h4 class="mr10 inline-block mt10 mb10 ml10">{{clinicName}}</h4>
          <el-button v-if="!lookInterface && childNodeFlag && select == FRAMEWORK[0]" type="text" @click="handelIsClinic()">编辑</el-button>
          <el-button v-if="select != FRAMEWORK[0]" type="text" @click="handelIsClinic()">编辑</el-button>
          <div class="mt10 mb10 ml10 f14" v-if="select != FRAMEWORK[0] && clinicCustomName">{{clinicCustomName}}</div>
        </el-col>
        <el-col class="mb20 mt10" :span="22" v-else>
          <el-col :span="4" class="mr10">
            <ever-select v-if="select == FRAMEWORK[0]" v-model="rootNode" :options="clinicArr" :needObjFlag="true" placeholder="请选择集团机构" filterable :clearable="true"></ever-select>
            <el-input size="small" v-model="rootNodeStr" placeholder="请输入架构名称" v-else></el-input>
          </el-col>
          <el-col :span="8">
            <el-button size="small" type="primary" @click="handelRootGroup">保存</el-button>
          </el-col>
        </el-col>
        <el-col :span="2" align="right">
          <el-button type="primary" size="small" @click="$router.push('/group/mechanismadd/')">创建机构</el-button>
        </el-col>
      </el-row>
    </div>
    <div :class="!clinicName ? 'body_con' : 'body_con'" v-if="ifShowTitle">
      <el-row>
        <el-col :span="24">
          <div class="head_title alg_c f_bold">
            <span>{{titleName}}</span>
          </div>
        </el-col>
      </el-row>
      <div class="content_clinic" v-if="!clinicName">
        <el-row>
          <el-col :span="24" class="alg_c mt20 mb40" v-if="select == FRAMEWORK[0]">
            <ever-select v-model="rootClinicId" :options="clinicArr" :needObjFlag="true" placeholder="请选择集团机构" width="400px" filterable :clearable="true"></ever-select>
          </el-col>
          <el-col :span="24" class="alg_c mt20 mb40" v-else>
            <el-col :span="6">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="12">
               <el-input size="small" placeholder="请输入架构名称" v-model="customName">
                <el-select v-model="select" slot="prepend" placeholder="请输入架构名称" style="width: 140px">
                  <el-option v-for="item in CUSTOM_CLASSIFY" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-input>
              <!-- <el-input size="small" v-model="customName" placeholder="请输入架构名称"></el-input> -->
            </el-col>
            <el-col :span="6">
            </el-col>
          </el-col>
          <el-col :span="24" class="alg_c">
            <el-button size="small" type="primary" @click="handelAddRootClinic()">保存</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <el-tree
          v-if="clinicName"
          node-key="id"
          ref="tree"
          :data="tableData"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :indent="select == FRAMEWORK[2] ? 500 : 200"
          :empty-text="select != FRAMEWORK[0] && createCustomFlag && !tableData.length ? ' ' : '暂无数据'">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <span v-if="node.disabled" class="cell-btn">
                <el-button size="small" type="text" @click="handelClinicInfo(data)">{{node.label}}</el-button>
              </span>
              <span class="f14" v-else>{{node.label}}</span>
            </span>
            <span v-if="!lookInterface" class="cell-btn">
              <el-button v-if="select == FRAMEWORK[2] && !data.parentId" size="small" type="primary" @click="handelEdit(data)">编辑</el-button>
              <el-button v-else-if="select != FRAMEWORK[2]" size="small" type="primary" @click="handelEdit(data)">编辑</el-button>
              <el-button :class="select != FRAMEWORK[0] && !data.parentId ? 'place' : ''" size="small" type="danger" @click="handleCancle(data)">解除关联</el-button>
            </span>
          </span>
        </el-tree>
        <el-row v-if="clinicName && !lookInterface && select == FRAMEWORK[0]">
          <el-col :span="24" class="con_clinic" v-if="!organOrNode && childNodeFlag">
            <div class="ml20">
              <el-button size="small" v-if="!isClinic" type="text" @click="handelIsClinic('group')">添加机构</el-button>
              <div v-else>
                <ever-select class="mr10" v-model="mechanismId" :options="clinicArr" :needObjFlag="true" placeholder="请选择集团机构" width="300px" filterable :clearable="true"></ever-select>
                <el-button size="small" type="primary" @click="handelAddClinic">添加</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="select != FRAMEWORK[0] && clinicName && createCustomFlag">
          <el-col :span="24" class="con_custom alg_c" v-if="tableData.length > 1">
            <span>{{tableData.length ? '请添加子节点' : '请添加根节点'}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="footer_tree mt20 alg_c" v-if="!childNodeFlag">
      <el-row>
        <el-col :span="24">
          <span v-if="select != FRAMEWORK[0] && !tableData.length">添加根节点:</span>
          <span v-else class="f14">添加子节点:</span>
          <ever-select size="small" class="ml10" v-model="childNode" :needObjFlag="true" :options="clinicArr" placeholder="选择机构" width="300px" filterable></ever-select>
          <ever-select size="small" v-if="select == FRAMEWORK[1]" class="ml10 mr10" v-model="departmentObject" :needObjFlag="true" :options="departmentArr" placeholder="选择部门" width="200px" filterable :clearable="true"></ever-select>
          <ever-select size="small" v-if="select == FRAMEWORK[2] && !rootId" class="ml10 mr10" v-model="storageRoomObject" :needObjFlag="true" :options="storageRoomArr" placeholder="选择库房" width="200px" filterable :clearable="true"></ever-select>
          <remote-select size="small" v-else-if="select == FRAMEWORK[2] && rootId" style="width: 500px; display: inline-block" v-model="localSettingObject" class="ml10 mr10" ref="remoteselect" :queryParams="queryParams" apiName="getClinicMaterial" :api="api" @selectSave="handleSelect" :clearable="true"></remote-select>
          <!-- <remote-select :needObjFlag="true" :options="localSettingArr" placeholder="选择物资" width="500px" filterable :remote-method="queryMaterial" remote :loading="loading"></remote-select> -->
          <el-button size="small" type="primary" @click="handelGroup()">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="mt20" v-if="childNodeFlag && !lookInterface && this.tableList.length">
      <h4>已解除关联机构列表</h4>
      <div class="body_con">
        <el-row>
          <el-col :span="24">
            <div class="head_title alg_c f_bold">
              <span>{{titleName}}</span>
            </div>
          </el-col>
        </el-row>
        <el-tree
          class="content"
          v-if="clinicName"
          node-key="id"
          ref="tree"
          :data="tableList"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :indent="200">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <span v-if="node.disabled">
                <el-button size="small" type="text" @click="handelClinicInfo(data)">{{node.label}}</el-button>
              </span>
              <span class="f14 ml10" v-else>{{node.label}}</span>
            </span>
            <span v-if="!lookInterface && data.ifShowButton">
              <el-button size="small" type="danger" plain @click="handleCancle(data)">解除关联</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="mt20 alg_c" v-if="childNodeFlag && customId && select != FRAMEWORK[0]">
      <el-row>
        <el-col :span="24">
          <el-button size="small" type="primary" @click="handelDelCustom()">删除架构</el-button>
        </el-col>
      </el-row>
    </div>
    <tipDialog title="是否解除关联子节点" content="该操作只解除当前节点与上级父节点的关系，下属子节点的关系依旧存在" ref="dialog" :function="handelRemove"></tipDialog>
  </div>
</template>
<script>
import api from '@/warehouse/page/group/store/organizationapi'
import tipDialog from '@/warehouse/page/components/tipsdialog'
import remoteSelect from '@/warehouse/page/joinstorage/remoteselect'
import { debounce, patch, SPEC_CODE } from '@/util/common'

const CUSTOM_CLASSIFY = [
  { id: 122, name: '自定义' }
  // {id: 123, name: '集团发药'} 2019.3.29  笑语让俺暂时去掉
]

export default {
  // blockFlag 返回集团架构根节点
  props: ['clinicId', 'architectureType', 'customArr', 'customNewBulit', 'FRAMEWORK', 'blockFlag'],
  data () {
    return {
      api,
      titleName: '机构名称',
      defaultProps: {
        children: 'children',
        label: 'architectureName',
        disabled: 'status'
      },
      CUSTOM_CLASSIFY,
      select: CUSTOM_CLASSIFY[0].id,
      tableData: [],
      tableList: [],
      clinicArr: [],
      departmentArr: [],
      storageRoomArr: [],
      localSettingArr: [],
      organOrNode: null,
      isClinicTotal: false,
      isClinic: false,
      mechanismId: {},
      childNode: {},
      rootClinicId: {},
      clinicName: '',
      lookInterface: false,
      // 此id判断是否编辑根节点
      rootId: '',
      childNodeFlag: true,
      removeNode: {},
      customName: '',
      customId: null,
      createCustomFlag: true,
      rootNode: {},
      departmentObject: {},
      storageRoomObject: {},
      localSettingObject: {},
      clinicCustomName: '',
      rootNodeStr: '',
      ifShowTitle: false,
      createData: {},
      unEditFlag: true,
      rootDataId: '',
      slectClinicId: '',
      queryParams: {}
    }
  },
  created () {
    this.defaultProps.label = 'architectureName'
    if (this.architectureType) this.select = this.architectureType
    if (Number(this.select) !== this.FRAMEWORK[0]) {
      this.ifShowTitle = true
      this.titleName = '节点名称'
      if (this.customArr && this.customArr.id && this.customNewBulit) {
        this.customId = this.customArr.id
        this.clinicName = this.customArr.name
        this.select = this.customArr.architectureType
        let params = {
          architectureType: this.select,
          directoryId: this.customId
        }
        this._getCustomInfo(params)
      }
    } else {
      this._getNodeObject()
    }
  },
  methods: {
    handelCustomDetails () {
      this.rootId = ''
      this.isClinicTotal = false
      this.unEditFlag = true
      this.childNode = {}
      this.departmentObject = {}
      this.childNodeFlag = true
      let params = {
        architectureType: this.select,
        directoryId: this.customId
      }
      this.clinicCustomName = ''
      this._getCustomInfo(params)
    },
    handelDelCustom: debounce(function () {
      let delData = this.customArr && this.customArr.id ? this.customArr : this.createData
      this._emitStatus(delData)
    }),
    handleCancle: debounce(function (data) {
      this.removeNode = Object.assign({}, data)
      this.$refs.dialog.open()
    }),
    handelClinicInfo: debounce(function (data) {
      this._emitStatus('seeGroup')
      this.defaultProps.label = 'name'
      this.lookInterface = true
      this.clinicName = data.architectureName
      this.tableData = this._arr2Tree(data.departmentList, true)
    }),
    handelRootGroup: debounce(function () {
      if (Number(this.select) !== this.FRAMEWORK[0]) this._createCustom('edit')
      if (!this.rootNode.id && this.rootNode.id !== this.rootId && Number(this.select) === this.FRAMEWORK[0]) {
        this.isClinicTotal = false
      } else if (Number(this.select) === this.FRAMEWORK[0]) {
        this.clinicName = this.rootNode.name
        this.isClinicTotal = false
        this.rootId = this.rootNode.id
        this.rootNode = {}
        this.api.create(this.rootId).then(res => {
          if (res) {
            this._getNodeObject()
          }
        })
      }
    }),
    handelGroup: debounce(function () {
      if (Number(this.select) === this.FRAMEWORK[0]) {
        let childDataId = this.childNode.id
        this.childNode = {}
        this._addNode(childDataId, childDataId, this.rootId)
      } else {
        let objectName, objectId
        if (Number(this.select) === this.FRAMEWORK[1]) {
          objectName = this.departmentObject.name ? this.departmentObject.name : ''
          objectId = this.departmentObject.id ? this.departmentObject.id : ''
        } else {
          objectName = this.storageRoomObject.name ? this.storageRoomObject.name : this.localSettingObject.name ? this.localSettingObject.name : ''
          objectId = this.storageRoomObject.id ? this.storageRoomObject.id : this.localSettingObject.id ? this.localSettingObject.id : ''
        }
        if (!objectId) return
        let params = {
          clinicId: this.childNode.id,
          architectureId: objectId,
          architectureName: `${this.childNode.name} - ${objectName}`,
          directoryId: this.customId
        }
        this.rootId ? this._addNode(this.childNode.id, objectId, this.rootId) : this._addCustomNode(params)
      }
    }),
    handelAddClinic: debounce(function () {
      if (!this.mechanismId.id) {
        this.isClinic = false
      } else {
        let mechanismId = this.mechanismId.id
        this.mechanismId = {}
        this._addNode(mechanismId, mechanismId, this.rootId)
      }
    }),
    handelAddRootClinic: debounce(function () {
      if (Number(this.select) === this.FRAMEWORK[0] && !this.tableData.length) {
        if (!this.rootClinicId.id) {
          this.$messageTips(this, 'warning', '请选择集团机构')
        } else {
          this.api.create(this.rootClinicId.id).then(res => {
            this._getNodeObject()
          })
        }
      }
      if (Number(this.select) !== this.FRAMEWORK[0]) {
        let msgName = Number(this.select) === this.FRAMEWORK[1] ? '自定义' : '集团发药'
        !this.customName ? this.$messageTips(this, 'warning', `请录入${msgName}架构名称`) : this._createCustom('newBuilt')
      }
    }),
    handelIsClinic (type) {
      type ? this.isClinic = true : this.isClinicTotal = true
      if (Number(this.select) !== this.FRAMEWORK[0]) this.rootNodeStr = this.customArr.name
    },
    handelEdit: debounce(function (data) {
      this.childNodeFlag = false
      if (Number(this.select) === this.FRAMEWORK[0]) {
        this.titleName = '节点名称'
        this._emitStatus('childNode')
        this._getTreeList(data.id)
        this._getClinicName(data.id)
      } else {
        // 集团发药只允许有二级节点
        if (Number(this.select) === this.FRAMEWORK[2]) this.unEditFlag = false
        this.isClinicTotal = false
        this.rootId = data.id
        this._getClinicName(data.id)
        let params = {
          architectureType: this.select,
          id: data.id
        }
        this._getCustomInfo(params)
      }
    }),
    handelRemove: debounce(function () {
      this.api.unbindNode(this.removeNode.id).then(res => {
        if (res) {
          if (Number(this.select) === this.FRAMEWORK[0]) {
            this._getTreeList(this.rootId)
          } else {
            let params = { architectureType: this.select }
            if (this.rootId && this.rootId !== this.removeNode.id) {
              Object.assign(params, { id: this.rootId })
            } else {
              this.childNodeFlag = true
              Object.assign(params, { directoryId: this.customId })
            }
            this._getCustomInfo(params)
          }
        }
      })
    }),
    _createCustom (status) {
      let customParams = { architectureType: this.select }
      if (status === 'newBuilt') {
        if (!this.customName) {
          this.isClinicTotal = false
          return
        }
        Object.assign(customParams, { architectureName: this.customName })
      } else if (status === 'edit') {
        if (!this.rootNodeStr || this.customArr.name === this.rootNodeStr) {
          // return this.$messageTips(this, 'warning', '您提交的架构名称重复，请检查后重新录入')
          this.isClinicTotal = false
          return
        }
        Object.assign(customParams, { id: this.customId, architectureName: this.rootNodeStr })
      }
      this.api.createCustom(customParams).then(res => {
        if (res && res.id) {
          if (status === 'newBuilt') {
            this.createCustomFlag = false
            this.childNodeFlag = false
            this.clinicName = this.customName
            this.customId = res.id
            this.createData = Object.assign({}, {
              id: res.id,
              name: this.customName,
              architectureType: this.select
            })
          } else if (status === 'edit') {
            this.clinicName = this.rootNodeStr
            this.isClinicTotal = false
          }
          let params = {
            architectureType: this.select,
            directoryId: res.id
          }
          this._getCustomInfo(params)
        }
      })
    },
    // 自定义增加根节点
    _addCustomNode (customNode) {
      Object.assign(customNode, { architectureType: this.select })
      this.api.addCustomNode(customNode).then(res => {
        if (res) {
          let params = { architectureType: this.select }
          this.childNode = {}
          this.departmentObject = {}
          this.storageRoomObject = {}
          this.rootId ? Object.assign(params, { id: this.rootId }) : Object.assign(params, { directoryId: this.customId })
          this._getCustomInfo(params)
        }
      })
    },
    // 获取自定义机构&机构下所属
    async _customClinicList (params) {
      let clinicDepartment
      this.rootDataId = params.id
      if (Number(this.select) === this.FRAMEWORK[2] && this.rootId) {
        clinicDepartment = await this.api.getClinicList(params).then()
      } else {
        clinicDepartment = await this.api.getClinicDepartment(params).then()
      }
      clinicDepartment.clinicList && clinicDepartment.clinicList.length ? this.clinicArr = clinicDepartment.clinicList : this.clinicArr = []
    },
    async _getunRelation (data) {
      let unRelationArr
      if (Number(this.select) === this.FRAMEWORK[0] || Number(this.select) === this.FRAMEWORK[1]) {
        unRelationArr = await this.api.getRelieveList(data).then()
      } else {
        unRelationArr = await this.api.getCustomRelieveList(data).then()
      }
      if (unRelationArr && unRelationArr.architectureList && unRelationArr.architectureList.length) {
        this.tableList = this._arr2Tree(unRelationArr.architectureList)
      } else {
        this.tableList = []
      }
    },
    // 获取树结构&解除关联树结构
    async _getCustomInfo (customParams) {
      let customArrList = await this.api.getCustomById(customParams).then()
      if (customArrList.architectureList && customArrList.architectureList.length) {
        this.tableData = this._arr2Tree(customArrList.architectureList)
        if (!this.rootId) this.childNodeFlag = true
      } else {
        if (!this.rootId) this.childNodeFlag = false
        this.tableData = []
      }
      if (this.customId) this.createCustomFlag = false
      this._getunRelation(customParams)
      this._customClinicList(customParams)
    },
    async _getTreeList (id) {
      let treeArr = await this.api.treeList(id).then()
      if (treeArr && treeArr.architectureList && treeArr.architectureList.length) {
        this.tableData = this._arr2Tree(treeArr.architectureList)
      } else {
        this.tableData = []
      }
      this._getunRelation(id)
      this._clinicList()
    },
    async _getNodeObject () {
      let params = Object.assign({
        ifRoot: 1,
        architectureType: this.select
      })
      let nodeObject = await this.api.getNodeObject(params).then()
      if (nodeObject && nodeObject.id) {
        this._getTreeList(nodeObject.id)
        this.clinicName = nodeObject.tittleName
        this.rootId = nodeObject.id
      } else {
        this._clinicList()
      }
      this.ifShowTitle = true
    },
    // 添加子节点
    _addNode (clinicId, architectureId, parentId, customName) {
      if (clinicId && architectureId) {
        let params = Object.assign({
          clinicId,
          architectureId,
          architectureType: this.select,
          parentId
        })
        if (Number(this.select) !== this.FRAMEWORK[0]) {
          let objectName, objectId
          if (Number(this.select) === this.FRAMEWORK[1]) {
            objectName = this.departmentObject.name ? this.departmentObject.name : ''
            objectId = this.departmentObject.id ? this.departmentObject.id : ''
          } else {
            objectName = this.storageRoomObject.name ? this.storageRoomObject.name : this.localSettingObject.name ? this.localSettingObject.name : ''
            objectId = this.storageRoomObject.id ? this.storageRoomObject.id : this.localSettingObject.id ? this.localSettingObject.id : ''
          }
          if (!objectId) return
          Object.assign(params, {
            directoryId: this.customId,
            architectureName: `${this.childNode.name} - ${objectName}`
          })
        }
        this.api.addNode(params).then(res => {
          if (res) {
            if (Number(this.select) !== this.FRAMEWORK[0]) {
              this.rootId ? Object.assign(params, { id: this.rootId }) : Object.assign(params, { directoryId: this.customId })
              this.childNode = {}
              this.departmentObject = {}
              this.localSettingObject = {}
              this.localSettingArr = []
              this._getCustomInfo(params)
            } else {
              this._getTreeList(parentId)
            }
          }
        })
      }
    },
    async _getClinicName (id) {
      let nodeObject = await this.api.getNodeObject({ id }).then()
      if (Number(this.select) === this.FRAMEWORK[0]) {
        this.clinicName = nodeObject.tittleName
        this.rootId = id
      } else {
        this.clinicCustomName = nodeObject.tittleName
      }
    },
    _emitStatus (status) {
      this.$emit('currentStatus', status)
    },
    async _clinicList () {
      let groupArr = await this.api.mechanismList(this.select).then()
      groupArr.clinicList && groupArr.clinicList.length ? this.clinicArr = groupArr.clinicList : this.clinicArr = []
    },
    _arr2Tree (data, type) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children
      })
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      let map = {}
      data.forEach(function (item) {
        map[item.id] = item
      })
      let val = []
      data.forEach(function (item) {
        let parent
        if (type) {
          parent = map[item.superiorDepartmentId]
        } else {
          item.status = null
          if ((item.departmentList && item.departmentList.length) || (item.storageRoomList && item.storageRoomList.length) || (item.localSettingList && item.localSettingList.length)) {
            item.status = true
          }
          // 以当前遍历项，的pid,去map对象中找到索引的id
          parent = map[item.parentId]
        }
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        parent ? (parent.children || (parent.children = [])).push(item) : val.push(item) // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      })
      return val
    },
    handleSelect (query) {
      console.log(query)
    },
    getMaterialList (data) {
      let params = {
        clinicId: this.slectClinicId,
        id: this.rootDataId,
        offset: 0,
        pagesize: 20
      }
      if (data) Object.assgin(params, data)
      this.loading = true
      this.api.getClinicMaterial(params).then(result => {
        if (result.localSettingList.length) {
          result.localSettingList.forEach(item => {
            item.name = this._resetMaterialName({ rows: item.materialSkuObject.materialPropertys, code: [[SPEC_CODE]], mark: ' ' })
          })
          this.localSettingArr = result.localSettingList
          this.loading = false
        }
      })
    },
    ...patch
  },
  watch: {
    'architectureType' (val) {
      if (Number(val) === this.FRAMEWORK[0]) {
        this._getNodeObject()
        this.childNodeFlag = true
      }
    },
    'childNode' (val) {
      if (Number(this.select) !== this.FRAMEWORK[0] && val.id) {
        this.slectClinicId = val.id
        val.localDepartmentList ? this.departmentArr = val.localDepartmentList : this.departmentArr = []
        this.departmentObject = {}
        val.storageRoomList && val.storageRoomList.length ? this.storageRoomArr = val.storageRoomList : this.storageRoomArr = []
        if (Number(this.select) === this.FRAMEWORK[2] && this.rootDataId) {
          this.localSettingObject = {}
          // this.getMaterialList()
          this.queryParams = {
            clinicId: this.slectClinicId,
            id: this.rootDataId,
            offset: 0,
            pagesize: 20
          }
        }
      }
    },
    'rootId' (val) {
      if (Number(this.select) !== this.FRAMEWORK[0]) this._emitStatus(val)
    },
    'blockFlag' (val) {
      if (Number(this.select) === this.FRAMEWORK[0] && val) {
        this._getNodeObject()
        this.childNodeFlag = true
        this.$emit('handleCheckBlock', false)
      }
    }
  },
  components: {
    tipDialog,
    remoteSelect
  }
}
</script>
<style lang="less" scoped>
.custom-tree-node {flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;}
.body_con {border: 1px solid #ccc;}
.head_title {background-color: #dddddd; height: 32px; line-height: 32px; font-size: 14px;}
.content {line-height: 32px; width: 100%; font-size: 14px;}
#tree /deep/ .el-tree {border: none; padding: 0;}
#tree /deep/ .el-tree > .el-tree-node > .el-tree-node__content {background-color: #f0f0f0;}
#tree /deep/ .el-tree-node__content {padding: 5px 0; border-top: 1px solid #ccc;}
#tree /deep/ .el-tree-node__content /deep/ span.el-tree-node__expand-icon {visibility: hidden;}
.con_clinic {background-color: #f0f0f0; border-top: 1px solid #ccc; height: 50px; line-height: 50px;}
.footer_tree {padding: 10px 0; height: 50px; line-height: 50px; background-color: #f0f0f0;}
.content_clinic {height: 200px;}
.overflow_text{display: inline-block; width: 200px; overflow: hidden;}
.con_custom {height: 200px; line-height: 150px; color: #cccccc;}
.place {visibility: hidden;}
.cell-btn .el-button {
  padding: 4px 7px;
}
</style>
