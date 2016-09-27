//��ȡԪ��
var banner = document.getElementById('banner');
var bannerInner = utils.getElementsByClass('bannerInner',banner)[0];
var imgsBox = bannerInner.getElementsByTagName('div'); //���ǰ���img�ĺ���
var imgs = bannerInner.getElementsByTagName('img'); //���е�img
var focusList  = banner.getElementsByTagName('ul')[0];
var lis = focusList.getElementsByTagName('li');
var left = utils.getElementsByClass('leftt',banner)[0];
var right = utils.getElementsByClass('rightt',banner)[0];
//��ȡ����
(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',"data.txt?_="+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
//console.log(data)

//������
(function bindData(){
    if(window.data){
        var str = "";
        var liStr = "";
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            str += '<div><img src="" trueSrc="'+ curData.src +'"/></div>';
            liStr += i === 0 ? '<li class="bg"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str;
        focusList.innerHTML = liStr;
    }
})();

//ͼƬ�ӳټ��أ� ������������Ѿ��ѵ�һ��Ĭ�ϴ�zIndex=0���ó�1������͸����Ҳ��0��1
function imgsDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        (function (i){
            var curImg = imgs[i];
            if(curImg.isloaded) return;
            var tempImg = new Image();
            tempImg.src = curImg.getAttribute('trueSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                utils.css(curImg,"display","block"); //�����������ͼƬdisplay��block�����ǰ�����ͼƬ��div��z-Index�Ĳ㼶��0����������͸����opacityҲ��0
                //��ֻ��Ĭ�ϵĵ�һ��img(�����ŵ�һ��ͼƬ��img��div��z-IndexΪ1��������������ӵ�͸����opacity��0�˶���1)
                //�ж�ֻ��i==0��ʱ�򣬲��ǵ�һ��
                if(i === 0){
                    //�ȰѲ㼶z-Index�ı�
                    utils.css(curImg.parentNode,'zIndex',1);
                    //���һ�Ҫ�޸�͸����
                    animate(curImg.parentNode,{opacity:1},300);
                }else{
                    utils.css(curImg.parentNode,"zIndex",0); //��һ��ʽûд
                    utils.css(curImg.parentNode,'opacity',0); //��һ͸����Ҳû������
                }
            }
            tempImg = null;
            curImg.isloaded = true;
        })(i);
    }
}
window.setTimeout(imgsDelayLoad,500);

//�Զ��ֲ�
var step = 0;
var timer = null;
var interval = 2000; //2000ms����һ��ͼƬ
timer = window.setInterval(autoMove,interval);
function autoMove(){
    //console.log(step); //��һ������ͼƬ��ʾ��
    if(step == data.length - 1){ // ֻҪ���step����3��˵����һ���ǵ�4����ʾ�ġ���ô��һ��Ӧ���ǵ�һ����ʾ�ˡ���һ����ʾ��������0 ==> ��ô����step++֮�����0. ��ô��step++֮ǰ����-1
        step = -1;
    }
    step++; //��һ�ε��յ㣬�´ζ�Ӧ����ֵ��ͼƬ��ʾ
    //����ط�Ҫдһ�������������������������Ϊstep������ͼƬ��zIndex=1���ֲ�����������ͼƬ��zIndex�ص�0. ����������Ϊstep��ͼƬ��͸���ȴ�0���ȵ�1
    //console.log(step); //��һ��˭Ҫ��ʾ
    setBanner();
}

function setBanner(){ //����������һ��ͼƬ��ʾ
    //��Ҫѭ�����е�img��ֻҪ����ֵ��ȫ�ֵ�step��ͬ����һ�ŵ�zIndex��ֵ���1���������ı��0.������step��͸���ȴ�0�˶���1��˵�������յ�֮���������������ͼƬ��͸����ֱ�����ó�0�Ϳ�����.(��Ҫ�ص�����)
    for(var i=0; i<imgs.length; i++){
        var curImg = imgs[i];
        if(i === step){ //
            utils.css(curImg.parentNode,'zIndex',1); //�Ȱ�step���������ֵ��һ�ŵ�zIndex���ó�1
            animate(curImg.parentNode,{opacity:1},300,function (){
                var siblings = utils.siblings(this); //���˵�ǰ������Ҳ����step��һ�ŵ���������ͼƬ,����siblings�Ƕ�������Ҫѭ������͸����Ϊ0
                for(var j=0; j<siblings.length; j++){
                    var curSibling = siblings[j];
                    utils.css(curSibling,'opacity',0);
                }
            });

        }else{
            utils.css(curImg.parentNode,'zIndex',0); //�ѳ���step��һ�ŵ���������ͼƬ��zIndex���ó�0
        }
    }
    for(var i=0; i<lis.length; i++){
        lis[i].className = i == step ? 'bg' : '';
    }
}

(function bindEventForLi(){
    for(var i=0; i<lis.length; i++){
        var curLi = lis[i];
        curLi.index = i;
        curLi.onclick = function (){
            step = this.index; //�ѵ��li������ֵ��ֵ��ȫ��step��ȫ��step���Ǽ�¼��һ��ͼƬ��ʾ������ֻҪ�޸�step�Ϳ�����
            setBanner(); //���Ǹ���step�ı仯�������õ�
        }
    }
})();

banner.onmouseover = function (){
    left.style.display = right.style.display = 'block';
    window.clearInterval(timer);
}
banner.onmouseout = function (){
    left.style.display = right.style.display = 'none';
    timer = window.setInterval(autoMove,interval);
}
left.onclick = function (){
    step--; //����һ����˭��ʾ
    if(step == -1){
        step = data.length -1;
    }
    setBanner();
}
right.onclick = autoMove;