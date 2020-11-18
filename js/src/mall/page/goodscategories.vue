<template>
  <div id="mall">
    <el-row class="top">
      <el-col :span="24">
        <span class="title">商品分类管理</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" class="goodscategories-panel">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="classify_title">一级分类</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addFirst(1)">新增一级分类</el-button>
          </div>
          <div v-for="(o, i) in menuUl" :key="i" class="text item">
            <div class="classiy_tt" @click="activeTog(i)">
              <el-row :class="{ on: (id === o.id) }">
                <el-col :span="16">
                  <span class="classify_li">{{o.name}}</span>&nbsp;<i class="iconfont icon-shang" v-if="i !== 0" @click="sortUp(i, i-1)"></i>&nbsp;<i class="iconfont icon-xia" v-if="i !== menuUl.length-1" @click="sortDown(i, i+1)"></i>
                </el-col>
                <el-col :span="8" align="right">
                  <el-button type="text" @click="handleEdit(o, 1)">编辑</el-button>
                  <el-button type="text" @click="handleChangeStatus(o)" v-if="!o.status">启用</el-button>
                  <el-button type="text" @click="handleChangeStatus(o)" v-if="o.status">禁用</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" class="goodscategories-panel">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="classify_title">二级分类</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addFirst(2)">新增二级分类</el-button>
          </div>
          <div v-for="(o, i) in menu2Ul" :key="i" class="text item">
            <div class="classiy_tt">
              <el-row>
                <el-col :span="16">
                  <span class="classify_li">{{o.name}}</span>&nbsp;<i class="iconfont icon-shang" v-if="i !== 0" @click="sort2Up(i, i-1)"></i>&nbsp;<i class="iconfont icon-xia" v-if="i !== menuUl.length-1" @click="sort2Down(i, i+1)"></i>
                </el-col>
                <el-col :span="8" align="right">
                  <el-button type="text" @click="handleEdit(o, 2)">编辑</el-button>
                  <el-button type="text" @click="handleChangeStatus(o)" v-if="!o.status">启用</el-button>
                  <el-button type="text" @click="handleChangeStatus(o)" v-if="o.status">禁用</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="firstLevelForm.title"
      :visible.sync="firstLevelPop"
      width="30%">
      <el-form :model="firstLevelForm" ref="firstLevelForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          :label="firstLevelForm.label"
          prop="name"
          label-width="180px"
          :rules="[
            { required: true, message: '分类不能为空', trigger: 'blur'},
            { min: 1, max: 20, message: '最大长度为20个字符', trigger: 'blur' }
          ]"
        >
          <el-input v-model.trim="firstLevelForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('firstLevelForm')">提交</el-button>
          <el-button @click="resetForm('firstLevelForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../store/indexapi'
  import utillist from '../../util/list'
  export default {
    mixins: [utillist],
    data () {
      return {
        api: api,
        menuUl: [],
        menu2Ul: [],
        firstLevelPop: false,
        id: '',
        firstLevelForm: {
          name: '',
          title: '',
          label: '',
          parentId: '',
          level: ''
        }
      }
    },
    created () {
      api.getByLevel({parentId: 1}).then(result => {
        this.menuUl = result.data
        this.id = result.data[0].id
        api.getByLevel({parentId: result.data[0].id}).then(res => {
          this.menu2Ul = res.data
        })
      })
    },
    methods: {
      resetForm (formName) {
        this.firstLevelForm.name = ''
      },
      activeTog: async function (i) {
        this.id = this.menuUl[i].id
        api.getByLevel({parentId: this.id}).then(result => {
          this.menu2Ul = result.data
        })
      },
      sortUp (i, j) {
        let params = {
          firstId: this.menuUl[i].id,
          secondId: this.menuUl[j].id
        }
        api.exchangePosition(params).then(result => {
          api.getByLevel({parentId: 1}).then(result => {
            this.menuUl = result.data
            // this.id = result.data[0].id
            if (this.menu2Ul.length) {
              api.getByLevel({parentId: this.menu2Ul[0].parentId}).then(res => {
                this.menu2Ul = res.data
              })
            }
          })
        })
      },
      sortDown (i, j) {
        let params = {
          firstId: this.menuUl[i].id,
          secondId: this.menuUl[j].id
        }
        api.exchangePosition(params).then(result => {
          api.getByLevel({parentId: 1}).then(result => {
            this.menuUl = result.data
            // this.id = result.data[0].id
            if (this.menu2Ul.length) {
              api.getByLevel({parentId: this.menu2Ul[0].parentId}).then(res => {
                this.menu2Ul = res.data
              })
            }
          })
        })
      },
      sort2Up (i, j) {
        let params = {
          firstId: this.menu2Ul[i].id,
          secondId: this.menu2Ul[j].id
        }
        api.exchangePosition(params).then(result => {
          api.getByLevel({parentId: 1}).then(result => {
            this.menuUl = result.data
            // this.id = result.data[0].id
            if (this.menu2Ul.length) {
              api.getByLevel({parentId: this.menu2Ul[0].parentId}).then(res => {
                this.menu2Ul = res.data
              })
            }
          })
        })
      },
      sort2Down (i, j) {
        let params = {
          firstId: this.menu2Ul[i].id,
          secondId: this.menu2Ul[j].id
        }
        api.exchangePosition(params).then(result => {
          api.getByLevel({parentId: 1}).then(result => {
            this.menuUl = result.data
            // this.id = result.data[0].id
            if (this.menu2Ul.length) {
              api.getByLevel({parentId: this.menu2Ul[0].parentId}).then(res => {
                this.menu2Ul = res.data
              })
            }
          })
        })
      },
      handleEdit (o, num) {
        if (num === 1) {
          this.firstLevelForm = {
            name: o.name,
            title: '编辑一级分类',
            label: '一级分类名字',
            parentId: o.parentId,
            level: o.level,
            id: o.id
          }
        } else if (num === 2) {
          this.firstLevelForm = {
            name: o.name,
            title: '编辑二级分类',
            label: '二级分类名字',
            parentId: o.parentId,
            level: o.level,
            id: o.id
          }
        }
        this.firstLevelPop = true
      },
      handleChangeStatus (o) {
        let params = {id: o.id}
        api.changeStatus(params).then(result => {
          api.getByLevel({parentId: 1}).then(result => {
            this.menuUl = result.data
            api.getByLevel({parentId: this.id}).then(res => {
              this.menu2Ul = res.data
            })
          })
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {}
            if (this.firstLevelForm.level === 1) {
              if (this.firstLevelForm.id) {
                params = {
                  name: this.firstLevelForm.name,
                  id: this.firstLevelForm.id,
                  comment: this.firstLevelForm.name
                }
              } else {
                params = {
                  name: this.firstLevelForm.name,
                  level: this.firstLevelForm.level,
                  comment: this.firstLevelForm.name
                }
              }
            } else if (this.firstLevelForm.level === 2) {
              if (this.firstLevelForm.id) {
                params = {
                  name: this.firstLevelForm.name,
                  id: this.firstLevelForm.id,
                  comment: this.firstLevelForm.name
                }
              } else {
                params = {
                  name: this.firstLevelForm.name,
                  parentId: this.firstLevelForm.parentId,
                  level: this.firstLevelForm.level,
                  comment: this.firstLevelForm.name
                }
              }
            }
            api.create(params, this.firstLevelForm.id).then(result => {
              if (result.data) {
                this.firstLevelPop = false
                api.getByLevel({parentId: 1}).then(result => {
                  this.menuUl = result.data
                  api.getByLevel({parentId: this.id}).then(res => {
                    this.menu2Ul = res.data
                  })
                })
              }
            })
          } else {
            return false
          }
        })
      },
      addFirst (n) {
        if (n === 1) {
          this.firstLevelForm = {
            title: '新建一级分类',
            label: '一级分类名称',
            name: '',
            parentId: 0,
            level: 1
          }
        } else if (n === 2) {
          this.firstLevelForm = {
            title: '新建二级分类',
            label: '二级分类名称',
            name: '',
            parentId: this.id,
            level: 2
          }
        }
        this.firstLevelPop = true
      }
    },
    components: {
      // menuNav
    }
  }
 </script>
 <style scoped>
  .classify_title {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #000;
    line-height: 16px;
  }
  .classify_li {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #000;
    line-height: 44px;
  }
  .classify_li i {
    color:#ccc;
  }
  .el-menu {
    background-color: #fff
  }
  .on {background: rgba(28,123,239,0.05);font-family: PingFangSC-Semibold;font-size: 14px;color: #1C7BEF;line-height: 14px;}
  .on .classify_li {color:#1C7BEF;}
  /*.classiy_tt /deep/ span{line-height: 44px; font-family: PingFangSC-Semibold; font-size: 16px; color: #000; line-height: 16px;}*/
 </style>
