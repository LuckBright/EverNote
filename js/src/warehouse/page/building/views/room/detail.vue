<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/room/list"></ever-bread-crumb>
    <div class="layout_inner oa">
      <ever-form2
        v-model="form"
        ref="form"
        :schema="schema"
        :rules="rules"
        label-width="150px"
      >
        <template>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
            </el-form-item>
          </el-col>
        </template>
        <template slot="building">
          <el-select v-model="form.building" value-key="buildingCode" class="w">
            <el-option v-for="item in buildingList" :key="item.buildingCode" :label="item.buildingName" :value="item"></el-option>
          </el-select>
        </template>
        <template slot="usableArea">
          <el-input placeholder="使用面积" v-model="form.usableArea">
            <template slot="append">平方米</template>
          </el-input>
        </template>
        <template slot="tsRoomConfigureDTOList">
          <sys-type code="THC_WH_FJPZ" v-model="form.tsRoomConfigureDTOList" :multiple="true" :use-object="true" :obj-simple="true"></sys-type>
        </template>
        <template slot="tsRoomOrgSubjectDTO">
          <el-cascader
            class="w"
            v-model="form.tsRoomOrgSubjectDTO"
            :options="subjectList"
            :props="cascaderMulProps"
            filterable
            clearable
            @change="changeMulSubject"
          ></el-cascader>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import orgUrlMap from '@/manages/page/organization/utils/urls'
  import {roomSchema, roomRules} from '@/warehouse/page/building/views/room/model'
  import {convertListToTree, changeToTreeList, getAllParentById, sortTreeList} from '@/manages/page/organization/utils/fns'
  import '@/warehouse/page/building/assets/index.less'
  import storage from '@/util/storage'
  const schema = roomSchema
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.buildingName = ''
      form.buildingCode = ''
      form.roomPurposeName = ''
      form.roomPurposeCode = ''
      form.roomTypeName = ''
      form.roomTypeCode = ''
      form.tsRoomOrgSubjectDTO = [] // 用于回显数据
      form.tsRoomOrgSubjectDTOObjList = [] // 对象数组
      form.tsRoomOrgSubjectDTOList = [] // 用于提交
      form.tsRoomConfigureDTOList = []
      return {
        schema,
        form,
        rules: roomRules,
        id: null,
        type: '',
        buildingList: [],
        originSubjectList: [],
        subjectList: [],
        subjectDone: false,
        searchDone: false,
        cascaderMulProps: {
          checkStrictly: true,
          multiple: true,
        },
      }
    },
    created () {
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      if (this.type === 'create') {
      } else {
        this.search()
      }
      this.searchBuildingList()
      this.searchSubjectList()
    },
    methods: {
      searchSubjectList () {
        // 查询当前机构下的科室
        request(orgUrlMap.subject.loadOrgSubjectListByOrgId, {orgId: storage.getStorageByClinic('CLINICID')}).then(res => {
          this.originSubjectList = res.data.pageList
          this.subjectList = convertListToTree(changeToTreeList(res.data.pageList, {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'}))
          this.subjectDone = true
          this.setAsyncSubject()
        })
      },
      setAsyncSubject () {
        if (this.searchDone && this.subjectDone && this.form.tsRoomOrgSubjectDTOList && this.form.tsRoomOrgSubjectDTOList.length) {
          // 先对要回显的科室数据进行排序，按照树的展示顺序排序，否则在删除的时候会出现意外情况
          const treeList = changeToTreeList(this.originSubjectList, {label: 'orgSubjectName', id: 'orgSubjectCode', parentId: 'parentOrgSubjectCode'})
          this.form.tsRoomOrgSubjectDTOList = sortTreeList(treeList, this.form.tsRoomOrgSubjectDTOList, {id: 'orgSubjectCode'}).map(item => ({
            orgSubjectCode: item.orgSubjectCode,
            orgSubjectName: item.orgSubjectName,
            orgSubjectId: item.orgSubjectId,
          }))
          this.form.tsRoomOrgSubjectDTOObjList = this.form.tsRoomOrgSubjectDTOList.map(tsSubject => {
            const parentList = getAllParentById(treeList, tsSubject.orgSubjectCode)
            return [...parentList, {
              orgSubjectCode: tsSubject.orgSubjectCode,
              orgSubjectName: tsSubject.orgSubjectName,
              orgSubjectId: tsSubject.orgSubjectId,
              _id: tsSubject.orgSubjectId,
            }]
          })
          this.form.tsRoomOrgSubjectDTO = this.form.tsRoomOrgSubjectDTOObjList.map(tsSubjectList => tsSubjectList.map(item => item._id))
        }
      },
      searchBuildingList () {
        request(urlMap.building.pageList).then(res => {
          this.buildingList = res.data.pageList || []
        })
      },
      search () {
        request(urlMap.room.getById, {id: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.searchDone = true
            this.form = Object.assign({}, this.form, res.data)
            this.form.building = {
              buildingName: this.form.buildingName,
              buildingCode: this.form.buildingCode,
            }
            this.form.roomPurpose = {
              name: this.form.roomPurposeName,
              code: this.form.roomPurposeCode,
            }
            this.form.roomType = {
              name: this.form.roomTypeName,
              code: this.form.roomTypeCode,
            }
            if (this.form.tsRoomConfigureDTOList) {
              this.form.tsRoomConfigureDTOList = this.form.tsRoomConfigureDTOList.map(item => ({
                code: item.roomConfigureCode,
                name: item.roomConfigureName,
              }))
            }
            // 回显关联科室
            if (this.form.tsRoomOrgSubjectDTOList) {
              this.setAsyncSubject()
            }
          }
        })
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            if (this.form.building) {
              params.buildingCode = this.form.building.buildingCode
              params.buildingName = this.form.building.buildingName
            }
            if (this.form.roomPurpose) {
              params.roomPurposeCode = this.form.roomPurpose.code
              params.roomPurposeName = this.form.roomPurpose.name
            }
            if (this.form.roomType) {
              params.roomTypeCode = this.form.roomType.code
              params.roomTypeName = this.form.roomType.name
            }
            params.tsRoomOrgSubjectDTOList = params.tsRoomOrgSubjectDTOObjList.map(subjectList => {
              const item = subjectList[subjectList.length - 1]
              return {
                orgSubjectId: item._id || item.orgSubjectId,
                orgSubjectCode: item.orgSubjectCode,
                orgSubjectName: item.orgSubjectName,
              }
            })
            params.tsRoomConfigureDTOList = params.tsRoomConfigureDTOList.map(item => ({
              roomConfigureCode: item.code,
              roomConfigureName: item.name,
            }))
            params.roomName = params.roomCode
            delete params.building
            delete params.roomPurpose
            delete params.roomType
            delete params.tsRoomOrgSubjectDTO
            delete params.tsRoomOrgSubjectDTOObjList
            request(urlMap.room[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({name: 'building-room-list'})
              }
            })
          }
        })
      },
      changeMulSubject (value) {
        if (!value) return
        this.form.tsRoomOrgSubjectDTOObjList = value.map(item => item.map(id => this.originSubjectList.find(s => s._id === id)))
      },
    },
  }
</script>
