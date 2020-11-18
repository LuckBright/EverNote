<template>
  <div>
    <ever-bread-crumb :name="title[tplType] + setTitle" pathTo="true" showTitle="true" :path="pPath"></ever-bread-crumb>
    <div :class="'layout_inner' + (pageType === 'list' ? ' spe2' : '')">
      <template v-if="pageType === 'list'">
        <div class="ever_menu_nav">
          <el-menu mode="horizontal" :default-active="belongType" @select="nav">
            <el-menu-item v-for="item,index in belong" :index="index" :key="index">{{item}}</el-menu-item>
          </el-menu>
        </div>
        <div class="main-wrap">
          <list-box :tpl-type="tplType" :belong-type="belongType" :page-type="pageType" :user-id="userId"></list-box>
        </div>
      </template>
      <template v-else-if="pageType === 'form'">
        <edit-form :tpl-type="tplType" :belong-type="belongType" :page-type="pageType" :data-id="dataId" :pPath="pPath" :user-id="userId"></edit-form>
      </template>
    </div>
  </div>
</template>

<script>
  import listBox from './common/list'
  import editForm from './common/edit.form'
  export default {
    data () {
      return {
        title: {
          '2': '中药处方模版',
          '3': '西/成药处方模版'
        },
        belong: {
          '1': '个人模版',
          '2': '科室模版'
        },
        userId: this.$store.state.currentUser.userId,
        tplType: this.$route.params.tplType,
        belongType: this.$route.params.belong,
        pageType: this.$route.params.page,
        dataId: this.$route.params.id,
        pPath: `/warehouse/prescription/template/${this.$route.params.tplType}/${this.$route.params.belong}/list`
      }
    },
    computed: {
      setTitle () {
        let str = ''
        if (this.pageType === 'form') {
          if (this.dataId === '-1') {
            str = '新建'
          } else if (Number(this.dataId) > 0) {
            str = '编辑'
          }
        }
        return str
      }
    },
    mounted () {
      this.hasPermission()
    },
    components: {
      listBox,
      editForm
    },
    methods: {
      nav (panel) {
        this.$router.push({
          name: 'prescipeTpl',
          path: '/warehouse/prescription/template',
          params: {
            tplType: this.tplType,
            belong: panel,
            page: this.pageType
          }
        })
      },
      hasPermission () {
        if (this.tplType === '2') {
          if (!this.$hasPermission('Auth_menu_clinic_medicalset_chinese_dpt')) {
            this.belong = {
              '1': '个人模版'
            }
          } else {
            this.belong = {
              '1': '个人模版',
              '2': '科室模版'
            }
          }
        } else if (this.tplType === '3') {
          if (!this.$hasPermission('Auth_menu_clinic_prescription_western_dpt')) {
            this.belong = {
              '1': '个人模版'
            }
          } else {
            this.belong = {
              '1': '个人模版',
              '2': '科室模版'
            }
          }
        }
      }
    },
    watch: {
      '$store.state.currentUser': {
        handler (val) {
          this.userId = val.userId
        },
        deep: true
      },
      '$route.params' (val) {
        this.tplType = val.tplType
        this.belongType = val.belong
        this.pageType = val.page
        this.dataId = val.id
        this.hasPermission()
        this.pPath = `/warehouse/prescription/template/${val.tplType}/${val.belong}/list`
      }
    }
  }
</script>
