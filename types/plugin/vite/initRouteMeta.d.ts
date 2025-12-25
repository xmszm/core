/**
 * 初始化路由元数据
 * 
 * @param routes - 路由配置数组
 * @param str - 基础路径字符串，默认为空字符串
 * @returns 处理后的路由配置数组
 * 
 * @example
 * ```typescript
 * const routes = [
 *   {
 *     path: '/user',
 *     title: '用户管理',
 *     children: [
 *       { path: 'list', title: '用户列表' }
 *     ]
 *   }
 * ]
 * const processedRoutes = initRouteMeta(routes)
 * ```
 */
export function initRouteMeta(routes: any[], str?: string): any[]

