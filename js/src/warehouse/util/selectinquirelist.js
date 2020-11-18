// 获取机构&人员select，query调用
import { STENCIL_TYPE, patch, MECHANISM_CODE, STAFF_CODE, ROOM_CODE, BUILDING_CODE, SPACE_CODE, SENTENCE_CODE, getFirstRoutePath, DEPARTMENT_CODE, parserJSON } from '@/util/common'
// 集团api
import mechanismApi from '@/warehouse/page/group/store/mechanismapi.js'
import personnelApi from '@/warehouse/page/group/store/personnelapi.js'
import roomApi from '@/warehouse/page/group/store/roomapi.js'
import buildingApi from '@/warehouse/page/group/store/buildingapi.js'
import areaApi from '@/warehouse/page/group/store/areaapi.js'
import sentenceApi from '@/warehouse/page/group/store/sentenceapi.js'
import departmentApi from '@/warehouse/page/group/store/departmentapi.js'

// 机构api
import agencySentenceApi from '@/warehouse/page/agency/store/agencysentenceapi.js'
import agencyDepartmentApi from '@/warehouse/page/agency/store/agencydepartmentapi.js'
import agencyRoomApi from '@/warehouse/page/agency/store/agencyroomapi.js'
import beforeRouterEnterMixins from '@/warehouse/page/storages/util/beforer.route.enter.js'

