/**
 * 权限检查函数
 * 使用方需要根据实际项目实现权限检查逻辑
 */
export function hasPermission(permission) {
  // 测试用简单实现 - 实际项目中应该从 store 或 context 获取权限列表
  console.log('检查权限:', permission)
  
  // 示例：从 localStorage 或 store 获取权限
  // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  // return permissions.includes(permission)
  
  // 测试环境：默认返回 true
  return true
}

