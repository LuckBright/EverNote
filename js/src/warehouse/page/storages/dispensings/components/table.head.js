//  门诊发药 处方展示详情 table展示内容
export const T_HEAD = [{
  name: 'name',
  options: {
    'min-width': 200,
    label: '物资名称'
  }
},
{
  name: 'spec',
  options: {
    width: 140,
    label: '规格'
  }
},
{
  name: 'type',
  options: {
    width: 100,
    label: '剂型'
  }
},
{
  name: 'dosage',
  options: {
    width: 100,
    label: '每次用量'
  }
},
{
  name: 'rate',
  options: {
    width: 100,
    label: '频次'
  }
},
{
  name: 'days',
  options: {
    width: 60,
    label: '天数'
  }
},
{
  name: 'channel',
  options: {
    width: 140,
    label: '途径'
  }
},
{
  name: 'length',
  options: {
    width: 80,
    label: '数量'
  }
},
{
  name: 'position',
  options: {
    width: 100,
    label: '货位号'
  }
},
{
  name: 'other',
  options: {
    width: 80
  }
}]
export const CONSUMABLES_HEAD = [{
  name: 'name',
  options: {
    'min-width': 200,
    label: '物资名称'
  }
},
{
  name: 'spec',
  options: {
    width: 140,
    label: '规格'
  }
},
{
  name: 'length',
  options: {
    width: 80,
    label: '数量'
  }
},
{
  name: 'position',
  options: {
    width: 100,
    label: '货位号'
  }
},
{
  name: 'other'
}]

//  住院发药 处方展示详情 table展示内容
export const IPD_TABLE_HEAD = [
  {
    name: 'name',
    options: {
      'min-width': 280,
      label: '物资名称'
    }
  },
  {
    name: 'spec',
    options: {
      width: 160,
      label: '规格'
    }
  },
  {
    name: 'employ',
    options: {
      width: 140,
      label: '给药途径'
    }
  },
  {
    name: 'type',
    options: {
      width: 150,
      label: '剂型'
    }
  },
  {
    name: 'dosage',
    options: {
      width: 100,
      label: '每次用量'
    }
  },
  {
    name: 'length',
    options: {
      width: 120,
      label: '数量',
      align: 'right'
    }
  },
  // {
  //   name: 'position',
  //   options: {
  //     width: 120,
  //     label: '单位'
  //   }
  // },
  {
    name: 'doctor',
    options: {
      'min-width': 100,
      label: '开单医生'
    }
  },
  {
    name: 'other',
    options: {
      width: 80
    }
  }
]
