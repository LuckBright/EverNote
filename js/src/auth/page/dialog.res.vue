<template>
  <el-dialog :visible.sync="visible" title="资源管理" width="700" :close-on-click-modal="false" :before-close="handleClose">
    <div style="padding: 10px 20px">
      <ever-form2
        ref="form"
        :schema="schema"
        v-model="obj"
        :nosubmit="true"
        :rules="rules"
        label-position="right">
        <template slot="color">
          <el-color-picker v-model="obj.color"></el-color-picker>
        </template>
      </ever-form2>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addOrUpdate">{{ this.editType === 'edit' ? '更新' : '添加' }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/auth/store/resourceapi'
// 工作站schema
const benchSchema = [
  {
    name: 'color',
    label: 'color',
    comp: 'custom'
  },
  {
    name: 'icon',
    label: 'icon',
    props: {
      placeholder: '一级菜单（工作站）必填'
    }
  },
  {
    name: 'url',
    label: 'url',
    props: {
      placeholder: '一级菜单（工作站）和二级菜单必填'
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
// 菜单schema
const menuSchema = [
  {
    name: 'indexNum',
    label: 'indexNum',
    parentClass: 'dn',
    props: {
      disabled: true
    }
  },
  {
    name: 'url',
    label: 'url',
    props: {
      placeholder: '一级菜单和二级菜单必填'
    }
  },
  // {
  //   name: 'parentId',
  //   label: 'parentId',
  //   props: {
  //     disabled: false // 临时打开，可以修改parentid的功能，调整完菜单之后 关闭
  //   }
  // },
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
// 按钮schema
const btnSchema = [
  {
    name: 'indexNum',
    label: 'indexNum',
    parentClass: 'dn',
    props: {
      disabled: true
    }
  },
  // {
  //   name: 'parentId',
  //   label: 'parentId',
  //   props: {
  //     disabled: false // 临时打开，可以修改parentid的功能，调整完菜单之后 关闭
  //   }
  // },
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
  // {
  //   name: 'alias',
  //   label: '别名',
  //   props: {
  //     placeholder: '用于区分菜单名称',
  //   }
  // },
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

// 工作站校验规则
const benchRules = {
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

// 菜单校验规则
const menuRules = {
  url: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  rid: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
}

// 按钮校验规则
const btnRules = {
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  rid: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
}

export default {
  props: {
    'resData': {
      type: Object,
      default: function () {
        return {}
      }
    },
    'resType': {
      type: String,
      default: 'menu'
    }
  },
  data () {
    return {
      schema: [],
      obj: {},
      isAdd: false,
      visible: false,
      menuType: '', // parent sub
      routeType: {},
      rules: {},
      editType: 'add'
    }
  },
  watch: {
    'obj.type': {
      handler (val) {
        // const urlItem = this.schema.find(item => item.name === 'url')
        // urlItem.parentClass = val === 2 ? 'dn' : 'w'
        // this.rules.url[0].required = val !== 2
      },
      immediate: true,
    }
  },
  created () {
    // this.obj = this.$ever.createObjFromSchema(schema)
    // this.obj.type = 1
    // this.routeType = this.$route.params.type.split('_')
    // this.menuType = this.routeType[1] // 当前编辑的是工作站还是工作站下边的菜单 parent sub
    // const urlRequired = this.routeType[3]
    // const formItem = this.schema.find(item => item.name === 'groupCode')
    // const colorItem = this.schema.find(item => item.name === 'color')
    // const iconItem = this.schema.find(item => item.name === 'icon')
    // const aliasItem = this.schema.find(item => item.name === 'alias')
    // if (this.menuType === 'parent') {
    //   formItem.parentClass = 'w'
    //   colorItem.parentClass = ''
    //   iconItem.parentClass = ''
    //   aliasItem.parentClass = 'dn'
    //   this.rules.groupCode[0].required = true
    // } else {
    //   formItem.parentClass = 'dn'
    //   colorItem.parentClass = 'dn'
    //   iconItem.parentClass = 'dn'
    //   aliasItem.parentClass = ''
    //   this.rules.groupCode[0].required = false
    // }
    // this.rules.url[0].required = urlRequired === '1'
    // this.rules.icon[0].required = this.menuType === 'parent'
    // this.initData()
  },
  methods: {
    async open (type, rowData, editType) {
      this.editType = editType
      if (type === 'bench') {
        this.schema = benchSchema
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.rules = benchRules
      } else if (type === 'menu') {
        this.schema = menuSchema
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.rules = menuRules
      } else if (type === 'button') {
        this.schema = btnSchema
        this.obj = this.$ever.createObjFromSchema(this.schema)
        this.rules = btnRules
      }
      if (editType === 'edit') {
        Object.assign(this.obj, rowData)
        this.obj.version = (rowData.version ? rowData.version.split(',') : [])
      } else {
        this.obj.parentId = rowData.rid
        if (type === 'bench') {
          this.obj.parentId = 0
        }
        const maxnumbObj = await api.getMaxIndexNum()
        this.obj.indexNum = maxnumbObj.data + 1
      }
      this.obj.editType = editType
      if (type === 'button') {
        this.obj.type = 2
      } else {
        this.obj.type = 1
      }
      this.visible = true
    },
    handleClose () {
      this.visible = false
      this.schema = []
      this.rules = {}
    },
    async initData () {
      console.log(this.resData, 'init')
      // const id = this.$route.params.id
      // const pattern = this.routeType[0] // 当前模式 add edit
      // if (pattern === 'add') {
      //   this.isAdd = true
      //   this.obj.parentId = id
      //   this.obj.groupCode = this.routeType[2]
      //   this.fixAddSchema()
      //   this.$ever.getFieldFromSchema(this.schema, 'parentId').props.disabled = 'disabled'
      //   this.$ever.getFieldFromSchema(this.schema, 'indexNum').props.disabled = 'disabled'
      // const maxnumbObj = await api.getMaxIndexNum()
      // this.obj.indexNum = maxnumbObj.data + 1
      // } else {
      //   let res = await api.getById1(id)
      //   if (res.head.errCode === 0) {
      //     this.obj = Object.assign({}, this.obj, res.menu)
      //     this.obj.alias = res.menu.color || ''
      //     this.obj.version = res.menu.version ? res.menu.version.split(',') : []
      //   }
      //   this.$ever.getFieldFromSchema(this.schema, 'indexNum').props.disabled = 'disabled'
      // }
    },
    addOrUpdate () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.postData()
        }
      })
    },
    async postData () {
      let postData = {}
      // if (this.menuType !== 'parent') {
      //   this.obj.color = this.obj.alias // 将color 作为别名，用来区分菜单名称
      // }
      postData.color = this.obj.color
      postData.icon = this.obj.icon
      postData.url = this.obj.url
      postData.name = this.obj.name
      postData.alias = this.obj.alias
      postData.groupCode = this.obj.groupCode
      postData.deployAppType = this.obj.deployAppType
      postData.version = this.obj.version.join()
      postData.rid = this.obj.rid
      postData.menuId = this.obj.menuId
      postData.indexNum = this.obj.indexNum
      postData.parentId = this.obj.parentId
      postData.delFlag = this.obj.delFlag
      postData.type = this.obj.type
      if (this.obj.editType === 'add') {
        postData.menuId = this.obj.rid
        postData.delFlag = 0
      }
      let res = {}
      if (this.obj.editType === 'add') {
        res = await api.createItem(postData)
      } else {
        res = await api.updateItem(postData)
      }
      if (res.head.errCode === 0) {
        this.visible = false
        this.$messageTips(this, 'success', '提交成功！', '提示')
        this.$emit('success')
        // this.afterSave()
      }
      // if (this.isAdd) {
      //   this.obj.id = this.obj.rid
      //   this.obj.delFlag = 0
      //   res = await api.createItem(this.obj)
      // } else {
      //   res = await api.updateItem(this.obj)
      // }
      // if (res.head.errCode === 0) {
      //   this.$messageTips(this, 'success', '提交成功！', '提示')
      //   this.afterSave()
      // }
    },
    afterSave () {
      this.$router.push({
        name: 'resourcesnew'
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
  }
}
</script>
