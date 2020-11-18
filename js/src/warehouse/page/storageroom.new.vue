<template>
  <div>
    <ever-bread-crumb name="库房管理" v-if="!objId" path="/warehouse/storagerooms"></ever-bread-crumb>
    <div class="newstorageroom">
      <ever-form2
      class="storageform"
      ref="form"
      v-model="obj"
      :rules="rules"
      :nosubmit="true"
      labelWidth="180px"
      :schema="schema">
        <span slot="warning" class="warningsp">注：制剂库只能存放中成药、中药饮片、中药颗粒用于生产制剂，制剂库中中成药可以用于发货，中药饮片、中药颗粒只能用于库房业务库间流转不能作为发货使用。</span>
        <template slot="type">
          <el-radio-group v-model="obj.type" @change="typeChange" :disabled="!!objId">
            <el-radio v-for="(item, index) in  storageroomType" :label="item.id" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </template>
        <div slot="process" class="process" v-if="systemConfig.id">
          <div v-for="(item, index) in obj.processConfigDtoList" :key="index" class="processlist">
            <!-- {{item.obj}} -->
            <ever-form2
              :ref="'childform' + index"
              :schema="item.schema"
              :rules="processRules"
              :allDisabled="!!item.obj.id && item.obj.edit"
              :nosubmit="true"
              v-model="item.obj">
              <template slot="processId">
                <sys-select
                  style="width: 500px; display: inline-block; margin-right:10px"
                  v-model="item.obj.processId"
                  :disabled="!!item.obj.id && item.obj.edit"
                  :options="selectOptions(item)">
                </sys-select>
                <el-button :disabled="!item.obj.processId || ['100008', '100009'].includes(item.obj.processId)" size="medium" type="text" @click="thisProcessObject(item.obj.processItemObject, index, item.obj.processId)">流程设置</el-button>
              </template>
            </ever-form2>
            <div class="processaddbtn">
              <el-button type="primary" v-if="!item.obj.id" @click="createdProcess(item, 'childform' + index)">创建</el-button>
              <el-button type="primary" :disabled="omitsProcessIds.includes(item.obj.processId)" v-if="item.obj.id && item.obj.edit" @click="editProcess(item, 'childform' + index)">编辑</el-button>
              <el-button type="danger" :disabled="omitsProcessIds.includes(item.obj.processId)" v-if="item.obj.id && item.obj.edit" @click="deleteProcess(item, index)">删除</el-button>
              <el-button type="primary" v-if="item.obj.id && !item.obj.edit" @click="createdProcess(item, 'childform' + index, index)">保存</el-button>
              <el-button v-if="!item.obj.edit" @click="cencelProcess(item, 'childform' + index, index)">取消</el-button>
            </div>
          </div>
          <!-- <div v-if="systemConfig.dispenseSetting == DISPENSE_SETTING_OPTIONS[0].id">
            <ever-select :disabled="true" style="width:500px" class="mb10" size="small" v-model="dispenseSetting" :options="DISPENSE_SETTING_OPTIONS"></ever-select>
            <span class="notespan">注：如需修改此项，请在库房“系统配置”中修改</span>
          </div> -->
          <el-button
            v-if="obj.type == storageroomType[0].id || (obj.type == storageroomType[1].id && oldObj.materialType && oldObj.materialType.includes(WEST_MEDICINE_TYPE[1]))"
            class="addprocess"
            @click="addProcess" type="text"><i class="iconfont icon-tianjia"></i>创建新流程</el-button>
        </div>
        <div slot="toExamine" v-if="systemConfig.dispenseSetting != DISPENSE_SETTING_OPTIONS[0].id">
          <div class="setproess pt10 wid">
            <el-row class="storageroom one">
              <el-col :span="12">&nbsp;</el-col>
              <el-col :span="12">退药审核</el-col>
            </el-row>
            <el-row class="storageroom mb10">
              <el-col :span="12">
                <el-col>线下业务</el-col>
                <el-col>线上业务(互联网医院)</el-col>
              </el-col>
              <el-col :span="12">
                <el-col>
                  <!-- 线下业务 退药审核 -->
                  <el-switch
                    :active-text="'审核'"
                    :active-value="0"
                    :inactive-value="1"
                    :inactive-text="'不审'"
                    v-model="obj.toExamine">
                  </el-switch>
                </el-col>
                <el-col>
                  <!-- 线上业务 退药审核 -->
                  <el-switch
                    :active-text="'审核'"
                    :active-value="0"
                    :inactive-value="1"
                    :inactive-text="'不审'"
                    v-model="obj.onLineToExamine">
                  </el-switch>
                </el-col>
              </el-col>
            </el-row>
          </div>
          <span class="notespan">注：1、审核开启后，退药申请需要先经过单独的审核，才能操作是否入库。</span>
          <span class="notespan notespan2">2、设置为不审时，直接进行入库操作。</span>
        </div>
      </ever-form2>
      <hr>
      <div class="formbtn">
        <el-button @click="submitForm()" type="primary">保存</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </div>
      <!-- 流程设置 -->
      <dialog-slot title="按医嘱出库流程设置" :dialogSlot.sync="dialogSlot">
        <process-config
          v-if="dialogSlot"
          :processObject="processObject"
          :curProcessId="curProcessId"
          @processPop="processPop"></process-config>
      </dialog-slot>
      <dialog-slot title="按UDD出库流程设置" :dialogSlot.sync="dialogUddSlot">
        <hospital-process-config
          v-if="dialogUddSlot"
          :processObject="processObject"
          @processPop="processPop"></hospital-process-config>
      </dialog-slot>
    </div>
  </div>
