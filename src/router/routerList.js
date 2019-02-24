import {checkRole} from '@/utils/auth'
import menuList from '@/utils/menus'

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export default function () {
  // 莫得办法，用function

  function getRedirect (isIndex) {
    const indexUrl = isIndex ? false : '/index/index'
    if (checkRole('index/index')) {
      return indexUrl
    }
    var menuArr = []
    menuList.map(v => {
      if (v.role()) {
        menuArr.push(v)
      }
    })
    if (menuArr.length === 0) {
      return '/404'
    }
    return menuArr.length > 1 ? indexUrl : menuArr[0].charUrl
  }
  return [
    {
      path: '/index',
      component: Layout,
      redirect: getRedirect(false),
      name: 'index',
      children: [
        {
          path: 'index',
          redirect: getRedirect(true),
          component: () => import('@/views/index/index')
        },
        {
          path: 'chart',
          component: () => import('@/views/index/chart')
        }
      ]
    },
    {
      path: '/stock',
      component: Layout,
      redirect: '/stock/index',
      name: 'stock',
      children: [
        {
          path: 'index',
          component: () => import('@/views/stock/index')
        },
        {
          path: 'edit',
          component: () => import('@/views/stock/edit')
        },
        {
          name: 'stock_look',
          path: 'look',
          component: () => import('@/views/stock/look')
        }
      ]
    },
    {
      path: '/progress',
      component: Layout,
      redirect: '/progress/index',
      name: 'progress',
      children: [
        {
          path: 'index',
          component: () => import('@/views/progress/index')
        },
        {
          path: 'edit',
          component: () => import('@/views/progress/edit')
        }
      ]
    },
    {
      path: '/progress2',
      component: Layout,
      redirect: '/progress2/index',
      name: 'progress2',
      children: [
        {
          path: 'index',
          component: () => import('@/views/progress2/index')
        },
        {
          path: 'edit',
          component: () => import('@/views/progress2/edit')
        }
      ]
    },
    {
      path: '/bureau',
      component: Layout,
      redirect: '/bureau/index',
      name: 'bureau',
      children: [
        {
          path: 'index',
          component: () => import('@/views/bureau/index')
        },
        {
          path: 'edit',
          component: () => import('@/views/bureau/edit')
        }
      ]
    },
    {
      path: '/user',
      component: Layout,
      redirect: '/user/me',
      name: 'userMe',
      children: [{
        path: 'me',
        component: () => import('@/views/user/me')
      }]
    }
  ]
}
