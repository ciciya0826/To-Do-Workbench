开发框架React    项目框架UmiJS(封装底层)    封装成PC端软件electron    后端express
参考B站[[【个人向软件开发全流程记录：基于React的待办工作台软件】https://www.bilibili.com/video/BV1uP4y1P7Vq?p=3&vd_source=83aad684b6d3f6c061f57ee42b3be54d]]

## 配置
### umi和express
<mark style="background: #FFF3A3A6;">`yarn build`</mark> webpack打包umi中的项目然后复制到express中的public文件夹，html在这里显示
### express和electron
1. 将express中的www中的启动服务器的部分作为函数导出
2. 将这个函数放入到electron创建窗口时使用，启动这个的服务器
3. 再在electron的页面中用iframe属性将express页面的链接放进来，使用CSS控制使撑满屏幕

## 页面
### 主菜单

每一栏由多个接口实现的menuItem遍历组成
### 任务列表