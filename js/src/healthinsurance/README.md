# 医保工作站

http://localhost:8080/web/web/hi/index.html#/hi

# 所有四级路由 通用 control.vue路由文件
src/healthinsurance/views/control/control.vue

## example
```
{
  path: 'basic',
  component: Control,
  redirect: 'basic/operatorinfo',
  children: [
    {
      path: 'operatorinfo',
      component: OperatorInfo
    },
    {
      path: 'deptinfo',
      component: DeptInfo
    }
  ]
}
```

## 启动构建项目

### 根据模块构建，多个模块逗号隔开

```
entry=hi yarn run build
```