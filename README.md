# bee
微前端

主框架

需求
1. 主框架做路由匹配，路由切换，触发应用加载和卸载
2. 插件能力，自定义加载; js，html 入口; 沙箱
  
  - 支持 dependency 加载，也就是在加载特定的业务入口文件之前先加载一个公用的资源文件
  - 支持并行加载，即一个路径匹配多个子应用
  - 支持加载拦截，用于各种业务需求（如权限，404）
  - 沙箱支持改写，可以支持自定义沙箱，多应用多个不同的沙箱
  - beforeEnter 能力，从 A -> B，B 有一个 beforeEnter 的弹窗，这种情况下不应该挂载B 的 Dom

其他问题：
1. 公用组件怎么处理
2. 跨应用状态，跨技术栈状态
3. 公用依赖更新，例如基座依赖，或公用组件变更，怎么做到同时发布或者


主要技术
需求复杂，各种状态较多，切换麻烦，考虑使用 inversify
插件能力过于复杂，考虑 tapable


仓库
monorepo，core + inner plugin 实现自定义加载; js，html 入口; 沙箱能力
