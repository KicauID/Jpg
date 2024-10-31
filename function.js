window.function = function (html, fileName, format, zoom, margin, fidelity) {
    const fidelityMap = {
        low: 1,
        standard: 1.5,
        high: 2,
        veryHigh: 3,
        ultra: 4
    };

    html = html.value ?? "No HTML set.";
    fileName = fileName.value ?? "file";
    format = format.value ?? "A4";
    zoom = zoom.value ?? "1";
    margin = margin.value ?? "0";
    const quality = fidelityMap[fidelity.value] ?? 4;

    const formatDimensions = {
        A6: [350, 495],
        A4: [794, 1123],
    };

    const dimensions = formatDimensions[format];
    const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

    console.log(
        `Filename: ${fileName}\n` +
        `Format: ${format}\n` +
        `Dimensions: ${dimensions}\n` +
        `Zoom: ${zoom}\n` +
        `Final Dimensions: ${finalDimensions}\n` +
        `Margin: ${margin}\n` +
        `Quality: ${quality}`
    );

    const customCSS = `
    body {
        margin: 0!important;
    }

    .button {
        width: 120px; /* Atur lebar tombol */
        border-radius: 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5rem;
        color: #ffffff;
        border: none;
        font-family: 'Arial';
        padding: 0px 12px;
        height: 32px;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2.5px rgba(0, 0, 0, 0.1);
        position: absolute; /* Ubah menjadi absolute */
        left: 10px; /* Sesuaikan posisi ke kiri */
        top: 10px; /* Sesuaikan posisi ke atas */
        background: #0353A7;
    }

    .button:hover {
        background: #f5f5f5;
        color: #000000;
    }

    .button.downloading {
        background: #ffffff;
        color: #000000;
    }

    .button.done {
        background: #ffffff;
        color: #000000;
    }

    ::-webkit-scrollbar {
        width: 5px;
        background-color: rgb(0 0 0 / 8%);
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgb(0 0 0 / 32%);
        border-radius: 4px;
    }
    `;

    const originalHTML = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js"></script>
    <style>${customCSS}</style>
    <div class="main">
        <button class="button" id="download">Download</button>
        <div id="content" class="content thermal-${format}" style="margin-top: 50px;">${html}</div>
    </div>
    <script>
        document.getElementById('download').addEventListener('click', function() {
            var element = document.getElementById('content');
            var button = this;
            button.innerText = 'DOWNLOADING...';
            button.className = 'downloading';

            html2canvas(element, { scale: ${quality}, useCORS: true }).then(function(canvas) {
                var imgData = canvas.toDataURL('image/jpeg', 1.0);
                
                var pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [${finalDimensions[0]}, ${finalDimensions[1]}],
                    hotfixes: ['px_scaling']
                });
                pdf.addImage(imgData, 'JPEG', 0, 0, ${finalDimensions[0]}, ${finalDimensions[1]});
                pdf.save('${fileName}.pdf'); // Ubah format menjadi PDF untuk kualitas tinggi
                
                button.innerText = 'DOWNLOAD DONE';
                button.className = 'done';
                setTimeout(function() { 
                    button.innerText = 'Download';
                    button.className = ''; 
                }, 2000);
            });
        });
    </script>
    `;
    var encodedHtml = encodeURIComponent(originalHTML);
    return "data:text/html;charset=utf-8," + encodedHtml;
};