</template>

<script>
import dialogSlot from '@/warehouse/page/components/dialog.slot'
import processConfig from '@/warehouse/page/components/process.config'
import HospitalProcessConfig from '@/warehouse/page/components/hospital.process.config'
import storageroomapi from '../store/storageroomapi'
import storage from '@/util/storage'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import processSeting from '@/warehouse/page/storages/util/process.seting'
import { DISPENSE_SETTING_OPTIONS, OUTPAITENT_PRINT_CONFIG, HOSPITAL_PRINT_CONFIG, OUTPAITENT_PROCESS_OPTIONS, HOSPITAL_PROCESS_OPTIONS } from '@/warehouse/views/util/constant.js'
import {
  // BLOOD_CLASSIFYID,
  CONSUMABLES_TYPE,
  CHINESE_MEDICINE_TYPE,
  TRADITIONAL_CHINESE_MEDICINE,
  CHINESE_PATENT_MEDICINE,
  CONSUMABLES_MEDICAL_TYPE,
  CONSUMABLES_OFFICE_TYPE,
  WEST_MEDICINE_TYPE
} from '@/util/common'
const storageroomType = [
  {
    id: '1001',
    name: '普通库房'
  },
  {
    id: '1003',
    name: '制剂库'
  }
]
const materialTypeOptions = [
  {
    label: WEST_MEDICINE_TYPE[0],
    disabled: false,
    value: '西药'
  },
  {
    label: WEST_MEDICINE_TYPE[1],
    disabled: false,
    meta: 1,
    value: '中成药'
  },
  {
    label: TRADITIONAL_CHINESE_MEDICINE,
    disabled: false,
    meta: 1,
    value: '中药饮片'
  },
  {
    label: CHINESE_PATENT_MEDICINE,
    disabled: false,
    meta: 1,
    value: '中药颗粒'
  },
  {
    label: CONSUMABLES_MEDICAL_TYPE,
    disabled: false,
    value: '医疗耗材'
  },
  {
    label: '10008',
    disabled: false,
    value: '商品'
  },
  {
    label: CONSUMABLES_OFFICE_TYPE,
    disabled: false,
    value: '办公耗材'
  },
]
const sceneOptions = [
  {
    label: '1',
    disabled: false,
    value: '门诊'
  },
  {
    label: '2',
    disabled: false,
    value: '急诊'
  },
  {
    label: '3',
    disabled: false,
    value: '住院'
  },
  {
    label: '4',
    disabled: false,
    value: '互联网商城'
  },
  {
    label: '5',
    disabled: false,
    value: '超市收银'
  }
]
const implementOptions = [
  {
    label: '2',
    disabled: false,
    value: '院外'
  },
  {
    label: '1',
    disabled: false,
    value: '院内'
  }
]
const schema = [
  {
    name: 'name',
    label: '库房名称',
    style: 'width: 500px'
  },
  {
    name: 'phone',
    label: '库房电话',
    style: 'width: 500px'
  },
  {
    name: 'type',
    label: '库房类型',
    comp: 'custom'
  },
  {
    name: 'materialType',
    label: '管理物资类型',
    comp: 'checkbox',
    props: {
      options: materialTypeOptions
    }
  },
  {
    name: 'warning',
    label: '',
    comp: 'custom'
  },
]
const processSchema = [
  {
    name: 'name',
    label: '流程名称',
    style: 'width: 500px'
  },
  {
    name: 'materialType',
    label: '管理物资类型',
    comp: 'checkbox',
    props: {
      options: materialTypeOptions
    }
  },
  {
    name: 'implementType',
    label: '执行科室',
    comp: 'checkbox',
    props: {
      options: implementOptions
    }
  },
  {
    name: 'scene',
    label: '适用场景',
    comp: 'checkbox',
    props: {
      options: sceneOptions
    }
  },
  {
    name: 'processId',
    label: '选择流程',
    comp: 'custom'
  }
]

