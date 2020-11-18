<template>
  <div>
    <ever-bread-crumb :name="type === 'create' ? '创建' : '编辑'" path="/warehouse/building/sickArea/list"></ever-bread-crumb>
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
        <template slot="tsSickAreaBedDTONameList">
<!--          <el-select class="w" v-model="form.tsSickAreaBedDTOList" value-key="bedCode" multiple>-->
<!--            <el-option v-for="item in bedList" :key="item.bedCode" :label="item.bedName"-->
<!--                       :value="item"></el-option>-->
<!--          </el-select>-->
          <el-cascader
            class="w"
            v-if="refreshFlag"
            v-model="form.tsSickAreaBedDTONameList"
            :options="bedOptions"
            :show-all-levels="false"
            :props="cascaderProps"
            filterable
            @remove-tag="removeTag"
            @change="changeBed"
          ></el-cascader>
        </template>
        <template slot="tsSickAreaOrgSubjectDTOList">
<!--          只查询住院科室-->
          <ever-subject-select ref="ss" v-model="form.tsSickAreaOrgSubjectDTOList" multiple type="cascader"
            :params="params" use-org is-manage :fields="['id',
          'orgSubjectCode',
          'orgSubjectName',
          'tenantSubjectCode',
          'tenantSubjectName']"></ever-subject-select>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
  import {request} from '@/util/req'
  import urlMap from '@/warehouse/page/building/utils/urls'
  import {sickAreaSchema, sickAreaRules} from '@/warehouse/page/building/views/sickarea/model'
  import '@/warehouse/page/building/assets/index.less'
  import {sortListByTree} from '@/manages/page/organization/utils/fns'
  const schema = sickAreaSchema
  export default {
    data () {
      const form = this.$ever.createObjFromSchema(schema)
      return {
        refreshFlag: true,
        // removeTsBedIdList: [],
        originBedDTOList: [],
        schema,
        form,
        rules: sickAreaRules,
        id: null,
        type: '',
        bedList: [],
        bedOptions: [],
        params: {type2CodeList: ['01.01']},
        cascaderProps: {
          multiple: true,
          value: 'id',
          label: 'name',
          emitPath: false,
        },
        bedDTOListSearched: false,
        treeSearched: false,
      }
    },
    created () {
      this.id = this.$route.params.id
      this.type = this.$route.params.type
      if (this.type === 'create') {
      } else {
        this.search()
      }
      this.searchBedList()
    },
    methods: {
      searchBedList () {
        request(urlMap.bed.pageList).then(res => {
          if (res.head.errCode === 0) {
            this.bedList = res.data.pageList
          }
        })
        request(urlMap.bed.getTree, this.id ? {sickAreaId: this.id} : {}).then(res => {
          if (res.head.errCode === 0) {
            this.bedOptions = res.data
            this.treeSearched = true
            this.doSortList()
          }
        })
      },
      search () {
        request(urlMap.sickArea.getById, {id: this.id}).then(res => {
          if (res.head.errCode === 0) {
            this.form = Object.assign({}, this.form, res.data)
            if (this.form.specialFlagCode) {
              this.form.specialFlag = {
                code: this.form.specialFlagCode,
                name: this.form.specialFlagName,
              }
            }
            // if (this.form.tsSickAreaBedDTOList) {
            //   this.form.tsSickAreaBedDTOList = this.form.tsSickAreaBedDTOList.map(item => ({
            //     id: item.bedId,
            //     bedName: item.bedCode
            //   }))
            // }
            // if (this.form.tsSickAreaOrgSubjectDTOList) {
            //   this.form.tsSickAreaOrgSubjectDTOList = this.form.tsSickAreaOrgSubjectDTOList.map(item => getObjByIncludes(item, ['orgSubjectId', 'orgSubjectCode', 'orgSubjectName']))
            //   this.$refs.ss.setValue(this.form.tsSickAreaOrgSubjectDTOList)
            // }
            if (this.form.tsSickAreaBedDTOList) {
              this.originBedDTOList = this.form.tsSickAreaBedDTOList.slice(0)
              // todo 先对该list进行排序，再赋值，否则会出现问题
              this.bedDTOListSearched = true
              this.doSortList()
              // this.form.tsSickAreaBedDTONameList = this.form.tsSickAreaBedDTOList.map(item => item.bedId)
            }
          }
        })
      },
      doSortList () {
        if (this.treeSearched && this.bedDTOListSearched) {
          const sortedList = sortListByTree(this.bedOptions, this.form.tsSickAreaBedDTOList)
          this.form.tsSickAreaBedDTONameList = sortedList.map(item => item.bedId)
        }
      },
      save () {
        // 找到用户删除了哪些床位
        let removeTsBedList = this.originBedDTOList.filter(item => !(this.form.tsSickAreaBedDTOList || []).some(b => b.bedId === item.bedId))
        const removeTsBedIdList = removeTsBedList.map(item => item.bedId)
        const removedBed = removeTsBedList.find(item => item.currentStatus === 1)
        if (removedBed) {
          this.$messageTips(this, 'error', '您刚刚移除的床位【' + removedBed.bedName + '】已被使用')
          return
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            const params = Object.assign({}, this.form)
            if (params.specialFlag) {
              params.specialFlagCode = params.specialFlag.code
              params.specialFlagName = params.specialFlag.name
            }
            if (params.tsSickAreaBedDTOList && params.tsSickAreaBedDTOList.length) {
              params.tsSickAreaBedDTOList = params.tsSickAreaBedDTOList.map(item => ({
                bedId: item.bedId,
                bedCode: item.bedCode,
                bedName: item.bedName,
              }))
            } else {
              params.tsSickAreaBedDTOList = []
            }
            if (!params.tsSickAreaOrgSubjectDTOList) {
              params.tsSickAreaOrgSubjectDTOList = []
            }
            params.removeTsBedIdList = removeTsBedIdList
            delete params.tsSickAreaBedDTONameList
            request(urlMap.sickArea[this.type === 'edit' ? 'update' : 'insert'], params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '保存成功')
                this.$router.push({name: 'building-sickArea-list'})
              }
            })
          }
        })
      },
      removeTag (bedId) {
        const removedBed = this.originBedDTOList.find(item => item.bedId === bedId)
        // if (removedBed) {
        //   this.removeTsBedIdList.push(bedId)
        //   if (removedBed.currentStatus === 1) {
        //     this.$messageTips(this, 'error', '您刚刚移除的床位【' + removedBed.bedName + '】已被使用，移除后，保存按钮将不可使用。')
        //   }
        // }
        // this.removeTsBedIdList.push(bedId)
        // 自动将移除的床位加回来，遇到一个小问题，最后一个加回来时失败了
        if (removedBed && removedBed.currentStatus === 1) {
          this.$confirm('您刚刚移除的床位【' + removedBed.bedName + '】已被使用，移除后，保存按钮将不可使用。是否要将其再次加入到关联床位中?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.removeTsBedIdList.pop()
            this.form.tsSickAreaBedDTONameList.push(bedId)
            const sortedList = sortListByTree(this.bedOptions, this.form.tsSickAreaBedDTONameList.map(item => ({bedId: item})))
            this.form.tsSickAreaBedDTONameList = sortedList.map(item => item.bedId)
            this.doChangeBed(this.form.tsSickAreaBedDTONameList)
            this.refreshFlag = false
            setTimeout(() => {
              this.refreshFlag = true
            })
          }).catch(() => {})
        }
      },
      doChangeBed (value) {
        this.form.tsSickAreaBedDTOList = value.map(item => {
          const bedItem = this.bedList.find(bed => bed.id === item)
          if (bedItem) {
            return {
              ...bedItem,
              bedId: bedItem.id,
            }
          }
        })
      },
      changeBed (value) {
        if (value && value.length) {
          this.doChangeBed(value)
          // this.form.tsSickAreaBedDTOList = value.map(item => {
          //   const bedItem = this.bedList.find(bed => bed.id === item)
          //   if (bedItem) {
          //     return {
          //       ...bedItem,
          //       bedId: bedItem.id,
          //     }
          //   }
          // })
        } else {
          this.form.tsSickAreaBedDTOList = []
        }
      },
    },
  }
</script>
