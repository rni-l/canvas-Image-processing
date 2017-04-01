import opts from './opts'
import draw from './draw'
import photograph from './photograph'
import ImageFilters from './imagefilters'
//缓存滤镜信息数据
var filterData = {
	filter:[]
}
var oFilterBox = document.getElementById('filterBox'), //滤镜盒子
	oFilterSelect = document.getElementById('filterSelect'), //选择滤镜select
	oContent = document.querySelector('#filterBox .content'),
typeName = '', //类型名字
	dataList = '' //子节点

//点击filterBtn
document.getElementById('filterBtn').addEventListener('touchstart', function(e) {
	oFilterBox.style.display = 'block';
}, false);

document.querySelector('#filterBox .close').addEventListener('touchstart', function(e) {
	oFilterBox.style.display = 'none';
}, false);


//box change事件
oFilterBox.addEventListener('change', function(e) {
	var tar = e.target;
	//事件委托，获取到当前对象
	if (tar.getAttribute('type') === 'range') {
		updateFilter();
	}

}, false);

//box input事件
oFilterBox.addEventListener('input', function(e) {
	var tar = e.target;
	//事件委托，获取到当前对象
	if (tar.getAttribute('type') === 'range') {
		tar.nextSibling.innerHTML = tar.value
	}
})

oFilterBox.addEventListener('touchstart', function(e) {
	opts.isStopPrevent = false;
}, false);

//选择滤镜后
oFilterSelect.addEventListener('change', function(e) {
	opts.isStopPrevent = true;
	var arr = this.value.split('&'),
		arr2 = this.options[this.selectedIndex].getAttribute('value2').split('&')
	if (!arr) {
		return false;
	}
	//格式化内容
	var str = format(arr, arr2);
	oContent.innerHTML = str
	var aInput = Array.prototype.slice.call(document.querySelectorAll('#filterBox .content input'))
	dataList = aInput.filter(function(v, i) {
		return v.nodeName === 'INPUT'
	})
	updateFilter();
}, false)

function updateFilter(){
	filterData.filter.length = 0;
	dataList.forEach(function(v, i) {
		filterData.filter.push(v.value);
	})
	setFilter(typeName)
	draw.cleanDraw();
}

function format(arr, arr2) {
	var name = arr[0],
		str = '';
	typeName = arr[0]
	for (let i = 1, len = arr.length; i < len; i++) {
		let data = arr2[i - 1].split(',')
		str += 
		`<div class='list'>
			<span>${arr[i]}</span><input type='range' max='${data[1]}' min='${data[0]}' value='${data[2]}' id='${arr[i]}' /><span>${data[2]}</span>
			</div>`
	}
	return str;
}

function setFilter(type = typeName,imgColorData = opts.data.colorData) {
	if(!type){return false;}

	var ctx = opts.ctx
	var filtered = ImageFilters[type](imgColorData, ...filterData.filter),
		pos = opts.data.imgPos
	ctx.clearRect(pos.x,pos.y,pos.w,pos.h)
	ctx.putImageData(filtered, pos.x,pos.y);
	filtered = null;
	pos = null;
}


export default{
	setFilter:setFilter
}