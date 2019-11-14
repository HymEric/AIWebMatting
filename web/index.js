//判断是否为Trident内核浏览器(IE等)函数

$(function () {
    $("#upload").change(function () {
        var objUrl = $(this)[0].files[0];
        //获得一个http格式的url路径:mozilla(firefox)||webkit or chrome
        var windowURL = window.URL || window.webkitURL;
        //createObjectURL创建一个指向该参数对象(图片)的URL
        var dataURL;
        dataURL = windowURL.createObjectURL(objUrl);
        //把url给图片的src，让其显示
        $("#imageView").attr("src", dataURL).attr("style", "display:inline");
        $('#imageReturn').attr("style", "display:none");
        $("#download").removeClass('btn-danger').addClass('btn-disable').attr("disabled", true);
        Matting();
    });
});

function browserIsIe() {
    return (!!window.ActiveXObject || "ActiveXObject" in window);
}

function Matting() {
    var reader = new FileReader();
    var file = document.querySelector("#upload").files;
    reader.readAsBinaryString(file[0]);
    reader.onload = function () {
        var formData = new FormData();
        formData.append("file", $("#upload")[0].files[0]);
        $.ajax({
            url: "http://matting.zsyhh.com:4800/api/v1/upload",
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (returnData) {
                var json = JSON.parse(returnData);
                if (json.status) {
                    $("#imageReturn").attr("src", json.data);
                    $('#imageReturn').attr("style", "display:inline");
                    if (browserIsIe()) {
                        $("#download").on("click", function () {
                            //调用创建iframe的函数
                            createIframe(json.data);
                        });
                    } else {
                        $("#download").attr("download", json.data).attr("href", json.data);
                    }
                    $('#download').removeClass('btn-disable').addClass('btn-danger').attr("disabled",false);
                } else {
                    $("#result").text(json.msg);
                }
            }
        });
    }
}


function downloadImg() {
    //iframe的src属性不为空,调用execCommand(),保存图片
    if ($('#IframeReportImg').src !== "about:blank") {
        window.frames["IframeReportImg"].document.execCommand("SaveAs");
    }
}

//创建iframe并赋值的函数,传入参数为图片的src属性值.
function createIframe(imgSrc) {
    //如果隐藏的iframe不存在则创建
    if ($("#IframeReportImg").length === 0){
        $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="downloadImg();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");
    }
    //iframe的src属性如不指向图片地址,则手动修改,加载图片
    if ($('#IframeReportImg').attr("src") !== imgSrc) {
        $('#IframeReportImg').attr("src",imgSrc);
    } else {
        //如指向图片地址,直接调用下载方法
        downloadImg();
    }
}
