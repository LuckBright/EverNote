export const presrciptionPrintConfig = {
  '1': [  // 门诊处方打印标准版规则
    {
      id: '0',
      name: '处方打印',
      isRecipe: true, // 是否按照处方维度打印，默认是医嘱维度
      config: { serviceType: ['301', '302', '303', '304', '3002'] },
      children: [  // codeP 底方code filter: 是否过滤数据，true: 逐条打印，false：data中符合条件的数据都打印在一起，[]：根据数组中的条件过滤，符合条件的打印在一张单子上
        { id: '0-1', name: '普通处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_PT_DF', code: 'CHU_FANG_DAN_PT', isRecipe: true, filter: true, config: { serviceType: ['301', '302'], no_specialClassify: ['01.01', '01.02', '01.03'] } },
        { id: '0-2', name: '麻/精一类处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_MJY_DF', code: 'CHU_FANG_DAN_MJY', isRecipe: true, filter: true, config: { serviceType: ['301', '302'], specialClassify: ['01.03', '01.01'] } },
        { id: '0-3', name: '精二类处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_JT_DF', code: 'CHU_FANG_DAN_JT', isRecipe: true, filter: true, config: { serviceType: ['301', '302'], specialClassify: ['01.02'] } },
        { id: '0-4', name: '中药处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_ZY_DF', code: 'CHU_FANG_DAN_ZY', isRecipe: true, filter: true, config: { serviceType: ['303', '304', '3002'] } },
      ]
    },
    { id: '1', name: '检查申请打印', codeP: 'JIAN_CHA_SHEN_QING_DAN', code: 'JIAN_CHA_SHEN_QING_DAN', filter: false, config: { serviceType: ['800'] } },
    { id: '2', name: '检验申请打印', codeP: 'JIAN_YAN_SHEN_QING_DAN', code: 'JIAN_YAN_SHEN_QING_DAN', filter: false, config: { serviceType: ['801', '10003'] } },
    { id: '3', name: '治疗打印', codeP: 'ZHI_LIAO_DAN', code: 'ZHI_LIAO_DAN', filter: false, config: { serviceType: ['802'] } },
    { id: '4', name: '处置打印', codeP: 'CHU_ZHI_DAN', code: 'CHU_ZHI_DAN', filter: false, config: { serviceType: ['301', '302'], employ: ['401', '402', '403', '404', '405'] } },
    { id: '5', name: '手术申请打印', codeP: 'SHOU_SHU_SHEN_QING_DAN', code: 'SHOU_SHU_SHEN_QING_DAN', filter: true, config: { serviceType: ['2125'] } },
    { id: '6', name: '费用清单打印', codeP: 'FEI_YONG_QING_DAN', code: 'FEI_YONG_QING_DAN', filter: false, config: { serviceType: ['10006', '299', '300', '10008', '2467', '10004', '10002', '867', '799'] } }
  ],
  '2': [  // 门诊处方打印汇总版规则（卓正版）
    {
      id: '0',
      name: '处方打印',
      isRecipe: true, // 是否按照处方维度打印，默认是医嘱维度
      config: { serviceType: ['301', '302', '303', '304'] },
      children: [  // filter: 是否过滤数据，true: 逐条打印，false：data中符合条件的数据都打印在一起，[]：根据数组中的条件过滤，符合条件的打印在一张单子上
        { id: '0-1', name: '普通处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_PT_DF', code: 'CHU_FANG_DAN_PT', isRecipe: true, filter: ['storageRoomId'], config: { serviceType: ['301', '302'], no_specialClassify: ['01.01', '01.02', '01.03'] } },
        { id: '0-2', name: '麻/精一类处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_MJY_DF', code: 'CHU_FANG_DAN_MJY', isRecipe: true, filter: ['storageRoomId'], config: { serviceType: ['301', '302'], specialClassify: ['01.03', '01.01'] } },
        { id: '0-3', name: '精二类处方单', codeP: 'MZ_CPOE_CHU_FANG_DAN_JT_DF', code: 'CHU_FANG_DAN_JT', isRecipe: true, filter: ['storageRoomId'], config: { serviceType: ['301', '302'], specialClassify: ['01.02'] } },
      ]
    },
    { id: '1', name: '检验申请单打印', codeP: 'JIAN_YAN_SHEN_QING_DAN', code: 'JIAN_YAN_SHEN_QING_DAN', filter: ['executeProviderId'], config: { serviceType: ['801'] } },
    { id: '2', name: '检查申请单打印', codeP: 'JIAN_CHA_SHEN_QING_DAN', code: 'JIAN_CHA_SHEN_QING_DAN', filter: ['executeProviderId'], config: { serviceType: ['800'] } },
    { id: '3', name: '操作及治疗申请单', codeP: 'ZHI_LIAO_DAN', code: 'ZHI_LIAO_DAN', filter: false, config: { serviceType: ['802'] } },
    { id: '4', name: '商品单打印', codeP: 'FEI_YONG_QING_DAN', code: 'FEI_YONG_QING_DAN', filter: ['storageRoomId'], config: { serviceType: ['299', '300', '10008'] } }
  ]
}
