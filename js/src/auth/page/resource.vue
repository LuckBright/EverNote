<template>
  <div>
    <ever-bread-crumb :name="isAdd ? `添加功能资源`:`编辑功能资源`" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="flex_column_1_hidden layout_inner">
      <div class="flex_col_1_auto main-wrap">
        <ever-form2
          ref="form"
          :schema="schema"
          v-model="obj"
          :nosubmit="true"
          :rules="rules"
          label-position="right"
          @objsaved="afterSave"
        >
          <template slot="color">
            <el-color-picker v-model="obj.color"></el-color-picker>
          </template>
        </ever-form2>
      </div>
      <div style="margin-left: 120px;padding-top: 10px;">
        <el-button type="primary" @click="addOrUpdate">{{isAdd?'添加':'更新'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/auth/store/resourceapi'
import '../assets/less/style.less'

const menuTypeList = [
  {
    id: 1,
    name: '菜单'
  },
  {
    id: 2,
    name: '按钮'
  },
]
const schema = [
  {
    name: 'color',
    label: 'color',
    comp: 'custom'
  },
  {
    name: 'indexNum',
    label: 'indexNum',
    parentClass: 'dn',
    props: {
      disabled: true
    }
  },
  {
    name: 'icon',
    label: 'icon',
    props: {
      placeholder: '一级菜单必填'
    }
  },
  {
    name: 'type',
    label: 'type',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: menuTypeList
    }
  },
  {
    name: 'url',
    label: 'url',
    props: {
      placeholder: '一级菜单和二级菜单必填'
    }
  },
  {
    name: 'parentId',
    label: 'parentId',
    props: {
      disabled: false // 临时打开，可以修改parentid的功能，调整完菜单之后 关闭
    }
  },
  {
    name: 'rid',
    type: 'text',
    label: 'rid',
    props: {
      placeholder: '页面唯一id',
    }
  },
  {
    name: 'name',
    label: 'name',
    props: {
      placeholder: '名称',
    }
  },
  {
    name: 'alias',
    label: '别名',
    props: {
      placeholder: '用于区分菜单名称',
    }
  },
  {
    name: 'groupCode',
    label: 'group',
    comp: 'sys-type',
    parentClass: 'dn',
    props: {
      code: 'THC_SYS_MENU_TYPE'
    }
  },
  {
    name: 'deployAppType',
    label: '分类',
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'deploy_app_type',
      placeholder: '互联网医院相关的菜单才需要选这个，其他的不要选择',
    }
  },
  {
    name: 'version',
    label: '所属版本',
    comp: 'sys-type',
    props: {
      code: 'THC_RELEASE_VERSION',
      multiple: true,
      placeholder: '请明确该资源所属的版本，如果不选择版本，则系统内不会出现。',
    }
  },
]

export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.type = 1
    return {
      schema,
      obj,
      isAdd: false,
      menuType: '', // parent sub
      routeType: {},
      rules: {
        icon: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        rid: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        indexNum: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    'obj.type': {
      handler (val) {
        const urlItem = this.schema.find(item => item.name === 'url')
        urlItem.parentClass = val === 2 ? 'dn' : 'w'
        this.rules.url[0].required = val !== 2
      },
      immediate: true,
    }
  },
  created () {
    this.routeType = this.$route.params.type.split('_')
    this.menuType = this.routeType[1] // 当前编辑的是工作站还是工作站下边的菜单 parent sub
    const urlRequired = this.routeType[3]
    const formItem = this.schema.find(item => item.name === 'groupCode')
    const colorItem = this.schema.find(item => item.name === 'color')
    const iconItem = this.schema.find(item => item.name === 'icon')
    const aliasItem = this.schema.find(item => item.name === 'alias')
    if (this.menuType === 'parent') {
      formItem.parentClass = 'w'
      colorItem.parentClass = ''
      iconItem.parentClass = ''
      aliasItem.parentClass = 'dn'
      this.rules.groupCode[0].required = true
    } else {
      formItem.parentClass = 'dn'
      colorItem.parentClass = 'dn'
      iconItem.parentClass = 'dn'
      aliasItem.parentClass = ''
      this.rules.groupCode[0].required = false
    }
    this.rules.url[0].required = urlRequired === '1'
    this.rules.icon[0].required = this.menuType === 'parent'
    this.initData()
  },
  methods: {
    async initData () {
      const id = this.$route.params.id
      const pattern = this.routeType[0] // 当前模式 add edit
      if (pattern === 'add') {
        this.isAdd = true
        this.obj.parentId = id
        this.obj.groupCode = this.routeType[2]
        this.fixAddSchema()
        this.$ever.getFieldFromSchema(this.schema, 'parentId').props.disabled = 'disabled'
        this.$ever.getFieldFromSchema(this.schema, 'indexNum').props.disabled = 'disabled'
        const maxnumbObj = await api.getMaxIndexNum()
        this.obj.indexNum = maxnumbObj.data + 1
      } else {
        let res = await api.getById1(id)
        if (res.head.errCode === 0) {
          this.obj = Object.assign({}, this.obj, res.menu)
          this.obj.alias = res.menu.color || ''
          this.obj.version = res.menu.version ? res.menu.version.split(',') : []
        }
        this.$ever.getFieldFromSchema(this.schema, 'indexNum').props.disabled = 'disabled'
      }
    },
    addOrUpdate () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.postData()
        }
      })
    },
    async postData () {
      let res = {}
      if (this.menuType !== 'parent') {
        this.obj.color = this.obj.alias // 将color 作为别名，用来区分菜单名称
      }
      this.obj.version = this.obj.version.join()
      if (this.isAdd) {
        this.obj.id = this.obj.rid
        this.obj.delFlag = 0
        res = await api.createItem(this.obj)
      } else {
        res = await api.updateItem(this.obj)
      }
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '提交成功！', '提示')
        this.afterSave()
      }
    },
    afterSave () {
      this.$router.push({
        name: 'resources'
      })
    },
    fixAddSchema () {
      for (let i = 0; i < this.schema.length; i++) {
        let item = this.schema[i]
        if ('props' in item && 'disabled' in item.props) {
          item.props.disabled = false
        }
      }
    },
    fixAddObj (parent) {
      const obj = {}
      for (let key in parent) {
        obj[key] = parent[key]
      }
      this.obj.parentId = parent.id
      return obj
    }
  }
}
</script>
