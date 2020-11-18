<template>
  <el-dialog title="意见反馈" :visible.sync="dialogVisible" append-to-body width="900px">
    <div class="cnt">
      <ever-form2
        v-model="obj"
        ref="form"
        :schema="schema"
        :rules="rules"
        label-width="100px">
        <template slot="rate" v-if="type === 2">
          <div class="line">
            <div class="ico">1</div>
            <div class="tit">非常感谢您的反馈。请对我们的服务做出评价</div>
            <div class="rate">
              <span>业务吻合度：</span><el-rate v-model="obj.rate" :texts="rateArr" show-text :colors="colors"></el-rate>
            </div>
            <div class="rate">
              <span>操作便捷性：</span><el-rate v-model="obj.rate1" :texts="rateArr" show-text :colors="colors"></el-rate>
            </div>
          </div>
        </template>
        <template slot="content">
          <div class="line">
            <div class="ico">{{ type === 2 ? 2 : 1 }}</div>
            <div class="tit">{{ type === 2 ? '请输入您喜欢的内容' : '非常感谢您的反馈。请输入您认为可以改进的内容' }}</div>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              :maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="obj.content">
            </el-input>
          </div>
        </template>
        <template slot="screenShot">
          <div class="line">
            <div class="ico">{{ type === 2 ? 3 : 2 }}</div>
            <div class="tit"><el-checkbox v-model="obj.useScreenShot"></el-checkbox> 是否使用屏幕截图 <span class="cGray">（您可以长按鼠标对屏幕截图进行标记）</span></div>
            <div class="war">
              <div id="screenShot" v-loading="canvasLoading"></div>
              <div class="mask" v-show="!useScreenShotFlag"></div>
            </div>
          </div>
        </template>
        <template slot="phone">
          <div class="line">
            <div class="ico">{{ type === 2 ? 4 : 3 }}</div>
            <div class="tit">请输入您的联系电话</div>
            <el-input v-model="obj.phone"></el-input>
          </div>
        </template>
        <template slot="submit">
          <div class="line">
            <div class="ico"><i :class="['icon iconfont', type === 2 ? 'icon-weixiao' : 'icon-bumanyi']"></i></div>
            <div>
              <el-button @click="save" type="primary">发送</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </div>
            <div class="tips">非常感谢您的反馈，我们可能无法个别回复您，但会查阅每条意见。</div>
          </div>
        </template>
        <template slot="default"><span></span></template>
      </ever-form2>
    </div>
  </el-dialog>
</template>

<script>
import html2canvas from 'html2canvas'
import { debounce1 as debounce } from '@/util/common'
import { upload } from '@/components/ever-upload-helper'
import { validatePhone } from '@/util/validate'
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'

const schema = [
  {
    name: 'rate',
    comp: 'custom',
  },
  {
    name: 'content',
    comp: 'custom',
  },
  {
    name: 'screenShot',
    label: '',
    comp: 'custom',
  },
  {
    name: 'phone',
    label: '',
    comp: 'custom',
  },
  {
    name: 'submit',
    label: '',
    comp: 'custom',
  },
]
const rules = {
  content: [{ required: true, message: '必填项', trigger: 'change' }],
  phone: [
    { validator: validatePhone, trigger: 'change' }
  ],
}