const OUTPAITENT_PROCESS_IDS = OUTPAITENT_PROCESS_OPTIONS.map(item => item.id)
const HOSPITAL_PROCESS_IDS = HOSPITAL_PROCESS_OPTIONS.map(item => item.id)

export default {
  mixins: [storage, getStorage, processSeting],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    // obj.business = []
    obj.materialType = []
    obj.processConfigDtoList = []
    obj.type = storageroomType[0].id
    return {
      DISPENSE_SETTING_OPTIONS,
      schema,
      processSchema,
      obj,
      oldObj: {},
      storageroomType,
      WEST_MEDICINE_TYPE,
      HOSPITAL_PROCESS_OPTIONS, // 住院统一发药流程
      OUTPAITENT_PROCESS_OPTIONS, // 门诊统一发药流程
      omitsProcessIds: OUTPAITENT_PROCESS_IDS.concat(HOSPITAL_PROCESS_IDS), // 统一摆药流程id
      processItemOldObject: {},
      storageroomapi,
      processObject: {},
      processIndex: null,
      objId: this.$route.params.id,
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        materialType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      processRules: {
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        materialType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        implementType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        scene: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        processId: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      dialogSlot: false,
      dialogUddSlot: false,
      processOptions: [
        // include: 1:  门诊、急诊  2: 超市收银、互联网商城
        {
          id: '100002',
          disabled: false,
          include: 1,
          name: '自动出库流程'
        },
        {
          id: '100001',
          disabled: false,
          include: 1,
          name: '按明细生产流程'
        },
        {
          id: '100003',
          disabled: false,
          include: 1,
          name: '按订单生产流程'
        },
        {
          id: '100004',
          isHospital: true, // 标记住院流程，以备后续扩展使用
          disabled: false,
          name: 'UDD药包生产流程'
        },
        {
          id: '100008',
          disabled: false,
          include: 2,
          name: '互联网商城订单流程'
        },
        {
          id: '100009',
          disabled: false,
          include: 2,
          name: '超市收银订单流程'
        }
      ],
      checkboxDisabled: true,
      curProcessId: null,
      dispenseSetting: '1',
      systemConfig: {}
    }
  },
  async mounted () {
  },
  async created () {
    materialTypeOptions.forEach(item => {
      item.disabled = false
    })
    // 获取库房系统配置
    if (!this.systemConfig.id) await this.getStorageroomSystemConfig()
    this.systemConfig = this.$store.state.processConfig.storageroomSystemConfig
    if (this.objId) {
      let isProcess = false
      isProcess = this.schema.some(item => { return item.name === 'process' })
      if (!isProcess) this.schema.push({ name: 'process', label: '出库流程管理', comp: 'custom' })
      if (!this.schema.some(item => { return item.name === 'toExamine' }) && this.systemConfig.dispenseSetting !== DISPENSE_SETTING_OPTIONS[0].id) this.schema.push({ name: 'toExamine', label: '退药审核', comp: 'custom' })
      this.obj = this.$ever.createObjFromSchema(schema)
      this.getStorageroomInfo()
    } else {
      const index = this.schema.findIndex(item => item.name === 'toExamine')
      if (~index) this.schema.splice(index, 1)
      this.handlerMaterialType()
      this.schema = this.schema.filter(item => { return item.name !== 'process' })
    }
  },
  methods: {
    handlerAarrayListContain (arrList, obj) {
      let list = JSON.parse(JSON.stringify(arrList))
      if (obj.id) {
        let index = list.findIndex(item => item.obj.id === obj.id)
        if (index > -1) list.splice(index, 1)
      } else {
        list.pop()
      }
      let isRepeat = false
      list.forEach(item => {
        let count = 0
        const { materialType, implementType, scene } = item.obj
        const arrObj = { materialType, implementType, scene }
        Object.keys(arrObj).forEach(keys => {
          if (this.handlerArrayIsContain(arrObj[keys], obj[keys])) {
            count++
          }
        })
        if (count > 2) isRepeat = true
      })
      return isRepeat
    },
    handlerArrayIsContain (arr, thisArr) {
      let count = 0
      thisArr.forEach(item => {
        if (arr.includes(item)) count++
      })
      return count === thisArr.length || count === arr.length
    },
    deleteProcess (data, index) {
      let params = {
        id: data.obj.id,
        isDelete: 1
      }
      this.$confirm('确定要删除当前流程吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.storageroomapi.createProcess([params]).then(res => {
          if (res) {
            this.obj.processConfigDtoList.splice(index, 1)
          }
        })
      })
    },
    editProcess (data, formName) {
      if (!this.obj.processConfigDtoList.some(item => !item.obj.edit)) {
        this.processItemOldObject[formName] = JSON.parse(JSON.stringify(data))
        data.obj.edit = false
      } else {
        return this.$messageTips(this, 'warning', '当前已有正在编辑或创建的流程，请先保存修改')
      }
    },
    cencelProcess (data, formName, index) {
      if (data.obj.id) {
        this.$set(this.obj.processConfigDtoList, index, JSON.parse(JSON.stringify(this.processItemOldObject[formName])))
        data.obj.edit = true
      } else {
        this.obj.processConfigDtoList.splice(index, 1)
      }
    },
    createdProcess (data, formName, index) {
      this.$refs[formName][0].$children[0].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(data.obj))
          if (this.handlerProcessName(this.obj.processConfigDtoList, params)) {
            return this.$messageTips(this, 'warning', '当前流程名字已存在，请核对')
          }
          if (this.handlerAarrayListContain(this.obj.processConfigDtoList, params)) {
            return this.$messageTips(this, 'warning', '已存在流程和当前流程配置冲突，请核对')
          }
          // 判断用户是否点击过流程设置创建流程  没有点击默认 给当前流程添加打印配置默认值
          if (!Object.keys(params.processItemObject).length) {
            if (params.processId === '100004') {
              // 住院打印配置默认值
              params.processItemObject = { ...HOSPITAL_PRINT_CONFIG }
            } else {
              // 门诊打印配置默认值
              params.processItemObject = { ...OUTPAITENT_PRINT_CONFIG }
            }
          }
          params.storageRoomId = this.objId
          this.storageroomapi.createProcess([params]).then(res => {
            if (res) {
              this.$messageTips(this, 'success', `${!params.id ? '创建' : '编辑'}流程成功`)
              this.getStorageroomInfo(true)
            } else {
              this.$set(this.obj.processConfigDtoList, index, JSON.parse(JSON.stringify(this.processItemOldObject[formName])))
              // data.obj.edit = true
            }
          })
        } else {
          this.everWarning('请检查流程填写是否正确，完整')
        }
      })
    },
    handlerProcessName (arr, obj) {
      let newArr = JSON.parse(JSON.stringify(arr))
      if (obj.id) {
        let index = newArr.findIndex(item => item.obj.id === obj.id)
        if (index > -1) newArr.splice(index, 1)
      } else {
        newArr.pop()
      }
      return newArr.some(item => item.obj.name === obj.name)
    },
    processPop (data) {
      this.obj.processConfigDtoList[this.processIndex].obj.processItemObject = data
      this.showUddDialog()
    },
    thisProcessObject (data, index, processId) {
      this.processIndex = index
      this.processObject = data
      this.curProcessId = processId
      this.showUddDialog()
    },
    showUddDialog () { // 控制流程设置展示udd弹框还是门诊医嘱弹框
      if (this.hospitalProcessIds.includes(this.curProcessId)) {
        this.dialogUddSlot = !this.dialogUddSlot
      } else {
        this.dialogSlot = !this.dialogSlot
      }
    },
    getStorageroomInfo (boold) {
      this.storageroomapi.getStorageRoomInfo(this.objId).then(res => {
        if (res) {
          let data = JSON.parse(JSON.stringify(res[0]))
          // data.business = JSON.parse(data.business)
          data.materialType = JSON.parse(data.materialType)
          data.type = data.type || storageroomType[0].id
          let processList = []
          if (data.type === storageroomType[1].id) {
            this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materialTypeOptions.filter(item => {
              if (item.meta && data.materialType.includes(item.label)) item.disabled = true
              return item.meta
            })
          }
          this.$ever.getFieldFromSchema(this.processSchema, 'materialType').props.options = JSON.parse(JSON.stringify(materialTypeOptions)).filter(item => {
            const inow = data.type === storageroomType[0].id || (data.type === storageroomType[1].id && item.label === WEST_MEDICINE_TYPE[1])
            return data.materialType.includes(item.label) && item.label !== CONSUMABLES_OFFICE_TYPE && inow
          })
          data.processConfigDtoList && data.processConfigDtoList.forEach(item => {
            item.materialType = JSON.parse(item.materialType)
            item.implementType = JSON.parse(item.implementType)
            item.scene = JSON.parse(item.scene)
            item.edit = true
            processList.push({ obj: item, schema: JSON.parse(JSON.stringify(processSchema)), processOptions: this.processOptions.slice(0) })
          })
          data.processConfigDtoList = this.checkboxDisabledSet(processList || [])

          this.obj = JSON.parse(JSON.stringify(data))
          this.oldObj = JSON.parse(JSON.stringify(data))
          if (boold) {
            this.asyncSetStorageroomData(res[0])
          }
        }
      })
    },
    checkboxDisabledSet (processList) {
      processList.forEach(item => {
        this.$ever.getFieldFromSchema(item.schema, 'materialType').props.options = this.checkDisabled(this.$ever.getFieldFromSchema(item.schema, 'materialType').props.options, item.obj.materialType, true)
        this.$ever.getFieldFromSchema(item.schema, 'implementType').props.options = this.checkDisabled(this.$ever.getFieldFromSchema(item.schema, 'implementType').props.options, item.obj.implementType, true)
        this.$ever.getFieldFromSchema(item.schema, 'scene').props.options = this.checkDisabled(this.$ever.getFieldFromSchema(item.schema, 'scene').props.options, item.obj.scene, true)
      })
      return processList
    },
    resetForm () {
      if (this.objId) {
        this.oldObj.processConfigDtoList = this.obj.processConfigDtoList
        this.obj = JSON.parse(JSON.stringify(this.oldObj))
      } else {
        this.$refs.form.resetForm()
      }
    },
    submitForm () {
      this.$refs.form.$children[0].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.obj))
          delete params.warning
          this.storageroomapi.createStorageRoom(params).then(res => {
            if (res) {
              this.$messageTips(this, 'success', `${this.objId ? '编辑' : '创建'}库房成功`)
              if (this.objId) {
                this.getStorageroomInfo(true)
              } else {
                this.$router.replace(`/warehouse/storagerooms/${res.object.id}`)
              }
            } else {
              if (this.objId) this.getStorageroomInfo()
            }
          })
        }
      })
    },
    asyncSetStorageroomData (res) {
      if (this.objId) {
        // 修改退药流程
        let STORAGE_ITEM = JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) || []
        let index = STORAGE_ITEM.findIndex(item => { return item.id === this.objId })
        if (~index) STORAGE_ITEM[index] = res
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(STORAGE_ITEM))
        // 当前修改的是当前选择的库房，同步修改vuex
        if (this.objId === this.storageId) {
          storage.setLocalStorage('MATERIAL_TYPE', JSON.stringify(res.materialType))
          let processList = res.processConfigDtoList || []
          this.$store.commit('setStotageroomConfigList', processList)
          let processId = this.$store.state.processConfig.thisStorageroomProcessConfig.id || null
          this.$store.commit('setThisStorageroomProcessConfig', Object.assign({}, processList.find(item => item.id === processId) || {}))
        }
      }
    },
    addProcess () {
      if (this.obj.processConfigDtoList.some(item => !item.obj.edit)) {
        return this.$messageTips(this, 'warning', '当前已有正在编辑或创建的流程，请先保存修改')
      }
      let isAdd = this.obj.processConfigDtoList.some(item => { return !item.obj.id })
      if (this.obj.processConfigDtoList.length && isAdd) return this.$messageTips(this, 'warning', '有未完成的流程')
      if (!this.obj.processConfigDtoList.length || !isAdd) {
        let obj = this.$ever.createObjFromSchema(processSchema)
        obj.materialType = this.obj.type === storageroomType[1].id ? [WEST_MEDICINE_TYPE[1]] : []
        obj.implementType = []
        obj.scene = []
        obj.processItemObject = {}
        this.obj.processConfigDtoList.push({ obj: obj, schema: this.processSchema, processOptions: this.processOptions.slice(0) })
      }
    },
    handlerMaterialType (arr) {
      const materials = JSON.parse(JSON.stringify(materialTypeOptions))
      let newArr = []
      arr && arr.forEach(item => {
        if (WEST_MEDICINE_TYPE.includes(item)) {
          newArr = this.checkDisabled(materials, CHINESE_MEDICINE_TYPE, true, this.oldObj.materialType || [])
        } else if (CHINESE_MEDICINE_TYPE.includes(item)) {
          newArr = this.checkDisabled(materials, [...WEST_MEDICINE_TYPE, ...CONSUMABLES_TYPE], true, this.oldObj.materialType || [])
        } else if (CONSUMABLES_TYPE.includes(item)) {
          newArr = this.checkDisabled(materials, CHINESE_MEDICINE_TYPE, true, this.oldObj.materialType || [])
        } else {
          // let isCheck = arr.some(type => { return CHINESE_MEDICINE_TYPE.includes(type) })
          // if (!isCheck) this.checkDisabled(materials, [...CHINESE_MEDICINE_TYPE, ...CONSUMABLES_TYPE], false)
        }
      })
      if (!arr || !arr.length) {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materials
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = newArr
      }
    },
    checkDisabled (arr, check, status, all) {
      arr.forEach(item => {
        if (check.includes(item.label)) {
          item.disabled = status
        } else {
          item.disabled = !status
        }
        if (this.objId && all && all.includes(item.label)) {
          item.disabled = true
        }
      })
      return arr
    },
    handlerSetSelectDisabled (list, arr) {
      if (arr) {
        list.forEach(item => {
          if (arr.includes(item.id) || (this.obj.materialType.some(mater => CHINESE_MEDICINE_TYPE.includes(mater)) && item.id === '100001') && this.obj.type === this.storageroomType[0].id) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      } else {
        list.forEach(item => {
          if (this.obj.materialType.some(mater => CHINESE_MEDICINE_TYPE.includes(mater)) && item.id === '100001' && this.obj.type === this.storageroomType[0].id) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        })
      }
    },
    getScenes (arr, cur) { // 获取适用场景 [1,2,3,4]
      return arr.filter(option => option.label !== cur).map(option => option.label)
    },
    getProcess (arr, cur) {
      return arr.filter(option => option.id !== cur).map(option => option.id)
    },
    selectOptions (data) {
      const { obj, processOptions } = data
      if (OUTPAITENT_PROCESS_IDS.includes(obj.processId)) {
        return OUTPAITENT_PROCESS_OPTIONS
      }
      if (HOSPITAL_PROCESS_IDS.includes(obj.processId)) {
        return HOSPITAL_PROCESS_OPTIONS
      }
      return processOptions
    },
    typeChange (v) {
      if (v === '1003') {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materialTypeOptions.filter(item => {
          if (item.meta) item.disabled = false
          return item.meta
        })
        this.obj.materialType = []
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = materialTypeOptions.slice(0).map(item => {
          item.disabled = false
          return item
        })
        this.obj.materialType = []
      }
    }
  },
  computed: {
    hospitalProcessIds () { // 所有住院流程options配置id
      return this.processOptions.filter(process => process.isHospital).map(process => process.id)
    }
  },
  components: {
    processConfig,
    HospitalProcessConfig,
    dialogSlot
  },
  watch: {
    'obj.materialType' (v) {
      if (this.obj.type === storageroomType[0].id) this.handlerMaterialType(v)
    },
    'obj.processConfigDtoList': {
      handler (v) {
        v && v.length && v.forEach(item => {
          let sceneOptions = this.$ever.getFieldFromSchema(item.schema, 'scene').props.options
          const sceneKeyValue = {
            '100008': ['4'],
            '100009': ['5'],
          }
          const sceneKeys = Object.keys(sceneKeyValue)
          const sceneValues = sceneKeys.map(key => sceneKeyValue[key]).flat()
          const processId = item.obj.processId
          if (item.obj.scene.length && item.obj.scene.length > 2) {
            if (['100001', '100002', '100003'].includes(processId)) {
              item.obj.scene = ['1', '2']
            } else if (sceneKeys.includes(processId)) {
              item.obj.scene = sceneKeyValue[processId]
            } else {
              item.obj.scene = ['3']
            }
          }
          if (item.obj.scene.length || processId) {
            if (item.obj.scene.includes('3') || ['100004'].includes(processId)) {
              sceneOptions = this.checkDisabled(sceneOptions, sceneOptions && this.getScenes(sceneOptions, '3'), true)
              this.handlerSetSelectDisabled(item.processOptions, this.getProcess(item.processOptions, '100004'))
            } else if (sceneValues.includes(item.obj.scene[0]) || sceneKeys.includes(processId)) {
              const sceneValue = (sceneKeyValue[processId] ? sceneKeyValue[processId] : item.obj.scene)[0]
              let processValue = processId // 流程id
              if (!processValue) {
                // 当流程id为空时，通过sceneValue适用场景获取流程id
                sceneKeys.forEach(key => {
                  if (sceneKeyValue[key][0] === sceneValue) processValue = key
                })
              }
              if (processValue) {
                this.handlerSetSelectDisabled(item.processOptions, this.getProcess(item.processOptions, processValue))
              }
              sceneOptions = this.checkDisabled(sceneOptions, sceneOptions && this.getScenes(sceneOptions, sceneValue), true)
              this.$nextTick(_ => {
                console.log(sceneOptions)
              })
            } else {
              // 所有门诊 和 急诊的流程
              sceneOptions = this.checkDisabled(sceneOptions, sceneOptions.map(scene => scene.label > 2 && scene.label), true)
              this.handlerSetSelectDisabled(item.processOptions, item.processOptions.map(process => process.include !== 1 && process.id))
            }
          } else {
            if (this.systemConfig.dispenseSetting === DISPENSE_SETTING_OPTIONS[0].id) {
              // 多库房统一发药并且初始化时，没有选中项
              sceneOptions = this.checkDisabled(sceneOptions, sceneOptions.filter(scene => scene.label < 4).map(item => item.label), true)
              this.handlerSetSelectDisabled(item.processOptions, item.processOptions.map(process => process.include !== 2 && process.id))
            } else {
              sceneOptions = this.checkDisabled(sceneOptions, this.getScenes(sceneOptions), false)
              this.handlerSetSelectDisabled(item.processOptions)
            }
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.newstorageroom{
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
  .storageform{
    width: 70%;
    margin-top: 30px;
  }
  /deep/ .el-form-item__error{
    display: none;
  }
  /deep/ .el-form-item__label{
    font-weight: bold;
  }
  /deep/ .el-form .el-checkbox-group, .el-form .el-radio-group{
    line-height: 32px;
    .el-checkbox__label{
      font-weight: normal;
    }
  }
  /deep/ .is-error.custom-form-item-checkbox-group{
    margin-bottom: 10px;
  }
  .formbtn{
    text-align: center;
    /deep/ .el-button {
      padding: 10px 30px;
    }
  }
  .warningsp{
    color: #999;
    margin-top: -20px;
    display: inherit;
  }
  .notespan {
    margin-top: -6px;
    color: #999;
    display: inherit;
  }
  .notespan2 {
    padding-left: 28px;
  }
  .processlist{
    background-color: rgba(242, 242, 242, 1);
    padding: 15px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .processaddbtn {
    padding-left: 120px;
  }
}
.addprocess{
  width: 100%;
  line-height: 40px;
  background-color: rgba(242, 242, 242, 1);
  text-align: center;
  font-size: 14px;
  i {
    margin-right: 5px
  }
}
.storageroom{
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  width: 550px;
  text-align: center;
  .el-col-12 {
    line-height: 34px;
  }
  .bts{
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    line-height: 69px;
  }
  .el-col-24 {
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }
}
.one {
  /deep/ .el-col-12 {
    border-left: 1px solid #ccc;
    background: #ddd;
    font-weight: bold;
    line-height: 34px;
  }
}
</style>
