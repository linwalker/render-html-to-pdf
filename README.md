# html转成pdf（html2canvas 和 jsPDF）


## html2canvas

### 简介

我们可以直接在浏览器端使用html2canvas,对整个或局部页面进行‘截图’。但这并不是真的截图，而是通过遍历页面DOM结构，收集所有元素信息及相应样式，渲染出canvas image。

由于html2canvas只能将它能处理的生成canvas image，因此渲染出来的结果并不是100%与原来一致。但它不需要服务器参与，整个图片都由客户端浏览器生成，使用很方便。

### 使用

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

做个小例子代码如下，在线展示链接[demo](在线演示：[demo1](https://linwalker.github.io/render-html-to-pdf/demo1/html2canvas.html))

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
</h