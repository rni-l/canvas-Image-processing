
var oCan = document.getElementById('canvas'),//获取画布
    ctx = oCan.getContext('2d'),
    oFile = document.getElementById('file'),//上传图片按钮
    oShowImg = document.getElementById('lastImg'),//最终生成的图片
    oTop = document.querySelector('.main_top'),
  	oCreateBtn = document.getElementById('cretea'),//生成图片按钮
  	oMsg = document.querySelector('.msg'),
  	oZhezhao = document.querySelector('.zhezhao'),
  	oRevoke = document.getElementById('revoke')//撤销按钮	 

//公共方法
function msg(type){
	oZhezhao.style.display = type;
	oMsg.style.display = type;
}

	export default {
		oCan:oCan,
		ctx:ctx,
		oFile : oFile,
		oShowImg : oShowImg,
		oTop:oTop,
		oCreateBtn:oCreateBtn,
		oMsg : oMsg,
		oZhezhao : oZhezhao,
		oRevoke : oRevoke,
		//方法
		msg:msg,
		isDraw:false,//能否涂鸦
		isNewPic:true,//是否新的图片
		isStopPrevent:true,//是否阻止全局默认事件
		data:{
			
		}
	}
