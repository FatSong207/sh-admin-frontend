const viewModules = import.meta.glob('../views/*.vue')

export const asyncRouterHandle = asyncRouter => {
  // console.log(viewModules)
  asyncRouter.forEach(item => {
    // console.log('item', item)
    if (item.component) {
      if (item.component.split('/')[0] === 'views') {
        item.component = dynamicImport(viewModules, item.component)
      }
    } else {
      delete item['component']
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}

//把views下所有的vue檔跟後端傳過來menu.component做比對，無匹配到的就移除
function dynamicImport (dynamicViewsModules, component) {
  //   console.log('dynamicImport', dynamicViewsModules, component)
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter(key => {
    const k = key.replace('../', '')
    return k === component
  })
  //   console.log('matchKeys', matchKeys)
  const matchKey = matchKeys[0]

  return dynamicViewsModules[matchKey]
}
