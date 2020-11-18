
## 安装依赖

``` bash
yarn install
```

## 启动构建项目

### 根据模块构建，多个模块逗号隔开

```
entry=yihu,rcm yarn run build
```

#### 根据模块启动，多个模块逗号隔开

```
entry=yihu,rcm yarn run dev
```


## 构建类库（日常功能发布构建不需要）

### 构建 基础类库（依赖的三方库）+ main.js 库（我们自己的common库）

当 src/main.js 里涉及的 js 变化时才需要执行。
拆分出main，把main作为我们自己的公共类库，不用每次build的时候重新build main.js，减少build时间。

```
yarn run buildmain
```

#### 如需要调试 main.js 里的内容，

 1. 可以先在功能模块内部调试，完成后再放到main.js里，main.js里的内容不再支持实时编译修改。
 2. 或去掉 webpackdev.conf.js 里 basemain-manifest.json DllReferencePlugin，这样启动devserver时找依赖main.js时不再使用以及打包的main.js里的依赖。

