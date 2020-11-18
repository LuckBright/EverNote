<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/diagnosisArea/list"></ever-bread-crumb>
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

        <template slot="tsDiagnosisAreaRoomDTOList">
          <el-select v-model="form.tsDiagnosisAreaRoomDTOList" value-key="roomCode" class="w" multiple>
            <el-option
              v-for="item in roomList" :key="item.roomCode" :label="item.roomName"
              :value="item"></el-option>
          </el-select>
        </template>
        <template slot="tsDiagnosisAreaOrgSubjectDTOList">
          <subject-select ref="ss" v-model="form.tsDiagnosisAreaOrgSubjectDTOList"></subject-select>
        </template>
        <template slot="tsDiagnosisAreaBedDTONameList">
          <el-cascader
            class="w"
            v-model="form.tsDiagnosisAreaBedDTONameList"
            :options="bedOptions"
            :show-all-levels="false"
            :props="cascaderProps"
            filterable
            @change="changeBed"
          ></el-cascader>
        </template>
        <template slot="tsDiagnosisAreaSeatDTONameList">
          <el-cascader
            class="w"
            v-model="form.tsDiagnosisAreaSeatDTONameList"
            :options="seatOptions"
            :show-all-levels="false"
            :props="cascaderProps"
            filterable
            @change="changeSeat"
          ></el-cascader>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import {diagnosisAreaSchema, diagnosisAreaRules} from '@/warehouse/page/building/views/diagnosisarea/model'
  import '@/warehouse/page/building/assets/index.less'
  import { getObjByIncludes, sortListByTree, convertTreeToList } from '@/manages/page/organization/utils/fns'
  import SubjectSelect from '@/manages/page/organization/components/subjectselect'
  const schema = diagnosisAreaSchema
  export default {
    components: {SubjectSelect},
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        form,
        rules: diagnosisAreaRules,
        id: null,
        type: '',
        roomList: [],
        cascaderProps: {
          multiple: true,
          value: 'id',
          label: 'name',
          emitPath: false,
        },
        bedDTOListSearched: false,
        treeSearched: false,
        seatDTOListSearched: false,
        seatTreeSearched: false,
        bedOptions: [],
        seatOptions: [],
        bedDataList: [],
        seatDataList: [],
      }
    },
    created () {
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      if (this.type === 'create') {
      } else {
        this.search()
      }
      this.searchRoomList()
      this.searchBedTree()
      this.searchSeatTree()
    },
    methods: {
      changeBed (value) {
        if (value && value.length) {
          this.form.tsDiagnosisAreaBedDTOList = value.map(item => {
            const bedItem = this.bedDataList.find(bed => bed.id === item)
            console.log(bedItem, 'bedItem')
            if (bedItem) {
              return {
                ...bedItem,
                bedId: bedItem.id,
              }
            }
          })
        } else {
          this.form.tsDiagnosisAreaBedDTOList = []
        }
      },
      changeSeat (value) {
        if (value && value.length) {
          this.form.tsDiagnosisAreaSeatDTOList = value.map(item => {
            const seatItem = this.seatDataList.find(bed => bed.id === item)
            if (seatItem) {
              return {
                ...seatItem,
                seatId: seatItem.id,
              }
            }
          })
        } else {
          this.form.tsDiagnosisAreaBedDTOList = []
        }
      },
      searchRoomList () {
        request(urlMap.room.pageList).then(res => {
          this.roomList = res.data.pageList || []
        })
      },
      searchBedTree () {
        request(urlMap.bed.getTree, this.id ? {diagnosisAreaId: this.id} : {}).then(res => {
          if (res.head.errCode === 0) {
            this.bedOptions = res.data
            this.bedDataList = convertTreeToList(this.bedOptions)
            this.treeSearched = true
            this.doSortList()
          }
        })
      },
      searchSeatTree () {
        request(urlMap.seat.getTree, this.id ? {diagnosisAreaId: this.id} : {}).then(res => {
          if (res.head.errCode === 0) {
            this.seatOptions = res.data
            this.seatDataList = convertTreeToList(this.seatOptions)
            this.seatTreeSearched = true
            this.doSortSeatList()
          }
        })
      },
      search () {
        request(urlMap.diagnosisArea.getById, {id: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.tsDiagnosisAreaOrgSubjectDTOList && this.form.tsDiagnosisAreaOrgSubjectDTOList.length) {
              this.form.tsDiagnosisAreaOrgSubjectDTOList = this.form.tsDiagnosisAreaOrgSubjectDTOList.map(item => getObjByIncludes(item, ['orgSubjectId', 'orgSubjectCode', 'orgSubjectName']))
              this.$refs.ss.setValue(this.form.tsDiagnosisAreaOrgSubjectDTOList)
            }
            if (this.form.tsDiagnosisAreaBedDTOList) {
              // todo 先对该list进行排序，再赋值，否则会出现问题
              this.bedDTOListSearched = true
              this.doSortList()
            }
            if (this.form.tsDiagnosisAreaSeatDTOList) {
              // todo 先对该list进行排序，再赋值，否则会出现问题
              this.seatDTOListSearched = true
              this.doSortSeatList()
            }
          }
        })
      },
      doSortList () {
        if (this.treeSearched && this.bedDTOListSearched) {
          const sortedList = sortListByTree(this.bedOptions, this.form.tsDiagnosisAreaBedDTOList)
          this.form.tsDiagnosisAreaBedDTONameList = sortedList.map(item => item.bedId)
        }
      },
      doSortSeatList () {
        if (this.seatTreeSearched && this.seatDTOListSearched) {
          const sortedList = sortListByTree(this.seatOptions, this.form.tsDiagnosisAreaSeatDTOList, 'seatId')
          this.form.tsDiagnosisAreaSeatDTONameList = sortedList.map(item => item.seatId)
        }
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            if (params.tsDiagnosisAreaRoomDTOList && params.tsDiagnosisAreaRoomDTOList.length) {
              params.tsDiagnosisAreaRoomDTOList = params.tsDiagnosisAreaRoomDTOList.map(item => ({
                roomId: item.id,
                roomCode: item.roomCode,
                roomName: item.roomName,
              }))
            } else {
              params.tsDiagnosisAreaRoomDTOList = []
            }
            if (params.tsDiagnosisAreaBedDTOList && params.tsDiagnosisAreaBedDTOList.length) {
              params.tsDiagnosisAreaBedDTOList = params.tsDiagnosisAreaBedDTOList.map(item => ({
                bedId: item.bedId,
                bedCode: item.bedCode,
                bedName: item.bedName,
              }))
            } else {
              params.tsDiagnosisAreaBedDTOList = []
            }
            if (params.tsDiagnosisAreaSeatDTOList && params.tsDiagnosisAreaSeatDTOList.length) {
              params.tsDiagnosisAreaSeatDTOList = params.tsDiagnosisAreaSeatDTOList.map(item => ({
                seatId: item.seatId,
                seatCode: item.seatCode,
                seatName: item.seatName,
              }))
            } else {
              params.tsDiagnosisAreaSeatDTOList = []
            }
            if (!params.tsDiagnosisAreaOrgSubjectDTOList) {
              params.tsDiagnosisAreaOrgSubjectDTOList = []
            }
            request(urlMap.diagnosisArea[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({name: 'building-diagnosisArea-list'})
              }
            })
          }
        })
      },
    },
  }
</script>
