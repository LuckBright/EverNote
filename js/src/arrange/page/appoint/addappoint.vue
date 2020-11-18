<template>
  <el-popover
    v-model="show"
    @show="showPopover"
    @hide="hidePopover"
    popper-class="p0"
    placement="right"
    width="820"
    trigger="manual">
    <div class="mainbox">
      <el-row class="wrap">
        <el-col :span="11" class="left_wrap">
          <el-tabs v-model="activeName" v-if="!editAppoint">
            <el-tab-pane label="预约" name="appoint" v-if="useRules && useRules.applyAppointmentRule.isAllow"></el-tab-pane>
            <el-tab-pane label="当日挂号" name="today" v-if="date === $moment().format('YYYY-MM-DD')"></el-tab-pane>
            <el-tab-pane label="预约挂号" name="number" v-if="date !== $moment().format('YYYY-MM-DD')"></el-tab-pane>
            <el-tab-pane label="结算" name="pay" v-if="activeName === 'pay'"></el-tab-pane>
            <el-tab-pane label="锁定" name="lock"></el-tab-pane>
          </el-tabs>
          <el-button type="primary" plain size="mini" class="addbutton" v-if="activeName==='today' || activeName==='number'" @click="createPatient">新建档案</el-button>
          <el-form :model="form" label-width="92px" :show-message="true" label-position="right" ref="patientform" :key="1" v-if="activeName !== 'lock'">
            <el-form-item label="" v-if="activeName==='appoint'">
              <el-radio-group v-model="patientType" :disabled="!!editAppoint">
                <el-radio :label="1">已建档患者</el-radio>
                <el-radio :label="0">新建档患者</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-alert
              v-if="isShowWarning"
              class="mb10"
              center
              :closable="false"
              :title="warningText"
              type="error">
            </el-alert>
            <template v-else>
              <el-form-item label="患者：" v-if="editAppoint">
                <span>{{form.patient.name}}</span>
                <span class="ml10" v-if="form.patient.patientNumber !== 'temporary'">{{form.patient.patientNumber}}</span>
              </el-form-item>
              <el-form-item label="姓名：" prop="patient.name" :rules="rules.required" v-if="!patientType && !editAppoint">
                <div class="input-title">创建临时档案</div>
                <el-input v-model.trim="form.patient.name" :disabled="isShowWarning || isReadIdNo" size="small">
                  <template slot="suffix"><idcard-read @getData="getIdcardData"></idcard-read></template>
                </el-input>
              </el-form-item>
              <el-form-item label="患者：" prop="patient.id" :rules="rules.required" v-if="patientType && !editAppoint">
                <ever-patient-select
                  v-if="isShow"
                  size="small"
                  v-model.trim="form.patient.name"
                  @select="selectPatient"
                  @medicalInfo="setMedicalInfo"
                  :scence="0"
                  :insurance-org-id="insuranceOrg.id"
                  :allow-create="true"
                  :grey-denies-dialog-show="true"
                  :show-attr-type="false"
                ></ever-patient-select>
              </el-form-item>
              <el-form-item label="标签：" v-if="patientType">
                <template v-if="form.patient.busiInsur">
                  <a
                    :class="getBusiInsurColor(form.patient.busiInsur)"
                    :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                    target="_blank"
                    class="mr10 lab"
                    v-if="form.patient.busiInsur.busiInsurFlag">
                    商保
                  </a>
                  <a
                    :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                    target="_blank"
                    class="mr10 lab"
                    :class="getBusiSupplInsurColor(form.patient.busiInsur)"
                    v-if="form.patient.busiInsur.busiSupplInsurFlag">
                    商补
                  </a>
                </template>
                <template v-if="isHaveTaochan">
                  <em class="mr10 lab green">套餐</em>
                </template>
                <template v-if="form.patient.member && form.patient.member.objLabelList">
                  <em class="mr10 lab red" :style="{background: item.color}" v-for="(item, i) in form.patient.member.objLabelList" :key="i">{{item.labelName}}</em>
                </template>
                <template v-if="!form.patient.busiInsur && !isHaveTaochan && (!form.patient.member || !form.patient.member.objLabelList)">
                  <label>--</label>
                </template>
              </el-form-item>
              <el-form-item label="内部备注：" v-if="form.patient.internalRemark && patientType">
                <span style="color: orange">{{form.patient.internalRemark}}</span>
              </el-form-item>
              <el-form-item label="预约提示：" v-if="form.patient.appointRemind && patientType">
                <span style="color: orange">{{form.patient.appointRemind}}</span>
              </el-form-item>
              <el-form-item label="性别：" prop="patient.sex" :rules="patientType || !patientRules.includes('sex') ? rules.optional : rules.required">
                <span v-if="form.patient.id">{{form.patient.sex | formatSex}}</span>
                <span v-else-if="patientType === 1">--</span>
                <el-radio-group v-else  v-model="form.patient.sex" :disabled="isShowWarning || isReadIdNo || isValidIdNo">
                  <el-radio label="1">男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="出生日期：" prop="patient.birthday" :rules="patientType || !patientRules.includes('birthday') ? rules.optional : rules.required">
                <template v-if="form.patient.id && appointPatient.birthday">
                  <span>{{$moment(form.patient.birthday).format('YYYY-MM-DD')}}</span>
                  <span class="ml10">{{form.patient.ageShowText}}</span>
                </template>
                <span v-else-if="patientType === 1">--</span>
                <age v-model="form.patient.birthday" v-else :disabled="isShowWarning || isReadIdNo || isValidIdNo"></age>
              </el-form-item>
              <el-form-item label="手机号码：" prop="patient.mobile" :rules="patientType || !patientRules.includes('mobile') ? rules.checkMobileNo : rules.checkMobile">
                <span v-if="form.patient.id && appointPatient.mobile">{{form.patient.mobile}}</span>
                <span v-else-if="patientType === 1">--</span>
                <el-input v-else v-model="form.patient.mobile" size="small" :disabled="isShowWarning" placeholder="请输入手机号" prefix-icon="el-icon-phone-outline" class="el-date-editor" style="width: 100%"></el-input>
              </el-form-item>
              <el-form-item label="身份证号：" prop="patient.idNo" :rules="patientType || !patientRules.includes('idNo') ? rules.optionalCardId : rules.checkCardId">
                <span v-if="form.patient.id && form.patient.idNo">{{form.patient.idNo}}</span>
                <span v-else-if="patientType === 1">--</span>
                <el-input size="small" v-else v-model="form.patient.idNo" :disabled="isShowWarning || isReadIdNo || !!editAppoint"></el-input>
              </el-form-item>
              <el-form-item label="渠道：" prop="channelId" v-if="!patientType" :rules="patientType || !patientRules.includes('source') ? rules.optional : rules.required">
                <el-cascader
                  style="width:100%"
                  size="small"
                  :disabled="!!editAppoint || isShowWarning"
                  v-model="form.channelId"
                  :props="channelOption"
                  :options="channelList">
                </el-cascader>
              </el-form-item>
            </template>
          </el-form>
          <i class="iconfont icon-login-password" v-else></i>
        </el-col>
        <el-col :span="13" class="right">
          <el-form :model="form" label-width="92px" :show-message="true" label-position="right" ref="payform" :key="2" v-if="activeName === 'pay' && useRules.formalAppointmentRule">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="科室：">
                  {{form.deptName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="医生：">
                  {{form.resourceName}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col>
                <el-form-item label="时间：">
                  {{form.date}} {{form.startTimeStr}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="服务：">
                  {{form.serviceName}}
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="servicePrice || servicePrice === 0">
                <el-form-item>
                  ￥ {{servicePrice ? servicePrice.toFixed(2) : '0.00'}}
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-else>
                <el-form-item>
                  暂未找到对应的价格
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="!form.insuranceType">
              <el-col :span="14">
                <el-form-item label="套餐及保障计划：">
                  <el-select
                    size="small"
                    v-model="form.shopSetItemId"
                    placeholder="套餐信息">
                    <el-option :value="-1" label="不使用"></el-option>
                    <el-option
                      :value="item.setmealOrderDetailId"
                      :label="item.setMealName"
                      v-for="(item, i) in serviceSetList"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right">
                <el-form-item>
                  <span class="fontgreen">- ￥ {{servicePrice && form.shopSetItemId !== -1 ? servicePrice : '0.00'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="!form.insuranceType">
              <el-col :span="14">
                <el-form-item label="折扣：">
                  <el-select v-model="discountCard" value-key="id" size="small">
                    <el-option :value="{id: '', name: '无折扣'}" label="无折扣"></el-option>
                    <el-option
                      :label="item.name"
                      :value="item"
                      v-for="(item, i) in discountList"
                      :key="i"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10"></el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="">
                  <el-checkbox v-model="form.jiuZhenCard" :true-label="1" :false-label="0">就诊卡</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="jiuZhenCardPrice">
                <el-form-item>
                  <span class="fontgreen">+ ￥{{jiuZhenCardPrice.toFixed(2)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item label="">
                  <el-checkbox v-model="form.medicalRecordBook" :true-label="1" :false-label="0">病历本</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="10" align="right" v-if="recordBookPrice">
                <el-form-item>
                  <span class="fontgreen">+ ￥{{recordBookPrice.toFixed(2)}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="合计：">
                  <strong class="fontred" style="font-size: 18px;"  v-if="servicePrice || servicePrice === 0">￥{{(currentPrice - discountPrice + recordBookPrice + jiuZhenCardPrice).toFixed(2)}}</strong>
                  <span class="fontred" v-else>暂未找到对应的价格</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="">
                  <div style="padding-top: 10px">
                    <el-button size="small" type="primary" :disabled="isSubmit" @click="submitAppoint(false)">挂号收费</el-button>
                    <el-button size="small" type="primary" plain @click="closePopover">关闭</el-button>
                    <el-button size="small" type="primary" plain @click="returnNumberForm">返回</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form :model="form" label-width="92px" :show-message="true" label-position="right" ref="form" :key="3" v-if="['appoint', 'number', 'today'].includes(activeName)">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="科室："><span>{{form.deptName}}</span></el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="医生："><span>{{form.resourceName}}</span></el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="时间：">
                  <el-row type="flex" :gutter="5">
                    <el-col :span="8">{{form.date}}</el-col>
                    <el-col :span="6"><el-input size="mini" v-model="form.startTimeStr" :maxlength="5"></el-input></el-col>
                    <el-col :span="10">
                      <el-autocomplete placement="bottom" size="mini" :fetch-suggestions="querySearch" v-model="form.timeLength" popper-class="appoint-selecttime" style="width:66px;">
                        <template slot-scope="{ item }">
                          <el-row class="popperitem">
                            <el-col :span="12"><label>{{item.name}}</label></el-col>
                            <el-col :span="12" align="right"><span class="gray" v-if="item.endTime">结束于 {{item.endTime}}</span></el-col>
                          </el-row>
                        </template>
                      </el-autocomplete>
                      <label class="ml10">分钟</label>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="费别：" prop="insuranceType" :rules="rules.required">
                  <el-select v-model="form.insuranceType" @change="changeInsuranceType" size="small" :disabled="!patientType" style="width:100%">
                    <el-option label="自费" :value="0"></el-option>
                    <el-option label="医保" :value="1" v-if="activeName !== 'appoint'"></el-option>
                    <el-option label="商保" :value="2" v-if="activeName !== 'appoint'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="form.insuranceType">
              <el-col :span="24">
                <el-form-item label="保险机构：" prop="useInsurance.insuranceOrgId" :rules="rules.required">
                  <el-select size="small" v-model="insuranceOrg" value-key="id" style="width:100%" @change="changeInsuranceOrg" clearable>
                    <el-option v-for="(item, i) in insuranceOrgList" :key="i" :label="item.insureOrgShortName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="form.insuranceType">
              <el-col :span="24">
                <el-form-item label="保险产品：" prop="useInsurance.insuranceProductId" :rules="rules.required">
                  <el-select size="small" v-model="insuranceProduct" value-key="id" style="width:100%" @change="changeInsuranceProduct" clearable>
                    <el-option v-for="(item, i) in insuranceProductList" :key="i" :label="item.productName" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item  label="初复诊：" prop="subsequentVisit" :rules="rules.required">
                  <el-select v-model="form.subsequentVisit" size="small" style="width:100%">
                    <el-option label="初诊" :value="0"></el-option>
                    <el-option label="复诊" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="挂号类别：" prop="registerTypeCode" :rules="rules.required">
                  <sys-type code="CT05.10.004" :clearable="false" v-model="form.registerTypeCode" :multiple="false"></sys-type>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="就诊类型："><span>{{this.visitType}}</span></el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="预约途径：" prop="appointWayCode" v-if="activeName === 'appoint'" :rules="rules.required">
                  <sys-type code="CT05.10.006" :clearable="false" v-model="form.appointWayCode" :multiple="false"></sys-type>
                </el-form-item>
                <el-form-item label="挂号方式：" prop="registerWayCode" v-if="activeName === 'number' || activeName === 'today'" :rules="rules.required">
                  <sys-type code="CT05.10.005" :clearable="false" v-model="form.registerWayCode" :multiple="false"></sys-type>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="标注颜色：">
                  <el-dropdown @command="handleCommand" trigger="click" class="colors">
                    <span class="el-dropdown-link">
                      <i class="currclolr" :style="{background: predefineColors[form.showStyle]}"></i>
                      <i class="el-icon-arrow-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="i" v-for="(item, i) in predefineColors" :key="i">
                        <span class="color" :style="{background: item}"></span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.symptom" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="免单：">
                  <el-switch
                    :disabled="!!form.insuranceType"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="form.freeSheet">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="免单原因：">
                  <el-input v-model="form.freeReason" :maxlength="200" size="small" placeholder="请输入免单原因" :disabled="!form.freeSheet"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="isExistCharge && isShowPrice">
              <el-col :span="24">
                <el-form-item label="支付：">
                  <span v-if="servicePrice || servicePrice === 0">{{servicePrice ? servicePrice : '0.00'}} 元</span>
                  <span class="fontred" v-else>暂未找到对应的价格</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="activeName === 'appoint' && useRules.applyAppointmentRule && useRules.applyAppointmentRule.isPayTimeLimit">
              <el-col :span="24" style="padding-left: 92px">
                <div class="fontred"><i class="el-icon-warning"></i><em>请提醒客户于{{useRules.applyAppointmentRule.payTimeLimit}}分钟内完成在线付款</em></div>                
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="activeName === 'number' && useRules.formalAppointmentRule && useRules.formalAppointmentRule.isPayTimeLimit">
              <el-col :span="24" style="padding-left: 92px">
                <div class="fontred"><i class="el-icon-warning"></i><em>请提醒客户于{{useRules.formalAppointmentRule.payTimeLimit}}分钟内完成在线付款</em></div>                
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-form-item label="发送短信：">
                <el-switch
                  v-model="sendMessage">
                </el-switch>
                <span class="ml20" style="color:#666;">手工发送：</span>
                <el-switch
                  :disabled="!sendMessage"
                  :active-value="0"
                  :inactive-value="1"
                  v-model="form.isSmsRemind">
                </el-switch>
              </el-form-item>
            </el-row>
            <el-row :gutter="10" v-if="activeName === 'appoint'">
              <el-col :span="24">
                <el-form-item>
                  <div style="padding-top: 10px">
                    <el-button type="primary" size="small" @click="submitAppoint(true)" :disabled="isSubmit || isShowWarning || (!servicePrice && servicePrice !== 0)">{{isSubmit ? '预约中' : '预约'}}</el-button>
                    <el-button type="" size="small" @click="closePopover">关闭</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="activeName === 'today'">
              <el-col :span="24">
                <el-form-item>
                  <div style="padding-top: 10px">
                    <template v-if="isExistCharge && (useRules.receptionRule.documentPayRel === 'AND' || !useRules.receptionRule.documentPayRel) && useRules.receptionRule.isPay">
                      <el-button type="primary"
                      size="small"
                      :disabled="isShowWarning"
                      @click="toPayTab"
                      v-if="!useRules.receptionRule.payOption || useRules.receptionRule.payOption === 1">结算</el-button>
                      <el-button type="primary"
                      size="small"
                      :disabled="isShowWarning"
                      @click="submitAppoint(false)"
                      v-if="useRules.receptionRule.payOption === 2">支付</el-button>
                    </template>
                    <el-button type="primary" size="small" @click="submitAppoint(true)" :disabled="isSubmit || isShowWarning || (!servicePrice && servicePrice !== 0)" v-else>{{isSubmit ? '挂号中' : '挂号'}}</el-button>
                    <el-button type="" size="small" @click="closePopover">关闭</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="activeName === 'number'">
              <el-col :span="24">
                <el-form-item>
                  <div style="padding-top: 10px">
                    <template v-if="isExistCharge && (useRules.formalAppointmentRule.documentPayRel === 'AND' || !useRules.formalAppointmentRule.documentPayRel) && useRules.formalAppointmentRule.isPay">
                      <el-button type="primary"
                      size="small"
                      :disabled="isShowWarning"
                      @click="toPayTab"
                      v-if="!useRules.formalAppointmentRule.payOption || useRules.formalAppointmentRule.payOption === 1">结算</el-button>
                      <el-button type="primary"
                      size="small"
                      :disabled="isShowWarning"
                      @click="submitAppoint(false)"
                      v-if="useRules.formalAppointmentRule.payOption === 2">支付</el-button>
                    </template>
                    <el-button type="primary" size="small" @click="submitAppoint(true)" :disabled="isSubmit || isShowWarning || (!servicePrice && servicePrice !== 0)" v-else>{{isSubmit ? '挂号中' : '挂号'}}</el-button>
                    <el-button type="" size="small" @click="closePopover">关闭</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form :model="lockform" label-width="92px" :show-message="true" label-position="right" ref="lockform" v-if="activeName === 'lock'">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="科室：">
                  <span>{{lockform.deptName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="医生：">
                  <span>{{lockform.resourceName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="时间：" prop="timeLength" :rules="rules.checkLockTime">
                  <span>
                    <el-date-picker
                      style="width:122px"
                      size="small"
                      v-model="lockform.lockDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      :clearable="false"
                      placeholder="选择日期">
                    </el-date-picker>
                  </span>
                  <span>
                    <el-input size="small" v-model="lockform.lockStartTimeStr" style="width:56px" :maxlength="5"></el-input>
                  </span>
                  <span>
                    <el-input-number  size="small" v-model="lockform.timeLength" style="width:50px" :controls="false" :min="1" :max="999"></el-input-number>
                    <font class="ml10">分钟</font>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="重复：">
                  <el-select v-model="lockform.repeatType" size="small" style="width:100%">
                    <el-option :value="0" label="不重复"></el-option>
                    <el-option :value="1" label="每天"></el-option>
                    <el-option :value="2" label="每周"></el-option>
                    <el-option :value="3" label="每月"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="截止：" v-if="lockform.repeatType !== 0">
                  <el-date-picker
                    size="small"
                    style="width:100%"
                    v-model="lockform.dueDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOption2"
                    placeholder="于此日（含）">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="lockform.description" :autosize="{ minRows: 4, maxRows: 8}" :maxlength="200"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item>
                  <div style="padding: 20px 0">
                    <el-button type="primary" size="small" @click="lockAppoint" :disabled="isSubmit" style="width: 64px">{{isSubmit ? '锁定中' : '锁定'}}</el-button>
                    <el-button type="" size="small" @click="closePopover">关闭</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <create-patient ref="createpatient" page-type="2" @getArchivesObj="setCreatePatient"></create-patient>
    </div>
    <!--<div class="editing" v-if="editAppoint">正在编辑</div>-->
    <div slot="reference" class="addarea"></div>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
import sobapi from '@/sob/store/serviceapi'
import storage from '@/util/storage'
import age from '@/components/age'
import dialogFollowAppoint from '@/follow/page/template/dialog-follow-appoint'
import createPatient from '@/crm/components/createarchivesdialog.vue'
import IdcardRead from '@/components/readdevice/idcard/idcard'
import { validatePhone, validateIden } from '@/util/validate'
export default {
  props: ['date', 'startTime', 'timeLength', 'organ', 'dept', 'resource', 'service', 'isShow', 'isClick', 'showType', 'patient', 'editAppoint', 'openScene'],
  components: { dialogFollowAppoint, age, IdcardRead, createPatient },
  data () {
    let validateTimeLength = (rule, value, callback) => {
      if (this.form.startTimeStr === '') {
        callback(new Error('请输入开始时间'))
        return false
      }
      if (!/^(20|21|22|23|[0-1]\d):[0-5]\d$/.test(this.form.startTimeStr)) {
        callback(new Error('请输入正确的时间格式'))
        return false
      }
      let timeArr = this.form.startTimeStr.split(':')
      let m = timeArr[0] * 60 + parseInt(timeArr[1]) + parseInt(value)
      if (m > 1440) {
        callback(new Error('时长不能超过今日24点'))
      } else {
        callback()
      }
    }
    let validateLockTime = (rule, value, callback) => {
      if (!this.lockform.lockDate) {
        callback(new Error('请输入锁定日期'))
        return false
      }
      if (!this.lockform.lockStartTimeStr) {
        callback(new Error('请输入开始时间'))
        return false
      }
      if (!/^(20|21|22|23|[0-1]\d):[0-5]\d$/.test(this.form.startTimeStr)) {
        callback(new Error('请输入正确的时间格式'))
        return false
      }
      let timeArr = this.lockform.lockStartTimeStr.split(':')
      let m = timeArr[0] * 60 + parseInt(timeArr[1]) + parseInt(value)
      if (m > 1440) {
        callback(new Error('时长不能超过今日24点'))
      } else {
        callback()
      }
    }
    return {
      api,
      sobapi,
      step: 1,
      storage,
      addPatientType: 2,
      apolloValue: '',
      currentLogin: storage.getLocalStorage('CLINICID'),
      show: false,
      sendMessage: false,
      isAutoSend: false,
      isSubmit: false,
      isValidRepeat: true,
      isHaveTaochan: false,
      isShowWarning: false,
      isShowPrice: false,
      isZhenjian: false,
      isMobileConfirm: false,
      isReadIdNo: false,
      isValidIdNo: false,
      warningText: '',
      appointPatient: '',
      patientType: 1,
      activeName: 'appoint',
      servicePrice: '',
      feeTypePrice: '',
      recordBookPrice: 0,
      jiuZhenCardPrice: 0,
      discountCard: {id: '', name: '无折扣'},
      predefineColors: [
        '#8703da',
        '#0312DA',
        '#A05B00',
        '#0F92BD',
        '#5EAA45'
      ],
      form: {
        patient: {
          id: '',
          name: '',
          sex: '1',
          birthday: '',
          mobile: '',
          // agebirthday: ''
        }
      },
      lockform: {},
      useRules: '',
      patientRules: [],
      isExistCharge: false,
      rules: {
        optional: [
          {required: false}
        ],
        patient: [
          { required: true, message: '请选择已建档患者', trigger: ['change', 'blur'] }
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ],
        requiredDate: [
          { required: true, message: '必填项', trigger: ['change'], type: 'date' }
        ],
        checkTimeLen: [
          {validator: validateTimeLength, trigger: ['blur', 'change']}
        ],
        checkLockTime: [
          {validator: validateLockTime, trigger: ['blur', 'change']}
        ],
        checkMobile: [
          {required: true, validator: validatePhone, trigger: ['change']}
        ],
        checkMobileNo: [
          {required: false, validator: validatePhone, trigger: ['change']}
        ],
        checkCardId: [
          {required: true, validator: validateIden, trigger: ['change']}
        ],
        optionalCardId: [
          {required: false, validator: validateIden, trigger: ['change']}
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOption2: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      selectTimeConfig: [10, 15, 20, 30, 45, 60, 90, 120],
      restaurants: [],
      serviceSetList: [],
      discountList: [],
      channelList: [],
      insuranceOrgList: [],
      insuranceProductList: [],
      channelOption: {value: 'id', label: 'text', emitPath: false},
      settlementInfo: '',
      appointmentInfo: '',
      insuranceOrg: '',
      insuranceProduct: '',
      visitType: '门诊'
    }
  },
  watch: {
    'isShow' (val) {
      this.show = val
    },
    'show' (val) {
      this.$emit('update:isShow', val)
      if (!val) {
        return false
      }
      this.resetForm()
      this.setDefaultTime()
      this.setUseRules()
      this.setPatientRules()
      this.getApolloConfig()
      this.getServicePrice()
      this.getChannelList()
      this.getInsuranceOrg()
      if (this.patient) {
        this.form.patient = Object.assign(this.form.patient, this.patient)
        this.appointPatient = this.form.patient
      }
      if (this.editAppoint) {
        this.form.patient = Object.assign(this.form.patient, this.editAppoint.patient)
        if (this.editAppoint.patient.patientNumber === 'temporary') {
          this.patientType = 0
        }
        this.appointPatient = this.form.patient
        this.form.channelId = this.editAppoint.channelId
        this.form.subsequentVisit = this.editAppoint.subsequentVisit
        this.form.appointWayCode = this.editAppoint.appointWayCode
        this.form.registerTypeCode = this.editAppoint.registerTypeCode
        this.getIsTaoChan(this.editAppoint.patientId)
      } else {
        this.isHaveTaochan = false
      }
      this.isValidRepeat = !this.editAppoint && !this.$route.query.patientId
      this.$bus.$on('onError', val => {
        this.isSubmit = false
      })
      this.$bus.$off('appoint:showinfo')
      this.$bus.$on('appoint:showinfo', val => {
        this.show = false
      })
    },
    'patient' (val) {
      if (val && this.show) {
        this.form.patient = Object.assign(this.form.patient, val)
        this.isValidRepeat = false
        if (this.activeName === 'appoint') {
          this.submitAppoint(this.isMobileConfirm)
        } else {
          this.toPayTab()
        }
      }
    },
    'patientType' (val) {
      if (!val) {
        let applyRule = this.useRules.applyAppointmentRule
        let formalRule = this.useRules.formalAppointmentRule
        let receptionRule = this.useRules.receptionRule
        let c1 = this.activeName === 'appoint' && applyRule && applyRule.isAllow && applyRule.isFormalDocument && applyRule.documentPayRel !== 'OR'
        let c2 = this.activeName === 'today' && receptionRule && receptionRule.isAllow && receptionRule.isFormalDocument && receptionRule.documentPayRel !== 'OR'
        let c3 = this.activeName === 'number' && formalRule && formalRule.isAllow && formalRule.isFormalDocument && formalRule.documentPayRel !== 'OR'
        if (c1 || c2 || c3) {
          this.warningText = '非正式建档患者，不可预约此号'
          this.isShowWarning = true
        }
        if ((this.editAppoint && this.editAppoint.apptType === 1) || this.activeName === 'appoint') {
          this.addPatientType = 6
        } else {
          this.addPatientType = 2
        }
      } else {
        this.addPatientType = 2
        this.warningText = ''
        this.isShowWarning = false
       //  this.form.insuranceType = 1
      }
      this.isValidRepeat = !val && !this.editAppoint
      this.form.insuranceType = 0
      this.resetPatient()
    },
    'timeLength' (val) {
      this.form.timeLength = val === 'NaN' ? '10' : val + ''
      this.lockform.timeLength = val === 'NaN' ? '10' : val + ''
    },
    'form.startTimeStr' (val) {
      this.changeDefaultTimeList()
      this.$emit('timeupdate', {
        startTime: this.form.startTimeStr,
        timeLength: this.form.timeLength
      })
    },
    'form.timeLength' (val) {
      this.$emit('timeupdate', {
        startTime: this.form.startTimeStr,
        timeLength: this.form.timeLength
      })
    },
    'lockform.lockStartTimeStr' (val) {
      this.$emit('timeupdate', {
        startTime: this.lockform.lockStartTimeStr,
        timeLength: this.lockform.timeLength
      })
    },
    'lockform.timeLength' (val) {
      this.$emit('timeupdate', {
        startTime: this.lockform.lockStartTimeStr,
        timeLength: this.lockform.timeLength
      })
    },
    'lockform.repeatType' (val) {
      if (!val) {
        this.form.dueDate = ''
      }
    },
    'sendMessage' (val) {
      if (!val) {
        this.form.isSmsRemind = 0
      }
    },
    'discountCard' (val) {
      this.form.discount = val && val.id ? val.value : 100
      this.form.benefitId = val ? val.id : ''
    },
    'form.medicalRecordBook' (val) {
      if (!val) {
        this.recordBookPrice = 0
      } else {
        this.getItemPrice('bingliben').then(price => {
          this.recordBookPrice = price
        })
      }
    },
    'form.jiuZhenCard' (val) {
      if (!val) {
        this.jiuZhenCardPrice = 0
      } else {
        this.getItemPrice('jiuzhenka').then(price => {
          this.jiuZhenCardPrice = price || 0
        })
      }
    },
    'form.patient' (val) {
      this.form.patientId = val.id
      this.form.patientName = val.name
    },
    'feeTypePrice' (val) {
      if (val.CZ) {
        this.form.feeType = 'CZ'
      } else if (val.FZ) {
        this.form.feeType = 'FZ'
      } else if (val.PT) {
        this.form.feeType = 'PT'
      } else {
        this.form.feeType = ''
      }
    },
    'form.patient.name' (val) {
      if (!val) {
        this.form.patientId = ''
        this.form.patient.id = ''
      } else {
        this.form.patientName = val
      }
    },
    'form.patient.id' (val) {
      if (!val) {
        return false
      }
      this.$refs.form.clearValidate(['patientId'])
    },
    'activeName' (val, old) {
      if (val === 'number' || val === 'today') {
        this.form.apptType = 2
        if (old !== 'pay') {
          this.patientType = 1
        }
      }
      if (val === 'appoint') {
        if (this.useRules.applyAppointmentRule.isAllow) {
          this.form.apptType = 1
        } else if (this.useRules.formalAppointmentRule.isAllow) {
          this.form.apptType = 2
        }
        if (old !== 'pay') {
          this.patientType = 1
        }
      }
      if (val !== 'pay') {
        this.form.insuranceType = ['number', 'pay', 'today'].includes(this.activeName) && this.apolloValue === '1' ? 1 : 0
      }
      if (this.form.patient) {
        this.showRuleMessage(this.form.patient)
      } else {
        this.warningText = ''
        this.isShowWarning = false
      }
      // this.isValidRepeat = true
      this.isReadIdNo = false
      this.isValidIdNo = false
      this.form.isSceneAppoint = ['number', 'pay', 'today'].includes(val) ? 1 : 0
    },
    'appointmentInfo' (val) {
      this.$bus.$off('pay:success')
      this.$bus.$on('pay:success', action => {
        if (this.sendMessage && !this.form.isSmsRemind) {
          this.$bus.$emit('appoint:sendsms', val)
        }
        if (action === 'update') {
          this.$messageTips(this, 'success', '预约/挂号已变更', '提示')
        }
        if (action === 'cancel') {
          this.$messageTips(this, 'success', '预约/挂号已取消', '提示')
        }
        this.$bus.$emit('appoint:question', val)
        this.$bus.$emit('appoint:success', val, action)
      })
    },
    'form.registerTypeCode' (val) {
      this.setVisitType()
      this.form.useInsurance.cureType = val
    },
    'form.insuranceType' (val) {
      if (!val) {
        this.insuranceOrg = ''
        this.insuranceProduct = ''
        this.form.useInsurance = {
          macId: '',
          cureType: 11,
          insuranceOrgId: '',
          insuranceOrgName: '',
          insuranceProductId: '',
          insuranceProductName: ''
        }
      } else {
        this.form.freeSheet = 0
        this.form.shopSetItemId = -1
      }
      this.getInsuranceOrg()
      this.setVisitType()
    },
    'form.patient.idNo' (val) {
      let submitform
      if (this.activeName === 'pay') {
        submitform = this.$refs.payform
      } else {
        submitform = this.$refs.form
      }
      return val && submitform && submitform.validateField('patient.idNo', valid => {
        if (valid === '身份证格式不正确') {
          this.isValidIdNo = false
          return false
        }
        let myId = this.changeIdNo(val)
        if (myId.birthday && myId.sex) {
          this.form.patient.birthday = myId.birthday
          this.form.patient.sex = myId.sex
          this.isValidIdNo = true
        }
      })
    },
    'form.freeSheet' (val) {
      if (!val) {
        this.form.freeReason = ''
      }
    },
    'insuranceOrg' (val) {
      if (val) {
        this.getInsuranceProduct()
      } else {
        this.insuranceProductList = []
      }
      this.getServicePrice()
    }
  },
  methods: {
    changeIdNo (IdNO) {
      let data = {
        birthday: '',
        sex: ''
      }
      let birthday = ''
      if (!IdNO) {
        return data
      }
      if (IdNO.length === 18) {
        birthday = IdNO.substr(6, 8)
        data.birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        data.sex = IdNO.charAt(16) % 2 === 0 ? '2' : '1'
      } else if (IdNO.length === 15) {
        birthday = '19' + IdNO.substr(6, 6)
        data.birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        data.sex = IdNO.charAt(14) % 2 === 0 ? '2' : '1'
      }
      return data
    },
    setColor (val) {
      if (val === this.form.showStyle) {
        this.form.showStyle = ''
      } else {
        this.form.showStyle = val
      }
    },
    hidePopover () {
      this.$emit('hide', true)
    },
    showPopover () {
      this.$emit('show', true)
    },
    setPatient () {
      this.$emit('patient', this.form.patient.name)
    },
    closePatient () {
      this.resetForm()
      this.$emit('reset', true)
    },
    resetForm () {
      if (this.showType) {
        return false
      }
      this.patientType = 1
      this.sendMessage = false
      this.isMobileConfirm = false
      this.isReadIdNo = false
      this.isValidIdNo = false
      this.insuranceOrg = ''
      this.insuranceProduct = ''
      this.isHaveTaochan = false
      this.form = {
        id: '',
        isSceneAppoint: ['number', 'pay', 'today'].includes(this.activeName) ? 1 : 0,
        subsequentVisit: 0,
        date: this.date,
        startTimeStr: this._startTime,
        endTimeStr: this._endTime,
        timeLength: this.timeLength + '',
        organId: this.organ.organId,
        organName: this.organ.organName,
        deptId: this.dept.deptId,
        deptName: this.dept.deptName,
        apptType: ['number', 'pay', 'today'].includes(this.activeName) ? 2 : 1,
        resourceId: this.resource.resourceId,
        resourceName: this.resource.resourceName,
        serviceId: this.service.serviceId,
        serviceName: this.service.serviceName,
        shopSetItemId: -1,
        feeType: '',
        freeSheet: 0,
        freeReason: '',
        patientId: '',
        patientName: '',
        patient: {
          id: '',
          name: '',
          sex: '1',
          birthday: '',
          mobile: '',
          // agebirthday: {
          //   age: '',
          //   birthday: ''
          // }
        },
        channelId: '',
        isSmsRemind: 0,
        showStyle: 4,
        symptom: '',
        discount: '',
        benefitId: '',
        jiuZhenCard: 0,
        medicalRecordBook: 0,
        registerType: [],
        registerTypeCode: '1',
        appointWayCode: '1',
        registerWayCode: '1',
        insuranceType: 0,
        dataSource: 'Super_Appt',
        questionIds: [],
        useInsurance: {
          macId: '',
          cureType: 11,
          insuranceOrgId: '',
          insuranceOrgName: '',
          insuranceProductId: '',
          insuranceProductName: '',
          medPersonInfo: ''
        }
      }
      this.lockform = {
        organId: this.organ.organId,
        organName: this.organ.organName,
        deptId: this.dept.deptId,
        deptName: this.dept.deptName,
        resourceId: this.resource.resourceId,
        resourceName: this.resource.resourceName,
        lockDate: this.date,
        lockStartTimeStr: this._startTime,
        lockEndTimeStr: this._endTime,
        asstAppoint: 1,
        appAppoint: 0,
        repeatType: 0,
        dueDate: '',
        nonAsstAppoint: 0,
        timeLength: this.timeLength,
        description: ''
      }
      if (this.$refs.patientform) {
        this.$refs.patientform.clearValidate()
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      if (this.$refs.lockform) {
        this.$refs.lockform.clearValidate()
      }
      if (this.$refs.payform) {
        this.$refs.payform.clearValidate()
      }
    },
    resetPatient () {
      this.form.patient = {
        id: '',
        name: '',
        sex: '1',
        birthday: '',
        mobile: '',
      }
      this.isHaveTaochan = false
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.setPatientRules()
    },
    createPatient () {
      this.$refs.createpatient.open()
    },
    setCreatePatient (val) {
      // this.patientName = val.patient ? val.patient.name : val.name
      this.selectPatient(val.patient ? val.patient : val)
    },
    toPayTab () {
      if (this.isValidRepeat) {
        this.setPatient()
        return false
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        if (this.form.insuranceType === 1 && !this.form.useInsurance.medPersonInfo) {
          this.$messageTips(this, 'warning', '医保挂号未读卡不能进行挂号')
          return false
        }
        if (this.form.patient.mobile) {
          this.activeName = 'pay'
          return false
        }
        if (this.sendMessage) {
          this.$prompt('请输入手机号码', '提示', {
            closeOnClickModal: false,
            confirmButtonText: '确定',
            cancelButtonText: '暂不填写',
            inputPattern: /^1(3|4|5|7|8)\d{9}$/,
            inputErrorMessage: '手机号码格式错误'
          }).then(({ value }) => {
            this.form.patient.mobile = value
            this.activeName = 'pay'
          }).catch(() => {
            this.sendMessage = false
            this.activeName = 'pay'
          })
        } else {
          this.$confirm('尚未填写手机号码，是否确认建档并且继续挂号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.activeName = 'pay'
          }).catch(() => {
            this.isSubmit = false
            return false
          })
        }
      })
    },
    submitAppoint (val) {
      let submitform = ''
      if (this.patientType && !this.form.patient.id) {
        return false
      }
      if (this.activeName === 'appoint' && this.isValidRepeat) {
        this.isMobileConfirm = val
        this.setPatient()
        return false
      }
      if (this.activeName === 'pay') {
        submitform = this.$refs.payform
      } else {
        submitform = this.$refs.form
      }
      return submitform && submitform.validate(valid => {
        if (!valid) {
          return false
        }
        this.isSubmit = true
        this.form.endTimeStr = this.getEndTime(this.form.date, this.form.startTimeStr, this.form.timeLength)
        let request = this.form.id ? this.api.updateAppoint : this.api.createAppoint
        if (!val || this.form.patient.mobile) {
          this.addAppointEvent(request)
          return false
        }
        if (this.sendMessage) {
          this.$prompt('请输入手机号码', '提示', {
            closeOnClickModal: false,
            confirmButtonText: '确定',
            cancelButtonText: '暂不填写',
            inputPattern: /^1(3|4|5|7|8)\d{9}$/,
            inputErrorMessage: '手机号码格式错误'
          }).then(({ value }) => {
            this.form.patient.mobile = value
            this.addAppointEvent(request)
          }).catch(() => {
            this.sendMessage = false
            this.addAppointEvent(request)
          })
        } else {
          this.$confirm('尚未填写手机号码，是否确认建档并且继续挂号？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.addAppointEvent(request)
          }).catch(() => {
            this.isSubmit = false
            return false
          })
        }
      })
    },
    addAppointEvent (request) {
      request(this.form).then(rs => {
        this.show = false
        this.isSubmit = false
        this.activeName = 'appoint'
        if (rs.data.checkResultVO && !rs.data.checkResultVO.passed) {
          this.$bus.$emit('appoint:error', rs.data.checkResultVO.message)
          return false
        }
        rs.data.appointmentInfo.patient = {
          id: rs.data.appointmentInfo.patientId,
          name: rs.data.appointmentInfo.patientName,
          mobile: rs.data.appointmentInfo.patientPhone,
          sex: rs.data.appointmentInfo.patientSex
        }
        this.settlementInfo = rs.data.settlementInfo
        this.appointmentInfo = rs.data.appointmentInfo
        if (this.isShowPrice && this.isExistCharge && this.settlementInfo && Object.keys(this.settlementInfo).length) {
          this.settlementInfo.action = this.editAppoint ? 'update' : 'add'
          this.$bus.$emit('appoint:pay', this.settlementInfo)
          return false
        } else if (this.sendMessage && !this.form.isSmsRemind) {
          this.$bus.$emit('appoint:sendsms', this.appointmentInfo)
        }
        this.$bus.$emit('appoint:question', this.appointmentInfo)
        this.$bus.$emit('appoint:success', this.appointmentInfo, this.editAppoint ? 'update' : 'add')
        this.resetForm()
      })
    },
    selectPatient (val) {
      this.$refs.patientform.clearValidate()
      if (!val || !Object.keys(val).length) { return }
      if (val.birthday) {
        val.birthday = this.$moment(val.birthday).format('YYYY-MM-DD')
      }
      this.appointPatient = val
      Object.assign(this.form.patient, val)
      this.form.symptom = val.appointRemark
      this.isValidRepeat = false
      this.getIsTaoChan(val.id)
      this.getPatientServiceSet()
      this.getDiscountList()
      this.showRuleMessage(val)
    },
    showRuleMessage (val) {
      if (val.patientNumber === 'temporary') {
        let applyRule = this.useRules.applyAppointmentRule
        let formalRule = this.useRules.formalAppointmentRule
        let receptionRule = this.useRules.receptionRule
        let c1 = this.activeName === 'appoint' && applyRule.isAllow && applyRule.isFormalDocument && applyRule.documentPayRel !== 'OR'
        let c2 = this.activeName === 'today' && receptionRule.isAllow && receptionRule.isFormalDocument && receptionRule.documentPayRel !== 'OR'
        let c3 = this.activeName === 'number' && formalRule.isAllow && formalRule.isFormalDocument && formalRule.documentPayRel !== 'OR'
        if (c1 || c2 || c3) {
          this.warningText = '非正式建档患者，不可预约此号'
          this.isShowWarning = true
        } else {
          this.warningText = ''
          this.isShowWarning = false
        }
      } else {
        this.warningText = ''
        this.isShowWarning = false
      }
    },
    lockAppoint () {
      this.$refs.lockform.validate(valid => {
        if (!valid) {
          return false
        }
        if (!this.lockform.lockDate) {
          this.$messageTips(this, 'warning', '锁定日期不能为空')
          return false
        }
        if (!this.lockform.lockStartTimeStr) {
          this.$messageTips(this, 'warning', '锁定开始时间不能为空')
          return false
        }
        this.isSubmit = true
        this.lockform.lockEndTimeStr = this.getEndTime(this.lockform.lockDate, this.lockform.lockStartTimeStr, this.lockform.timeLength)
        this.api.createLockAppoint(this.lockform).then(rs => {
          if (rs.data) {
            this.show = false
            this.isSubmit = false
            this.$bus.$emit('lock:success', true)
          }
        })
      })
    },
    setDefaultTime (req) {
      this.lockform.lockStartTimeStr = this._startTime
      this.lockform.lockEndTimeStr = this._endTime
      this.lockform.timeLength = this.timeLength
      this.form.startTimeStr = this._startTime
      this.form.endTimeStr = this._endTime
      this.form.timeLength = this.timeLength + ''
      this.setDefaultTimeList()
      if (!this.isClick) {
        return false
      }
      this.api.getNumberTime({
        date: this.form.date,
        organId: this.form.organId,
        deptId: this.form.deptId,
        resourceId: this.form.resourceId,
        serviceId: this.form.serviceId,
        startTimeStr: this._startTime,
        endTimeStr: this._endTime
      }).then(rs => {
        if (rs.data) {
          this.form.startTimeStr = rs.data.startTimeStr
          this.form.endTimeStr = rs.data.endTimeStr
          this.form.timeLength = rs.data.timeLength + ''
          this.setDefaultTimeList()
          this.restaurants.unshift({
            name: rs.data.timeLength + '分钟 (默认)',
            value: rs.data.timeLength + '',
            endTime: ''
          })
        }
      })
    },
    getEndTime (date, time, len) {
      return this.$moment(date + ' ' + time).add(len, 'm').format('HH:mm')
    },
    getBusiInsurColor (val) {
      if (val.busiInsurAllExpire) {
        return 'gray'
      } else if (val.busiInsurExpire) {
        return 'red'
      } else {
        return 'green'
      }
    },
    getBusiSupplInsurColor (val) {
      if (val.busiSupplInsurAllExpire) {
        return 'gray'
      } else if (val.busiSupplInsurExpire) {
        return 'red'
      } else {
        return 'green'
      }
    },
    closePopover () {
      this.show = false
      this.resetForm()
      this.$emit('close', true)
    },
    querySearch (val, cb) {
      cb(this.restaurants)
    },
    handleCommand (val) {
      this.form.showStyle = val
    },
    setDefaultTimeList () {
      this.restaurants = []
      this.selectTimeConfig.map((item, i) => {
        this.restaurants.push({
          name: item + '分钟',
          value: item + '',
          endTime: this.$moment(this.date + ' ' + this._startTime).add(item, 'm').format('HH:mm')
        })
      })
    },
    changeDefaultTimeList () {
      this.restaurants.map((item, i) => {
        if (item.endTime) {
          item.endTime = this.$moment(this.date + ' ' + this.form.startTimeStr).add(item.value, 'm').format('HH:mm')
        }
        return item
      })
    },
    getIsTaoChan (val) {
      if (val) {
        this.api.getOrderSet({patientId: val}).then(rs => {
          this.isHaveTaochan = rs.data && rs.data[0]
        })
      }
    },
    setUseRules () {
      this.api.getUseRules({
        organId: this.organ.organId,
        deptType: 1,
        deptId: this.dept.deptId,
        resourceId: this.resource.resourceId,
        resourceType: 'DOCTOR',
        serviceId: this.service.serviceId
      }).then(rs => {
        this.isExistCharge = rs.data.isExistCharge
        this.useRules = rs.data.normalCustomerRuleDetail
        if (!this.useRules.applyAppointmentRule.isAllow && !this.useRules.formalAppointmentRule.isAllow) {
          this.warningText = '不支持申请预约或正式预约'
          this.isShowWarning = true
        } else if (this.editAppoint) {
          this.form.apptType = this.editAppoint.apptType
        } else if (this.useRules.applyAppointmentRule.isAllow) {
          this.form.apptType = 1
        } else if (this.useRules.formalAppointmentRule.isAllow) {
          this.form.apptType = 2
        }
        if (this.editAppoint) {
          this.form.id = this.editAppoint.id
          this.form.showStyle = this.editAppoint.showStyle
          this.form.symptom = this.editAppoint.symptom
          this.form.patient = Object.assign(this.form.patient, this.editAppoint.patient)
          if (this.editAppoint.apptType === 2 && this.date === this.$moment().format('YYYY-MM-DD')) {
            this.activeName = 'today'
          } else if (this.editAppoint.isSceneAppoint) {
            this.activeName = 'number'
          } else {
            this.activeName = 'appoint'
          }
        } else if (this.useRules.applyAppointmentRule.isAllow) {
          this.activeName = 'appoint'
        } else if (this.date === this.$moment().format('YYYY-MM-DD') && this.useRules.formalAppointmentRule.isAllow && this.useRules.receptionRule.isAllow) {
          this.activeName = 'today'
        } else if (this.useRules.formalAppointmentRule.isAllow) {
          this.activeName = 'number'
        } else {
          this.activeName = 'lock'
        }
        this.isShowPay()
      })
    },
    setPatientRules () {
      this.api.getPatientParams({type: this.addPatientType}).then(rs => {
        this.patientRules = rs.data
      })
    },
    getServicePrice () {
      this.api.getServicePrice(
        this.organ.organId,
        this.service.serviceId,
        this.service.serviceName,
        this.insuranceOrg.id
      ).then(rs => {
        if (!rs.data || !rs.data.itemPriceList[0]) {
          this.servicePrice = 0
          return false
        }
        if (!rs.data.itemPriceList[0].price && rs.data.itemPriceList[0].price !== 0) {
          this.servicePrice = ''
        }
        if (this.editAppoint && this.editAppoint.serviceOrder) {
          this.servicePrice = rs.data.itemPriceList[0].price - this.editAppoint.serviceOrder.totalPrice
        } else {
          this.servicePrice = rs.data.itemPriceList[0].price
        }
      })
    },
    getPatientServiceSet () {
      this.serviceSetList = []
      if (this.form.patient.id && this.form.deptId && this.form.serviceId) {
        this.api.getServiceSetList({
          patientId: this.form.patient.id,
          dptId: this.dept.deptId,
          serviceId: this.service.serviceId
        }).then(rs => {
          if (rs.head.errCode || !rs.data) {
            this.serviceSetList = []
            this.form.shopSetItemId = -1
            return false
          }
          this.serviceSetList = rs.data
        })
      } else {
        this.serviceSetList = []
        this.form.shopSetItemId = -1
      }
    },
    getDiscountList () {
      if (this.form.patient.id && this.form.serviceId) {
        this.api.getPatientDiscounts({ patientId: this.form.patient.id, itemId: this.form.serviceId }).then(rs => {
          if (!rs.head.errCode && rs.data[0]) {
            this.discountList = rs.data.map(item => {
              item.name = (item.discount / 10).toFixed(1) + '折'
              item.value = item.discount
              item.id = item.patientBenefitId
              return item
            })
          } else {
            this.discountList = []
            this.discountCard = {id: '', name: '无折扣'}
          }
        })
      }
    },
    getItemPrice (code) {
      return this.sobapi.listByCode({ code: code }).then(rs => {
        if (!rs.head.errCode && rs.data) {
          return this.api.getServicePrice(
            this.organ.organId,
            rs.data.id,
            rs.data.name
          ).then(rs => {
            return !rs.head.errCode ? rs.data.itemPriceList[0].price : 0
          })
        } else {
          return 0
        }
      })
    },
    isShowPay () {
      if (!this.useRules) {
        return false
      }
      let applyRule = this.useRules.applyAppointmentRule
      let formalRule = this.useRules.formalAppointmentRule
      let receptionRule = this.useRules.receptionRule
      this.isShowPrice = true
      if (this.activeName === 'appoint') {
        if (applyRule.isPay && applyRule.isFormalDocument && applyRule.documentPayRel === 'OR') {
          this.isShowPrice = false
        }
        if (formalRule.isPay && formalRule.isFormalDocument && formalRule.documentPayRel === 'OR') {
          this.isShowPrice = false
        }
      }
      if (this.activeName === 'number') {
        if (formalRule.isPay && formalRule.isFormalDocument && formalRule.documentPayRel === 'OR') {
          this.isShowPrice = false
        }
      }
      if (this.activeName === 'today') {
        if (receptionRule.isPay && receptionRule.isFormalDocument && receptionRule.documentPayRel === 'OR') {
          this.isShowPrice = false
        }
      }
    },
    returnNumberForm () {
      this.activeName = this.date === this.$moment().format('YYYY-MM-DD') ? 'today' : 'number'
    },
    appointPay (flag, result, id, visit) {
      result.visitNumber = visit
      this.$bus.$emit('appoint:rcm2Visible', {
        flag: 'ajax_success',
        printType: 'register',
        rcmResult: result,
        appointId: id,
        isRefund: !!flag,
        xianchang: 1,
        isMedicalInsurance: 1
      })
    },
    getChannelList () {
      this.api.getChannelList().then(rs => {
        this.channelList = rs.data.resultList
      })
    },
    getApolloConfig () {
      this.api.getApolloValue({key: 'ARRANGE_FEIBIE', defaultValue: 1}).then(rs => {
        this.apolloValue = rs.data
        this.form.insuranceType = ['number', 'pay', 'today'].includes(this.activeName) && this.apolloValue === '1' ? 1 : 0
      })
    },
    changeInsuranceType () {
      this.insuranceOrg = ''
      this.insuranceProduct = ''
      this.form.useInsurance = {
        macId: '',
        cureType: 11,
        insuranceOrgId: '',
        insuranceOrgName: '',
        insuranceProductId: '',
        insuranceProductName: ''
      }
    },
    getInsuranceOrg () {
      if (!this.form.insuranceType) {
        this.insuranceOrgList = []
        return false
      }
      this.api.getInsuranceOrg({corpType: this.form.insuranceType === 2 ? 1 : 0}).then(rs => {
        this.insuranceOrgList = rs.data
        this.insuranceOrg = rs.data[0]
        this.changeInsuranceOrg(rs.data[0])
      })
    },
    getInsuranceProduct () {
      this.api.getInsuranceProduct({id: this.insuranceOrg.id}).then(rs => {
        this.insuranceProductList = rs.data
        this.insuranceProduct = rs.data[0]
        this.changeInsuranceProduct(rs.data[0])
      })
    },
    changeInsuranceOrg (val) {
      this.form.useInsurance.insuranceOrgId = val ? val.id : ''
      this.form.useInsurance.insuranceOrgName = val ? val.insureOrgShortName : ''
      this.insuranceProduct = ''
      this.changeInsuranceProduct()
    },
    changeInsuranceProduct (val) {
      this.form.useInsurance.insuranceProductId = val ? val.id : ''
      this.form.useInsurance.insuranceProductName = val ? val.productName : ''
    },
    setMedicalInfo (val) {
      this.form.useInsurance.medPersonInfo = val
      this.form.useInsurance.macId = val.macId
    },
    getIdcardData (val) {
      if (!val || !val.idCode) {
        this.$messageTips(this, 'error', '请连接身份证读卡设备')
        return false
      }
      this.isReadIdNo = true
      this.form.patient.name = val.name
      this.form.patient.birthday = this.$moment(val.birthday).format('YYYY-MM-DD')
      // this.form.patient.agebirthday = {
      // }
      if (val.sex === '男') {
        this.form.patient.sex = '1'
      } else if (val.sex === '女') {
        this.form.patient.sex = '2'
      }
      this.form.patient.idNo = val.idCode
    },
    setVisitType () {
      let val = this.form.registerTypeCode
      if (['1', '4', '5', '6', '7', '11', '12'].includes(val)) {
        this.visitType = '门诊'
      }
      if (['2', '21', '22'].includes(val)) {
        this.visitType = '急诊'
      }
      if (['3', '31', '32', '33'].includes(val)) {
        this.visitType = '体检'
      }
      if (['99'].includes(val)) {
        this.visitType = '其他'
      }
    }
  },
  computed: {
    _endTime () {
      return this.$moment(this.date + ' ' + this._startTime).add(this.timeLength, 'm').format('HH:mm')
    },
    _startTime () {
      return this.$moment(this.date + ' ' + this.startTime).format('HH:mm')
    },
    discountPrice () {
      if (this.form.discount !== '' && this.servicePrice) {
        return (this.servicePrice - this.servicePrice * this.form.discount / 100).toFixed(2)
      } else {
        return '0.00'
      }
    },
    currentPrice () {
      if (this.form.shopSetItemId !== -1) {
        return 0
      } else {
        return this.servicePrice
      }
    }
  }
}
</script>
<style scoped>
  .addarea {height: 100%;}
  .mainbox .ml20 {margin-left: 14px;}
  .mainbox .el-form-item {margin-bottom: 7px; font-size: 14px;}
  .lockform .el-form-item {margin-bottom: 14px; font-size: 14px;}
  .mainbox /deep/ .el-form-item__label {height: 32px; color: #999;}
  .mainbox /deep/ .el-form-item__content {line-height: 32px;}
  .mainbox /deep/ .el-tabs__item{padding: 0 10px;}
  .mainbox /deep/ .el-tabs--top .el-tabs__item.is-top:nth-child(2) {margin-left:72px;}
  .mainbox /deep/ .el-tabs__active-bar{left: 72px;}
  .colors{cursor: pointer;}
  .color {display: inline-block; padding: 0; width: 14px; height: 14px; border-radius: 50%; cursor: pointer;}
  .currclolr {display: inline-block; width: 14px; height: 14px; position: relative; border-radius: 50%;}
  .colors .el-icon-arrow-down {vertical-align: middle; position: relative; top: -3px; margin-left: 0;}
  .popperitem {width: 240px; padding: 0 5px;}

  .el-popper .gray{color: #999;}
  .fontred{color: #ee4433; font-size: 14px;}
  .fontgreen{color: #00B636; font-size: 14px;}
  .el-row em {font-style: normal;}
  .el-form-item .el-icon-warning{color: #ee4433; line-height: inherit;margin-right: 5px;}
  .el-form-item em{font-style: normal;}
  .editing {position: absolute; left: 0; right: 0; top: 0; background: #FFD7D7; text-align: center; height: 55px; line-height: 55px; z-index: 999;}
  .mainbox /deep/ .el-dialog__header{padding: 0;}
  .mainbox /deep/ .el-dialog__body {padding: 0; }
  .mainbox .el-form-item {margin-bottom: 0;}
  .mainbox .el-form /deep/ .el-form-item__label {height: 40px;}
  .mainbox .el-form /deep/ .el-form-item__content {line-height: 40px; min-height: 40px;}
  .mainbox .right {border-left: 1px solid #ddd; min-height: 500px; background: #f2f2f2;}
  .mainbox .wrap {box-shadow: 0 5px 5px 0 #D8D8D8}
  .mainbox .wrap > .el-col {padding: 20px;}
  .mainbox .btline {border-bottom: 1px solid #D8D8D8; min-height: 40px;}
  .mainbox .fontblue {color: #1C7BEF;}
  .mainbox .fontgray {color: #AAAAAA;}
  .mainbox .lab {display: inline-block; height: 20px; line-height: 20px; font-size: 12px; color: #fff; font-style: normal; padding: 0 5px; border-radius: 2px; text-align: center;}
  .mainbox .lab.blue {background: #1c7bef;}
  .mainbox .lab.green {background: #61a812;}
  .mainbox .lab.yellow {background: #E6E3B4;height: 18px; line-height: 18px; border:1px solid #CFCC9E; color: #575100;}
  .mainbox .lab.orange {background: #e38748;}
  .mainbox .lab.red {background: #ee4433;}
  .mainbox .lab.violet {background: #bd10e0;}
  .mainbox .lab.gray {background: #666666;}
  .mainbox .lab.deepblue {background: #366298;}
  .mainbox .input-title{padding: 0 10px; height: 32px; line-height: 32px; position: relative; top:3px; background:#C0CCD9 ; border-radius: 5px 5px 0 0;}
  .mainbox .icon-login-password {font-size: 120px; position: absolute; left: 120px; top: 120px; color: #999;}
  .left_wrap {position: relative;}
  .addbutton {position: absolute; right: 20px; top: 24px;}
</style>
