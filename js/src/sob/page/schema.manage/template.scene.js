export const scene = [{
  name: '门诊',
  id: 1,
  code: 1
}, {
  name: '急诊',
  id: 2,
  code: 2
}, {
  name: '住院',
  id: 3,
  code: 3
}, {
  name: '体检',
  id: 4,
  code: 4
}, {
  name: '手术',
  id: 5,
  code: 5
}, {
  name: '互联网医院',
  id: 6,
  code: 6
}]

export function getName (id) {
  for (let i = 0; i < scene.length; i++) {
    if (scene[i].id === id) {
      return scene[i].name
    }
  }
  return '--'
}
