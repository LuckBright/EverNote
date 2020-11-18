export default function (vm, config) {
  let _config = {
    content: config.content || '文档有修改, 是否先保存?',
    title: config.title || '提示',
    showCancelButton: !(config.showCancelButton || false),
    confirmCallBack: config.confirmCallBack || (() => {}),
    cancelCallBack: config.cancelCallBack || (() => {})
  }
  return vm.$confirm(_config.content, _config.title, {
    confirmButtonText: '确定',
    cancelButtonText: '不保存',
    showCancelButton: _config.showCancelButton,
    showClose: false,
    closeOnClickModal: false,
    type: 'warning'
  })
  .then(_config.confirmCallBack)
  .catch(_config.cancelCallBack)
}
