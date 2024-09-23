# Nest.js (暂停更新本章节)

用于构建服务器端应用程序的框架，主要用于开发后端服务。它基于 Node.js 和 Express.js，但提供了更高层次的抽象和更多的功能，如模块化架构、依赖注入、控制器、服务、中间件等,Nest.js 主要用于编写业务逻辑，处理 HTTP 请求，与数据库交互，以及实现各种后端功能

## 安装

```hs
npm i -g @nestjs/cli
```

## 创建项目

```hs
nest new project-name
```

## 启动

第一次启动较慢，用的 webpack 打包,默认 `localhost:3000` 访问

```sh
#配置文件有
npm run start #（无热更新）
npm run start:dev #（启用热更新）

```

## 案例

这里使用 mongoDb 数据库，需要安装依赖:

```sh
npm install  @nestjs/mongoose mongoose
```

启动 mongoDb 服务: `mongod --dbpath D:\XXX\xxx(你安装的路径)`

nest 生成一个 user 模块

```sh
nest g res user

# 会有几个选项
# REST API (我们选这个)
# GraphQL (code first)
# GraphQL (schema first)
# Microservice (non-Http) (微服务)
# WebSockets

#是否生成怎删改查模板 选 Y

# 如果出现undefined (reading 'text')报错 请将typescript版本改为 5.5.3就可以解决
```


