//判断是否为Trident内核浏览器(IE等)函数

$(function () {
    disableButton("download");
    disableButton("addBg");
    $("#addBackground").attr("disabled","disabled");
    $("#upload").change(function () {
        var objUrl = $(this)[0].files[0];
        //获得一个http格式的url路径:mozilla(firefox)||webkit or chrome
        var windowURL = window.URL || window.webkitURL;
        //createObjectURL创建一个指向该参数对象(图片)的URL
        var dataURL = windowURL.createObjectURL(objUrl);
        //把url给图片的src，让其显示
        $("#imageView").attr("src", dataURL).attr("style", "display:inline");
        $("#imageView2").attr("src", dataURL);
        fixImage('imageView');
        $('#imageReturn').attr("style", "display:none");
        $('#imageAddBg').attr("style", "display:none");
        disableButton("download");
        disableButton("addBackground");
        $("#addBackground").attr("disabled","disabled");
        $("#download").text('点击下载');
        if (browserIsIe()) {
            $("#download").removeAttr("onclick");
        } else {
            $("#download").removeAttr("download").attr("href","");
        }
        Matting();
    });
    $("#addBackground").change(function () {
        AddBackground();
    });
});



function browserIsIe() {
    return (!!window.ActiveXObject || "ActiveXObject" in window);
}

function AddBackground() {
    var reader = new FileReader();
    var file = document.querySelector("#addBackground").files;
    reader.readAsBinaryString(file[0]);
    reader.onload = function () {
        var formData = new FormData();
        formData.append("file", $("#addBackground")[0].files[0]);
        formData.append("fg_path", $("#imageReturn2").attr("src"));
        $.ajax({
            url: "http://matting.zsyhh.com:4800/api/v1/synthesis",
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (returnData) {
                var json = JSON.parse(returnData);
                if (json.status) {
                    $("#imageAddBg").attr("src", json.data).attr("style", "display:inline");
                    $("#imageAddBg2").attr("src", json.data);
                    fixImage('imageAddBg');
                    if (browserIsIe()) {
                        $("#download").on("click", function () {
                            //调用创建iframe的函数
                            createIframe(json.data);
                        });
                    } else {
                        $("#download").attr("download", json.data).attr("href", json.data);
                    }
                    enableButton("download");
                    $('#download').text('含背景图');
                } else {
                    $("#result").text(json.msg);
                }
            }
        });
    }
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
                    $("#imageReturn").attr("src", json.data).attr("style", "display:inline");
                    $("#imageReturn2").attr("src", json.data);
                    fixImage('imageReturn');
                    if (browserIsIe()) {
                        $("#download").on("click", function () {
                            //调用创建iframe的函数
                            createIframe(json.data);
                        });
                    } else {
                        $("#download").attr("download", json.data).attr("href", json.data);
                    }
                    enableButton("download");
                    enableButton("addBg");
                    $("#addBackground").removeAttr("disabled");
                    //$('#download').removeClass('btn-disable').addClass('btn-danger').attr("disabled",false);
                } else {
                    $("#result").text(json.msg);
                }
            }
        });
    }
}



function downloadImg() {
    //iframe的src属性不为空,调用execCommand(),保存图片
    if ($('#IframeReportImg').src !== "about:blank")
        window.frames["IframeReportImg"].document.execCommand("SaveAs");
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

function _fixImage(url,maxWidth,maxHeight) {
    var imgHandle = $('#'+url+'2');
    var imgSrc = $('#'+url);
    var imgWidth = imgHandle.width();
    var imgHeight = imgHandle.height();
    var imgWH = imgWidth/imgHeight;
    var maxWH = maxWidth/maxHeight;
    if(imgWidth >= imgHeight) {
        if(imgWH <= maxWH)
            imgSrc.width((imgWidth * maxHeight)/imgHeight).height(maxHeight);
        else
            imgSrc.width(maxWidth).height((imgHeight * maxWidth)/imgWidth);
    }
    else {
        if(imgWH >= maxWH)
            imgSrc.width(maxWidth).height((imgHeight*maxWidth)/imgWidth);
        else
            imgSrc.width((imgWidth * maxHeight)/imgHeight).height(maxHeight);
    }
}

function fixImage(url) {
    _fixImage(url,300,400);
}

function disableButton(button){
    $("#"+button).removeClass('btn-danger').addClass('btn-disable').attr("disabled", true);
}
function enableButton(button) {
    $("#"+button).removeClass('btn-disable').addClass('btn-danger').attr("disabled", false);
}