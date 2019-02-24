import {checkRole} from '@/utils/auth'

let menuList = [
  {
    title: '存量招商',
    charTitle: '存量招商统计',
    charSubTitle: '查看存量统计',
    charUrl: { path: './chart', query: { chart_type: 'TableStock' } },
    type: 'TableStock',
    bgColor: '2291e1',
    url: { path: '/stock/index' },
    icon: 'stock',
    check_ico: 'stock2',
    img: require('@/assets/index/pic1.jpg'),
    role: () => checkRole('table_stock/index')
  },
  {
    title: '在谈内资',
    charTitle: '在谈内资项目情况统计',
    charSubTitle: '查看项目统计',
    type: 'TableProgress',
    bgColor: 'ff6533',
    url: { path: '/progress/index' },
    icon: 'map',
    check_ico: 'map2',
    img: require('@/assets/index/pic2.jpg'),
    role: () => checkRole('table_progress/index')
  },
  {
    title: '在谈外资',
    charTitle: '在谈外资项目情况统计',
    charSubTitle: '查看项目统计',
    type: 'TableProgress2',
    bgColor: '8085e9',
    url: { path: '/progress2/index' },
    icon: 'abroad',
    check_ico: 'abroad2',
    img: require('@/assets/index/pic3.jpg'),
    role: () => checkRole('table_progress2/index')
  },
  {
    title: '联动招商跟进',
    charTitle: '联动招商跟进情况统计',
    charSubTitle: '查看跟进情况统计',
    type: 'TableBureau',
    bgColor: 'F9C90C',
    url: { path: '/bureau/index' },
    icon: 'bookmark',
    check_ico: 'bookmark2',
    img: require('@/assets/index/pic4.jpg'),
    role: () => checkRole('table_bureau/index')
  }
]

menuList.map(v => {
  v.charUrl = { path: '/index/chart', query: { chart_type: v.type, title: v.charTitle } }
})

export default menuList
