//引入umi框架的配置定义函数，用于类型提示和配置验证
import { defineConfig } from "umi";

// 导出默认配置对象，通过defineConfig包装以获得类型支持
export default defineConfig({
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: 'npm', //包管理工具
});