export default {
  mixins: [beforeRouterEnterMixins],
  methods: {
    // 机构select
    async _clinicSelect () {
      let mechanismData = await mechanismApi.list().then()
      let mechanismOption = []
      if (mechanismData && mechanismData.list && mechanismData.list.length) {
        mechanismData.list.forEach(item => {
          mechanismOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[3].attributeName], code: [MECHANISM_CODE[0]] })
          })
        })
      }
      return mechanismOption
    },
    // 人员select
    async _staffSelect (customFlag) {
      let params = {
        // offset: 0,
        // pagesize: 20
      }
      if (getFirstRoutePath(this.$route.path, 1) === 'group' || customFlag) params.isBloc = 1
      let personnelData = await personnelApi.list(params).then()
      let personnelOption = []
      if (personnelData && personnelData.list && personnelData.list.length) {
        personnelData.list.forEach(item => {
          personnelOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[2].attributeName], code: [STAFF_CODE[0]] })
          })
        })
      }
      return personnelOption
    },
    // 房间select
    async _roomSelect () {
      let params = {}
      if (getFirstRoutePath(this.$route.path, 1) === 'group') params.isBloc = 1
      let roomData = await roomApi.list(params).then()
      let roomOption = []
      if (roomData && roomData.list && roomData.list.length) {
        roomData.list.forEach(item => {
          roomOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[6].attributeName], code: [ROOM_CODE[1]] })
          })
        })
      }
      return roomOption
    },
    // 机构房间单关联select
    async _roomSingleSelect (params) {
      let roomData = await agencyRoomApi.listSingle(params)
      let options = []
      roomData.floor && roomData.floor.map(item => {
        options.push({
          name: item,
          value: item
        })
      })
      roomData.roomRecordGroupFloor && roomData.roomRecordGroupFloor.map(room => {
        room.map(item => {
          let id = item.id
          let floorName = this._resetMaterialName({ rows: item[STENCIL_TYPE[7].attributeName], attributeValue: [STENCIL_TYPE[7].attributeValue], code: [[ROOM_CODE[2]]] })
          let roomName = this._resetMaterialName({ rows: item[STENCIL_TYPE[7].attributeName], code: [ROOM_CODE[1]] })
          let index = options.findIndex(item => {
            return item.value === floorName
          })
          if (index > -1) {
            if (!options[index].children) options[index].children = []
            options[index].children.push({
              value: id,
              name: roomName,
              id: id
            })
          }
        })
      })
      return options
    },
    // 建筑select
    async _buildingSelect () {
      let params = {}
      if (getFirstRoutePath(this.$route.path, 1) === 'group') params.isBloc = 1
      let buildingData = await buildingApi.list(params).then()
      let buildingOption = []
      if (buildingData && buildingData.list && buildingData.list.length) {
        buildingData.list.forEach(item => {
          buildingOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[5].attributeName], code: [BUILDING_CODE[0]] })
          })
        })
      }
      return buildingOption
    },
    // 病区select
    async _areaSelect () {
      let params = {}
      if (getFirstRoutePath(this.$route.path, 1) === 'group') params.isBloc = 1
      let areaData = await areaApi.list(params).then()
      let areaOption = []
      if (areaData && areaData.list && areaData.list.length) {
        areaData.list.forEach(item => {
          areaOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[8].attributeName], code: [SPACE_CODE[0]] })
          })
        })
      }
      return areaOption
    },
    // 科室select
    async _sentenceSelect (customFlag) {
      let customApi = customFlag ? agencySentenceApi : sentenceApi
      let sentenceData = await customApi.list()
      let sentenceOption = []
      if (sentenceData && sentenceData.list && sentenceData.list.length) {
        sentenceData.list.forEach(item => {
          if ((item[STENCIL_TYPE[4].localProperties] && item[STENCIL_TYPE[4].localProperties].ext)) {
            sentenceOption.push({
              id: item.id,
              name: parserJSON({ data: customFlag ? item[STENCIL_TYPE[4].localProperties].ext : item[STENCIL_TYPE[4].attributeName], property: SENTENCE_CODE[1] })
            })
          }
        })
      }
      return sentenceOption
    },
    // 获取当前用户科室select
    async _deptsApiSelect (params) {
      try {
        let res = await agencySentenceApi.getLocalSectionVoBySearch(params)
        if (res && res.length) {
          res.map(item => {
            item.id = item.sectionRecordId
            return item
          })
        } else {
          res = []
        }
        return res
      } catch (err) {
        return []
      }
    },
    // 科室上级科室关联select
    async _sentenceNoFatherSelect (params) {
      let sentenceData = await agencySentenceApi.list(params).then()
      console.log(sentenceData)
      let sentenceOption = []
      if (sentenceData && sentenceData.length) {
        sentenceData.forEach(item => {
          sentenceOption.push({
            id: item.id,
            name: this._resetMaterialName({ rows: item[STENCIL_TYPE[4].localProperties][STENCIL_TYPE[4].attributeName], code: [SENTENCE_CODE[1]] })
          })
        })
      }
      return sentenceOption
    },
    // 科室病区关联select
    async _sentenceSpaceSelect (params) {
      let sentenceData = await agencySentenceApi.sentenceSpaceList(params).then()
      let sentenceOption = []
      if (sentenceData && sentenceData.length) {
        // 科室数据接口改变，采用ext数据格式废弃this._recursion 方法
        sentenceData.forEach(item => {
          sentenceOption.push({
            id: item.id,
            name: parserJSON({ data: item[STENCIL_TYPE[4].localProperties].ext, property: SENTENCE_CODE[1] })
          })
        })
        // this._recursion({ data: sentenceData, name: 'sonLocalSections', spliceName: STENCIL_TYPE[4].localProperties.ext, spliceCode: SENTENCE_CODE[1] })
      }
      return sentenceOption
    },
    // 部门select
    async _departmentSelect (customFlag) {
      let customApi = customFlag ? agencyDepartmentApi : departmentApi
      let params = {}
      if (customFlag === false) params.searchForCorrelation = 1
      if (customFlag) params.ifLocal = true // 新增机构部门查询，只查询本机构数据 俊俊2019.04.03添加
      let departmentData = await customApi.list(params).then()
      let departmentOption = []
      if (departmentData && departmentData.list && departmentData.list.length) {
        departmentData.list.forEach(item => {
          departmentOption.push({
            id: item.id,
            relevance: item.relevance,
            name: this._resetMaterialName({ rows: customFlag ? item[STENCIL_TYPE[1].localProperties][STENCIL_TYPE[1].attributeName] : item[STENCIL_TYPE[1].attributeName], code: [DEPARTMENT_CODE[0]] })
          })
        })
      }
      return departmentOption
    },
    _recursion ({ data, name, spliceName, spliceCode }) {
      data.forEach(item => {
        item.name = parserJSON({ data: item[spliceName], property: [spliceCode] })
        if (item[name]) {
          this._recursion({ data: item[name], name, spliceName, spliceCode })
        }
      })
    },
    ...patch
  },
  watch: {
    'queryObj.name' (val) {
      if (val) {
        Object.assign(this.queryObj, { codesMatchValues: [{ codes: this.codesMatchValuesCodes, value: val.toString().trim() }] })
      } else {
        delete this.queryObj.codesMatchValues
      }
      this.query(this.queryObj)
      // if (this.queryObj.codesMatchValues && val) {
      //   this.queryObj.codesMatchValues[0].value = val.toString().trim()
      //   this.query(this.queryObj)
      // } else {
      //   this.queryObj.codesMatchValues[0].value = ''
      //   this.query(this.queryObj)
      // }
    },
    'queryObj.sectionRecord' (val) {
      if (Array.isArray(val)) {
        this.queryObj.localSectionId = this.queryObj.sectionRecord[this.queryObj.sectionRecord.length - 1]
        this.query(this.queryObj)
      }
    }
    // // 科室
    // 'queryObj.sentenceId' (val) {
    //   if (this.queryObj.codesMatchValues) {
    //     if (getFirstRoutePath(this.$route.path, 1) === 'warehouse') {
    //       this.queryObj.codesMatchValues[1].value = val
    //       this.query(this.queryObj)
    //     }
    //   }
    // },
    // // 房间
    // 'queryObj.roomId' (val) {
    //   if (this.queryObj.codesMatchValues) {
    //     if (getFirstRoutePath(this.$route.path, 1) === 'warehouse') {
    //       this.queryObj.codesMatchValues[2].value = val
    //       this.query(this.queryObj)
    //     }
    //   }
    // },
    // // 病区
    // 'queryObj.areaId' (val) {
    //   if (this.queryObj.codesMatchValues) {
    //     if (getFirstRoutePath(this.$route.path, 1) === 'warehouse') {
    //       this.queryObj.codesMatchValues[3].value = val
    //       this.query(this.queryObj)
    //     }
    //   }
    // }
  }
}
