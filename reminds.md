## Here is some reminds of this project.

### About Algorithms
 
Please click: 
- https://github.com/HymEric/Segmentation-Series-Chaos
- https://github.com/HymEric/Segmentation-Series-Chaos/tree/master/matting

### About backend (Chinese)
后端发现调用算法时，sess.run()运行多次会报错，因此把这个函数移动到import阶段执行，只执行一次，不在每次调用算法时执行。
 opencv的Python依赖名应该是opencv-python，而不是opencv
 tensorflow依赖bug修复，本项目采用tensorflow 1.6版本，在requirements.txt中不能使用tensorflow>=1.6，因为这样会安装上2.0版本的tensorflow，只能使用tensorflow==1.6

绝对路径bug修复

文件名使用随机数并进行base64编码时遇到文件找不到的问题，base64编码中有个字符是/，但是这个字符在文件系统中又表示路径分隔符，所以会出现bug。我们采用了将base64编码中的/都替换成_的方法修复。

当上传文件在几MB时，nginx会报413错误。我们通过修改nginx配置文件解决，把最大文件大小限制改大，具体方法如下：client_max_body_size 20m;

### About wed (Chinese)

1.上传文件时所使用的<input type="file">标签获取文件通过的不是click事件而是change事件，即文件流已经被赋值到input内部，而click事件处理时，文件还未被完全解析。

2.由于后端要求data传输的类型为file，又规定filename所以前期所使用的json方式无法被识别，只能用object.append(file)方法添加文件，再传输。

3.由于在js中原生dom对象和jquery对象的调用方法不同，常常会导致由于使用错误的方法而使浏览器报出方法未定义错误。例如使用dom元素使用attr方法，使用jquery元素调用width和height属性等等。

4.由于js对程序内部是异步执行的，所以我在对用户上传的图片进行固定大小时回应为程序还没完全解析图片导致查询图片大小的长和宽都为0或undefined，一次在需要程序解析大型文件时，需要制定一定的延时或者是冗余操作，保证程序的正常执行。

5.windows和mac的区别：在css和js代码中由于操作系统的缘故，部分标签例如 <a type=”download”>标签只能在windows端被识别而Mac端无法正确识别，因此另辟蹊径使用创建空白frame方式给用户下载。

6.为了美观界面我使用label指向<input type="file">标签，这就导致在命令input无效时，需要同时对label和input进行操作。


