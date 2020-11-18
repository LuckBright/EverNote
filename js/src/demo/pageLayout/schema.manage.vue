<template>
  <div class="schema-manage">
    <ever-bread-crumb name="批量编辑开单属性" path="/demo/layout/schema"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="search-box">
        <el-input v-model="tplName" class="tpl-name" clearabled placeholder="模版名称"></el-input>
        <el-input v-model="filterObj.code" class="tpl-name" clearabled placeholder="code"></el-input>
        <el-input v-model="filterObj.name" class="tpl-name" clearabled placeholder="字段名"></el-input>
        <el-input v-model="filterObj.valueUrl" class="tpl-name" clearabled placeholder="valueUrl"></el-input>
        <el-input v-model="filterObj.valueSetCode" class="tpl-name" clearabled placeholder="valueSetCode"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
        <el-select v-model="contentType" class="content-type">
          <el-option key="no" label="不显示" value="no"></el-option>
          <el-option key="schema" label="schema" value="schema"></el-option>
          <el-option key="form" label="form" value="form"></el-option>
          <el-option key="schemaValue" label="schemaValue" value="schemaValue"></el-option>
        </el-select>
      </div>
      <div class="form-content" v-for="(item,index) in schemaList" :key="index">
        <span class="title-name">{{list[index].name}}</span>
        <p v-show="contentType === 'schemaValue'">{{list[index].schemaValue}}</p>
        <p v-show="contentType === 'schema'">{{JSON.stringify(item)}}</p>
        <ever-form2
          v-if="contentType === 'form'"
          class="schema-form"
          :schema="schemaList[index]"
          :rules="{}"
          label-position="top"
          label-width="80px"
          :nosubmit="true"
          :gutter="10"
          :inline="true"
          :validateOnRuleChange="false"
          size="small"
        ></ever-form2>
      </div>
      <div class="editor-box">
        <div class="out">
          <el-input placeholder="请输入内容" v-model="outEditor">
            <el-select
              class="input-select"
              v-model="outSeletName"
              slot="prepend"
              placeholder="请选择"
              filterable
              allow-create
              clearable
            >
              <el-option v-for="item in selectList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-input>
        </div>
        <div class="property-object">
          <el-input placeholder="请输入内容" v-model="propertyEditor">
            <el-select
              class="input-select"
              v-model="propertySeletName"
              slot="prepend"
              placeholder="请选择"
              filterable
              allow-create
              clearable
            >
              <el-option v-for="item in propertyList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-input>
        </div>
        <div class="field-object">
          <el-input placeholder="请输入内容" v-model="fieldEditor">
            <el-select
              class="input-select"
              v-model="fieldSeletName"
              slot="prepend"
              placeholder="请选择"
              filterable
              allow-create
              clearable
            >
              <el-option v-for="item in fieldList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-input>
        </div>
        <el-button type="primary" @click="editor">编辑</el-button>
      </div>
      <div class="add-box">
        <el-form ref="addForm" :mode="addForm">
          
        </el-form>
        <el-button type="primary" @click="add">添加</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { sob as axios } from '@/sob/store/api'
import { objFind } from '@/util/common'
import { createSchemaByItems } from '@/util/formcustom'
// import { merge } from 'lodash'

export default {
  data () {
    return {
      tplName: '住院',
      filterObj: {
        code: '',
        name: '',
        valueUrl: '',
        valueSetCode: ''
      },
      list: [],
      schemaList: [],
      contentType: 'no',
      outSeletName: '',
      outEditor: '',
      selectList: ['isDelete', 'isMust', 'display', 'lineNumber'],
      propertyEditor: '',
      propertySeletName: '',
      propertyList: ['code', 'name', 'proportion', 'type'],
      fieldEditor: '',
      fieldSeletName: '',
      fieldList: [],
      addForm: {
        code: '',
        name: '',
        type: '',

      }
    }
  },
  methods: {
    async search () {
      let params = {
        offset: 0,
        page: 1,
        pagesize: 1000,
        name: this.tplName
      }
      let res = await this.getSchemaList(params)
      if (res && res.length) {
        let list = []
        let schemaList = []
        list = res.filter(item => {
          let obj = {}
          let schemaValue = JSON.parse(item.schemaValue)
          for (let i in this.filterObj) {
            if (this.filterObj[i]) {
              obj[i] = this.filterObj[i]
            }
          }
          return objFind(schemaValue, {propertyObject: obj})
        })
        schemaList = list.map(item => {
          let schemaValue = JSON.parse(item.schemaValue)
          return createSchemaByItems(schemaValue).schema
        })
        this.list = list
        this.schemaList = schemaList
        console.log(this.list, this.schemaList)
      } else {
        this.list = []
      }
    },
    getSchemaList (params) {
      return axios.post('healthServiceTemplate/search', params).then(res => {
        if (res.data && res.data.resultList.length) {
          return res.data.resultList
        }
        return false
      }).catch(err => {
        console.error('healthServiceTemplate/update/', err)
      })
    },
    editor () {
      console.log('editor')
    },
    add () {
      console.log('add')
    }
  },
}
</script>
<style lang="scss" scoped>
  .schema-manage {
    .tpl-name {
      width: 200px;
    }
    .content-type {
      width: 110px;
    }
    .form-content {
      margin-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
      .title-name {
        font-size: 15px;
        font-weight: 700;
      }
      p {
        font-size: 14px;
      }
      .schema-form {
        margin-top: 10px;
      }
    }
    .add-box,.editor-box {
      margin-top: 50px;
    }
    .property-object,.field-object,.out {
      display: inline-block;
      width: 300px;
      .input-select {
        width: 100px;
      }
    }
  }
</style>>
