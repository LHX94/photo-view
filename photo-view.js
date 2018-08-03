;(function(){
	var  viewImage = function (obj, ywidth, yheight){
		var _self    = this
        // 保存数据
        this.obj     = obj;
		this.list_id = obj.getAttribute("img-list-view");
        this.ywidth  = ywidth;
        this.yheight = yheight;
        // 创建 img  公共
        this.c_img   = document.createElement("img");
        this.c_img.setAttribute("class",'view_img');
        this.c_img.style.width  = ywidth  +'px';
        this.c_img.style.height = yheight +'px';
    	//,图片允许上传文件的后缀名
    	var allowExtention = ".jpg,.bmp,.gif,.png"; 
		// 获取图片格式
        var extention      = obj.value.substring(obj.value.lastIndexOf(".") + 1).toLowerCase();
        // 浏览器检测
        var browserVersion = window.navigator.userAgent.toUpperCase();
        if(allowExtention.indexOf(extention) > -1){
	    	// 创建img 父元素
	    	_self.createBox()
	    	// 创建img 关闭按钮
	    	_self.createCloseImg()
            if(browserVersion.indexOf("MSIE") > -1){
                if (browserVersion.indexOf("MSIE 6.0") > -1) {//ie6
        			this.c_img.setAttribute("src", obj.value);
					document.getElementById(this.list_id).lastChild.appendChild(this.c_img);
                }else{//ie[7-8]、ie9以上
                    _self.ieView();
                }
            }else if(browserVersion.indexOf("FIREFOX") > -1){//firefox
                var firefoxVersion = parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
                if(firefoxVersion < 7){//firefox7以下版本
                    _self.firefoxView(obj.files[0].getAsDataURL());
                }else{//firefox7.0+  
                    _self.firefoxView(window.URL.createObjectURL(obj.files[0]));
                }
            }else if(obj.files){
                //兼容chrome、火狐等，HTML5获取路径                   
                if(typeof FileReader !== "undefined"){
                	_self.H5View()
                }else if(browserVersion.indexOf("SAFARI") > -1){
                    alert("暂时不支持Safari浏览器!");
                }
            }else{
            	this.c_img.setAttribute("src", obj.value);
				document.getElementById(this.list_id).lastChild.appendChild(this.c_img);
            }
        }else{
        	alert('格式不正确！')
        	return;
        }
    }
    viewImage.prototype = {
    	constructor:viewImage,
        // 创建 关闭图片和展示图片的  div 父元素
    	createBox:function(){
    		var box            = document.createElement("div");
	    	box.style.width    = this.ywidth +'px';
	    	box.style.height   = this.yheight +'px';
	    	box.style.position = 'relative';
            box.style.float    = 'left';
            box.style.overflow = 'hidden';
	    	box.setAttribute("class",'img_box_view');
	    	document.getElementById(this.list_id).appendChild(box);
    	},
        // 创建 关闭图片
    	createCloseImg:function(){
    		var close_img            = document.createElement('img')
            close_img.src            = 'closeImg.png';
	    	close_img.setAttribute("class",'close_img');
	    	close_img.style.width    = 29 +'px';
	    	close_img.style.height   = 29 +'px';
	    	close_img.style.position = 'absolute';
	    	close_img.style.right    = 0 +'px';
	    	close_img.style.top      = -29 +'px';
	    	close_img.style.cursor   = 'pointer';
			document.getElementById(this.list_id).lastChild.appendChild(close_img)
    	},
        // h5浏览器  显示处理
    	H5View:function(){
            var _self = this;
    		var reader = new FileReader();
            reader.onload = function (e) {
            	_self.c_img.setAttribute("src", e.target.result);
				document.getElementById(_self.list_id).lastChild.appendChild(_self.c_img);
                _self.closeImg(); 
            }
            reader.readAsDataURL(_self.obj.files[0]);
    	},
        // ie浏览器  显示处理
    	ieView:function(){
            var _self = this;
    		this.obj.select();
            this.obj.blur();
            var src = document.selection.createRange().text;
            var div = document.getElementById(this.list_id);
            if(src==""){
             /* 如果当前页面放到框架如iframe里面，则在ie下src依然取到空值，
             因为obj.blur()之后，file控件中原本被选中的文本将会失去选中的状态，因此，不能使用obj.blur()。
             可以让当前页面上的其他元素，如div，button等或者父页面的body获得焦点即可。
             注意，如果是div，则要确保div有至少1像素的高和宽，方可获得焦点。 */
             this.obj.select();
             window.parent.document.body.focus(); //或者document.getElementById("upbtn").focus();
             src = document.selection.createRange().text;
            }
            var img      = document.querySelectorAll('.imgViews')[0];
            var sFilter  = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
            var img_wid = img.offsetWidth;  // 原始宽度
            var img_hei = img.offsetHeight; // 原始高度
            var img_src = sFilter + src;
            document.getElementById(this.list_id).lastChild.innerHTML += "<div style='width:"+this.ywidth+"px;height:"
                +this.yheight+"px;"+img_src+"\"'></div>";
            _self.closeImg(); 
    	},
        // 火狐浏览器  显示处理
        firefoxView:function(src){
            var _self = this;
            this.c_img.setAttribute("src",src);
            document.getElementById(this.list_id).lastChild.appendChild(this.c_img);
            _self.closeImg();
        },
        // 关闭图片 添加的时间
        closeImg:function(){
            var _self = this;
            var dimg;
            var img_box   = document.querySelectorAll('.img_box_view');
            for(var i=0;i<img_box.length;i++){
                img_box[i].timer = null;
                img_box[i].onmouseenter = function(){
                    dimg = this.children[0];
                    _self.startMover(0,12,dimg)
                }
                img_box[i].onmouseleave = function(){
                    dimg = this.children[0];
                    _self.startMover(-29,12,dimg)
                }
                img_box[i].children[0].onclick = function(){
                    _self.delParent(this)
                }
            }
        },
        // 删除 当前元素的  父元素
        delParent:function(thisdel){
            thisdel.parentNode.parentNode.removeChild(thisdel.parentNode);
            var id = document.getElementById(this.obj.id);
            if(id.outerHTML){
                id.outerHTML += '';
            }else{
                id.value = '';
            }
        },
        // 关闭动画位移
        startMover:function(itarget,time,obj){
            clearInterval(obj.timer);
            obj.timer = setInterval(function(){
                var top = obj.style.top;
                var end = top.indexOf('px')
                var sum = parseInt(top.substring(0,end))
                if(sum > itarget){
                    sum = sum - 1;
                }
                else{
                    sum = sum + 1;
                }
                if(sum == itarget){
                    obj.style.top = sum+'px';
                    clearInterval(obj.timer);
                }else{
                    obj.style.top = sum+'px';
                }
            },time);
        },
        getStyle:function (obj,attr) {
            // ie 浏览器
            if(obj.currentStyle){
                return obj.currentStyle[attr];
            }else{
                // firefox 浏览器
                return getComputedStyle(obj,false)[attr];
            }
        }
    }
    viewImage.init = function(obj, ywidth, yheight){
        new viewImage(obj, ywidth, yheight)
    }
    window.viewImage = viewImage.init
})()