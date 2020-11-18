export const exports = (val) => {
  let url = new Blob([ val.data ], { type: 'application/vnd.ms-excel' })
  const linkNode = document.createElement('a')
  let fileName = val.fileName.split('filename=')[1]

  linkNode.download = decodeURI(fileName) // a标签的download属性规定下载文件的名称
  linkNode.style.display = 'none'
  linkNode.href = URL.createObjectURL(url) // 生成一个Blob URL
  document.body.appendChild(linkNode)
  linkNode.click()  // 模拟在按钮上的一次鼠标单击

  URL.revokeObjectURL(linkNode.href) // 释放URL 对象
  document.body.removeChild(linkNode)
}
