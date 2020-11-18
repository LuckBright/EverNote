<template>
  <div>
    <ever-bread-crumb name="库房管理" path="/warehouse/storagerooms"></ever-bread-crumb>
    <!-- <div class="layout_inner" v-if="this.$route.path === '/warehouse/storageroomadd/'">
      <ever-form2
        :schema="schema"
        v-model="obj"
        :api="storageroomapi"
        :rules="rules"
        @objsaved="afterSave"
        label-position="right"
      >
        <template slot="classifyId">
          <ever-select v-model="obj.classifyId" :options="options1" class="queryClass"></ever-select>
          <ever-select
            v-model="obj.type2"
            v-if="obj.classifyId === '1' && options1.length"
            :options="options2"
            placeholder="请选择类型"
            class="queryClass"
          ></ever-select>
        </template>
      </ever-form2>
    </div> -->
    <div class="layout_inner">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="ever_tabs_top">
        <el-tab-pane label="基本信息" name="essentialInfo">
          <add-storageroom></add-storageroom>
          <!-- <ever-form2
            :schema="schema"
            v-model="obj"
            ref="essentialInfo"
            :api="storageroomapi"
            :rules="rules"
            @objsaved="afterSave"
            label-position="right"
          >
            <template slot="classifyId">
              <ever-select v-model="obj.classifyId" :options="options1" class="queryClass"></ever-select>
              <ever-select
                v-model="obj.type2"
                v-if="obj.classifyId === '1' && options1.length"
                :options="options2"
                placeholder="请选择类型"
                class="queryClass"
              ></ever-select>
            </template>
          </ever-form2> -->
        </el-tab-pane>
        <el-tab-pane label="人员管理" name="staffInfo">
          <div class="main-head">
            <div class="mb20">
              <span class="employeeInfo">员工姓名</span>
              <template>
                <ever-staff-remote-select
                  size="small"
                  class="remote-select"
                  v-model="querySchema"
                  ref="remoteselect"
                  :remote-method="queryRemote"
                  filterable
                  remote
                  :params="params"
                  @change="handleSelect"
                  placeholder="请输入所要添加员工姓名"
                  obj="true"
                  :showKeys="['name', 'sex', 'departmentName']"
                  :delOptions="tableData.length ? tableData : []"
                ></ever-staff-remote-select>
              </template>
              <el-button @click="addEmployeeInfo(queryObj)" size="medium" type="primary">添加</el-button>
            </div>
          </div>
          <div class="storeroom_personnel_details mt10">库房人员详情</div>
          <div v-if="cacheTableDate.length">
            <el-table :data="cacheTableDate" style="width: 100%">
              <el-table-column show-overflow-tooltip align="center" prop label="姓名">
                <template slot-scope="scope">
                  <span v-if="scope.row.staffName">{{scope.row.staffName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="性别">
                <template slot-scope="scope">
                  <span v-if="scope.row.genderName">{{scope.row.genderName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="人员状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.statusName">{{scope.row.statusName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip align="center" prop label="操作">
                <template slot-scope="scope">
                  <ever-confirm
                    width="228px"
                    placement="left"
                    :msg="'是否将该员工从库房人员中移除？'"
                    action="移除"
                    @confirm="del(scope.row.id)"
                  ></ever-confirm>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <ever-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :totalCount="totalCount"
                :current="current"
              ></ever-pagination>
            </el-row>
          </div>
          <ever-no-data v-else tipTxt="还未添加任何人员信息"></ever-no-data>
        </el-tab-pane>
        <!-- 已经无用内容 -->
        <el-tab-pane label="发药设置" name="medicinesetting" v-if="medicineDrug">
          <!-- 快捷出库 -->
          <el-form ref="form" label-width="240px" class="bor_bom_1" style="min-height: 30px">
            <el-form-item label="快捷出库" class="pt10 pb10">
              <wh-switch
                v-model="dispenseSetting.isQuick"
                :textList="IS_QUICK"
                @change="handleQuickChange"
              ></wh-switch>
              <div class="cGray">开启后，该库房内的全部生产任务都自动完成，无需人工参与</div>
            </el-form-item>
          </el-form>
          <!-- 门诊发药 - 门诊发药设置，以下设置只针对门诊发药有效 -->
          <el-form
            ref="form"
            label-width="240px"
            class="bor_bom_1 pt20 pb20"
            style="min-height: 30px"
            v-if="dispenseSetting.outPatientDispenseSettingObject"
          >
            <el-form-item label class="leftw180 f_bold">
              <i class="titleLabel"></i>
              <span class="f18">门诊发药设置，以下设置只针对门诊发药有效</span>
            </el-form-item>
            <el-form-item label="发药工作台">
              <wh-switch
                v-model="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench"
                :textList="START_STOP"
                @change="(v) => {handleCommonChange(v, 'dispenseWorkbench', 1)}"
              ></wh-switch>
              <div class="cGray">开启后，会显示门诊发药工作台；禁用则不显示</div>
            </el-form-item>
            <el-form-item label="发药时限">
              <wh-switch
                v-model="dispenseSetting.outPatientDispenseSettingObject.isTimeLimit"
                :textList="IS_TIME"
                @change="(v) => {handlerIsTime(v)}"
              ></wh-switch>
              <span v-if="dispenseSetting.outPatientDispenseSettingObject.isTimeLimit === 1">
                <el-input-number
                  type="Number"
                  style="width: 60px"
                  class="mr10 ml10"
                  :min="1"
                  :max="999"
                  :precision="0"
                  :controls="false"
                  @blur="handlerIsTime()"
                  v-model="dispenseSetting.outPatientDispenseSettingObject.timeLimitObject.value"></el-input-number>天后不能发药
              </span>
              <div class="cGray">不限制，永不过期，随时可发药；限制，N天后不能发药</div>
            </el-form-item>
            <el-form-item
              label="发药流程"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1"
            >
              <ever-select
                class="w200"
                v-model="dispenseSetting.outPatientDispenseSettingObject.isCoordination"
                @change="(v) => {handleChildrenChange(v, 'isCoordination', 1)}"
                :options="OPD_DISPENSING_FLOW_STATUS"
              ></ever-select>
              <div class="cGray">多人协同：显示菜单“任务打印”、“备药管理”。可为多人配置不同操作权限，打印、备药、发药可多人协同完成</div>
              <div class="cGray">一人操作：显示菜单“处方发药”。一个用户在一个页面完成打印、备药、发药的操作</div>
            </el-form-item>
            <el-form-item
              label="收方发药"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1 && dispenseSetting.outPatientDispenseSettingObject.isCoordination == 1"
            >
              <wh-switch
                v-model="dispenseSetting.outPatientDispenseSettingObject.dispenseReceiver"
                :textList="START_STOP"
                @change="(v) => {handleCommonChange(v, 'dispenseReceiver', 1)}"
              ></wh-switch>
              <div class="cGray">开启后，显示收方发药菜单；禁用则不显示</div>
            </el-form-item>
            <el-form-item
              label="药房备药"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1"
            >
              <wh-switch
                v-model="dispenseSetting.outPatientDispenseSettingObject.dispensePrepare"
                :textList="START_STOP"
                @change="(v) => {handleCommonChange(v, 'dispensePrepare', 1)}"
              ></wh-switch>
              <div class="cGray">开启后，发药的生产过程中，备药环节必须在系统中操作备药完成；禁用时，系统无备药环节的操作</div>
            </el-form-item>
            <el-form-item
              label="打印备药单"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1 && dispenseSetting.outPatientDispenseSettingObject.dispensePrepare == 1"
            >
              <wh-switch
                v-model="dispenseSetting.outPatientDispenseSettingObject.dispensePreparePrint"
                @change="(v) => {handleCommonChange(v, 'dispensePreparePrint', 1)}"
                :textList="PRINTING"
              ></wh-switch>
              <div class="cGray">备药单为热敏纸打印的药品清单，必须先开启药房备药时才能设置。打印规格：80mm宽的热敏纸</div>
            </el-form-item>
            <el-form-item
              label="打印药贴"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1"
            >
              <div class="fl" style="width: 700px">
                <wh-switch
                  v-model="dispenseSetting.outPatientDispenseSettingObject.dispensePaste"
                  :textList="PRINTING"
                  @change="(v) => {handleCommonChange(v, 'dispensePaste', 1)}"
                ></wh-switch>
                <div v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePaste == 1">
                  <ever-select
                    class="w200"
                    v-model="dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.value"
                    :options="PRINT_SPEC"
                    @change="(v) => {handleChildrenChange(v, 'dispensePaste', 1, true)}"
                  ></ever-select>
                  <ever-select
                    class="w200"
                    v-model="dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.dispenseSettingPasteObject.value"
                    :options="PRINT_SPEC[dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.value - 1].children"
                    @change="(v) => {handleChildrenChange(v, 'dispensePaste', 1)}"
                  ></ever-select>
                </div>
                <div class="cGray">
                  药贴是发药时贴在药品包装上的小标签。
                  <span
                    v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePaste == 1"
                  >打印规格：{{htmlCompileShow(PRINT_SPEC[dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.value - 1].children, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.dispenseSettingPasteObject.value, 'spec')}} mm的不干胶</span>
                </div>
              </div>
              <div
                class="fl ml20"
                v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePaste == 1"
              >
                <div class="cGray">打印药贴示例图：</div>
                <div
                  class="imgWidth"
                  :style="{'width': imgCompileWidth(PRINT_SPEC[dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.value - 1].children, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.dispenseSettingPasteObject.value, 'spec')}"
                >
                  <img
                    :src="htmlCompileShow(PRINT_SPEC[dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.value - 1].children, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPasteObject.dispenseSettingPasteObject.value, 'url')"
                    alt
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="父子医嘱药贴"
              v-if="dispenseSetting.outPatientDispenseSettingObject.dispenseWorkbench == 1"
            >
              <div class="fl" style="width: 700px">
                <wh-switch
                  v-model="dispenseSetting.outPatientDispenseSettingObject.dispensePatient"
                  :textList="PRINTING"
                  @change="(v) => {handleCommonChange(v, 'dispensePatient', 1)}"
                ></wh-switch>
                <div v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePatient == 1">
                  <ever-select
                    class="w200"
                    v-model="dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPatientObject.value"
                    @change="(v) => {handleChildrenChange(v, 'dispensePatient', 1)}"
                    :options="OPD_PARENT_PRINT_STYLE"
                  ></ever-select>
                </div>
                <div class="cGray" style="line-height: 30px">
                  开启后，父子医嘱将单独打印一张药贴，所有药都打印在一起，普通药贴中不打印父子医嘱的药品。
                  <br>
                  <span
                    v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePatient == 1"
                  >打印规格：{{htmlCompileShow(OPD_PARENT_PRINT_STYLE, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPatientObject.value, 'spec')}}mm 的不干胶</span>
                </div>
              </div>
              <div
                class="fl ml20"
                v-if="dispenseSetting.outPatientDispenseSettingObject.dispensePatient == 1"
              >
                <div class="cGray">打印父子医嘱药贴示例图：</div>
                <div
                  class="imgWidth"
                  :style="{'width': imgCompileWidth(PRINT_SPEC[dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPatientObject.value - 1].children, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPatientObject.value, 'spec')}"
                >
                  <img
                    :src="htmlCompileShow(OPD_PARENT_PRINT_STYLE, dispenseSetting.outPatientDispenseSettingObject.dispenseSettingPatientObject.value, 'url')"
                    alt
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
          <!-- 住院发药 - 住院发药设置，以下设置只针对住院发药有效-->
          <el-form
            ref="form"
            label-width="240px"
            class="pt20 pb20"
            style="min-height: 30px"
            v-if="dispenseSetting.uddDispenseSettingObject"
          >
            <el-form-item label class="leftw180 f_bold">
              <i class="titleLabel"></i>
              <span class="f18">住院发药设置，以下设置只针对住院发药有效</span>
            </el-form-item>
            <el-form-item label="发药工作台">
              <wh-switch
                v-model="dispenseSetting.uddDispenseSettingObject.dispenseWorkbench"
                :textList="START_STOP"
                @change="(v) => {handleCommonChange(v, 'dispenseWorkbench', 2)}"
              ></wh-switch>
              <div class="cGray">开启后，会显示住院发药工作台；禁用则不显示</div>
            </el-form-item>
            <el-form-item
              label="发药流程"
              v-if="dispenseSetting.uddDispenseSettingObject.dispenseWorkbench == 1"
            >
              <ever-select
                class="w200"
                v-model="dispenseSetting.uddDispenseSettingObject.isCoordination"
                @change="(v) => {handleChildrenChange(v, 'isCoordination', 2)}"
                :options="IPD_DISPENSING_FLOW_STATUS"
              ></ever-select>
              <div class="cGray">多人协同：显示菜单“任务打印”、“备药管理”。可为多人配置不同操作权限，打印、备药、发药可多人协同完成</div>
              <div class="cGray">一人操作：显示菜单“药包发药”。一个用户在一个页面完成打印、备药、发药的操作</div>
            </el-form-item>
            <el-form-item
              label="药房备药"
              v-if="dispenseSetting.uddDispenseSettingObject.dispenseWorkbench == 1"
            >
              <wh-switch
                v-model="dispenseSetting.uddDispenseSettingObject.dispensePrepare"
                :textList="START_STOP"
                @change="(v) => {handleCommonChange(v, 'dispensePrepare', 2)}"
              ></wh-switch>
              <div class="cGray">开启后，发药的生产过程中，备药环节必须在系统中操作备药完成；禁用时，系统无备药环节的操作</div>
            </el-form-item>
            <el-form-item
              label="打印备药单"
              v-if="dispenseSetting.uddDispenseSettingObject.dispenseWorkbench == 1 && dispenseSetting.uddDispenseSettingObject.dispensePrepare == 1"
            >
              <wh-switch
                v-model="dispenseSetting.uddDispenseSettingObject.dispensePreparePrint"
                :textList="PRINTING"
                @change="(v) => {handleCommonChange(v, 'dispensePreparePrint', 2)}"
              ></wh-switch>
              <div class="cGray">批量备药单中包含多个UDD药包的药品信息。打印规格：A4纸</div>
            </el-form-item>
            <el-form-item
              label="打印药包贴"
              v-if="dispenseSetting.uddDispenseSettingObject.dispenseWorkbench == 1"
            >
              <div class="fl" style="width: 700px">
                <wh-switch
                  v-model="dispenseSetting.uddDispenseSettingObject.dispensePaste"
                  :textList="PRINTING"
                  @change="(v) => {handleCommonChange(v, 'dispensePaste', 2)}"
                ></wh-switch>
                <div v-if="dispenseSetting.uddDispenseSettingObject.dispensePaste == 1">
                  <ever-select
                    class="w200"
                    v-model="dispenseSetting.uddDispenseSettingObject.dispenseSettingPasteObject.value"
                    :options="IPD_PRINT_STYLE"
                    @change="(v) => {handleChildrenChange(v, 'dispensePaste', 2)}"
                  ></ever-select>
                </div>
                <div class="cGray">
                  药包贴是以UDD药包为单位打印的不干胶药贴。
                  <span
                    v-if="dispenseSetting.uddDispenseSettingObject.dispensePaste == 1"
                  >打印规格：{{htmlCompileShow(IPD_PRINT_STYLE, dispenseSetting.uddDispenseSettingObject.dispenseSettingPasteObject.value, 'spec')}}mm 的不干胶</span>
                </div>
              </div>
              <div
                class="fl ml20"
                v-if="dispenseSetting.uddDispenseSettingObject.dispensePaste == 1"
              >
                <div class="cGray">打印药包贴示例图：</div>
                <div
                  class="imgWidth"
                  :style="{'width': imgCompileWidth(PRINT_SPEC[dispenseSetting.uddDispenseSettingObject.dispenseSettingPasteObject.value - 1].children, dispenseSetting.uddDispenseSettingObject.dispenseSettingPasteObject.value, 'spec')}"
                >
                  <img
                    :src="htmlCompileShow(IPD_PRINT_STYLE, dispenseSetting.uddDispenseSettingObject.dispenseSettingPasteObject.value, 'url')"
                    alt
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import storageroomapi from '../store/storageroomapi'
import staffapi from '@/warehouse/store/staffapi'
import dispensesettingApi from '@/warehouse/page/storages/store/dispensesettingapi'
import list from '@/util/list'
import { STORAGE_ROOM_TYPE, drugOrMaterialType, BLOOD_CLASSIFYID, debounce, PRINT_SPEC, OPD_PARENT_PRINT_STYLE, IPD_PRINT_STYLE, whComFn, STAFF_RELATION_TYPE, validateTelePhone, OPD_DISPENSING_FLOW_STATUS, IPD_DISPENSING_FLOW_STATUS, PARSE_REG } from '@/util/common'
import selectInquireList from '@/warehouse/util/selectinquirelist'
import storage from '@/util/storage'
import getStorage from '@/warehouse/page/storages/util/getstorage'
import whSwitch from '@/warehouse/page/components/wh.switch'
import everStaffRemoteSelect from '@/components/staffremoteselect'
import addStorageroom from './storageroom.new'

const IS_QUICK = [{ id: 1, name: '启用' }, { id: 0, name: '禁用' }]
const START_STOP = [{ id: 1, name: '启用' }, { id: 2, name: '禁用' }]
const IS_TIME = [{ id: 1, name: '限制' }, { id: 2, name: '不限制' }] // 发药时限
const PRINTING = [{ id: 1, name: '打印' }, { id: 2, name: '不打印' }]
const DEPARTMENT_TYPE = [{ id: 530, name: '科室' }, { id: 531, name: '病区' }] // 科室库科室类型

var schema = [
  {
    name: 'type',
    comp: 'sys-select',
    span: 12,
    props: {
      options: STORAGE_ROOM_TYPE,
      clearable: false
    },
    label: '库房类型'
  },
  {
    name: 'name',
    label: '库房名称',
    span: 12,
    props: {
      max: 40
    }
  },
  {
    name: 'code',
    span: 12,
    label: '库房编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    span: 12,
    props: {
      disabled: true
    },
    label: '库房条码编码'
  },
  {
    name: 'materialType',
    comp: 'sys-select',
    span: 12,
    newRow: true,
    props: {
      options: [],
      field: {
        multiple: true
      },
      clearable: true
    },
    label: '物资类型'
  },
  // {
  //   span: 12,
  //   name: 'departmentId',
  //   label: '所属部门',
  //   comp: 'sys-select',
  //   props: {
  //     options: [],
  //     clearable: true
  //   }
  // },
  {
    span: 12,
    name: 'phone',
    label: '电话',
    props: {
      placeholder: '输入座机号码'
    }
  },
  {
    newRow: true,
    name: 'address',
    label: '库房位置',
    span: 12,
    max: 80
  },
  {
    name: 'description',
    label: '备注',
    comp: 'textarea',
    span: 24
  },
  {
    name: 'classifyId',
    label: '科室库',
    comp: 'custom',
    span: 12
  }
]
let options1 = [
  {
    id: '1',
    name: '是'
  },
  {
    id: '0',
    name: '否'
  }
]
let options2 = [
  {
    id: STAFF_RELATION_TYPE[1].id,
    name: '科室'
  },
  {
    id: STAFF_RELATION_TYPE[2].id,
    name: '病区'
  }
]
const FORM_SPANCE = {
  name: 'formSpaceId',
  label: '所属病区',
  comp: 'sys-select',
  props: {
    options: [],
    value: [],
    clearable: true,
    optionsClassName: true,
    field: {
      multiple: true
    },
    placeholder: '请选择所属病区'
  },
  span: 12
}
const FORM_SENTENCE = {
  name: 'formSentenceId',
  label: '所属科室',
  comp: 'whCascaderMulti',
  props: {
    options: [],
    placeholder: '请选择所属科室'
  },
  span: 12
}
var obj = {}
obj.staffObj = ''
export default {
  mixins: [list, selectInquireList, storage, getStorage],
  data () {
    obj = this.$ever.createObjFromSchema(schema)
    obj.isSection = ''
    obj.type2 = ''
    obj.formSpaceId = []
    obj.formSentenceId = []
    obj.storageRoomRelations = []
    let validateClassifyId = (rule, value, callback) => {
      if (this.obj.classifyId === '1' && !this.obj.type2) {
        return callback('必填项')
      }
      callback()
    }
    return {
      schema,
      obj,
      options1,
      options2,
      storageroomapi,
      querySchema: {},
      params: {
        offset: 0,
        pagesize: 20,
        orgId: storage.getStorageByClinic('CLINICID') || '' // 获取机构ID
      },
      activeName: 'essentialInfo',
      api: '',
      listApiName: '',
      tableData: [],
      cacheTableDate: [],
      objId: this.$route.params.id,
      PARSE_REG,
      tipMsg: {
        1: {
          dispenseWorkbench: '发药工作台',
          isTimeLimit: '发药时限',
          dispenseReceiver: '收方发药',
          dispensePrepare: '药房备药',
          dispensePreparePrint: '打印备药单',
          dispensePaste: '打印药贴',
          dispensePatient: '父子医嘱药贴',
          isCoordination: '门诊发药流程'
        },
        2: {
          dispenseWorkbench: '发药工作台',
          isTimeLimit: '发药时限',
          dispensePrepare: '药房备药',
          dispensePreparePrint: '打印备药单',
          dispensePaste: '打印药包贴',
          isCoordination: '住院发药流程'
        }
      },
      rules: {
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        materialType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        unitCategory: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        enableDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        classifyId: [
          { required: true, validator: validateClassifyId, trigger: 'blur' }
        ],
        formSentenceId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        formSpaceId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        phone: [
          { validator: validateTelePhone, trigger: 'blur' }
        ]
      },
      staffFlag: false,
      STORAGE_ROOM_TYPE,
      START_STOP,
      IS_TIME,
      PRINTING,
      IS_QUICK,
      PRINT_SPEC,
      IPD_PRINT_STYLE,
      OPD_PARENT_PRINT_STYLE,
      OPD_DISPENSING_FLOW_STATUS,
      IPD_DISPENSING_FLOW_STATUS,
      medicineTableData: [],
      dispenseSetting: {},
      medicineFlag: false,
      medicineDrug: false,
      editMaterialType: true
    }
  },
  methods: {
    handlerIsTime: debounce(function (v = 1) { // 设置发药时限
      const settingName = 'outPatientDispenseSettingObject'
      const settingObj = this.dispenseSetting[settingName]
      const item = this.dispenseSetting[settingName].timeLimitObject
      let params = {
        id: settingObj.id,
        'isTimeLimit': settingObj['isTimeLimit']
      }
      if (v === 1 && item) {
        Object.assign(params, {
          timeLimitObject: {
            value: item.value || '3',
            id: item.id
          }
        })
      }
      dispensesettingApi.updateDispenseSetting(params).then(res => {
        if (res.flag) {
          this.dispenseSetting[settingName] = res.object
          this.dispenseSetting = this.basicCompileInitData(this.dispenseSetting)
          this.$messageTips(this, 'success', `门诊发药:更新发药时限成功`)
        } else {
          this.dispenseSetting[settingName][name] = v === 1 ? 2 : 1 // 还原数据状态
        }
      })
    }),
    handleChildrenChange: debounce(function (v, name, type, third) { // 二级或者三级下拉选择变更方法 {v: 当前选择状态值，name: 当前选择的字段，type: 1 门诊；2 住院, third: 是否是第三级选择}
      const settingName = type === 1 ? 'outPatientDispenseSettingObject' : 'uddDispenseSettingObject'
      const settingObj = this.dispenseSetting[settingName]
      let params = {
        id: settingObj.id,
        [name]: settingObj[name]
      }
      if (['dispensePaste', 'dispensePatient'].includes(name)) params = this.basicCompileParams(params, name, type, settingName, third)
      dispensesettingApi.updateDispenseSetting(params).then(res => {
        if (res.flag) {
          this.dispenseSetting[settingName] = res.object
          this.dispenseSetting = this.basicCompileInitData(this.dispenseSetting)
          this.$messageTips(this, 'success', `${type === 1 ? '门诊发药' : '住院发药'}:更新${this.tipMsg[type][name]}成功`)
        } else {
          if (name === 'isCoordination') {
            this.dispenseSetting[settingName][name] = v === 1 ? 2 : 1 // 还原数据状态
          } else {
            this.dispenseSetting[settingName][name === 'dispensePaste' ? 'dispenseSettingPasteObject' : 'dispenseSettingPatientObject'].value = v === 1 ? '2' : '1' // 还原数据状态
          }
        }
        if (this.storageId === this.objId) this.getDispenseSetting()
      })
    }),
    handleCommonChange: debounce(function (v, name, type) { // 门诊住院切换状态公共方法 {v: 当前选择状态值，name: 当前选择的字段，type: 1 门诊；2 住院}
      const settingName = type === 1 ? 'outPatientDispenseSettingObject' : 'uddDispenseSettingObject'
      const settingObj = this.dispenseSetting[settingName]
      let params = {
        id: settingObj.id,
        [name]: v
      }
      if (['dispensePaste', 'dispensePatient'].includes(name) && v === 1) params = this.basicCompileParams(params, name, type, settingName)
      dispensesettingApi.updateDispenseSetting(params).then(res => {
        if (res.flag) {
          this.dispenseSetting[settingName] = res.object
          this.dispenseSetting = this.basicCompileInitData(this.dispenseSetting)
          this.$messageTips(this, 'success', `${type === 1 ? '门诊发药' : '住院发药'}:${v === 1 ? IS_QUICK[0].name : IS_QUICK[1].name}${this.tipMsg[type][name]}成功`)
        } else {
          this.dispenseSetting[settingName][name] = v === 1 ? 2 : 1 // 还原数据状态
        }
        if (this.storageId === this.objId) this.getDispenseSetting()
      })
    }),
    handleQuickChange: debounce(function (v) { // 快捷出库
      if (this.activeName !== 'medicinesetting') return
      storageroomapi.createOrUpdate({ id: this.obj.id, isQuick: v }).then(res => {
        if (!res.flag) {
          this.dispenseSetting.isQuick = v ? 0 : 1 // 还原数据状态
        } else {
          this.dispenseSetting = this.basicCompileInitData(res.object)
          this.$messageTips(this, 'success', `${v ? IS_QUICK[0].name : IS_QUICK[1].name}快捷出库成功`)
        }
        if (this.storageId === this.objId) this.getDispenseSetting()
      })
    }),
    basicCompileParams (data, name, type, settingName, third) {
      if (name === 'dispensePaste') {
        const item = this.dispenseSetting[settingName].dispenseSettingPasteObject
        if (item) {
          Object.assign(data, {
            dispenseSettingPasteObject: {
              value: item.value || '1',
              id: item.id
            }
          })
          if (type === 1) {
            Object.assign(data, {
              dispenseSettingPasteObject: {
                value: item.value,
                id: item.id,
                dispenseSettingPasteObject: {
                  value: third ? '1' : item.dispenseSettingPasteObject.value,
                  id: item.dispenseSettingPasteObject.id
                }
              }
            })
          }
        } else {
          Object.assign(data, { dispenseSettingPasteObject: { value: '1' } })
          if (type === 1) Object.assign(data, { dispenseSettingPasteObject: { value: '1', dispenseSettingPasteObject: { value: '1' } } })
        }
      } else {
        const item = this.dispenseSetting[settingName].dispenseSettingPatientObject
        if (item) {
          Object.assign(data, {
            dispenseSettingPatientObject: {
              value: item.value,
              id: item.id
            }
          })
        } else {
          Object.assign(data, { dispenseSettingPatientObject: { value: '1' } })
        }
      }
      return data
    },
    handleSelect (obj) {
      this.obj.staffObj = {
        id: obj.id ? obj.id : ''
      }
    },
    handleClick (tab, event) {
      this.queryObj = {}
      this.staffFlag = false
      this.medicineFlag = false
      if (tab.name === 'staffInfo') {
        this.staffFlag = true
        this.api = staffapi
        this.listApiName = 'getStaffRoleList'
        this.queryObj = { nodeId: this.$route.params.id, roleType: 1 }
        this.list(this.queryObj)
      } else if (tab.name === 'medicinesetting') {
        this.medicineFlag = true
        this.getDispenseSetting()
      } else if (tab.name === 'essentialInfo') {
        this.editMaterialType = true
        // this.$refs.essentialInfo.getDetail()
      }
    },
    getDispenseSetting () {
      dispensesettingApi.getByDispensePrintSetting(this.objId).then(res => {
        if (res.storageRoomId) {
          // if (this.storageId === this.objId) {
          //   this.$store.commit('setDispenseSetting', res)
          //   storage.setLocalStorage('DISPENSE_SETTING', JSON.stringify(res))
          // }
          this.dispenseSetting = this.basicCompileInitData(res)
        }
      })
    },
    basicCompileInitData (res) {
      if (res.uddDispenseSettingObject && !res.uddDispenseSettingObject.dispenseSettingPasteObject) {
        res.uddDispenseSettingObject = Object.assign({}, res.uddDispenseSettingObject, { // 住院
          dispenseSettingPasteObject: {
            value: '1'
          }
        })
      }
      if (res.outPatientDispenseSettingObject && !res.outPatientDispenseSettingObject.dispenseSettingPasteObject) {
        res.outPatientDispenseSettingObject = Object.assign({}, res.outPatientDispenseSettingObject, { // 门诊
          dispenseSettingPasteObject: {
            value: '1',
            dispenseSettingPasteObject: {
              value: '1'
            }
          }
        })
      }
      if (res.outPatientDispenseSettingObject && !res.outPatientDispenseSettingObject.dispenseSettingPatientObject) {
        res.outPatientDispenseSettingObject = Object.assign({}, res.outPatientDispenseSettingObject, { // 门诊
          dispenseSettingPatientObject: {
            value: '1'
          }
        })
      }
      if (res.outPatientDispenseSettingObject && !res.outPatientDispenseSettingObject.timeLimitObject) {
        res.outPatientDispenseSettingObject = Object.assign({}, res.outPatientDispenseSettingObject, { // 发药时限
          timeLimitObject: {
            value: 3
          }
        })
      }
      return res
    },
    queryRemote (query) {
      if (query && query.nameList) query.nameList = [query.nameList]
      return query && query.nameList ? staffapi.list(query) : this.emptyFn()
    },
    emptyFn () {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    },
    del (id) {
      staffapi.updateStaffRole(id).then(res => {
        this.$messageTips(this, 'success', '移除成功')
        this.list()
        this._setStorageItem()
      })
    },
    afterSave () {
      let initstorageId = storage.getLocalStorage('STORAGE_ID_VUEX') || storage.getLocalStorage('STORAGE_ID') || storage.getLocalStorage('INIT_STORAGE_ID')
      if (this.objId === initstorageId) {
        storage.setLocalStorage('MATERIAL_TYPE', JSON.stringify(this.obj.materialType))
      }
      this._setStorageItem()
      this.$router.push('/warehouse/storagerooms')
    },
    addEmployeeInfo () {
      if (!this.obj.staffObj.id) {
        this.$messageTips(this, 'warning', '请选择需要添加的人员')
        return
      }
      let params = {
        staffId: this.obj.staffObj.id,
        nodeId: this.$route.params.id,
        roleType: 1
      }
      staffapi.createStaffRole(params).then(res => {
        this.list()
        this.querySchema = {}
        this._setStorageItem()
      })
    },
    _medicineEach (arr) {
      arr.forEach(item => { item.medicineStatus = 0 })
      return arr
    },
    async _setStorageItem () {
      let initstorageId = storage.getLocalStorage('INIT_STORAGE_ID') || storage.getLocalStorage('STORAGE_ID')
      let initstorageFlag = false
      let storageList = await storageroomapi.list({ userType: 1 })
      if (storageList && storageList.list && storageList.list.length) {
        storageList.list.forEach(item => {
          if (item.id === initstorageId) initstorageFlag = true
        })
        let storageItem = []
        storageItem = storageList.list
        if (!initstorageFlag) {
          storage.removeLocalStorage('INIT_STORAGE_ID')
          storage.removeLocalStorage('STORAGE_ID')
          storage.removeLocalStorage('STORAGE_ID_VUEX')
        }
        storage.setLocalStorage('STORAGE_ITEM', JSON.stringify(storageItem))
      } else {
        storage.removeLocalStorage('STORAGE_ID')
        storage.removeLocalStorage('STORAGE_ITEM')
        storage.removeLocalStorage('INIT_STORAGE_ID')
        storage.removeLocalStorage('MATERIAL_TYPE')
        storage.removeLocalStorage('STORAGE_ID_VUEX')
      }
    },
    imgCompileWidth (list, val, name) {
      let index = list.findIndex(item => {
        return item.id === val
      })
      let width = list[index][name].split('*')[0] * 5
      return width + 'px'
    },
    htmlCompileShow (list, val, name) {
      let index = list.findIndex(item => {
        return item.id === val
      })
      return list[index][name]
    },
    getDepartmentStorehouse (v, type, childobj) { // 处理传递给后端的科室或者病区数据
      if (v.length) {
        let arr = []
        v.map(item => {
          let newObj = { relationId: Array.isArray(item) ? item[item.length - 1] : item }
          if (type) { newObj.relationType = this.obj.type2 === STAFF_RELATION_TYPE[1].id ? DEPARTMENT_TYPE[0].id : DEPARTMENT_TYPE[1].id }
          arr.push(newObj)
        })
        this.obj[childobj] = arr
      }
    }
  },
  components: {
    whSwitch,
    everStaffRemoteSelect,
    addStorageroom
  },
  created () {
    // // 科室库设置选项默认是否
    // this.obj.classifyId = this.options1[1].id
    // this._departmentSelect(true).then(res => {
    //   this.$ever.getFieldFromSchema(this.schema, 'departmentId').props.options = res
    // })
    // if (this.objId) {
    //   this.$ever.getFieldFromSchema(this.schema, 'type').props.disabled = true
    // } else {
    //   this.$ever.getFieldFromSchema(this.schema, 'type').props.disabled = false
    // }
    // this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = []
    // if (this.$route.params.id) { // 判断是否库房为药品显示发药设置
    //   storageroomapi.getById(this.$route.params.id).then(res => {
    //     if (res && res.materialType && [DRUGTYPE, MATERIALTYPE].includes(res.materialType)) this.medicineDrug = true
    //   })
    // }
  },
  watch: {
    obj: {
      handler: function (v) {
        if ([STORAGE_ROOM_TYPE[0].id].includes(v.type)) this.medicineDrug = true // 判断是否库房为药品显示发药设置
        v.classifyId = v.classifyId.toString()
      },
      deep: true
    },
    'obj.storageRoomRelations': { // 编辑回显科室 || 病区
      handler (v) {
        if (v && v.length) this.obj.classifyId = this.options1[0].id
        if (!this.objId) return
        if (v.length && v[0].relationType === DEPARTMENT_TYPE[0].id) {
          let formSentenceArr = []
          this.obj.type2 = STAFF_RELATION_TYPE[1].id
          if (this.obj.formSentenceId.length) return
          const formsentencelist = whComFn.optionMap(v, DEPARTMENT_TYPE[0].id)
          formsentencelist.forEach(item => {
            formSentenceArr.push(item.levelRelationIds)
          })
          this.obj.formSentenceId = formSentenceArr
        } else if (v.length && v[0].relationType === DEPARTMENT_TYPE[1].id) {
          let formspaceArr = []
          this.obj.type2 = STAFF_RELATION_TYPE[2].id
          if (this.obj.formSpaceId.length) return
          const formspacelist = whComFn.optionMap(v, DEPARTMENT_TYPE[1].id)
          formspacelist.forEach(item => {
            formspaceArr.push(item.relationId)
          })
          this.obj.formSpaceId = formspaceArr
          this.$nextTick(_ => {
            this.$ever.getFieldFromSchema(this.schema, 'formSpaceId').props.value = formspaceArr
          })
        }
      },
      deep: true
    },
    'obj.type' (v) {
      this.obj.materialType = []
      if (v === STORAGE_ROOM_TYPE[0].id) {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = [...drugOrMaterialType]
      } else if (v === STORAGE_ROOM_TYPE[1].id) {
        let blood = [{ id: BLOOD_CLASSIFYID, name: '血液' }]
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = [...blood]
      } else {
        this.$ever.getFieldFromSchema(this.schema, 'materialType').props.options = []
      }
    },
    'obj.materialType': {
      handler (val) {
        if (this.objId && this.editMaterialType && this.obj.storageRoomTypeRelationList) {
          let arr = []
          this.obj.storageRoomTypeRelationList.forEach(item => {
            arr.push(item.relationId)
          })
          this.$set(this.obj, 'materialType', arr)
          this.editMaterialType = false
        }
        if (typeof val === 'object') this.getDepartmentStorehouse(val, false, 'storageRoomTypeRelationList')
      },
      deep: true
    },
    'obj.classifyId' (val) {
      this.obj.isSection = val
      if (val === '0') {
        this.obj.storageRoomRelations = []
        this.schema.forEach(item => {
          if (item.name === 'formSpaceId' || item.name === 'formSentenceId') {
            this.schema.pop()
            this.obj.type2 = ''
          }
        })
      }
    },
    'obj.type2' (val) { // 选择库房类型
      if (val === STAFF_RELATION_TYPE[1].id) {
        this.schema.forEach(item => {
          if (item.name === 'formSpaceId') {
            this.schema.pop()
          }
        })
        this.schema.push(FORM_SENTENCE)
        this._sentenceSpaceSelect({ relationId: this.objId, relationType: val }).then(res => {
          const options = whComFn.sectionMap(res)
          this.$ever.getFieldFromSchema(this.schema, 'formSentenceId').props.options = options
        })
      }
      if (val === STAFF_RELATION_TYPE[2].id) {
        this.schema.forEach(item => {
          if (item.name === 'formSentenceId') {
            this.schema.pop()
          }
        })
        this.schema.push(FORM_SPANCE)
        this._areaSelect().then(res => {
          this.$ever.getFieldFromSchema(this.schema, 'formSpaceId').props.options = res
        })
      }
    },
    'obj.formSentenceId' (val) { // 所属科室
      this.getDepartmentStorehouse(val, true, 'storageRoomRelations')
    },
    'obj.formSpaceId' (val) { // 所属病区
      this.getDepartmentStorehouse(val, true, 'storageRoomRelations')
    },
    'tableData' (val) {
      if (this.staffFlag && (val.length || this.cacheTableDate.length === 1)) {
        this.cacheTableDate = val
      } else if (this.medicineFlag && val.length) {
        this.medicineTableData = this._medicineEach(val)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_tabs_top {
  margin: -10px;
  min-height: calc(100vh - 140px);
}
.el-form {
  min-height: calc(100vh - 230px);
}
.w200 {
  width: 200px !important;
}
.leftw180 {
  margin-left: -100px;
  i.titleLabel {
    display: inline-block;
    width: 4px;
    margin-right: 10px;
    height: 18px;
    position: relative;
    top: 3px;
    background: #1c7bef;
    border-radius: 2px;
  }
}
.el-form-item__content > div {
  margin-left: 30px;
}
.storeroom_personnel_details {
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  color: #666666;
}
.main-head {
  border-bottom: 1px solid #eee;
  padding: 0 0 20px 0;
}
.employeeInfo {
  font-size: 14px;
  color: #666666;
}
.remote-select {
  width: 320px !important;
  // margin: 0 38px 0 10px;
}
.imgWidth {
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  img {
    width: 100%;
  }
}
.queryClass {
  margin: 0 !important;
  width: 49.7% !important;
  display: inline-block;
}
</style>
