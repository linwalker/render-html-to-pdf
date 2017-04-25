# html转成pdf（html2canvas 和 jsPDF）


## html2canvas

#### 简介

我们可以直接在浏览器端使用html2canvas,对整个或局部页面进行‘截图’。但这并不是真的截图，而是通过遍历页面DOM结构，收集所有元素信息及相应样式，渲染出canvas image。

由于html2canvas只能将它能处理的生成canvas image，因此渲染出来的结果并不是100%与原来一致。但它不需要服务器参与，整个图片都由客户端浏览器生成，使用很方便。

#### 使用

使用的API也很简洁，下面代码可以将某个元素渲染成canvas：

```
html2canvas(element, {
    onrendered: function(canvas) {
        // canvas is the final rendered <canvas> element
    }
});
```

通过onrendered方法，可以将生成的canvas进行回掉，比如插入到页面中：

```
html2canvas(element, {
    onrendered: function(canvas) {
       document.body.appendChild(canvas);
    }
});
```

做个小例子代码如下，在线展示链接[demo1](https://linwalker.github.io/render-html-to-pdf/demo1.html)

```
<html>
  <head>
    <title>html2canvas example</title>
    <style type="text/css">...</style>
  </head>
  <body>
    <header>
      <nav>
        <ul>
          <li>one</li>
          ...
        </ul>
      </nav>
    </header>
    <section>
      <aside>
        <h3>it is a title</h3>
        <a href="">Stone Giant</a>
        ...
     </aside>
      <article>
        <img src="./Stone.png">
        <h2>Stone Giant</h2>
        <p>Coming ... </p>
        <p>以一团石头...</p>
      </article>
    </section>
    <footer>write by linwalker @2017</footer>
    <script type="text/javascript" src="./html2canvas.js"></script>
    <script type="text/javascript">
        html2canvas(document.body, {
          onrendered:function(canvas) {
            document.body.appendChild(canvas)
          }
        })
    </script>
  </body>
</html>
```

## jsPDF

jsPDF库可以用于浏览器端生成PDF。

#### 文字生成PDF

使用方法如下：

```
// 默认a4大小，竖直方向，mm单位的PDF
var doc = new jsPDF();

// 添加文本‘Download PDF’
doc.text('Download PDF!', 10, 10);
doc.save('a4.pdf');
```

在线演示[demo2](https://linwalker.github.io/render-html-to-pdf/demo2.html)

#### 图片生成PDF

使用方法如下：

```
// 三个参数，第一个方向，第二个尺寸，第三个尺寸格式
var doc = new jsPDF('landscape','pt',[205, 115])

// 将图片转化为dataUrl
var imageData = ‘data:image/png;base64,iVBORw0KGgo...’;

doc.addImage(imageData.png, 'PNG', 0, 0, 205, 115);
doc.save('a4.pdf');
```

在线演示[demo3](https://linwalker.github.io/render-html-to-pdf/demo3.html)

#### 文字与图片生成PDF

```javascript
// 三个参数，第一个方向，第二个尺寸，第三个尺寸格式
var doc = new jsPDF('landscape','pt',[205, 155])

// 将图片转化为dataUrl
var imageData = ‘data:image/png;base64,iVBORw0KGgo...’;

//设置字体大小
doc.setFontSize(20);

//10,20这两参数控制文字距离左边，与上边的距离
doc.text('Stone', 10, 20);

// 0, 40, 控制文字距离左边，与上边的距离
doc.addImage(imageData, 'PNG', 0, 40, 205, 115);
doc.save('a4.pdf')
```

在线演示[demo4](https://linwalker.github.io/render-html-to-pdf/demo4.html)

生成pdf需要把转化的元素添加到jsPDF实例中，也有添加html的功能，但某些元素无法生成在pdf中，因此可以使用html2canvas + jsPDF的方式将页面转成pdf。通过html2canvas将遍历页面元素，并渲染生成canvas，然后将canvas图片格式添加到jsPDF实例，生成pdf。

## html2canvas + jsPDF

#### 单页

将demo1的例子修改下：

```javascript
<script type="text/javascript" src="./js/jsPdf.debug.js"></script>
<script type="text/javascript">
      var downPdf = document.getElementById("renderPdf");
      downPdf.onclick = function() {
          html2canvas(document.body, {
              onrendered:function(canvas) {

                  //返回图片dataURL，参数：图片格式和清晰度(0-1)
                  var pageData = canvas.toDataURL('image/jpeg', 1.0);

                  //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
                  var pdf = new jsPDF('', 'pt', 'a4');

                  //需要dataUrl格式
                  pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );

                  pdf.save('stone.pdf');

              }
          })
      }
</script>
```
在线演示[demo5](https://linwalker.github.io/render-html-to-pdf/demo5.html)












