<template>
  <div>
    <div class="area" v-show="activeName === 'first'?true:false">
      <el-button :type="initcity?'':'primary'" size="small" class="ischoose" @click="getallcity">全部</el-button>
      <template v-for="(item,index) in areaList">
        <el-button
          size="small"
          :type="initcity=== item.provinceCode?'primary':''"
          @click="choosecity(item.provinceCode)"
        >{{item.province}}</el-button>
      </template>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="按机构" name="first">
        <el-tree
          ref="tree"
          :key="maptree"
          :accordion="accordion"
          :data="treedata"
          show-checkbox
          node-key="id"
          :default-expanded-keys="initcheckedOrgan"
          :default-checked-keys="initcheckedOrgan"
          :props="defaultProps"
        ></el-tree>
      </el-tab-pane>
      <el-tab-pane label="按科室" name="second">
        <el-tree
          :key="mapdepttree"
          ref="depttree"
          :data="depttree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="initcheckeddept"
          :default-checked-keys="initcheckeddept"
          :props="defaultProps"
        ></el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/warehouse/page/group/store/arrange.js'
export default {
  props: ['defaultChecked', 'defaultcity', 'clear', 'deptororgan'],
  data () {
    return {
      api,
      areaList: [],
      maptree: 1,
      accordion: true,
      mapdepttree: 1,
      activeName: 'first',
      depttree: [],
      initcheckedOrgan: [],
      initcheckeddept: [],
      initcity: '',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  watch: {
    'clear' (v) {
      this.initcheckedOrgan = []
      this.initcheckeddept = []
      this.$refs.depttree.setCheckedKeys([])
      this.$refs.tree.setCheckedKeys([])
      this.mapdepttree = new Date().getTime()
      this.maptree = new Date().getTime()
      for (let i = 0; i < this.$refs.depttree.store._getAllNodes().length; i++) {
        this.$refs.depttree.store._getAllNodes()[i].expanded = false
      }
      for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false
      }
      this.activeName = 'first'
      this.initcity = ''
    },
    'deptororgan': {
      handler (v) {
        this.activeName = v.formtype === 1 ? 'second' : 'first' // type 1 为科室  2为机构
      },
      deep: true
    },
    'defaultChecked' (v) {
      this.$refs.depttree.setCheckedKeys([])
      this.$refs.tree.setCheckedKeys([])
      this.mapdepttree = new Date().getTime()
      this.maptree = new Date().getTime()
      if (this.activeName === 'first') {
        this.initcheckedOrgan = Array.from(new Set(v))
      } else {
        this.initcheckeddept = Array.from(new Set(v))
      }
    },
    'defaultcity' (v) {
      this.$refs.depttree.setCheckedKeys([])
      this.$refs.tree.setCheckedKeys([])
      this.mapdepttree = new Date().getTime()
      this.maptree = new Date().getTime()
      this.initcity = v
      if (v) {
        this.choosecity(v)
      } else {
        this.getallcity()
      }
    },
    activeName: {
      handler (newName, oldName) {
        if (newName && newName !== oldName && newName === 'first') {
          this.initcheckeddept = []
          this.$refs.depttree.setCheckedKeys([])
          this.mapdepttree = new Date().getTime()
        } else if (newName && newName !== oldName && newName === 'second') {
          this.initcheckedOrgan = []
          this.$refs.tree.setCheckedKeys([])
          this.maptree = new Date().getTime()
        }
      }
    }
  },
  created () {
    this.getClinicCityList()
    this.queryGroupClinics()
    this.queryGroupDepts()
  },
  methods: {
    getallcity () {
      this.initcity = ''
      this.queryGroupClinics()
    },
    choosecity (v) { // 城市筛选机构
      this.initcity = v
      this.api.queryCityGroupClinics({ provinceCode: v }).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.treedata = rs.data
      })
    },
    getClinicCityList () { // 获取全部城市
      this.api.getClinicCityList({ blocId: '', clinicId: '' }).then(rs => {
        this.areaList = rs
      })
    },
    queryGroupClinics () { // 获取全部机构
      this.api.queryGroupClinics({ clinicId: '' }).then(rs => {
        this.treedata = rs.data
      })
    },
    queryGroupDepts () { // 获取全部科室
      this.api.queryGroupDepts({}).then(rs => {
        this.depttree = rs.data
      })
    },
    getData () {
      const filter = []
      const data = this.$refs.tree.getCheckedNodes()
      const newData = []
      this.filterData(data, filter, newData)
      return newData
    },
    getdeptData () {
      const filter1 = []
      const datadept = this.$refs.depttree.getCheckedNodes()
      const newData1 = []
      this.filterDeptData(datadept, filter1, newData1)
      return newData1
    },
    filterData (data, filter, newData, parent) {
      data.map(item => {
        if (filter.indexOf(item.id) === -1) {
          filter.push(item.id)
          const items = {
            timeTrunkType: 1,
            dady: item.parentId,
            organId: item.data.id,
            organName: item.text,
          }
          if (item.children && item.children.length) {
            items.depts = []
            this.filterData(item.children, filter, newData, items)
          } else if (parent) {
            parent.parentId = {
              parentIds: filter,
              cityCode: this.initcity,
            }
            let deptdetil = {
              deptType: 1,
              deptId: item.id,
              deptName: item.text
            }
            parent.depts ? parent.depts.push(deptdetil) : (() => {
              parent.depts = [deptdetil]
            })()
            if (newData.indexOf(parent) === -1) {
              newData.push(parent)
            }
          } else {
            let noparentitem = {
              deptId: items.organId,
              deptName: items.organName
            }
            this.$refs.tree.getHalfCheckedNodes().map(p => {
              if (p.id === items.dady) {
                let newobj = {
                  organId: p.data.id,
                  organName: p.text,
                  timeTrunkType: 1,
                  parentId: {
                    parentIds: filter,
                    cityCode: this.initcity
                  }
                }
                newobj.depts = []
                newobj.depts.push(noparentitem)
                newData.push(newobj)
              }
            })
            // 以下是狗屁逻辑嗯
            let empty = []
            newData.map(k => {
              empty.push(k.organId)
            })
            if (!empty.includes(items.organId)) {
              items.parentId = {
                parentIds: filter,
                cityCode: this.initcity
              }
              items.depts = []
              newData.push(items)
            }
          }
        }
      })
    },
    filterDeptData (datadept, filter1, newData1) {
      datadept.map(item => {
        filter1.push(item.id)
      })
      datadept.map(item => {
        if (item.children && item.children.length) {
          let deptcontet = {
            deptType: 1,
            groupCode: item.data.id,
            deptName: item.data.name,
          }
          deptcontet.parentId = {
            parentIds: Array.from(new Set(filter1)),
            cityCode: this.initcity,
          }
          deptcontet.timeTrunkScopes = []
          this.fetchorgan(item, deptcontet)
          newData1.push(deptcontet)
        } else {
          this.$refs.depttree.getHalfCheckedNodes().map(p => {
            let parent = {
              groupCode: p.data.id,
              deptName: p.data.name,
              deptType: 1,
              myId: p.parentId,
              parentId: {
                parentIds: Array.from(new Set(filter1)),
                cityCode: this.initcity,
              }
            }
            parent.timeTrunkScopes = []
            if (item.parentId === p.id) {
              parent.timeTrunkScopes.push({
                timeTrunkType: 1,
                organId: item.data.id,
                organName: item.data.name
              })
              newData1.push(parent)
            }
          })
        }
      })
    },
    fetchorgan (item, deptcontet) {
      item.children.map(p => {
        deptcontet.timeTrunkScopes.push({
          timeTrunkType: 1,
          organId: p.data.id,
          organName: p.data.name
        })
      })
    }
  }
}
</script>

<style  scoped>
.area {
  margin-bottom: 10px;
}
</style>
