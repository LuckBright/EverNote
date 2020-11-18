<template>
    <div class="save_as_tpl" v-if="tplType">
        <el-dialog 
            title="存为模版"
            :visible="visible"
            @update:visible="close"
            width="700px"
            @close="close"
            :append-to-body='true'
            :close-on-click-modal="false"
            destroy-on-close>
            <el-form :model="form" ref="form" class="custom-form">
                <el-form-item :label="tplName" :label-width="formLabelWidth" prop="name">
                    <check-name 
                      v-model="form.name" 
                      ref="checkName"
                      :space='space'
                      :checkNameParams="form"
                      ></check-name>
                </el-form-item>
                <el-form-item label="文档类型" :label-width="formLabelWidth" v-if="isHospitalNormal">
                    <el-input v-model="form.categoryName" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item :label="tplCategory" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.businessType">
                      <el-radio label="2">个人</el-radio>
                      <el-radio label="3" v-if='space !== "tech"'>科室</el-radio>
                      <el-radio label="0" v-else>集团</el-radio>
                      <el-radio label="1" v-if='space !== "tech"'>机构</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="模版属性" :label-width="formLabelWidth" v-if="isHospitalNormal && space !== 'tech'">
                    <el-checkbox label="另立专项" name="type"  v-model="form.anotherRecord" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                    <el-checkbox label="另起一页" name="type"  v-model="form.anotherPage" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                    <!-- <el-checkbox label="自动增加时间锚点" name="type"  v-model="form.autoInsertTime" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                  <el-checkbox label="自动增加标题" name="type"  v-model="form.autoInsertTitle" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox> -->
                </el-form-item>
                <!-- <el-form-item label="" :label-width="formLabelWidth" v-if="isHospitalNormal && space !== 'tech'">
                    <el-checkbox label="另起一页" name="type"  v-model="form.anotherPage" :true-label="1" :false-label="0" :disabled="modelAttrrDisabled"></el-checkbox>
                </el-form-item> -->
                <el-form-item label="" :label-width="formLabelWidth">
                  <el-button type="primary" @click="submit">确定</el-button>
                  <el-button @click="close">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import savetpl from '@/emr/mixins/savetpl'
export default {
  mixins: [savetpl],
}
</script>
<style lang="scss" scoped>
.save_as_tpl{
    .dialog-footer{
        text-align: left;
    }
    /deep/.el-tabs__nav-wrap:after{
        background:transparent;
    }
    /deep/.el-tabs__header{
        margin:0;
    }
    .el-form-item{
        margin:10px;
        margin-bottom:20px;
    }
    /deep/.el-form-item__content{
        line-height:32px;
    }
    /deep/.el-divider--horizontal{
        margin:0;
    }
    .tpl_list_wrap{
        max-height:320px;
        overflow-y:scroll;
        border:1px solid #ccc;
    }
    .tpl_list{
        border-bottom:1px solid #ccc;
        padding-left:15px;
        &:last-child{
            border-bottom:none;
        }
        &:hover{
            background:#409eff;
            color:#fff;
        }
    }
    
}
</style>
