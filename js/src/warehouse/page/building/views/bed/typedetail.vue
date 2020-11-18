<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/bedType/list"></ever-bread-crumb>
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
        <template slot="tsBedTypeItemDTOList">
          <el-select
            class="w"
            v-model="form.tsBedTypeItemDTOList"
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
        <template slot="tsBedDTOList">
          <el-col class="bed-list-box">
            <div>床位数量：{{bedFormList.length}}</div>
            <ever-form2
              v-for="(bedForm,index) in bedFormList"
              :ref="'bedForm' + bedForm.index"
              v-model="bedForm.form"
              :schema="bedForm.schema"
              :rules="bedForm.bedRules"
              :inline="true"
              :is-query="true"
              :key="bedForm.index"
            >
              <template slot="default">
                <el-form-item>
                  <el-button icon="el-icon-plus" v-if="index === bedFormList.length - 1" @click="addBedForm(bedForm.index)"></el-button>
                  <el-button icon="el-icon-minus" v-if="index !== 0" @click="minusBedForm(bedForm.index)"></el-button>
                </el-form-item>
              </template>
              <template slot="room">
                <el-select v-model="bedForm.form.room" value-key="roomCode"
                           clearable
                           filterable
                           class="w">
                  <el-option
                    v-for="(item,index) in roomList" :key="index" :label="item.roomName"
                    :value="item"></el-option>
                </el-select>
              </template>
              <template slot="tsBedConfigureDTOList">
                <sys-type
                  code="THC_WH_CWPZ" v-model="bedForm.form.tsBedConfigureDTOList" :multiple="true" :use-object="true"
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
  import { bedTypeSchema, bedTypeRules } from '@/warehouse/page/building/views/bed/model'
  import '@/warehouse/page/building/assets/index.less'

  const schema = bedTypeSchema
  const bedRules = {
    bedCode: [{required: true, message: '必填项', trigger: 'change'}],
    bedStatus: [{required: true, message: '必填项', trigger: 'change'}],
    room: [{required: true, message: '必填项', trigger: 'change'}],
  }
  const bedSchema = [
    {
      name: 'bedCode',
      label: '床位编号',
    },
    {
      name: 'bedStatus',
      label: '床位状态',
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
      name: 'tsBedConfigureDTOList',
      label: '床位配置',
      comp: 'custom',
    }
  ]
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      form.status = 1
      form.tsBedTypeItemDTOList = []
      const bedForm = this.$ever.createObjFromSchema(bedSchema)
      bedForm.bedStatus = {
        code: '01',
        name: '有效'
      }
      return {
        schema,
        form,
        rules: bedTypeRules,
        id: null,
        type: '',
        roomList: [],
        deletedIdList: [],
        bedFormList: [
          {
            form: bedForm,
            schema: bedSchema,
            bedRules,
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
        request(urlMap.bedType.queryItem, {
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
            for (const item of this.form.tsBedTypeItemDTOList) {
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
          const needMergeList = this.form.tsBedTypeItemDTOList.filter(item => {
            return !this.itemOptions.some(option => option.serviceId === item.serviceId)
          })
          if (needMergeList.length) {
            this.itemOptions = this.itemOptions.concat(needMergeList || [])
          }
        }
      },
      search () {
        request(urlMap.bedType.getById, { id: this.id }).then(res => {
          this.deletedIdList = []
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            this.searched = true
            this.mergeItemOptions()
            if (this.form.bedLevelCode) {
              this.form.bedLevel = {
                code: this.form.bedLevelCode,
                name: this.form.bedLevelName,
              }
            }
            if (this.form.fitPeopleCode) {
              this.form.fitPeople = {
                code: this.form.fitPeopleCode,
                name: this.form.fitPeopleName,
              }
            }
            if (this.form.tsBedDTOList && this.form.tsBedDTOList.length) {
              this.bedFormList = this.form.tsBedDTOList.map((item, index) => {
                const formValue = {
                  id: item.id,
                  orderNumber: item.orderNumber,
                  bedCode: item.bedCode,
                  bedStatus: {
                    code: item.bedStatusCode,
                    name: item.bedStatusName,
                  },
                  room: {
                    roomCode: item.roomCode,
                    roomName: item.roomName,
                    roomId: item.roomId,
                  },
                  tsBedConfigureDTOList: (item.tsBedConfigureDTOList || []).map(conf => {
                    return {
                      code: conf.bedConfigureCode,
                      name: conf.bedConfigureName,
                    }
                  })
                }
                return {
                  schema: bedSchema,
                  form: Object.assign(this.$ever.createObjFromSchema(bedSchema), formValue),
                  bedRules,
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
            // 判断是否每一个床位表单是否符合要求
            Promise.all(this.bedFormList.map((item) => {
              return this.$refs['bedForm' + item.index][0].$refs.form.validate()
            })).then(validList => {
              if (validList.every(valid => !!valid)) {
                const params = Object.assign({}, this.form)
                if (params.bedLevel) {
                  params.bedLevelCode = params.bedLevel.code
                  params.bedLevelName = params.bedLevel.name
                }
                if (params.fitPeople) {
                  params.fitPeopleCode = params.fitPeople.code
                  params.fitPeopleName = params.fitPeople.name
                }
                // 判断床位code是否有重复的
                const tempObj = {}
                for (let i = 0; i < this.bedFormList.length; i++) {
                  const item = this.bedFormList[i]
                  if (tempObj[item.form.bedCode]) {
                    this.$messageTips(this, 'error', '床位有重复的code：' + item.form.bedCode)
                    return
                  } else {
                    tempObj[item.form.bedCode] = 1
                  }
                }
                params.tsBedDTOList = this.bedFormList.map(bedForm => {
                  const form = bedForm.form
                  return {
                    ...(form.id ? {id: form.id} : {}),
                    orderNumber: form.orderNumber || '',
                    bedCode: form.bedCode,
                    bedName: form.bedCode,
                    bedStatusCode: form.bedStatus.code,
                    bedStatusName: form.bedStatus.name,
                    roomCode: form.room.roomCode,
                    roomName: form.room.roomName,
                    roomId: form.room.roomId,
                    tsBedConfigureDTOList: (form.tsBedConfigureDTOList || []).map(item => ({
                      bedConfigureCode: item.code,
                      bedConfigureName: item.name,
                    }))
                  }
                })
                params.deletedIdList = this.deletedIdList
                delete params.bedLevel
                delete params.fitPeople
                // console.log(this.form)
                // console.log(this.bedFormList)
                request(urlMap.bedType[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
                  if (res.head.errCode === 0) {
                    this.$messageTips(this, 'success', '保存成功')
                    this.$router.push({ name: 'building-bedType-list' })
                  }
                })
              }
            })
          }
        })
      },
      addBedForm (index) {
        const bedForm = this.$ever.createObjFromSchema(bedSchema)
        bedForm.bedStatus = {
          code: '01',
          name: '有效'
        }
        this.bedFormList.push({
          index: index + 1,
          form: bedForm,
          schema: bedSchema,
          bedRules,
        })
      },
      minusBedForm (index) {
        // 删除前先做提示
        const delItem = this.bedFormList.find(item => item.index === index)
        if (delItem.currentStatus === 1) {
          this.$message({
            type: 'error',
            message: '该床位已存在患者，暂不允许删除'
          })
          return
        }
        if (delItem && delItem.form.id) {
          this.deletedIdList.push(delItem.form.id)
        }
        this.bedFormList = this.bedFormList.filter(item => item.index !== index)
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
