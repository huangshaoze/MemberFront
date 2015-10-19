前后端分离集成方案
====
基于nodejs前后端分离思考与实践
----
实际状况中，总是会遇到4,5页面的项目,而且这种项目也不在少数，倘若使用node以项目为单位去开发，会发现项目很多，
很难管理，而且如果前端在没有一套成熟统一js组件框架下，以后更改统一会变得更麻烦。与其这样下去，我个人感觉
前期可以冒险点，才有集成方案。项目以插件的形式放进去，开发只要面向插件开发即可。

项目多而小，管理难，代码管理，端口管理,如果遇到公共部分地方修改，维护成本更大.倘若把所有的项目，都写在一个项目里面，
就不方面并行开发等等
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/1.png)

解决方案集成图
----
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/2.png)
用户只需在api文件夹下，新建项目文件，把代码写在新建文件中即可

开发的过程中，可以直接打开新建的文件夹，对项目开发，无须了解框架本身.启动服务，只要把项目app.js启动，gulp启动即可
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/3.png)
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/4.png)
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/5.png)
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/6.png)
![image](https://github.com/weiqingting/MemberFront/blob/master/readme_images/7.png)
