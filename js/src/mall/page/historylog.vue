<template>
  <div class="historyLog">
    <el-dialog
      title="历史日志"
      :visible.sync="dialogVisible"
      class="ui_dialog_02">
      <div class="borderleft" v-if="historyObj">
        <el-row class="logItem" v-for="(item, index) in historyObj" :key="index">
          <el-col class="flag" :class="{ last : index === 0}"></el-col>
          <el-col>
            <el-row class="line1">
              <el-col :span="8">{{item.createTime}}</el-col>
              <el-col :span="6">{{item.operatorName}}</el-col>
            </el-row>
            <div class="logList">
              <el-row :gutter="20" v-for="(rs, i) in item.changes" :key="i">
                <el-col :span="6">
                {{rs.property | propsItem}}
                </el-col>
                <el-col :span="6">
                  <div>
                    <span v-if="rs.from || rs.form === 0">
                      {{rs.property | propsValue(rs.from)}}
                    </span>
                    <span v-else>--</span>
                  </div>
                </el-col>
                <el-col :span="6"><i class="iconfont icon-guodujiantou"></i></el-col>
                <el-col :span="6" class="c333">
                <div>
                  <span>
                    <span v-if="rs.to || rs.to === 0">
                      {{rs.property| propsValue(rs.to)}}
                    </span>
                    <span v-else>--</span>
                  </span>
                </div>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="item.modifyReason">
                <el-col :span="24">修改原因:{{item.modifyReason}}</el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else class="nodata">
        暂无历史记录
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="close" type="primary">关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '../store/historylogapi'
import sysvalue from '@/warehouse/store/sysvalueapi'
import '../assets/log.scss'

let props = [
  {
    id: 'status',
    name: '商品状态'
  },
  {
    id: 'name',
    name: '商品名称'
  },
  {
    id: 'enName',
    name: '英文名称'
  },
  {
    id: 'incomeType',
    name: '财务分类'
  },
  {
    id: 'origPrice',
    name: '市场价'
  },
  {
    id: 'salePrice',
    name: '商城价'
  },
  {
    id: 'comment',
    name: '商品详情'
  },
  {
    id: 'canReturn',
    name: '退货设置'
  },
  {
    id: 'fixSalePrice',
    name: '最小储值门槛'
  },
  {
    id: 'specValue',
    name: '商品规格'
  }
]

let goodsStatus = [
  {
    id: 0,
    name: '下架'
  },
  {
    id: 1,
    name: '上架'
  },
  {
    id: 2,
    name: '草稿'
  }
]
let finType = []
export default {
  data () {
    return {
      api,
      props,
      goodsStatus,
      finType,
      dialogVisible: false,
      historyObj: {}
    }
  },
  methods: {
    open (id) {
      this.dialogVisible = true
      api.list(id).then(res => {
        this.historyObj = res.data
      })
    },
    close () {
      this.dialogVisible = false
    },
    filterKeyName (val) {
    }
  },
  created () {
    sysvalue.listOnce('THC_RCM_MALL_FIN_TYPE').then(res => {
      finType = res
    })
  },
  filters: {
    propsItem: function (value) {
      let a
      for (let i = 0; i < props.length; i++) {
        if (value === props[i].id) {
          a = props[i]
        }
      }
      return a.name
    },
    propsValue: function (value, id) {
      let a
      if (value === 'status') {
        for (let i = 0; i < goodsStatus.length; i++) {
          if (id === goodsStatus[i].id) {
            a = goodsStatus[i].name
          }
        }
      } else if (value === 'incomeType') {
        for (let i = 0; i < finType.length; i++) {
          if (Number(id) === Number(finType[i].value)) {
            a = finType[i] && finType[i].name
          }
        }
      } else {
        a = id
      }
      return a
    }
  }
}
</script>

