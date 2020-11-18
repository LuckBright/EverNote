<template>
  <div id="registerpanel">
    <el-container>
      <el-aside width="480px">
        <el-row class="patient-select">
          <el-col :span="19">
              <ever-patient-select
                size="small"
                :scence="0"
                :disabled="!!editAppoint"
                v-model.trim="patientName"
                :get-membercard-flag="true"
                :allow-create="true"
                :grey-denies-dialog-show="true"
                @medicalInfo="setMedicalInfo"
                :insurance-org-id="insuranceOrg.id"
                :show-attr-type="false"
                @memberdata="selectPatient"
              ></ever-patient-select>
          </el-col>
          <el-col :span="5">
            <el-button size="small" type="primary" class="ml10" :disabled="!!editAppoint" @click="createPatient">新建档案</el-button>
          </el-col>
        </el-row>
        <el-form :model="form.patient" label-width="80px">
          <el-form-item label="姓名：">
            <div class="btline">
              <span class="fontblue">{{form.patient.name || '--'}}</span>
              <span class="ml10" v-if="form.patient.sex">{{form.patient.sex | formatSex}}</span>
              <span class="ml10">{{form.patient.ageShowText}}</span>
            </div>
          </el-form-item>
          <el-form-item label="出生日期：">
            <div class="btline">{{form.patient.birthday ? $moment(form.patient.birthday).format('YYYY-MM-DD') : '--'}}</div>
          </el-form-item>
          <el-form-item label="手机号：">
            <div class="btline">{{form.patient.mobile || '--'}}</div>
          </el-form-item>
          <el-form-item label="身份证号：">
            <div class="btline">{{form.patient.idNo || '--'}}</div>
          </el-form-item>
          <el-form-item label="就诊卡号：">
            <div class="btline">{{form.patient.visitCards | formatVisitNo}}</div>
          </el-form-item>
          <el-form-item label="患者标签：">
            <div class="btline">
              <template v-if="isHaveTaochan">
                <em class="mr10 lab green">套餐</em>
              </template>
              <template v-if="form.patient.busiInsur">
                <a
                  :class="getBusiInsurColor(form.patient.busiInsur)"
                  :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                  target="_blank"
                  class="lab"
                  v-if="form.patient.busiInsur.busiInsurFlag">
                  商保
                </a>
                <a
                  :href="$ever.crmIndex + '/crm/memberinfo/userinfo/userinsuranceinfo/' + form.patient.id"
                  target="_blank"
                  class="ml10 lab"
                  :class="getBusiSupplInsurColor(form.patient.busiInsur)"
                  v-if="form.patient.busiInsur.busiSupplInsurFlag">
                  商补
                </a>
              </template>
              <template v-if="form.patient.member && form.patient.member.objLabelList">
                <em class="mr10 lab red" :style="{background: item.color}" v-for="(item, i) in form.patient.member.objLabelList" :key="i">{{item.labelName}}</em>
              </template>
              <template v-if="noLabels">--</template>
            </div>
          </el-form-item>
          <el-form-item label="患者身份：">
            <div class="btline">
              <label v-if="!form.patient.benefit">--</label>
              <template v-else>
                <em class="mr10 lab yellow" v-for="(item, i) in form.patient.benefit.split(',')" :key="i">{{item}}</em>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="预约提示：">
            <div class="btline">{{form.patient.appointRemind || '--'}}</div>
          </el-form-item>
          <el-form-item label="" class="mt20">
            <el-link class="btnlink mr10" v-if="patientValue" :href="$ever.crmIndex + '/crm/memberinfo/userinfo/memberbaseinfo/' + patientValue.id" target="_blank">
              <el-button type="primary" size="small">患者档案</el-button>
            </el-link>
             <el-link class="btnlink mr10">
              <el-button plain type="primary" @click="patientName=''" size="small">清空</el-button>
             </el-link>
             <el-link class="btnlink">
              <el-button type="primary" @click="isInsurance=true" size="small">医保账户查询</el-button>
             </el-link> 
          </el-form-item>
        </el-form>
        <div class="cards">
          <div class="card" v-for="(item, i) in patientAppointList" :key="i">
            <div class="title">
               <label class="lab green">{{item.apptType === 1 ? item.appointWayName : item.dataSourceDesc}}</label>
               <label class="ml10">{{item.organName}}</label>
            </div>
            <div class="title">
              <label>{{item.deptName}}</label>
              <label>{{item.resourceName}}</label>
              <label class="ml10 font12" v-if="item.staffInfo">{{item.staffInfo.skillsTitle2Name}}</label>
              <label class="ml10 font12">{{item.serviceName}}</label>
              <span class="subscript">{{item.appointStatusDesc}}</span>
            </div>
            
            <div class="time" v-if="item.arrangeInstance">
              <label>{{item.arrangeInstance.arrangeTime | formatAppointDate}} {{item.arrangeInstance.timetrunkName}}</label>
            </div>
            <div class="foot">
              <el-button size="mini" plain type="primary" @click="returnRegister(item)" v-if="item.organId === currentOrganId">退号</el-button>
              <el-button size="mini" plain type="primary"  v-if="item.apptType === 1 && item.organId === currentOrganId" @click="appointToRegister(item)">预转挂</el-button>
              <el-button size="mini" plain type="primary" @click="setEditRegister(item)" v-if="item.apptType === 1 && !item.serviceOrder">改约</el-button>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane label="挂号" name="register">
            <div class="editmodel" v-if="editAppoint && editAppoint.patient">
              <span>为患者{{editAppoint.patient.name}} {{$moment(editAppoint.dateStr).format('MM月DD日')}} {{editAppoint.startTimeStr}}分 在 {{editAppoint.deptName}} {{editAppoint.resourceName}}医生 的预约 选择新的预约</span>
              <el-button size="mini" @click="cannelEditModel">取消编辑</el-button>
            </div>
            <el-form :model="form" label-width="92px" class="registerform" ref="registerform">
              <el-row class="btline" style="padding: 5px 0" :gutter="10">
                <el-col :span="5">
                  <el-form-item label="初复诊：" prop="subsequentVisit" :rules="rules.required">
                    <el-select v-model="form.subsequentVisit" size="small">
                      <el-option label="初诊" :value="0"></el-option>
                      <el-option label="复诊" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="挂号类别：" prop="registerTypeCode" :rules="rules.required">
                    <sys-type code="CT05.10.004" :clearable="false" v-model="form.registerTypeCode" :multiple="false"></sys-type>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="挂号方式：" prop="registerWayCode" :rules="rules.required">
                    <sys-type code="CT05.10.005" :clearable="false" v-model="form.registerWayCode" :multiple="false"></sys-type>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="就诊类型："><span>{{this.visitType}}</span></el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="发送短信：" prop="sendMessage">
                      <el-switch
                        v-model="sendMessage">
                      </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="btline" style="padding: 5px 0" :gutter="10">
                <el-col :span="5">
                  <el-form-item label="费别：">
                    <el-select v-model="form.insuranceType" @change="changeInsuranceType" :disabled="!isAllowInsurance" size="small">
                      <el-option label="自费" :value="0"></el-option>
                      <el-option label="医保" :value="1"></el-option>
                      <el-option label="商保" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5" v-if="form.insuranceType">
                  <el-form-item label="保险机构：" prop="useInsurance.insuranceOrgId" :rules="rules.required">
                    <el-select size="small" v-model="insuranceOrg" value-key="id" style="width:100%" @change="changeInsuranceOrg" clearable>
                      <el-option v-for="(item, i) in insuranceOrgList" :key="i" :label="item.insureOrgShortName" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5"  v-if="form.insuranceType">
                  <el-form-item label="保险产品：" prop="useInsurance.insuranceProductId" :rules="rules.required">
                    <el-select size="small" v-model="insuranceProduct" value-key="id" style="width:100%" @change="changeInsuranceProduct" clearable>
                      <el-option v-for="(item, i) in insuranceProductList" :key="i" :label="item.productName" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="search">
                <el-col :span="18">
                  <el-form :model="params" :inline="true" size="small">
                    <el-form-item label="">
                      <el-select v-model="selectCity" size="small" :disabled="true" @change="changeCity" placeholder="城市" value-key="cityCode" style="width:100px">
                        <el-option
                          v-for="(item, i) in orgCityList"
                          :key="i"
                          :value="item"
                          :label="item.cityName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <el-select v-model="selectOrgan" size="small" :disabled="true" placeholder="机构" value-key="id" @change="changeOrgan" style="width:132px">
                        <el-option
                          v-for="(item, i) in orgItemList"
                          :key="i"
                          :value="item"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <ever-subject-select v-model="selectDept" :disabled="isQuoteDept" placeholder="请选择科室" @change="changeDept" type="select" :params="deptParams" style="width:132px"></ever-subject-select>
                    </el-form-item>
                    <el-form-item label="">
                      <ever-staff-select v-model="params.resourceId" :disabled="isQuoteResource" placeholder="请选择医生" @change="changeResource" :params="resourceParams" style="width:132px"></ever-staff-select>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="6">
                  <el-form :model="params" :inline="true" size="small">
                    <el-form-item label="时间：">
                      <el-date-picker
                        style="width:132px"
                        v-model="params.date"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="加号：">
                      <el-switch
                        :active-value="1"
                        :inactive-value="0"
                        v-model="form.isPlus">
                      </el-switch>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row class="panel">
                <el-col :span="12" class="left">
                  <el-row>
                    <el-col :span="24" class="left-head">
                      <label>末次来院及诊断：</label>
                      <template v-if="latestVisit">
                        <span>{{latestVisit.deptName}}</span>
                        <el-button
                        :type="!isQuoteDept ? 'primary' : ''"
                        size="mini"
                        @click="setLatestDept(latestVisit)">{{!isQuoteDept ? '引用' :'撤销'}}</el-button>
                        <template v-if="latestVisit.resourceId && latestVisit.resourceId !== '-1'">
                          <span class="ml20">{{latestVisit.resourceName}}</span>
                          <el-button
                          :type="!isQuoteResource ? 'primary' : ''"
                          size="mini"
                          @click="setLatestResource(latestVisit)">{{!isQuoteResource ? '引用' :'撤销'}}</el-button>
                        </template>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row class="select-number">
                    <el-col :span="9" class="line-right">
                      <ul class="first">
                        <li v-for="(item, i) in arrangeDeptList"
                        :key="i"
                        :class="{on: currentParams.deptId === item.tenantDeptId}"
                        @click="setCurrentParams('deptId', item.tenantDeptId, item.tenantDeptName)">{{item.tenantDeptName}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="9" class="line-right">
                      <ul>
                        <li v-for="(item, i) in arrangeServiceList"
                        :key="i"
                        :class="{on: currentParams.serviceId === item.serviceId}"
                        @click="setCurrentParams('serviceId', item.serviceId, item.serviceName)">{{item.serviceName || '科室号'}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="6">
                      <ul>
                        <li v-for="(item, i) in arrangeResourceList"
                        :key="i"
                        :class="{on: currentParams.resourceId === item.resourceId}"
                        @click="setCurrentParams('resourceId', item.resourceId, item.resourceName)">{{item.resourceName}}</li>
                      </ul>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12" class="right">
                  <div class="inner">
                    <template v-for="(arrange, i) in arrangeTimesliceList">
                      <template v-for="(times , j) in arrange.timeranges">
                        <div :key="i + '-' + j">
                          <div class="arrange">
                            <strong>{{arrange.timetrunkName}}</strong>
                            <span>（{{times.timerangeStartDate}}-{{times.timerangeEndDate}}）</span>
                          </div>
                          <ul class="times clearfix" v-if="arrange.frequencyType === 1">
                            <li
                              v-for="(item, k) in times.timeslices"
                              @click="setCurrentTimeslice(item)"
                              :class="{disabled: item.stockAmount < 1 || form.isPlus, on: currentParams.startTimeStr === item.startDate}"
                              :key="i + '-' + j + '-' + k">{{item.startDate}}</li>
                              <li v-if="form.isPlus && (!times.plusApptCount || times.plusApptCount < 10)"
                              :class="{on: currentParams.arrangeTimerangeId === times.timerangeId}"
                              @click="setAddTimeslice(times, arrange.instanceId)">+</li>
                              <li class="full" v-if="form.isPlus && times.plusApptCount && times.plusApptCount >= 10">
                                已加号{{times.plusApptCount}}人
                              </li>
                          </ul>
                          <div
                            v-if="arrange.frequencyType === 2"
                            class="progress"
                            :class="{disabled: times.timeslices[0].stockAmount < 1, on: currentParams.startTimeStr === times.timeslices[0].startDate}"
                            @click="setCurrentTimeslice(times.timeslices[0])">
                            <span :style="{width: (times.timeslices[0].occupyAmount / times.timeslices[0].amount) * 100 +'%'}"></span>
                            <label><em>{{times.timeslices[0].occupyAmount}}</em> / {{times.timeslices[0].amount}}</label>
                          </div>
                        </div>
                      </template>
                    </template>
                  </div>
                </el-col>
              </el-row>
              <el-row class="btline" style="padding: 5px 0" :gutter="10">
                <el-col :span="4">
                  <el-form-item label="免单：">
                    <el-switch
                      :disabled="!!form.insuranceType"
                      :active-value="1"
                      :inactive-value="0"
                      v-model="form.freeSheet">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="免单原因：">
                    <el-input v-model="form.freeReason" :maxlength="200" size="small" placeholder="请输入免单原因" :disabled="!form.freeSheet"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="套餐及保障计划：">
                    <el-select
                      size="small"
                      :disabled="!!form.insuranceType"
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
                <el-col :span="8">
                  <el-form-item label="备注：">
                    <el-input v-model="form.symptom" size="small" :maxlength="200"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="padding: 10px 0" :gutter="10">
                <el-col>
                  <el-button size="small" type="primary" :disabled="isSubmit || servicePrice === ''" class="submitbtn" @click="submitRegister">挂号</el-button>
                  <template v-if="isShowPrice">
                    <span class="ml10" v-if="servicePrice !==''">挂号费：￥ <strong style="font-size: 16px;">{{servicePrice || '0.00'}}</strong> 元</span>
                    <span class="ml10" v-else style="color:red">暂未找到对应的价格</span>
                  </template>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="预约" name="appoint">
            <div class="editmodel" v-if="editAppoint && editAppoint.patient">
              <span>为患者{{editAppoint.patient.name}} {{$moment(editAppoint.dateStr).format('MM月DD日')}} {{editAppoint.startTimeStr}}分 在 {{editAppoint.deptName}} {{editAppoint.resourceName}}医生 的预约 选择新的预约</span>
              <el-button size="mini" @click="cannelEditModel">取消编辑</el-button>
            </div>
            <el-form :model="form" label-width="92px" class="registerform" ref="appointform">
              <el-row class="btline" style="padding: 5px 0" :gutter="10">
                <el-col :span="5">
                  <el-form-item label="初复诊：" prop="subsequentVisit" :rules="rules.required">
                    <el-select v-model="form.subsequentVisit" size="small">
                      <el-option label="初诊" :value="0"></el-option>
                      <el-option label="复诊" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="挂号类别：" prop="registerTypeCode" :rules="rules.required">
                    <sys-type code="CT05.10.004" :clearable="false" v-model="form.registerTypeCode" :multiple="false"></sys-type>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="预约途径：" prop="appointWayCode" v-if="activeName === 'appoint'" :rules="rules.required">
                    <sys-type code="CT05.10.006" v-model="form.appointWayCode" :multiple="false"></sys-type>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="就诊类型："><span>{{this.visitType}}</span></el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="发送短信：" prop="sendMessage">
                      <el-switch
                        v-model="sendMessage">
                      </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="search">
                <el-col :span="18">
                  <el-form :model="params" :inline="true" size="small">
                    <el-form-item label="">
                      <el-select v-model="selectCity" size="small" @change="changeCity" placeholder="城市" value-key="cityCode" style="width:100px">
                        <el-option
                          v-for="(item, i) in orgCityList"
                          :key="i"
                          :value="item"
                          :label="item.cityName"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <el-select v-model="selectOrgan" size="small" placeholder="机构" value-key="id" :disabled="isEditMessage" @change="changeOrgan" style="width:132px">
                        <el-option
                          v-for="(item, i) in orgItemList"
                          :key="i"
                          :value="item"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="">
                      <ever-subject-select v-model="selectDept" :disabled="isQuoteDept" placeholder="请选择科室" @change="changeDept" type="select" :params="deptParams" style="width:132px"></ever-subject-select>
                    </el-form-item>
                    <el-form-item label="">
                      <ever-staff-select v-model="params.resourceId" :disabled="isQuoteResource" placeholder="请选择医生" @change="changeResource" :params="resourceParams" style="width:132px"></ever-staff-select>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="6">
                  <el-form :model="params" :inline="true" size="small">
                    <el-form-item label="时间：">
                      <el-date-picker
                        style="width:132px"
                        v-model="params.date"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row class="panel">
                <el-col :span="12" class="left">
                  <el-row>
                    <el-col :span="24" class="left-head">
                      <label>末次来院及诊断：</label>
                      <template v-if="latestVisit">
                        <span>{{latestVisit.deptName}}</span>
                        <el-button
                        :type="!isQuoteDept ? 'primary' : ''"
                        size="mini"
                        @click="setLatestDept(latestVisit)">{{!isQuoteDept ? '引用' :'撤销'}}</el-button>
                        <span class="ml20">{{latestVisit.resourceName}}</span>
                        <el-button
                        :type="!isQuoteResource ? 'primary' : ''"
                        size="mini"
                        @click="setLatestResource(latestVisit)">{{!isQuoteResource ? '引用' :'撤销'}}</el-button>
                      </template>
                    </el-col>
                  </el-row>
                  <el-row class="select-number">
                    <el-col :span="9" class="line-right">
                      <ul class="first">
                        <li v-for="(item, i) in arrangeDeptList"
                        :key="i"
                        :class="{on: currentParams.deptId === item.tenantDeptId}"
                        @click="setCurrentParams('deptId', item.tenantDeptId, item.tenantDeptName)">{{item.tenantDeptName}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="6" class="line-right">
                      <ul>
                        <li v-for="(item, i) in arrangeServiceList"
                        :key="i"
                        :class="{on: currentParams.serviceId === item.serviceId}"
                        @click="setCurrentParams('serviceId', item.serviceId, item.serviceName)">{{item.serviceName || '科室号'}}</li>
                      </ul>
                    </el-col>
                    <el-col :span="9">
                      <ul>
                        <li v-for="(item, i) in arrangeResourceList"
                        :key="i"
                        :class="{on: currentParams.resourceId === item.resourceId}"
                        @click="setCurrentParams('resourceId', item.resourceId, item.resourceName)">{{item.resourceName}}</li>
                      </ul>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="12" class="right">
                  <div class="inner">
                    <template v-for="(arrange, i) in arrangeTimesliceList">
                      <template v-for="(times , j) in arrange.timeranges">
                        <div :key="i + '-' + j">
                          <div class="arrange">
                            <strong>{{arrange.timetrunkName}}</strong>
                            <span>（{{times.timerangeStartDate}}-{{times.timerangeEndDate}}）</span>
                          </div>
                          <ul class="times clearfix" v-if="arrange.frequencyType === 1">
                            <li
                              v-for="(item, k) in times.timeslices"
                              @click="setCurrentTimeslice(item)"
                              :class="{disabled: item.stockAmount < 1 || form.isPlus, on: currentParams.startTimeStr === item.startDate}"
                              :key="i + '-' + j + '-' + k">{{item.startDate}}</li>
                              <li v-if="form.isPlus && (!times.plusApptCount || times.plusApptCount < 10)"
                              :class="{on: currentParams.arrangeTimerangeId === times.timerangeId}"
                              @click="setAddTimeslice(times, arrange.instanceId)">+</li>
                              <li class="full" v-if="form.isPlus && times.plusApptCount && times.plusApptCount >= 10">
                                已加号{{times.plusApptCount}}人
                              </li>
                          </ul>
                          <div
                            v-if="arrange.frequencyType === 2"
                            class="progress"
                            :class="{disabled: times.timeslices[0].stockAmount < 1, on: currentParams.startTimeStr === times.timeslices[0].startDate}"
                            @click="setCurrentTimeslice(times.timeslices[0])">
                            <span :style="{width: (times.timeslices[0].occupyAmount / times.timeslices[0].amount) * 100 +'%'}"></span>
                            <label><em>{{times.timeslices[0].occupyAmount}}</em> / {{times.timeslices[0].amount}}</label>
                          </div>
                        </div>
                      </template>
                    </template>
                  </div>
                </el-col>
              </el-row>
              <el-row class="btline" style="padding: 5px 0" :gutter="10">
                <el-col :span="4">
                  <el-form-item label="免单：">
                    <el-switch
                      :disabled="!!form.insuranceType"
                      :active-value="1"
                      :inactive-value="0"
                      v-model="form.freeSheet">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="免单原因：">
                    <el-input v-model="form.freeReason" :maxlength="200" size="small" placeholder="请输入免单原因" :disabled="!form.freeSheet"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="套餐：">
                    <el-select
                      size="small"
                      :disabled="!!form.insuranceType"
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
                <el-col :span="8">
                  <el-form-item label="备注：">
                    <el-input v-model="form.symptom" size="small" :maxlength="200"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="padding: 10px 0" :gutter="10">
                <el-col>
                  <el-button size="small" type="primary" class="submitbtn" :disabled="isSubmit || servicePrice === ''" @click="submitRegister">{{editAppoint ? '改约' : '预约'}}</el-button>
                  <template v-if="isShowPrice">
                    <span class="ml10" v-if="servicePrice !==''">挂号费：￥ <strong style="font-size: 16px;">{{servicePrice}}</strong></span>
                    <span class="ml10" v-else style="color:red">暂未找到对应的价格，请选择其他费用类型</span>
                  </template>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="补卡补本" name="card">
            <dialog-bind-card :patient="patientValue"></dialog-bind-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <send-message2
      ref="sendmessage"
      :data="allSendParams"
    ></send-message2>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="yzsParams"
      @payStatus="payStatus"
      @closedialog="closePayDialog"
    ></paymethodstwo>
    <dialog-register-pay :show.sync="isShowPay" :service-set-list="serviceSetList" v-model="form" @submit="registerPay" :type="activeName"></dialog-register-pay>
    <dialog-register-return :show.sync="isShowReturn" v-model="returnAppoint"></dialog-register-return>
    <dialog-insurance :insuranceOrgId="form.useInsurance.insuranceOrgId" :self-account-show.sync="isInsurance"></dialog-insurance>
    <create-patient ref="createpatient" page-type="2" @getArchivesObj="setCreatePatient"></create-patient>
  </div>
</template>
<script>
  import api from '@/arrange/store/appointmentapi'
  import storage from '@/util/storage'
  import createPatient from '@/crm/components/createarchivesdialog.vue'
  import dialogInsurance from '@/rcm/otmdiscomponent/hljmedical/selfaccountquery.vue'
  import dialogFollowAppoint from '@/follow/page/template/dialog-follow-appoint'
  import dialogBindCard from '@/arrange/page/register/dialog-bindcard'
  import sendMessage2 from '@/crm/page/sendmessage2'
  import dialogRegisterPay from '@/arrange/page/appoint/dialog-register-pay'
  import dialogRegisterReturn from '@/arrange/page/appoint/dialog-register-return'
  import { validatePhone } from '@/util/validate'
  import { everprint } from '@/util/print'
  export default {
    components: {
      dialogFollowAppoint,
      createPatient,
      dialogBindCard,
      sendMessage2,
      dialogRegisterPay,
      dialogRegisterReturn,
      dialogInsurance
    },
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
        storage,
        isEditMessage: false,
        sendMessage: false,
        isHaveTaochan: false,
        payVisible: false,
        isSubmit: false,
        isExistCharge: true,
        isShowPay: false,
        isShowReturn: false,
        isFastRegister: false,
        isInsurance: false,
        apolloValue: '',
        activeName: 'register',
        useRules: '',
        editAppoint: '',
        returnAppoint: '',
        patientName: '',
        patientValue: '',
        selectCity: '',
        selectOrgan: '',
        selectDept: '',
        insuranceOrg: '',
        insuranceProduct: '',
        discountCard: '',
        latestVisit: '',
        isQuoteDept: false,
        isQuoteResource: false,
        isShowPrice: false,
        settlementInfo: '',
        appointmentInfo: '',
        currentAppoint: '',
        payAction: '',
        servicePrice: 0,
        feeTypePrice: '',
        visitType: '门诊',
        orgCityList: [],
        orgItemList: [],
        arrangeDeptList: [],
        arrangeServiceList: [],
        arrangeResourceList: [],
        arrangeTimesliceList: [],
        insuranceOrgList: [],
        insuranceProductList: [],
        patientAppointList: [],
        serviceSetList: [],
        discountList: [],
        allSendParams: {},
        yzsParams: {
          iscallback: true, // 外层loading
          loading: false,
          patientid: '', // 患者id
          id: '', // 结算单id
          orderId: '', // 订单ID
          settleCode: '', // 结算单号
          unexefee: 0, // 还需支付
          exefee: 0, // 已收金额
          totalFee: 0, // 总额
          payType: '4', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
          paymethodArr: [], // 支付方式
          isValited: false, // 押金是false,费用为true
          isDeposit: 0, // 是否押金(押金传1)
          isRefund: false,  // 是否退费(退费传true)
          isChange: false,
          visitNumber: '',
          medInsurPubPayFee: '',
          medInsurOwnPayFee: ''
        },
        params: {
          resourceId: '', // 医生Id
          apptType: '',
          patientId: '',
          queryPatientParam: '',
          date: this.$moment().format('YYYY-MM-DD'),
          dates: [],
          pagesize: 20,
          offset: 0,
          deptId: '',
          organId: '',
          channelId: ''
        },
        organParams: {
          cityCodeList: []
        },
        deptParams: {
          status: 'Y',
          orgIdList: [],
          type1CodeList: ['01'],
          type2CodeList: ['01.02', '01.03']
        },
        resourceParams: {
          orgIdList: [],
          everQueryType: 'out',
          typeCodeList: ['DOCTOR'],
          tenantSubjectIdList: []
        },
        currentParams: {
          date: this.$moment().format('YYYY-MM-DD'),
          deptId: '',
          deptName: '',
          serviceId: '',
          serviceName: '',
          resourceId: '',
          resourceName: '',
          arrangeId: '',
          arrangeTimerangeId: '',
          startTimeStr: '',
          endTimeStr: ''
        },
        currentOrganId: storage.getLocalStorage('CLINICID'),
        currentOrganName: storage.getLocalStorage('CLINICNAME'),
        form: {
          id: '',
          isPlus: 0,
          subsequentVisit: 0,
          isEmergency: 0,
          insuranceType: 0,
          identityCardCheck: true,
          jiuZhenCard: 0,
          medicalRecordBook: 0,
          discount: '',
          isSmsRemind: 0,
          shopSetItemId: -1,
          feeType: '',
          freeSheet: 0,
          freeReason: '',
          questionIds: [],
          organId: '',
          organName: '',
          patientId: '',
          newPatientMobile: '',
          symptom: '',
          dataSource: '1',
          registerTypeCode: '1',
          appointWayCode: '1',
          registerWayCode: '1',
          patient: {
            id: '',
            name: '',
            sex: '',
            birthday: '',
            mobile: ''
          },
          useInsurance: {
            macId: '',
            cureType: 11,
            insuranceOrgId: '',
            insuranceOrgName: '',
            insuranceProductId: '',
            insuranceProductName: '',
            medPersonInfo: ''
          }
        },
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
            {required: false, validator: validatePhone, trigger: ['change']}
          ]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      }
    },
    created () {
      if (!this.storage.getLocalStorage('APPOINT_CLINICID')) {
        this.storage.setLocalStorage('APPOINT_CLINICID', this.currentOrganId)
      }
      if (this.$route.query.id) {
        this.activeName = 'appoint'
        this.api.getAppointData({ id: this.$route.query.id }).then(rs => {
          this.editAppoint = rs.data
        })
      }
      this.$bus.$off('appoint:sendsms')
      this.$bus.$on('appoint:sendsms', val => {
        this.currentPatient = [val.patient]
        this.allSendParams = {
          msgType: 108, // 想要发动短信所属的大分类 必传
          deptId: val.deptId, // 默认科室，不传需要下拉选择 非必传
          ccMobiles: '', // 抄送人手机号 分号隔开'18618453594;18618453594;18618453594', 不传显示为空 非必传
          receivers: [
            {
              id: val.patientId,  // patientId 必传
              name: val.patientName,  // patientName 必传
              mobile: val.patientMobile,  // 手机号 必传 业务方决定用哪个手机号
              payload: {  // 短信内容数据，非必传
                docName: val.resourceName, // 医生姓名
                hosName: val.organName, // 医院姓名
                patientName: val.patientName, // 患者姓名
                // clinicName: val.providerName, // 诊室名称
                appointTime: `${this.$moment(val.date).format('MM-DD')} ${val.startTimeStr}`, // 预约时间
                visitTime: val.arrivalTime ? this.$moment(val.arrivalTime).format('MM-DD HH:mm') : this.$moment().format('MM-DD'), // 就诊时间
                appointDate: this.$moment(val.date).format('MM-DD'), // 预约日期
                appointStartTime: val.startTimeStr, // 预约开始时间
                appointEndTime: val.endTimeStr// 预约结束时间
              }
            }
          ]
        }
        if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
          this.$refs.sendmessage.sendVisible = true
        }
      })
      this.$bus.$off('appoint:pay')
      this.$bus.$on('appoint:pay', val => {
        this.yzsParams.orderId = val.orderid || val.orderId
        this.yzsParams.patientid = val.patientid
        this.yzsParams.id = val.id
        this.yzsParams.accountbillId = val.accountbillId
        this.yzsParams.settleCode = val.settleCode
        this.yzsParams.unexefee = val.unexefee
        this.yzsParams.exefee = val.exefee
        this.yzsParams.totalFee = val.totalFee
        this.yzsParams.isRefund = val.isRefund
        this.yzsParams.visitNumber = val.visitNumber
        this.yzsParams.medInsurPubPayFee = val.medInsurPubPayFee
        this.yzsParams.medInsurOwnPayFee = val.medInsurOwnPayFee
        this.payVisible = true
        this.payAction = val.action
      })
      this.$bus.$off('pay:success')
      this.$bus.$on('pay:success', action => {
        if (action === 'toregister') {
          this.appointToRegisterEvent(this.appointmentInfo)
          return false
        }
        if (this.sendMessage && action === 'add') {
          this.$bus.$emit('appoint:sendsms', this.appointmentInfo)
        }
        this.$bus.$emit('appoint:question', this.appointmentInfo)
        this.$bus.$emit('appoint:success', this.appointmentInfo, action)
      })
      this.$bus.$off('appoint:success')
      this.$bus.$on('appoint:success', (val, action) => {
        if (action === 'update') {
          this.cannelEditModel()
          this.$messageTips(this, 'success', '改约成功', '提示')
          this.resetForm()
        }
        if (action === 'add') {
          this.$messageTips(this, 'success', '预约/挂号成功', '提示')
          this.resetForm()
        }
        if (action === 'toregister') {
          this.$messageTips(this, 'success', '预转挂已完成', '提示')
          this.getValidAppointments()
        }
        if (action === 'bindcard') {
          this.$messageTips(this, 'success', '就诊已绑定成功', '提示')
          this.$bus.$emit('cardbook:success', true)
          this.resetForm()
        }
        if (action === 'buybook') {
          this.$messageTips(this, 'success', '病历本已购买成功', '提示')
          this.$bus.$emit('cardbook:success', true)
          this.resetForm()
        }
        if (action === 'cancel') {
          this.$messageTips(this, 'success', '退号成功', '提示')
          this.isShowReturn = false
          this.resetForm(true)
          this.getValidAppointments()
        }
        if (typeof val === 'object' && val.isSceneAppoint && action !== 'cancel') {
          this.print(val)
        }
      })
      this.$bus.$on('onError', val => {
        this.isSubmit = false
        this.setUseRules()
      })
      this.getOrganCityList()
      this.getApolloConfig()
      this.getInsuranceOrg()
    },
    watch: {
      'activeName' (val) {
        this.selectDept = ''
        this.params.deptId = ''
        this.params.resourceId = ''
        this.form.isPlus = 0
        if (val !== 'appoint') {
          this.editAppoint = ''
        }
        this.resetForm(true)
      },
      'isShowPay' (val) {
        if (!val) {
          this.isSubmit = false
        }
      },
      'selectCity' (val) {
        this.organParams.cityCodeList = val ? [val.cityCode] : []
        this.getOrgList()
      },
      'selectOrgan' (val) {
        this.params.organId = val ? val.id : ''
        this.form.organId = val ? val.id : ''
        this.form.organName = val ? val.name : ''
        this.deptParams.orgIdList = val ? [val.id] : [this.currentOrganId]
        this.resourceParams.orgIdList = val ? [val.id] : [this.currentOrganId]
        this.params.deptId = ''
        this.params.resourceId = ''
        if (this.activeName === 'appoint') {
          this.storage.setLocalStorage('APPOINT_CLINICID', val.id)
          this.storage.setLocalStorage('APPOINT_CLINICNAME', val.name)
        }
        this.getArrangeDeptList()
        this.getLatestVisit()
      },
      'patientValue' (val) {
        this.form.patientId = val ? val.id : ''
        if (val) {
          this.form.symptom = val.appointRemark
        } else {
          this.isHaveTaochan = false
        }
        this.form.patient = val || {
          id: '',
          name: '',
          sex: '',
          birthday: '',
          mobile: ''
        }
        this.getLatestVisit()
        this.getPatientServiceSet()
      },
      'params.date' (val) {
        this.currentParams.date = val
        this.currentParams.deptId = ''
        this.form.isPlus = 0
        this.getArrangeDeptList()
      },
      'patientName' (val) {
        if (!val) {
          this.patientValue = ''
          this.patientAppointList = []
        }
      },
      'arrangeTimesliceList' (val) {
        if (val && val[0] && val[0].frequencyType === 2 && this.form.isPlus) {
          let timerlen = val[0].timeranges.length
          this.currentParams.arrangeId = val[0].instanceId
          this.currentParams.arrangeTimerangeId = val[0].timeranges[timerlen - 1].timerangeId
          this.currentParams.startTimeStr = val[0].timeranges[timerlen - 1].timerangeStartDate
          this.currentParams.endTimeStr = val[0].timeranges[timerlen - 1].timerangeEndDate
        }
      },
      'form.isPlus' (val) {
        this.currentParams.arrangeId = ''
        this.currentParams.arrangeTimerangeId = ''
        this.currentParams.startTimeStr = ''
        this.currentParams.endTimeStr = ''
        if (val) {
          if (this.params.date !== this.$moment().format('YYYY-MM-DD')) {
            this.$messageTips(this, 'warning', '超出加号时间范围不能加号', '提示')
            this.form.isPlus = 0
          }
          if (this.arrangeTimesliceList[0] && this.arrangeTimesliceList[0].frequencyType === 2) {
            let timerlen = this.arrangeTimesliceList[0].timeranges.length
            this.currentParams.arrangeId = this.arrangeTimesliceList[0].instanceId
            this.currentParams.arrangeTimerangeId = this.arrangeTimesliceList[0].timeranges[timerlen - 1].timerangeId
            this.currentParams.startTimeStr = this.arrangeTimesliceList[0].timeranges[timerlen - 1].timerangeStartDate
            this.currentParams.endTimeStr = this.arrangeTimesliceList[0].timeranges[timerlen - 1].timerangeEndDate
          }
        }
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
      },
      'editAppoint' (val) {
        this.resetForm(!val)
        if (val) {
          this.patientName = val.patient.name
          this.api.getPatientInfo({patientId: val.patient.id}).then(rs => {
            this.patientValue = rs.data
          })
          this.form.id = val.id
          this.form.organId = val.organId
          this.form.organName = val.organName
        }
      },
      'isAllowInsurance' (val) {
        if (!val && !this.apolloValue) {
          this.form.insuranceType = 0
        }
      },
      'currentParams.deptId' (val) {
        if (val) {
          this.getArrangeServiceList()
        }
      },
      'currentParams.serviceId' (val) {
        if (val) {
          this.getPatientServiceSet()
          this.getArrangeResourceList()
        }
      },
      'currentParams.resourceId' (val) {
        if (val) {
          this.getArrangeTimesliceList()
          this.setUseRules()
          this.getServicePrice()
        }
      },
      '$route.query.id' (val) {
        this.activeName = 'appoint'
        this.api.getAppointData({ id: val }).then(rs => {
          this.editAppoint = rs.data
        })
      }
    },
    methods: {
      resetForm (flag) {
        this.isHaveTaochan = false
        this.sendMessage = false
        this.isQuoteDept = false
        this.isQuoteResource = false
        this.selectDept = ''
        let init = {
          id: '',
          isPlus: 0,
          subsequentVisit: 0,
          isEmergency: 0,
          insuranceType: ['register'].includes(this.activeName) && this.apolloValue === '1' ? 1 : 0,
          identityCardCheck: true,
          jiuZhenCard: 0,
          medicalRecordBook: 0,
          discount: '',
          isSmsRemind: 0,
          shopSetItemId: -1,
          feeType: '',
          freeSheet: 0,
          freeReason: '',
          questionIds: [],
          organId: '',
          organName: '',
          patientId: '',
          newPatientMobile: '',
          symptom: '',
          dataSource: '1',
          registerTypeCode: '1',
          appointWayCode: '1',
          registerWayCode: '1',
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
        if (!flag) {
          this.patientName = ''
          init.patient = {
            id: '',
            name: '',
            sex: '',
            birthday: '',
            mobile: ''
          }
        }
        this.insuranceOrg = ''
        this.insuranceProduct = ''
        this.serviceSetList = []
        this.params = {
          resourceId: '', // 医生Id
          apptType: '',
          patientId: '',
          queryPatientParam: '',
          date: this.$moment().format('YYYY-MM-DD'),
          dates: [],
          pagesize: 20,
          offset: 0,
          deptId: '',
          organId: '',
          channelId: ''
        }
        this.currentParams = {
          date: this.params.date || this.$moment().format('YYYY-MM-DD'),
          deptId: '',
          deptName: '',
          serviceId: '',
          serviceName: '',
          resourceId: '',
          resourceName: '',
          arrangeId: '',
          arrangeTimerangeId: '',
          startTimeStr: '',
          endTimeStr: ''
        }
        this.form = Object.assign(this.form, init)
        this.setCurrentCity()
        this.getArrangeDeptList()
      },
      setUseRules () {
        if (!this.currentParams.deptId || !this.currentParams.resourceId || !this.currentParams.serviceId) {
          // this.useRules = ''
          return false
        }
        this.api.getUseRules({
          organId: this.params.organId,
          deptType: 1,
          deptId: this.currentParams.deptId,
          resourceId: this.currentParams.resourceId,
          resourceType: 'DOCTOR',
          serviceId: this.currentParams.serviceId
        }).then(rs => {
          this.isExistCharge = rs.data.isExistCharge
          this.useRules = rs.data.normalCustomerRuleDetail
          this.getIsShowPrice()
        })
      },
      selectPatient (val) {
        this.patientValue = val
        Object.assign(this.form.patient, val)
        if (val) {
          this.getIsTaoChan(val.id)
          this.getValidAppointments()
        } else {
          this.isHaveTaochan = false
          this.patientAppointList = []
          this.latestVisit = ''
        }
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
      getIsTaoChan (val) {
        if (val) {
          this.api.getOrderSet({patientId: val}).then(rs => {
            this.isHaveTaochan = rs.data && rs.data[0]
          })
        }
      },
      getServicePrice () {
        if (!this.currentParams.serviceId || !this.form.organId) {
          this.servicePrice = 0
          return false
        }
        this.api.getServicePrice(
          this.form.organId,
          this.currentParams.serviceId,
          this.currentParams.serviceName,
          this.insuranceOrg.id
        ).then(rs => {
          if (!rs.data || !rs.data.itemPriceList[0]) {
            this.servicePrice = 0
            return false
          }
          this.servicePrice = rs.data.itemPriceList[0].price
        })
      },
      changeCity (val) {
        return val
      },
      getOrganCityList () {
        this.api.getOrganCity().then(rs => {
          this.orgCityList = rs.data
          this.setCurrentCity()
        })
      },
      getOrgList () {
        let APPOINT_CLINICID = this.storage.getLocalStorage('APPOINT_CLINICID')
        let CLINICID = this.currentOrganId
        this.api.getOrgList({
          outOrgGetOrgListByConditionReqDTO: {
            cityCodeList: [this.selectCity.cityCode],
          },
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            type1CodeList: ['01'],
            type2CodeList: ['01.02', '01.03']
          }
        }).then(rs => {
          this.orgItemList = rs.data.resultList
          if (APPOINT_CLINICID && this.activeName === 'appoint') {
            let item = this.orgItemList.filter(item => {
              return item.id === APPOINT_CLINICID
            })[0]
            this.selectOrgan = item || this.orgItemList[0]
          } else if (CLINICID) {
            let item = this.orgItemList.filter(item => {
              return item.id === CLINICID
            })[0]
            this.selectOrgan = item || this.orgItemList[0]
          } else {
            this.selectOrgan = this.orgItemList[0]
          }
        })
      },
      setCurrentCity () {
        const APPOINT_CLINICID = this.activeName === 'register' ? this.currentOrganId : this.storage.getLocalStorage('APPOINT_CLINICID')
        this.api.getOrgInfo({idList: APPOINT_CLINICID ? [APPOINT_CLINICID] : []}).then(rs => {
          if (rs.data && rs.data[0]) {
            this.selectCity = {
              cityCode: rs.data[0].cityCode,
              cityName: rs.data[0].cityName
            }
            this.setInitOrgan()
          }
        })
      },
      setInitOrgan () {
        if (this.activeName === 'appoint' && this.storage.getLocalStorage('APPOINT_CLINICID')) {
          this.selectOrgan = {
            id: this.storage.getLocalStorage('APPOINT_CLINICID'),
            name: this.storage.getLocalStorage('APPOINT_CLINICNAME')
          }
        } else {
          this.selectOrgan = {
            id: this.currentOrganId,
            name: this.currentOrganName
          }
        }
      },
      changeOrgan (val) {
        this.isQuoteVisit = false
        this.selectDept = ''
        this.params.deptId = ''
        this.params.resourceId = ''
        this.resourceParams.tenantSubjectIdList = []
      },
      changeDept (val) {
        this.params.deptId = val ? val.id : ''
        this.resourceParams.tenantSubjectIdList = val && val.id ? [val.id] : []
        this.params.resourceId = ''
        this.getArrangeDeptList()
      },
      changeResource (val) {
        this.params.resourceId = val
        this.getArrangeDeptList()
      },
      getArrangeDeptList () {
        this.currentParams.deptId = ''
        this.api.getArrangeDepts({
          orgId: this.params.organId,
          tenantDeptId: this.params.deptId,
          resourceId: this.params.resourceId,
          startDate: this.params.date,
          endDate: this.params.date,
          categoryCode: 'OUTPATIENT_DOCTOR'
        }).then(rs => {
          this.arrangeDeptList = rs.data
          if (rs.data && rs.data[0]) {
            // this.currentParams.serviceId = ''
            this.setCurrentParams('deptId', rs.data[0].tenantDeptId, rs.data[0].tenantDeptName)
          } else {
            this.arrangeServiceList = []
            this.arrangeResourceList = []
            this.arrangeTimesliceList = []
          }
        })
      },
      getArrangeServiceList () {
        this.currentParams.serviceId = ''
        this.api.getArrangeService({
          orgId: this.params.organId,
          startDate: this.params.date,
          endDate: this.params.date,
          tenantDeptId: this.currentParams.deptId,
          resourceId: this.params.resourceId,
          categoryCode: 'OUTPATIENT_DOCTOR'
        }).then(rs => {
          if (rs.data && rs.data[0]) {
            this.arrangeServiceList = rs.data
            this.currentParams.resourceId = ''
            this.setCurrentParams('serviceId', rs.data[0].serviceId, rs.data[0].serviceName)
          } else {
            this.arrangeResourceList = []
            this.arrangeTimesliceList = []
          }
        })
      },
      getArrangeResourceList () {
        this.currentParams.resourceId = ''
        this.api.getArrangeResource({
          orgId: this.params.organId,
          startDate: this.params.date,
          endDate: this.params.date,
          resourceId: this.params.resourceId,
          tenantDeptId: this.currentParams.deptId,
          serviceId: this.currentParams.serviceId,
          categoryCode: 'OUTPATIENT_DOCTOR'
        }).then(rs => {
          if (rs.data && rs.data[0]) {
            this.arrangeResourceList = rs.data.filter(item => {
              return item.resourceId === '-1' || item.resourceName
            })
            this.currentParams.resourceId = ''
            this.setCurrentParams('resourceId', rs.data[0].resourceId, rs.data[0].resourceName)
            this.setCurrentTimeslice(false)
          } else {
            this.arrangeTimesliceList = []
          }
        })
      },
      getArrangeTimesliceList () {
        this.api.getArrangeTimeslice({
          orgId: this.params.organId,
          arrangeTime: this.params.date,
          tenantDeptId: this.currentParams.deptId,
          serviceId: this.currentParams.serviceId,
          resourceId: this.currentParams.resourceId,
          queryPlusApptCount: true,
          categoryCode: 'OUTPATIENT_DOCTOR'
        }).then(rs => {
          this.arrangeTimesliceList = rs.data
        })
      },
      getValidAppointments () {
        this.api.getValidAppointments({patientId: this.patientValue.id}).then(rs => {
          this.patientAppointList = rs.data
        })
      },
      setCurrentParams (key, val, name) {
        this.currentParams[key] = val
        if (key === 'deptId') {
          this.currentParams.deptName = name
        }
        if (key === 'serviceId') {
          this.currentParams.serviceName = name
        }
        if (key === 'resourceId') {
          this.currentParams.resourceName = name
        }
      },
      setCurrentTimeslice (val) {
        if ((val && val.stockAmount < 1) || this.form.isPlus) {
          return false
        }
        this.currentParams.arrangeId = val ? val.instanceId : ''
        this.currentParams.arrangeTimerangeId = ''
        this.currentParams.startTimeStr = val ? val.startDate : ''
        this.currentParams.endTimeStr = val ? val.endDate : ''
      },
      setAddTimeslice (val, arrangeId) {
        this.currentParams.arrangeTimerangeId = val.timerangeId
        this.currentParams.arrangeId = arrangeId
        this.currentParams.startTimeStr = val.timeslices[val.timeslices.length - 1].startDate
        this.currentParams.endTimeStr = val.timeslices[val.timeslices.length - 1].endDate
      },
      getApolloConfig () {
        this.api.getApolloValue({key: 'ARRANGE_FEIBIE', defaultValue: 1}).then(rs => {
          this.apolloValue = rs.data
          this.form.insuranceType = ['register'].includes(this.activeName) && this.apolloValue === '1' ? 1 : 0
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
      getPatientServiceSet () {
        this.serviceSetList = []
        if (this.patientValue.id && this.currentParams.deptId && this.currentParams.serviceId) {
          this.api.getServiceSetList({
            patientId: this.patientValue.id,
            dptId: this.currentParams.deptId,
            serviceId: this.currentParams.serviceId
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
      getLatestVisit () {
        if (!this.patientValue) {
          this.latestVisit = ''
          return false
        }
        this.isQuoteResource = false
        this.isQuoteDept = false
        this.api.getLatestVisit({
          patientId: this.patientValue.id,
          organId: this.params.organId,
          deptId: this.params.deptId
        }).then(rs => {
          this.latestVisit = rs.data
        })
      },
      setLatestDept (item) {
        if (!this.isQuoteDept) {
          this.selectDept = {id: item.deptId, orgSubjectCode: item.deptId, orgSubjectName: item.deptName}
          this.params.deptId = item.deptId
          this.resourceParams.tenantSubjectIdList = item.deptId ? [item.deptId] : []
          this.isQuoteDept = true
        } else {
          this.selectDept = ''
          this.params.deptId = ''
          this.params.resourceId = ''
          this.resourceParams.tenantSubjectIdList = []
          this.isQuoteDept = false
          this.isQuoteResource = false
        }
        this.getArrangeDeptList()
      },
      setLatestResource (item) {
        if (!this.isQuoteResource) {
          this.api.getLatestDateOutCall({
            orgId: this.selectOrgan.id,
            tenantDeptId: item.deptId,
            resourceId: item.resourceId
          }).then(rs => {
            if (rs.data) {
              this.params.date = rs.data
            }
            this.selectDept = {id: item.deptId, orgSubjectCode: item.deptId, orgSubjectName: item.deptName}
            this.params.deptId = item.deptId
            this.params.resourceId = item.resourceId
            this.resourceParams.tenantSubjectIdList = item.deptId ? [item.deptId] : ''
            this.isQuoteDept = true
            this.isQuoteResource = true
            this.getArrangeDeptList()
          })
        } else {
          this.params.resourceId = ''
          this.resourceParams.tenantSubjectIdList = []
          this.isQuoteResource = false
          this.getArrangeDeptList()
        }
      },
      setEditRegister (val) {
        this.activeName = 'appoint'
        this.editAppoint = val
      },
      submitRegister () {
        let request = this.api.createRegister
        let submitFrom = this.activeName === 'register' ? this.$refs.registerform : this.$refs.appointform
        if (this.patientValue) {
          this.form.patientId = this.patientValue.id
          this.form.patient = this.patientValue
        }
        this.form = Object.assign({}, this.form, this.currentParams)
        if (this.activeName === 'appoint') {
          request = this.api.createAppointRegister
        }
        if (this.editAppoint) {
          request = this.api.updateAppointRegister
        }
        if (!this.form.patientId) {
          this.$messageTips(this, 'warning', '请选择患者', '提示')
          return false
        }
        if (!this.form.arrangeId) {
          this.$messageTips(this, 'warning', '请选择时间', '提示')
          return false
        }
        submitFrom.validate(valid => {
          if (!valid) {
            return false
          }
          this.isSubmit = true
          if (this.form.patient.mobile) {
            this.requestRegister(request)
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
              this.form.newPatientMobile = value
              this.requestRegister(request)
            }).catch(() => {
              this.sendMessage = false
              this.requestRegister(request)
            })
          } else {
            this.$confirm('尚未填写手机号码，是否确认建档并且继续挂号？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.requestRegister(request)
            }).catch(() => {
              this.isSubmit = false
              return false
            })
          }
        })
      },
      requestRegister (request) {
        let isShowPayDialog
        if (this.activeName === 'register') {
          isShowPayDialog = this.isExistCharge && (this.useRules.formalAppointmentRule.documentPayRel === 'AND' || !this.useRules.formalAppointmentRule.documentPayRel) && this.useRules.formalAppointmentRule.isPay
        }
        if (this.activeName === 'appoint') {
          isShowPayDialog = this.isExistCharge && (this.useRules.applyAppointmentRule.documentPayRel === 'AND' || !this.useRules.applyAppointmentRule.documentPayRel) && this.useRules.applyAppointmentRule.isPay
        }
        if (isShowPayDialog) {
          this.isShowPay = true
        } else {
          return request(this.form).then(rs => {
            if (rs.data.checkResultVO && !rs.data.checkResultVO.passed) {
              this.isSubmit = false
              this.setUseRules()
              this.$messageTips(this, 'warning', rs.data.checkResultVO.message)
              return false
            }
            this.isSubmit = false
            this.isShowPay = false
            rs.data.appointmentInfo.patient = {
              id: rs.data.appointmentInfo.patientId,
              name: rs.data.appointmentInfo.patientName,
              mobile: rs.data.appointmentInfo.patientPhone,
              sex: rs.data.appointmentInfo.patientSex
            }
            this.settlementInfo = rs.data.settlementInfo
            this.appointmentInfo = rs.data.appointmentInfo
            if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
              this.settlementInfo.action = this.editAppoint ? 'update' : 'add'
              this.$bus.$emit('appoint:pay', this.settlementInfo)
              return false
            }
            if (this.sendMessage) {
              this.$bus.$emit('appoint:sendsms', this.appointmentInfo)
            }
            this.$bus.$emit('appoint:question', this.appointmentInfo)
            this.$bus.$emit('appoint:success', this.appointmentInfo, this.editAppoint ? 'update' : 'add')
          })
        }
      },
      registerPay (val) {
        let request
        this.isExistCharge = false
        Object.assign(this.form, val)
        if (this.activeName === 'appoint') {
          request = this.editAppoint ? this.api.updateAppointRegister : this.api.createAppointRegister
        }
        if (this.activeName === 'register') {
          request = this.api.createRegister
        }
        this.requestRegister(request)
      },
      appointToRegister (val) {
        if (val.serviceOrder && !val.serviceOrder.isPaid) {
          this.api.getSettlementInfo({ id: val.id, returnFlag: 0 }).then(rs => {
            this.settlementInfo = rs.data
            this.appointmentInfo = val
            if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
              this.settlementInfo.action = 'toregister'
              this.$bus.$emit('appoint:pay', this.settlementInfo)
              return false
            }
          })
        } else {
          this.appointToRegisterEvent({
            id: val.id,
            patientId: val.patientId,
            isSceneAppoint: val.isSceneAppoint,
            date: val.dateStr,
            startTimeStr: val.startTimeStr,
            endTimeStr: val.endTimeStr,
            organId: val.organId,
            organName: val.organName,
            deptId: val.deptId,
            deptName: val.deptName,
            resourceId: val.resourceId,
            resourceName: val.resourceName,
            serviceId: val.serviceId,
            serviceName: val.serviceName
          })
        }
      },
      appointToRegisterEvent (val) {
        this.api.changeAppoint(val).then(rs => {
          if (rs.data.checkResultVO && !rs.data.checkResultVO.passed) {
            this.$messageTips(this, 'warning', rs.data.checkResultVO.message)
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
          if (this.settlementInfo && Object.keys(this.settlementInfo).length) {
            this.settlementInfo.action = 'add'
            this.$bus.$emit('appoint:pay', this.settlementInfo)
            return false
          }
          this.$bus.$emit('appoint:question', this.appointmentInfo)
          this.$bus.$emit('appoint:success', this.appointmentInfo, 'toregister')
        })
      },
      returnRegister (val) {
        this.returnAppoint = val
        this.isShowReturn = true
      },
      payStatus (val) {
        this.$bus.$emit('pay:success', this.payAction)
      },
      closePayDialog (val) {
        this.payVisible = false
        this.resetForm()
      },
      print (val) {
        let params = {queryApptNum: true}
        if (val.visitNumber) {
          params.visitNumber = val.visitNumber
        }
        if (val.patientId) {
          params.patientId = val.patientId
        }
        if (this.yzsParams.settleCode) {
          params.id = this.yzsParams.settleCode
        }
        if (this.yzsParams.orderId) {
          params.orderId = this.yzsParams.orderId
        }
        everprint('registform', params, {
          preview: true,
          cb: _ => {
            console.log('打印完成')
          }
        })
      },
      cannelEditModel () {
        this.editAppoint = ''
      },
      createPatient () {
        this.$refs.createpatient.open()
      },
      setCreatePatient (val) {
        this.patientName = val.patient ? val.patient.name : val.name
        this.selectPatient(val.patient ? val.patient : val)
      },
      getIsShowPrice () {
        if (!this.useRules) {
          this.isShowPrice = false
          return false
        }
        let applyRule = this.useRules.applyAppointmentRule
        let formalRule = this.useRules.formalAppointmentRule
        this.isShowPrice = true
        if (this.activeName === 'appoint') {
          if (applyRule.isPay && applyRule.isFormalDocument && applyRule.documentPayRel === 'OR') {
            this.isShowPrice = false
          }
          if (formalRule.isPay && formalRule.isFormalDocument && formalRule.documentPayRel === 'OR') {
            this.isShowPrice = false
          }
        }
        if (this.activeName === 'register') {
          if (formalRule.isPay && formalRule.isFormalDocument && formalRule.documentPayRel === 'OR') {
            this.isShowPrice = false
          }
        }
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
    filters: {
      formatVisitNo (value) {
        if (!value || !value[0]) {
          return '--'
        }
        let strArr = value.map(val => {
          return val.no
        })
        return strArr.join('，')
      },
      formatAppointDate (value) {
        if (!value || !value[0]) {
          return ''
        }
        let week = ['日', '一', '二', '三', '四', '五', '六']
        let date = new Date(value)
        return value + ' 周' + week[date.getDay()]
      }
    },
    computed: {
      currentPrice () {
        if (this.form.shopSetItemId !== -1) {
          return 0
        } else {
          return this.servicePrice
        }
      },
      noLabels () {
        let noHaveBusiInsur = !this.form.patient.busiInsur || (!this.form.patient.busiInsur.busiInsurFlag && !this.form.patient.busiInsur.busiSupplInsurFlag)
        let noHaveLabels = !this.form.patient.member || !this.form.patient.member.objLabelList
        return !this.form.patient.id || (!this.isHaveTaochan && noHaveBusiInsur && noHaveLabels)
      },
      isAllowInsurance () {
        return this.params.date === this.$moment().format('YYYY-MM-DD') && this.currentOrganId === this.params.organId
      }
    }
  }
</script>

<style scoped>
  #registerpanel {font-size: 14px;}
  #registerpanel .el-aside:not(.no-box-sha) {height:calc(100vh - 60px); box-shadow: none; padding: 20px 30px; border-right: 1px solid #ddd; background: #fff;}
  #registerpanel .el-main {height:calc(100vh - 60px); background: #F8F9FA; padding:20px 30px !important;}
  #registerpanel .patient-select {margin-bottom: 30px;}
  #registerpanel .el-form-item {margin-bottom: 0;}
  #registerpanel .registerform /deep/ .el-form-item__label {height: 40px;}
  #registerpanel .el-aside .el-form /deep/ .el-form-item__label {height: 36px; padding-right: 0; color: #999;}
  #registerpanel .btline {border-bottom: 1px solid #D8D8D8;}
  #registerpanel .el-aside .btline {border-bottom: 1px solid #D8D8D8; min-height: 36px; line-height: 36px; padding: 0 10px;}
  #registerpanel .fontblue {color: #1C7BEF;}
  #registerpanel .fontgray {color: #AAAAAA;}
  #registerpanel .lab {display: inline-block; height: 20px; line-height: 20px; font-size: 12px; color: #fff; font-style: normal; padding: 0 5px; border-radius: 2px; text-align: center;}
  #registerpanel .lab.blue {background: #1c7bef;}
  #registerpanel .lab.green {background: #61a812;}
  #registerpanel .lab.yellow {background: #E6E3B4;height: 18px; line-height: 18px; border:1px solid #CFCC9E; color: #575100;}
  #registerpanel .lab.orange {background: #e38748;}
  #registerpanel .lab.red {background: #ee4433;}
  #registerpanel .lab.violet {background: #bd10e0;}
  #registerpanel .lab.gray {background: #666666;}
  #registerpanel .lab.deepblue {background: #366298;}
  #registerpanel /deep/ .el-tabs__header {margin-bottom: 10px;}
  #registerpanel /deep/ .el-tabs__item {background: #EAEEF3; font-weight: normal; padding: 0 20px;}
  #registerpanel /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {background: #fff;}
  #registerpanel .search {padding: 10px; background: #E3E8EE; color:#9EB0C5;}
  #registerpanel .search .el-form-item {margin-bottom: 0;}
  #registerpanel .cards {margin-top: 30px;}
  #registerpanel .card {position: relative; overflow: hidden; font-size: 14px; background: #FFFEF0 ; border: #CFCC9E 1px solid; border-radius: 2px; padding: 15px 12px; margin-bottom: 10px;}
  #registerpanel .card .title {margin-bottom: 10px;}
  #registerpanel .card .time {color: #999; margin-bottom: 10px;}
  #registerpanel .card .foot {text-align: right;}
  #registerpanel .font12 {font-size: 12px; color: #999;}
  #registerpanel .panel{border: 1px solid #BCC9D7; background: #fff; border-radius: 0;}
  #registerpanel .panel .right {border-left: 1px solid #BCC9D7;  height: 345px; overflow: auto;}
  #registerpanel .panel .inner {padding: 20px;}
  #registerpanel .left-head {height: 32px; line-height: 32px;border-bottom: 1px solid #BCC9D7; padding: 0 20px; color: #999;}
  #registerpanel .left-head span {color: #000; font-weight: 700;}
  #registerpanel .left-head .el-button--mini {padding: 2px 10px; margin-left: 5px;}
  #registerpanel .line-right {border-right: 1px solid #BCC9D7;}
  #registerpanel .select-number .el-col{height: 312px; overflow: auto;}
  #registerpanel ul {list-style: none; padding: 0; margin: 0;}
  #registerpanel .select-number .el-col ul li {height: 24px; line-height: 24px;  padding: 0 10px; position: relative; cursor: pointer;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}
  #registerpanel .select-number .el-col ul li span {display: inline-block; width: 50%;}
  #registerpanel .select-number .el-col ul.first li {padding-left: 30px;}
  #registerpanel .select-number .el-col ul li.on {background: #D3E3F5;}
  #registerpanel .submitbtn {width: 84px; margin-left: 92px;}
  #registerpanel .arrange {margin-bottom: 10px;}
  #registerpanel ul.times {margin-bottom: 20px;}
  #registerpanel ul.times li {float: left; width: 48px; height: 20px; line-height: 20px; background: #CCE7BD; border-radius: 2px; text-align: center; cursor: pointer; color: #688C54; margin-right: 5px; margin-bottom: 10px;}
  #registerpanel ul.times li.disabled {background: #E2E2E2; color: #fff;}
  #registerpanel ul.times li.on {background: #1C7BEF; color: #fff;}
  #registerpanel ul.times li.full {background: #FFB244; color: #fff; width: auto; padding: 0 5px;}
  #registerpanel .progress {height: 32px; background: #C2EAAB; position: relative; width: 317px; border: 2px solid #fff; cursor: pointer;}
  #registerpanel .progress.on {border: 2px solid #1C7BEF;}
  #registerpanel .progress span {display: block; position: absolute; left: 0; top: 0; bottom: 0; background: #E3E8EE;}
  #registerpanel .progress label {position: absolute; right: -48px; top: 7px;}
  #registerpanel .progress label em {color: #1c7bef; font-style: normal;}
  #registerpanel .editmodel {font-size: 18px; height: 40px; line-height: 40px; background: #FEF5BE; text-align: center;}
  #registerpanel .btnlink{color: #1c7bef;height: 32px; line-height: 32px;}
  #registerpanel .btnlink:hover{color: #fff;}
  #registerpanel .subscript{
    color: #fff;
    height: 24px;
    width: 80px;
    position: absolute;
    right: -24px;
    top: 6px;
    text-align: center;
    line-height: 24px;
    background-color: #1c7bef;
    font-size: 12px;
    -moz-transform:rotate(45deg);
    -webkit-transform:rotate(45deg);
    -o-transform:rotate(45deg);
    -ms-transform:rotate(45deg);
    transform:rotate(45deg);
  }
</style>
