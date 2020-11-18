<template>
  <div class="bg">
    <el-row class="pd">
      <div v-if="isEdit">
        <ever-form2 :schema="schema" v-model="obj" :api="api" ref="form" label-position="right">
          <div slot="default"></div>
          <template slot="objLabelList">
            <div v-if="obj.member && obj.member.objLabelList.length > 0">
              <el-tag
                class="mr5"
                v-for="(tag, i) in obj.member.objLabelList"
                :key="i"
                :disable-transitions="false"
              >{{tag.labelName || ''}}</el-tag>
            </div>
          </template>
          <template slot="edit">
            <el-button type="text" @click="toEditPage">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
          </template>
        </ever-form2>
      </div>
      <div v-else>
        <ever-form2
          :schema="schema1"
          v-model="obj1"
          :api="api"
          label-position="right"
          @submit.native.prevent
        >
          <div slot="default"></div>
          <template slot="objLabelList">
            <el-tag
              class="mr5"
              v-for="(tag, i) in tags"
              :key="i"
              :closable="tag.systemFlag ? false : true"
              :disable-transitions="false"
              @close="removeTag(i)"
            >{{tag.labelName}}</el-tag>
            <el-autocomplete
              v-if="inputVisible"
              style="width: 200px;"
              class="input-new-tag"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              :fetch-suggestions="querySearch"
              :select-when-unmatched="true"
              @select="handleSelect"
            ></el-autocomplete>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
          </template>
          <div class="mgl120">
            <el-button @click="save">保存</el-button>
            <el-button @click="cancle">取消</el-button>
          </div>
        </ever-form2>
      </div>
    </el-row>
  </div>
</template>
<script>
import tagapi from '../store/tagapi'
import api from '../store/memberapi'
import utillist from '../../util/list'

let schema = [
  {
    name: 'objLabelList',
    label: '客户标签',
    comp: 'custom',
    span: 21
  },
  {
    name: 'edit',
    comp: 'custom',
    style: {
      height: '40px'
    },
    span: 3
  },
  {
    name: 'appointRemind',
    label: '预约提示',
    comp: 'readonlyitem',
    span: 24
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 24
  },
  {
    name: 'appointRemark',
    label: '预约备注',
    comp: 'readonlyitem',
    span: 24
  },
  {
    comp: 'div',
    style: {
      height: '40px'
    },
    span: 24
  },
  {
    name: 'internalRemark',
    label: '内部备注',
    comp: 'readonlyitem',
    span: 24
  }
]
let schema1 = [
  {
    name: 'objLabelList',
    label: '客户标签',
    span: 24,
    comp: 'custom'
  },
  {
    name: 'appointRemind',
    label: '预约提示',
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '备注',
      max: 200,
      minRows: 4,
      maxRows: 6
    },
    span: 12
  },
  {
    comp: 'div',
    style: {
      height: '80px'
    },
    span: 12
  },
  {
    name: 'appointRemark',
    label: '预约备注',
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '备注',
      max: 200,
      minRows: 4,
      maxRows: 6
    },
    span: 12
  },
  {
    comp: 'div',
    style: {
      height: '80px'
    },
    span: 12
  },
  {
    name: 'internalRemark',
    label: '内部备注',
    comp: 'el-input',
    props: {
      type: 'textarea',
      placeholder: '备注',
      max: 200,
      minRows: 4,
      maxRows: 6
    },
    span: 12
  },
  {
    comp: 'div',
    style: {
      height: '80px'
    },
    span: 12
  }
]
let querySchema = [
  {
    name: 'type',
    comp: 'ever-range-picker',
    label: '创建时间',
    span: 3
  },
  {
    name: 'status',
    label: '行为记录',
    span: 3
  }
]
export default {
  mixins: [utillist],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    let obj1 = this.$ever.createObjFromSchema(schema1)
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      tagapi,
      api,
      obj,
      obj1,
      schema,
      schema1,
      querySchema: querySchema,
      queryObj: queryObj,
      patientId: this.$route.params.patientId ? this.$route.params.patientId : null,
      isEdit: true,
      inputVisible: false,
      inputValue: '',
      tags: [],
      objLabelList: []
    }
  },
  created () {
    this.getPatientId()
  },
  methods: {
    getPatientId () {
      api.getBaseInfoById({ 'patientId': this.patientId, 'needIden': true }).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj1.id = rs.data.member && rs.data.member.id
          this.obj = rs.data
          this.obj1.appointRemind = rs.data.appointRemind
          this.obj1.appointRemark = rs.data.appointRemark
          this.obj1.internalRemark = rs.data.internalRemark
          if (rs.data.member && rs.data.member.objLabelList) {
            // console.log(rs.data.member.objLabelList, 'rs.data.member.objLabelList')
            this.tags = []
            this.objLabelList = []
            rs.data.member.objLabelList.map(v => {
              return this.tags.push({labelName: v.labelName, systemFlag: v.systemFlag}) && this.objLabelList.push(v)
            })
          }
        }
      })
    },
    toEditPage () {
      this.isEdit = false
      this.getPatientId()
    },
    save () {
      this.obj1.patient = {}
      this.obj1.patient['id'] = this.patientId
      this.obj1.patient['appointRemind'] = this.obj1.appointRemind
      this.obj1.patient['appointRemark'] = this.obj1.appointRemark
      this.obj1.patient['internalRemark'] = this.obj1.internalRemark
      this.obj1.objLabelList = this.objLabelList
      api.appendLabel(this.obj1).then(rs => {
        if (rs.head.errCode === 0) {
          this.isEdit = true
          this.getPatientId()
        }
      })
    },
    cancle () {
      this.tags = []
      this.isEdit = true
    },
    removeTag (index) {
      this.tags.splice(index, 1)
      this.objLabelList.splice(index, 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue.length > 20) {
        this.$messageTips(this, 'warning', '标签内容最多不超过20个字符')
      } else {
        if (inputValue) {
          if (this.tags.includes(inputValue)) {
            this.$messageTips(this, 'warning', '此标签已添加过，请勿重复添加')
            return false
          }
          this.tagapi.createOrGet({ 'name': inputValue }).then(rs => {
            this.tags.push({ labelName: rs.data.name, systemFlag: rs.data.systemFlag, labelId: rs.data.id })
            this.objLabelList.push({ labelId: rs.data.id, lableName: rs.data.name })
          })
          this.obj1.objLabelList = this.objLabelList ? this.objLabelList : []
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    },
    querySearch (queryString, cb) {
      let restaurants = this.restaurants
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.handleInputConfirm()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.restaurants = []
      this.tagapi.list({ highFrequency: 0, status: 0 }).then(rs => {
        if (rs && rs.data && rs.data.resultList) {
          rs.data.resultList.forEach(item => {
            if (item.typeId === 1) this.restaurants.push(item)
          })
        }
      })
    })
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
  min-height: 500px;
}
.pdl20 {
  padding-left: 20px;
}
</style>
