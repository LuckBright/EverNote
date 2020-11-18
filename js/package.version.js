const fs = require('fs')
const branch = process.argv[2]
const now = new Date()
const p0 = num => (num + '').padStart(2, '0')
const currentTime = `${now.getFullYear()}-${p0(now.getMonth() + 1)}-${p0(now.getDate())} ${p0(now.getHours())}:${p0(now.getMinutes())}:${p0(now.getSeconds())}`
const content = fs.readFileSync('./index.html', 'utf8')
const newContent = content.replace(/____####[\s\S]*####____/, `____####发布时间：${currentTime}，发布分支：${branch}####____`)
let verReg = /\d*\.\d*\.\d*/
let res = branch.match(verReg)
let replaceStr = ''
if (res && res.length > 0) {
  replaceStr = res[0]
}
const newContentbranch = newContent.replace(/1.0.0/, replaceStr)
fs.writeFileSync('./index.html', newContentbranch, 'utf8')
