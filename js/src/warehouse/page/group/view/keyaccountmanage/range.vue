<template>
    <div>
        <el-tabs v-model="serviceIds.status" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="物资分类" name="first">
                <el-radio-group v-model="radio" @change="handleRadioChange">
                    <el-radio :label="1">全部分类</el-radio>
                    <el-radio :label="2">自定义分类</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="serviceIds.categoryIds">
                    <el-checkbox v-for="(item, i) in typeoptions" :label="item.id" :disabled="radio == 1" :key="i">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-tab-pane>
            <el-tab-pane label="医嘱项目" name="second">
                <el-button class="fr mb5" type="primary" @click="addService(serviceIds.itemIds)">添加</el-button>
                <el-table :data="serviceIds.itemIds" style="width: 100%" border>
                    <el-table-column prop="name" label="项目名称">
                    </el-table-column>
                    <el-table-column prop="serviceClassification" label="医嘱项目类型">
                        <template slot-scope="scope">
                            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.serviceClassification"></sys-value>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" width="80" label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="danger" @click="deleteRow1(scope.$index, serviceIds.itemIds)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <service-dialog ref="service" :itemIds="serviceIds.itemIds" @selectChange="selectChange"></service-dialog>
    </div>
</template>
<script>
import serviceDialog from '@/sob/page/servicedialog.vue'
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  components: {
    serviceDialog
  },
  props: {
    serviceIds: {

    },
  },
  data () {
    return {
    //   activeName2: this.serviceIds.itemIds.length > 0 ? 'second' : 'first',
      radio: '',
      typeoptions: [],
    }
  },
  created () {
    this.initCheckboxs()
  },
  methods: {
    initCheckboxs () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
        this.typeoptions = []
        let arr = []
        res.forEach(item => {
          if (item.parentId === '297' || item.parentId === '294' || item.parentId === '296' || item.parentId === '798') {
            arr.push({id: item.id, name: item.name})
          }
        })
        this.typeoptions = arr
        // this.typeoptions.filter(v => {
        //   this.serviceIds.categoryIds.push(v.id)
        // })
      })
    },
    handleRadioChange (val) {
      this.serviceIds.categoryIds = []
      if (val === 1) {
        this.typeoptions.map(v => {
          this.serviceIds.categoryIds.push(v.id)
        })
        this.serviceIds.categoryIds.push('0')  // 门诊补费时，大客户补费居然不在全部范围内
      } else {
        this.serviceIds.categoryIds = []
      }
    },
    handleClick (tab, event) {
    //   this.serviceIds.status = tab.name
    //   console.log(tab.name)
    //   if (tab.name === 'first') {
    //     this.serviceIds.itemIds = []
    //   } else {
    //     this.serviceIds.categoryIds = []
    //   }
    },
    addService (selects) {
      this.$refs.service.onDialogOpen(this.currTabs, selects)
    },
    selectChange (selects) {
      this.serviceIds.itemIds = selects
    },
    deleteRow1 (index, rows) {
      rows.splice(index, 1)
    },
    getItems () {
    },
  }
}
</script>
