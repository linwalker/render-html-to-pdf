/**
 * Created by linyuhua on 2017/4/25.
 */
/**
 * Created by linyuhua on 2017/4/24.
 */

const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

const pdfFormat = {
    'a0': [2383.94, 3370.39],
    'a1': [1683.78, 2383.94],
    'a2': [1190.55, 1683.78],
    'a3': [841.89, 1190.55],
    'a4': [595.28, 841.89],
    'a5': [419.53, 595.28],
    'a6': [297.64, 419.53],
    'a7': [209.76, 297.64],
    'a8': [147.40, 209.76],
    'a9': [104.88, 147.40],
    'a10': [73.70, 104.88],
    'b0': [2834.65, 4008.19],
    'b1': [2004.09, 2834.65],
    'b2': [1417.32, 2004.09],
    'b3': [1000.63, 1417.32],
    'b4': [708.66, 1000.63],
    'b5': [498.90, 708.66],
    'b6': [354.33, 498.90],
    'b7': [249.45, 354.33],
    'b8': [175.75, 249.45],
    'b9': [124.72, 175.75],
    'b10': [87.87, 124.72],
    'c0': [2599.37, 3676.54],
    'c1': [1836.85, 2599.37],
    'c2': [1298.27, 1836.85],
    'c3': [918.43, 1298.27],
    'c4': [649.13, 918.43],
    'c5': [459.21, 649.13],
    'c6': [323.15, 459.21],
    'c7': [229.61, 323.15],
    'c8': [161.57, 229.61],
    'c9': [113.39, 161.57],
    'c10': [79.37, 113.39],
    'dl': [311.81, 623.62],
    'letter': [612, 792],
    'government-letter': [576, 756],
    'legal': [612, 1008],
    'junior-legal': [576, 360],
    'ledger': [1224, 792],
    'tabloid': [792, 1224]
}

const renderPdf = function (content, pdfName, format, onSuccess) {
    const pdfProportion = pdfFormat[format][0] / pdfFormat[format][1];
    const contentHeight = content.offsetHeight;
    const contentWidth = content.offsetWidth;
    const pageHeight = contentWidth / pdfProportion;
    const pageWidth = contentWidth;

    function renderPages(imgData) {
        let pdf = new jsPDF('p', 'pt', format);
        if (contentHeight < pageHeight) {
            // pdf.addImage(imgData, 'JPEG', 0, 0, pdfFormat[format][0], pdfFormat[format][1] / pageHeight * contentHeight);
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfFormat[format][0], pdfFormat[format][0] / contentWidth * contentHeight);
            pdf.save(pdfName);
        } else {
            const index = 0;
            const count = parseInt(contentHeight / pageHeight);
            const page = document.createElement('div');

            page.style.position = "absolute";
            page.style.width = contentWidth + "px";
            page.style.height = pageHeight + "px";
            page.style.backgroundImage = "url(" + imgData + ")";
            page.style.backgroundRepeat = "norepeat";

            document.body.appendChild(page);

            function addPage(i, onFinished) {

                page.style.backgroundPositionY = -pageHeight * i + "px";

                html2canvas(page, {

                    onrendered: function (canvas) {

                        const pageData = canvas.toDataURL('image/jpeg');

                        pdf.addImage(pageData, 'JPEG', 0, 0, pdfFormat[format][0], pdfFormat[format][1]);

                        if (i + 1 < count) {
                            pdf = pdf.addPage();
                            addPage(i + 1, onFinished);
                        }
                        else {
                            onFinished()
                        }

                    }
                });
            }

            addPage(index, function () {

                page.style.backgroundPositionY = -pageHeight * count + "px";

                const lastPageHeight = contentHeight % pageHeight;
                page.style.height = lastPageHeight + "px";

                html2canvas(page, {

                    onrendered: function (canvas) {

                        //返回图片URL，参数：图片格式和清晰度(0-1)
                        var pageData = canvas.toDataURL('image/jpeg', 1.0);

                        pdf = pdf.addPage();
                        pdf.addImage(pageData, 'JPEG', 0, 0, pdfFormat[format][0], pdfFormat[format][1] / pageHeight * lastPageHeight);

                        document.body.removeChild(page);

                        onSuccess && onSuccess();

                        pdf.save(pdfName);

                    }
                });
            });

        }
    }

    html2canvas(content, {

        // 渲染完成时调用，获得 canvas
        onrendered: function (canvas) {

            // 从 canvas 提取图片数据
            const imgData = canvas.toDataURL('image/jpeg');

            renderPages(imgData);

        }
    });
}

module.exports = renderPdf;

