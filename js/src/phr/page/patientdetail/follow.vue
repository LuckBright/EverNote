<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree
        :default-expand-all="true" ref="" node-key="id" :data="treeData" :props="defaultProps"
        @node-click="handleNodeClick">
        <div
          :class="{'custom-tree-node': true, 'tree-checked': data._treeId === crt._treeId}" slot-scope="{ node, data }">
          <span class="follow-time">{{data._treeTime}}</span>
          {{data._treeName}}
        </div>
      </el-tree>
    </div>
    <div class="tree-detail">
      <div class="tree-detail-inner">
        <follow-box v-if="crt._treeId && !killed" :follow-data="crt"></follow-box>
      </div>
    </div>
  </div>
</template>

<script>
  import { request } from '@/util/req'
  import urlMap from '@/phr/api/urls'
  import followBox from './follow.box'
  import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'
  import { categoryList } from '@/phr/page/patientdetail/follow.models'
  import { listDestValue } from '@/util/common'

  export default {
    components: { followBox },
    data () {
      return {
        crt: {},
        treeData: [],
        defaultProps: {
          children: 'details',
          label: '_treeName',
          value: '_treeId',
        },
        killed: false,
      }
    },
    created () {
      // 获取左侧树形菜单
      request(urlMap.followUp, {
        patientId: this.$route.query.patientId,
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
      }).then(res => {
        if (res.head.errCode === 0) {
          // 拼接树状数据 树最多只有三层
          this.treeData = res.data.map((rootNode) => {
            return {
              ...rootNode,
              _treeId: rootNode.taskMasterInst.id || U(),
              _treeName: rootNode.taskMasterInst.name,
              _treeTime: (rootNode.taskMasterInst.createTime || rootNode.taskMasterInst.executeTime || '').slice(5, 10),
              details: rootNode.taskInsts.map(stageNode => {
                return {
                  ...stageNode,
                  _treeId: stageNode.taskInst.id || U(),
                  _treeName: stageNode.taskInst.name,
                  _treeTime: (stageNode.taskInst.createTime || stageNode.taskInst.executeTime || '').slice(5, 10),
                  details: stageNode.subTaskInst.map(leafNode => {
                    return {
                      ...leafNode,
                      _treeId: leafNode.taskInst.id || U(),
                      _treeName: '【' + listDestValue(categoryList, leafNode.taskInst.category) + '】' + leafNode.taskInst.name,
                      _treeTime: (leafNode.taskInst.createTime || leafNode.taskInst.executeTime || '').slice(5, 10),
                    }
                  }),
                }
              }),
            }
          })
          // this.treeData = res.data
          //   .map((n) => ({
          //     .n,
          //     _treeId: n.id || U(),
          //     _treeName: n.name,
          //     details: (n.children || []).map(t => ({
          //       ...t,
          //       _treeId: t.id || U(),
          //       _treeName: t.name,
          //       details: (t.children || []).map(s => ({
          //         ...s,
          //         _treeId: s.id || U(),
          //         _treeName: s.name,
          //       }))
          //     })),
          //   }))
          if (this.$route.query.activatedId) {
            // 找到当前数据
            let crt
            // eslint-disable-next-line no-labels
            a: for (const t of this.treeData) {
              for (const s of t.details) {
                for (const i of s.details) {
                  if (i._treeId === this.$route.query.activatedId) {
                    crt = i
                    // eslint-disable-next-line no-labels
                    break a
                  }
                }
              }
            }
            // this.treeData.forEach(t => {
            //   if (t.details && t.details.length) {
            //     t.details.forEach(s => {
            //       const crtSub = t.details.find(s => s._treeId === this.$route.query.activatedId)
            //       if (crtSub) {
            //         crt = crtSub
            //       }
            //     })
            //   }
            //   const crtSub = t.details.find(s => s._treeId === this.$route.query.activatedId)
            //   if (crtSub) {
            //     crt = crtSub
            //   }
            // })
            if (crt) {
              this.routeTo(crt)
            }
          } else {
            if (this.treeData && this.treeData[0] && this.treeData[0].details && this.treeData[0].details[0] && this.treeData[0].details[0].details && this.treeData[0].details[0].details[0]) {
              this.routeTo(this.treeData[0].details[0].details[0])
            }
          }
        }
      })
    },
    methods: {
      handleNodeClick (data, node) {
        if (node.isLeaf) {
          this.killed = true
          setTimeout(() => {
            this.killed = false
          })
          this.routeTo(data)
        }
      },
      routeTo (data) {
        let query = this.$route.query
        this.crt = data
        this.$router.replace({
          query: {
            ...query,
            activatedId: data._treeId,
            patientId: this.$route.query.patientId,
            // hospitalizedNumber: this.$route.query.hospitalizedNumber,
            // outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
            visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
            visitSerialNumber: this.$route.query.visitSerialNumber,
          },
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .follow-time {
    font-weight: bold;
    margin-right: 5px;
  }

  .tree-detail {
    padding: 15px 15px 0 25px;
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    overflow: auto;

    .tree-detail-inner {
      min-width: 836px;
      max-width: 1400px;
      background: #fff;
      min-height: 100%;
      margin: 0 auto;
    }

    .btn-box {
      min-width: 836px;
      max-width: 1400px;
      margin: 0 auto 10px;
      text-align: right;

      button {
        margin-left: 10px;
      }
    }
  }
</style>
