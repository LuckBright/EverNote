const testRight = { textAlign: 'right' }
const f12 = { fontSize: '12px' }
const f10 = { fontSize: '10px' }
export const styleObj = {
  box: {
    fontFamily: 'Microsoft YaHei',
    ...f12,
    height: '100%',
    padding: '5px'
  },
  box1: {
    height: '70%',
    padding: '10% 8%'
  },
  header: {
    height: '40px'
  },
  logo: {
    float: 'left',
    height: '100%'
  },
  right: {
    float: 'right'
  },
  phone: {
    width: '100%',
    ...f10,
    padding: '3px 0',
    ...testRight
  },
  doctor: {
    ...testRight
  },

  content: {
    width: '100%',
    height: '60%'
  },
  contentleft: {
    width: '73%',
    float: 'left',
    height: '100%'
  },
  QRcode: {
    float: 'right',
    height: '80%',
    width: '75px',
    ...f12
  },
  contentTop: {
    marginBottom: '5px'
  },
  name: {
    fontSize: '10px'
  },
  num: {
    fontWeight: 'bold',
    float: 'right'
  },
  contentBottom: {
    height: '60%',
    borderTop: '1px solid #000',
    borderBottom: '1px solid #000'
  },
  text: {
    display: 'inline-block',
    fontSize: '10px',
    fontWeight: 'bold',
    width: '80%',
    marginTop: '3px'
  },
  entrust: {
    width: '100%',
    height: '14px',
    overflow: 'hidden'
  },
  footer: {
    width: '100%',
    height: '10%'
  },
  Instructions: {
    float: 'left',
    fontSize: '12px'
  },
  liveTime: {
    fontSize: '10px',
    '-webkitTransform': 'scale(0.75)',
    width: '180px',
    textAlign: 'right',
    float: 'right'
  },
  ul: {
    margin: '0',
    padding: '0',
    listStyle: 'none',
    height: '100%'
  },
  li: {
    float: 'left',
    marginLeft: '5px',
    fontSize: '12px',
    height: '25%'
  },
  qrCode: {
    width: '100%',
    height: '100%'
  },
  p: {
    margin: 0,
    '-webkitTransform': 'scale(0.5)'
  }
}
