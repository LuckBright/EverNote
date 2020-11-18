<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/bed/list"></ever-bread-crumb>
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
        <template slot="bedType">
          <el-select v-model="form.bedType" value-key="id" class="w">
            <el-option
              v-for="item in bedTypeList" :key="item.id" :label="item.bedTypeName"
              :value="item"></el-option>
          </el-select>
        </template>
        <template slot="room">
          <el-select v-model="form.room" value-key="roomCode" class="w">
            <el-option
              v-for="item in roomList" :key="item.roomCode" :label="item.roomName"
              :value="item"></el-option>
          </el-select>
        </template>
        <template slot="tsBedConfigureDTOList">
          <sys-type
            code="THC_WH_CWPZ" v-model="form.tsBedConfigureDTOList" :multiple="true" :use-object="true"
            :obj-simple="true"></sys-type>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import { request } from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import { bedSchema, bedRules } from '@/warehouse/page/building/views/bed/model'
  import '@/warehouse/page/building/assets/index.less'

  const schema = bedSchema
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.bedStatus = {
        code: '01',
        name: '有效'
      }
      return {
        schema,
        form,
        rules: bedRules,
        id: null,
        type: '',
        roomList: [],
        bedTypeList: [],
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
      this.searchBedTypeList()
    },
    methods: {
      searchRoomList () {
        request(urlMap.room.pageList).then(res => {
          this.roomList = (res.data.pageList || []).map(item => ({...item, roomId: item.id}))
        })
      },
      searchBedTypeList () {
        request(urlMap.bedType.pageList).then(res => {
          this.bedTypeList = res.data.pageList || []
        })
      },
      search () {
        request(urlMap.bed.getById, { id: this.id }).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.roomCode) {
              this.form.room = {
                roomCode: this.form.roomCode,
                roomName: this.form.roomName,
                roomId: this.form.roomId,
              }
            }
            if (this.form.bedTypeCode) {
              this.form.bedType = {
                code: this.form.bedTypeCode,
                name: this.form.bedTypeName,
              }
            }
            if (this.form.bedStatusCode) {
              this.form.bedStatus = {
                code: this.form.bedStatusCode,
                name: this.form.bedStatusName,
              }
            }
            if (this.form.bedPositionCode) {
              // this.form.bedPosition = {
              //   code: this.form.bedPositionCode,
              //   name: this.form.bedPositionName,
              // }
            }
            if (this.form.tsBedConfigureDTOList) {
              this.form.tsBedConfigureDTOList = this.form.tsBedConfigureDTOList.map(item => ({
                code: item.bedConfigureCode,
                name: item.bedConfigureName,
              }))
            }
            if (this.form.bedTypeId) {
              this.form.bedType = {
                id: this.form.bedTypeId,
                bedTypeName: this.form.bedTypeName,
              }
            }
          }
        })
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            params.bedName = params.bedCode
            if (params.bedType) {
              params.bedTypeCode = params.bedType.code
              params.bedTypeName = params.bedType.name
            }
            if (params.bedStatus) {
              params.bedStatusCode = params.bedStatus.code
              params.bedStatusName = params.bedStatus.name
            }
            // if (params.bedPosition) {
            //   params.bedPositionCode = params.bedPosition.code
            //   params.bedPositionName = params.bedPosition.name
            // }
            if (params.room) {
              params.roomCode = params.room.roomCode
              params.roomName = params.room.roomName
              params.roomId = params.room.roomId
            }
            if (params.bedType) {
              params.bedTypeId = params.bedType.id
              params.bedTypeName = params.bedType.bedTypeName
            }
            params.tsBedConfigureDTOList = params.tsBedConfigureDTOList.map(item => ({
              bedConfigureCode: item.code,
              bedConfigureName: item.name,
            }))
            delete params.bedPosition
            delete params.bedStatus
            delete params.bedType
            delete params.room
            request(urlMap.bed[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({ name: 'building-bed-list' })
              }
            })
          }
        })
      },
    },
  }
</script>