export default {
  props: {
    'visible': {
      type: Boolean,
      default: false
    },
    // 1 吐槽，2 表扬
    'type': {
      type: Number,
      default: 1
    }
  },
  data () {
    const obj = this.$ever.createObjFromSchema(schema)
    obj.useScreenShot = true
    obj.rate = 4
    obj.rate1 = 4
    obj.phone = this.$store.state.currentUser.telephoneNumber
    return {
      obj,
      schema,
      rules,
      rateArr: [
        '还可以，勉强接受',
        '一般满意，还有很大进步空间',
        '满意，仍需努力',
        '很满意',
        '非常满意，无可挑剔',
      ],
      colors: [
        '#ee4433',
        '#ee4433',
        '#ee4433',
        '#ee4433',
        '#ee4433',
      ],
      canvasLoading: false,
      useScreenShotFlag: true,
    }
  },
  watch: {
    'obj.useScreenShot' (val) {
      if (val) {
        this.useScreenShotFlag = true
      } else {
        this.useScreenShotFlag = false
      }
    },
    'visible' (val) {
      if (!val) {
        this.feedbackDialog = false
        let canvas = document.getElementById('myCanvas')
        if (canvas) {
          document.getElementById('myCanvas').remove()
        }
      }
    },
  },
  methods: {
    init (val) {
      // 在弹出窗中自动截图，生成简易画板，加上一个输入意见内容的输入框，点击提交即可
      // 1. 生成图片
      this.canvasLoading = true
      // modal层处理，截屏时忽略遮罩层
      const modals = document.getElementsByClassName('el-dialog__wrapper')
      for (let i = 0; i < modals.length; i++) {
        modals[i].setAttribute('data-html2canvas-ignore', 'true')
      }
      const dialogs = document.getElementsByClassName('el-popover')
      for (let i = 0; i < dialogs.length; i++) {
        dialogs[i].setAttribute('data-html2canvas-ignore', 'true')
      }
      html2canvas(document.body, {
        logging: false,
        // ignoreElements (element) {
        //   return element.getAttribute('data-html2canvas-ignore') === 'true'
        // }
      }).then(canvas => {
        const screenShot = document.getElementById('screenShot')
        canvas.setAttribute('style', 'width:100%')
        canvas.id = 'myCanvas'
        this.initDrawPanel(canvas)
        screenShot.appendChild(canvas)
        this.canvasLoading = false
      }).catch(e => {
        this.canvasLoading = false
      })
    },
    initDrawPanel (c) {
      let that = this
      let isSameMove = false
      var ctx = c.getContext('2d')
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 4
      c.onmousedown = function (e) {
        isSameMove = true
        var ele = that.windowToCanvas(c, e.clientX, e.clientY)
        ctx.beginPath()
        ctx.moveTo(ele.x, ele.y)
        c.onmousemove = function (e) {
          if (isSameMove) {
            var ele = that.windowToCanvas(c, e.clientX, e.clientY)
            ctx.lineTo(ele.x, ele.y)
            ctx.stroke()
            ctx.save()
          }
        }
      }
      c.onmouseup = function (e) {
        isSameMove = false
      }
    },
    windowToCanvas (canvas, x, y) {
      let pixelRat = window.devicePixelRatio || 1
      var rect = canvas.getBoundingClientRect()
      return {
        x: ((x - rect.left) * (canvas.width / rect.width)) / pixelRat,
        y: ((y - rect.top) * (canvas.height / rect.height)) / pixelRat
      }
    },
    save: debounce(function () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          this.obj.type = this.type
          let params = JSON.parse(JSON.stringify(this.obj))
          params.content = '反馈内容：' + params.content + '\n'
          let typeStr = '吐槽\n\n'
          let pageStr = '反馈页面：' + window.location.href + '\n'
          if (this.type === 2) {
            typeStr = '表扬\n\n'
            params.title = '业务吻合度：' + this.rateArr[this.obj.rate - 1] + ' 操作便捷性：' + this.rateArr[this.obj.rate1 - 1]
            let starStr = '反馈星级：业务吻合度：' + this.rateArr[this.obj.rate - 1] + '，操作便捷性：' + this.rateArr[this.obj.rate1 - 1] + '\n'
            params.content = typeStr + pageStr + starStr + params.content
          } else {
            let tmp = params.content.replace(/\n/g, '')
            params.title = tmp.substring(0, 50)
            if (tmp.length > 50) {
              params.title = params.title + '...'
            }
            params.content = typeStr + pageStr + params.content
          }
          delete params.rate
          delete params.rate1
          delete params.submit
          delete params.screenShot
          delete params.useScreenShot
          let userStr = '反馈人：' + this.$store.state.currentUser.name + ' ' + this.obj.phone + ' ' + this.$store.state.currentUser.organizationName + '\n'
          let userRoles = '反馈人角色：'
          if (this.$store.state.currentUser.roles && this.$store.state.currentUser.roles.length > 0) {
            this.$store.state.currentUser.roles.forEach(item => {
              userRoles += (item.name + ',')
            })
          }
          params.content = params.content + userStr + userRoles
          if (this.obj.useScreenShot) {
            upload(document.getElementById('myCanvas').toDataURL(), true).then(res => {
              if (res.head.errCode === 0) {
                params.content += '\n屏幕截图：' + this.$ever.fileUrl2 + res.data.fileId + ''
                request(urlMap.systemFeedback.create, params).then(res => {
                  if (res.head.errCode === 0) {
                    this.$messageTips(this, 'success', '提交成功')
                    this.dialogVisible = false
                  }
                })
              }
            })
          } else {
            request(urlMap.systemFeedback.create, params).then(res => {
              if (res.head.errCode === 0) {
                this.$messageTips(this, 'success', '提交成功')
                this.dialogVisible = false
              }
            })
          }
        }
      })
    }),
  },
  computed: {
    dialogVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  },
}
</script>
<style scoped>
.line {
  padding-bottom: 10px;
}
.line .ico {
  background: rgba(28, 123, 239, 0.1);
  color: #1c7bef;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 18px;
  border-radius: 50%;
  position: absolute;
  left: -40px;
  top: 5px;
}

.line .ico .icon {font-size: 30px}
.el-rate {
  display: inline-block;
}
.tit .cGray {
  font-size: 12px;
}
.cnt {
  padding: 10px 40px 20px 20px;
}
.war{position:relative}
.mask{position:absolute;width:100%;height:100%;top:0;left:0;background:#ddd; opacity: 0.8;cursor: not-allowed;}
</style>
