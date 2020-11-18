<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/seatType/list"></ever-bread-crumb>
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
        <template slot="tsSeatTypeItemDTOList">
          <el-select
            class="w"
            v-model="form.tsSeatTypeItemDTOList"
            multiple
            filterable
            remote
            :reserve-keyword="false"
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            value-key="serviceId"
            :loading="loading">
            <el-option
              v-for="item in itemOptions"
              :key="item.serviceId"
              :label="item.serviceName"
              :value="item">
            </el-option>
          </el-select>
        </template>
        <template slot="tsSeatDTOList">
          <el-col class="seat-list-box">
            <div>座位数量：{{seatFormList.length}}</div>
            <ever-form2
              v-for="(seatForm,index) in seatFormList"
              :ref="'seatForm' + seatForm.index"
              v-model="seatForm.form"
              :schema="seatForm.schema"
              :rules="seatForm.seatRules"
              :inline="true"
              :is-query="true"
              :key="seatForm.index"
            >
              <template slot="default">
                <el-form-item>
                  <el-button icon="el-icon-plus" v-if="index === seatFormList.length - 1" @click="addSeatForm(seatForm.index)"></el-button>
                  <el-button icon="el-icon-minus" v-if="index !== 0" @click="minusSeatForm(seatForm.index)"></el-button>
                </el-form-item>
              </template>
              <template slot="room">
                <el-select v-model="seatForm.form.room" value-key="roomCode"
                           clearable
                           filterable
                           class="w">
                  <el-option
                    v-for="(item,index) in roomList" :key="index" :label="item.roomName"
                    :value="item"></el-option>
                </el-select>
              </template>
              <template slot="tsSeatConfigureDTOList">
                <sys-type
                  code="THC_WH_ZWPZ" v-model="seatForm.form.tsSeatConfigureDTOList" :multiple="true" :use-object="true"
                  :obj-simple="true"></sys-type>
              </template>
            </ever-form2>
          </el-col>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import { request } from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import { seatTypeSchema, seatTypeRules } from '@/warehouse/page/building/views/seat/model'
  import '@/warehouse/page/building/assets/index.less'

  const schema = seatTypeSchema
  const seatRules = {
    seatCode: [{required: true, message: '必填项', trigger: 'change'}],
    seatStatus: [{required: true, message: '必填项', trigger: 'change'}],
    room: [{required: true, message: '必填项', trigger: 'change'}],
  }
  const seatSchema = [
    {
      name: 'seatCode',
      label: '座位编号',
    },
    {
      name: 'seatStatus',
      label: '座位状态',
      span: 12,
      comp: 'sys-type',
      props: {
        code: 'THC_WH_CWZT',
        useObject: true,
        objSimple: true
      }
    },
    {
      name: 'room',
      label: '房间名称',
      comp: 'custom',
    },
    {
      name: 'tsSeatConfigureDTOList',
      label: '座位配置',
      comp: 'custom',
    }
  ]
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.status = 1
      form.tsSeatTypeItemDTOList = []
      const seatForm = this.$ever.createObjFromSchema(seatSchema)
      seatForm.seatStatus = {
        code: '01',
        name: '有效'
      }
      return {
        schema,
        form,
        rules: seatTypeRules,
        id: null,
        type: '',
        roomList: [],
        deletedIdList: [],
        seatFormList: [
          {
            form: seatForm,
            schema: seatSchema,
            seatRules,
            index: 0,
          }
        ],
        itemOptions: [],
        loading: false,
        searched: false,
        itemSearched: false,
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
      this.searchItems()
    },
    methods: {
      // 查询收费项目
      searchItems (name) {
        this.loading = true
        request(urlMap.seatType.queryItem, {
          offset: 0,
          pageSize: 20,
          name,
        }).then(res => {
          if (res.head.errCode === 0) {
            this.loading = false
            // 每次赋值，都应该是，已选的值和查询出来的值的合并结果
            // this.itemOptions = res.data.pageList
            const list = res.data.pageList
            const result = []
            for (const item of this.form.tsSeatTypeItemDTOList) {
              if (!list.some(l => l.serviceId === item.serviceId)) {
                result.push(item)
              }
            }
            this.itemOptions = [...result, ...list]
            this.itemSearched = true
            this.mergeItemOptions()
          }
        })
      },
      searchRoomList () {
        request(urlMap.room.pageList).then(res => {
          this.roomList = (res.data.pageList || []).map(item => ({...item, roomId: item.id}))
        })
      },
      mergeItemOptions () {
        if (this.itemSearched && this.searched) {
          // 先判断，再合并
          const needMergeList = this.form.tsSeatTypeItemDTOList.filter(item => {
            return !this.itemOptions.some(option => option.serviceId === item.serviceId)
          })
          if (needMergeList.length) {
            this.itemOptions = this.itemOptions.concat(needMergeList || [])
          }
        }
      },
      search () {
        request(urlMap.seatType.getById, { id: this.id }).then(res => {
          this.deletedIdList = []
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            this.searched = true
            this.mergeItemOptions()
            if (this.form.seatLevelCode) {
              this.form.seatLevel = {
                code: this.form.seatLevelCode,
                name: this.form.seatLevelName,
              }
            }
            if (this.form.fitPeopleCode) {
              this.form.fitPeople = {
                code: this.form.fitPeopleCode,
                name: this.form.fitPeopleName,
              }
            }
            if (this.form.tsSeatDTOList && this.form.tsSeatDTOList.length) {
              this.seatFormList = this.form.tsSeatDTOList.map((item, index) => {
                const formValue = {
                  id: item.id,
                  orderNumber: item.orderNumber,
                  seatCode: item.seatCode,
                  seatStatus: {
                    code: item.seatStatusCode,
                    name: item.seatStatusName,
                  },
                  room: {
                    roomCode: item.roomCode,
                    roomName: item.roomName,
                    roomId: item.roomId,
                  },
                  tsSeatConfigureDTOList: (item.tsSeatConfigureDTOList || []).map(conf => {
                    return {
                      code: conf.seatConfigureCode,
                      name: conf.seatConfigureName,
                    }
                  })
                }
                return {
                  schema: seatSchema,
                  form: Object.assign(this.$ever.createObjFromSchema(seatSchema), formValue),
                  seatRules,
                  index,
                }
              })
            }
          }
        })
      },
      save () {
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            // 判断是否每一个座位表单是否符合要求
            Promise.all(this.seatFormList.map((item) => {
              return this.$refs['seatForm' + item.index][0].$refs.form.validate()
            })).then(validList => {
              if (validList.every(valid => !!valid)) {
                const params = Object.assign({}, this.form)
                if (params.seatLevel) {
                  params.seatLevelCode = params.seatLevel.code
                  params.seatLevelName = params.seatLevel.name
                }
                if (params.fitPeople) {
                  params.fitPeopleCode = params.fitPeople.code
                  params.fitPeopleName = params.fitPeople.name
                }
                // 判断座位code是否有重复的
                const tempObj = {}
                for (let i = 0; i < this.seatFormList.length; i++) {
                  const item = this.seatFormList[i]
                  if (tempObj[item.form.seatCode]) {
                    this.$messageTips(this, 'error', '座位有重复的code：' + item.form.seatCode)
                    return
                  } else {
                    tempObj[item.form.seatCode] = 1
                  }
                }
                params.tsSeatDTOList = this.seatFormList.map(seatForm => {
                  const form = seatForm.form
                  return {
                    ...(form.id ? {id: form.id} : {}),
                    orderNumber: form.orderNumber || '',
                    seatCode: form.seatCode,
                    seatName: form.seatCode,
                    seatStatusCode: form.seatStatus.code,
                    seatStatusName: form.seatStatus.name,
                    roomCode: form.room.roomCode,
                    roomName: form.room.roomName,
                    roomId: form.room.roomId,
                    tsSeatConfigureDTOList: (form.tsSeatConfigureDTOList || []).map(item => ({
                      seatConfigureCode: item.code,
                      seatConfigureName: item.name,
                    }))
                  }
                })
                params.deletedIdList = this.deletedIdList
                delete params.seatLevel
                delete params.fitPeople
                // console.log(this.form)
                // console.log(this.seatFormList)
                request(urlMap.seatType[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
                  if (res.head.errCode === 0) {
                    this.$messageTips(this, 'success', '保存成功')
                    this.$router.push({ name: 'building-seatType-list' })
                  }
                })
              }
            })
          }
        })
      },
      addSeatForm (index) {
        const seatForm = this.$ever.createObjFromSchema(seatSchema)
        seatForm.seatStatus = {
          code: '01',
          name: '有效'
        }
        this.seatFormList.push({
          index: index + 1,
          form: seatForm,
          schema: seatSchema,
          seatRules,
        })
      },
      minusSeatForm (index) {
        const delItem = this.seatFormList.find(item => item.index === index)
        if (delItem && delItem.form.id) {
          this.deletedIdList.push(delItem.form.id)
        }
        this.seatFormList = this.seatFormList.filter(item => item.index !== index)
      },
      remoteMethod (name) {
        if (name !== '') {
          this.searchItems(name)
        } else {
          this.itemOptions = []
        }
      },
    },
  }
</script>
