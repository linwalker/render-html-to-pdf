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

doc.addImage(imageData, 'PNG', 0, 0, 205, 115);
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

                  //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
                  pdf.addImage(pageData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height );

                  pdf.save('stone.pdf');

              }
          })
      }
</script>
```
在线演示[demo5](https://linwalker.github.io/render-html-to-pdf/demo5.html)

如果页面内容根据a4比例转化后高度超过a4纸高度呢，生成的pdf会怎么样？

你可以试试，验证一下自己的想法: [demo6](https://linwalker.github.io/render-html-to-pdf/demo6.html)

jsPDF提供了一个很有用的API，`addPage()`，我们可以通过`pdf.addPage()`，来添加一页pdf，然后通过`pdf.addImage(...)`，将图片赋予这页pdf来显示。

那么我们如何确定哪里分页？

这个问题好回答，我们可以设置一个`pageHeight`，超过这个高度的内容放入下一页pdf。

来捋一下思路，将html页面内容生成canvas图片，通过`addImage`将第一页图片添加到pdf中，超过一页内容，通过`addPage()`添加pdf页数,然后再通过`addImage`将下一页图片添加到pdf中。

嗯～，很好！发现问题没有？这个方法实现的前提是——我们能根据`pageHeight`先将整页内容生成的canvas图片分割成对应的小图片，然后一个萝卜一个坑，`addImage`进去。

What? 想一想我们的canvas是肿么来的，不用拉上去，直接看下面：

```
	html2canvas(document.body, {
        onrendered:function(canvas) {
         //it is here we handle the canvas
        }
	})
```

这里的`body`就是要生成canvas的元素对象，一个元素生成一个canvas；那么我们需要一页一页的canvas，也就是说。。。

你觉得可能吗？ 我觉得不太现实，按这思路要获取页面上不同位置的DOM元素，然后通过`htnl2canvas(element,option)`来处理，先不说能不能刚好在每个`pageHeight`的位置刚好找到一个DOM元素，就算找到了，这样做累不累。

累的话    
：）可以看看下面这种方法

####多页

我提供的思路是我们只生成一个canvas，对就一个，转化元素就是你要转成pdf内容的母元素，在这篇demo里就是`body`了；其他不变，也是超过一页内容就`addPage`，然后`addImage`,只不过这里添加的事同一个canvas。

别急我没有耍你，看下面这张示意图，你是不是懂了














