import img1 from '../image/nav1.jpg'
import img2 from '../image/nav2.jpg'

export const cellTypes = {
  row: '1',
  col: '2'
}

export const selectNavData = [
  { imgPath: img1, text: '横向', value: cellTypes.row },
  { imgPath: img2, text: '纵向', value: cellTypes.col }
]
