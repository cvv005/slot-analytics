(function(){
    var old = document.getElementById('niu-floating-plugin');
    if(old){ old.remove(); return; }

    var isMobile = window.innerWidth <= 768;
    var initW = isMobile ? 320 : 380;
    var initH = isMobile ? 520 : 600;
    var isMin = false;
    var lockedRoomInfo = null;

    var box = document.createElement('div');
    box.id = 'niu-floating-plugin';
    box.style.cssText = 'position:fixed; top:10px; right:10px; width:'+initW+'px; height:'+initH+'px; min-width:260px; min-height:38px; z-index:999999; background:#060304; border:2px solid #ff0015; border-radius:10px; box-shadow:0 8px 30px rgba(0,0,0,0.95); overflow:hidden; resize:both; touch-action:none; transition:height 0.2s ease, width 0.2s ease;';

    var header = document.createElement('div');
    header.style.cssText = 'background:#120608; padding:8px 10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,0,21,0.4); cursor:move; user-select:none; height:38px; box-sizing:border-box;';
    header.innerHTML = '<div id="niu-marquee-wrap" style="overflow:hidden; flex:1; margin-right:8px; position:relative; height:20px; display:flex; align-items:center;"><div id="niu-header-title" style="color:#ffb700; font-weight:bold; font-size:12px; white-space:nowrap; position:absolute; left:0;">🐂 牛老大AI選房系統</div></div><div style="display:flex; gap:6px; align-items:center; flex-shrink:0;"><button id="min-niu-box" style="background:rgba(255,0,21,0.2); border:1px solid #ff0015; color:#fff; font-size:14px; font-weight:bold; cursor:pointer; width:22px; height:22px; line-height:18px; border-radius:4px; padding:0; text-align:center;">-</button><button id="close-niu-box" style="background:none; border:none; color:#ff0015; font-size:18px; font-weight:bold; cursor:pointer; padding:0 4px;">×</button></div>';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://cvv005.github.io/slot-analytics/';
    iframe.style.cssText = 'width:100%; height:calc(100% - 38px); border:none; background:#060304;';

    box.appendChild(header);
    box.appendChild(iframe);
    document.body.appendChild(box);

    var titleEl = document.getElementById('niu-header-title');
    var minBtn = document.getElementById('min-niu-box');
    var animInterval = null;

    window.addEventListener('message', function(e){
        if(e.data && e.data.type === 'LOCK_ROOM') {
            lockedRoomInfo = e.data.room;
            if(isMin) { startMarquee(); }
        }
    });

    function getMarqueeText() {
        if(lockedRoomInfo) {
            return '🎯 [已鎖定房號 #' + lockedRoomInfo.num + '] ｜ 爆分率: ' + lockedRoomInfo.rate + '% ｜ 狀態: ' + lockedRoomInfo.cycleState + ' ｜ 回報率: ' + lockedRoomInfo.returnRate + '%';
        } else {
            return '🔥 尚未鎖定房號 ｜ 請在大廳點擊「鎖定此房」進行連動！';
        }
    }

    function startMarquee() {
        if(animInterval) clearInterval(animInterval);
        titleEl.innerText = getMarqueeText();
        var pos = 260;
        animInterval = setInterval(function(){
            pos -= 1.5;
            if(pos < -titleEl.offsetWidth) {
                pos = 280;
                titleEl.innerText = getMarqueeText();
            }
            titleEl.style.left = pos + 'px';
        }, 40);
    }

    function stopMarquee() {
        if(animInterval) clearInterval(animInterval);
        titleEl.style.left = '0px';
        titleEl.innerText = lockedRoomInfo ? ('🎯 已鎖定房號 #' + lockedRoomInfo.num) : '🐂 牛老大AI選房系統';
    }

    minBtn.onclick = function(e){
        e.stopPropagation();
        isMin = !isMin;
        if(isMin) {
            box.style.height = '38px';
            box.style.width = isMobile ? '340px' : '360px';
            box.style.resize = 'none';
            iframe.style.display = 'none';
            minBtn.innerText = '+';
            minBtn.style.background = 'rgba(0,255,102,0.2)';
            minBtn.style.borderColor = '#00ff66';
            minBtn.style.color = '#00ff66';
            startMarquee();
        } else {
            box.style.height = initH + 'px';
            box.style.width = initW + 'px';
            box.style.resize = 'both';
            iframe.style.display = 'block';
            minBtn.innerText = '-';
            minBtn.style.background = 'rgba(255,0,21,0.2)';
            minBtn.style.borderColor = '#ff0015';
            minBtn.style.color = '#fff';
            stopMarquee();
        }
    };

    document.getElementById('close-niu-box').onclick = function(){
        if(animInterval) clearInterval(animInterval);
        box.remove();
    };

    var isDragging = false, offX = 0, offY = 0;
    function startDrag(e){
        if(e.target === minBtn || e.target.id === 'close-niu-box') return;
        isDragging = true;
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        offX = clientX - box.offsetLeft;
        offY = clientY - box.offsetTop;
        iframe.style.pointerEvents = 'none';
    }
    function doDrag(e){
        if(!isDragging) return;
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        var clientY = e.touches ? e.touches[0].clientY : e.clientY;
        box.style.left = (clientX - offX) + 'px';
        box.style.top = (clientY - offY) + 'px';
        box.style.right = 'auto';
    }
    function stopDrag(){
        isDragging = false;
        iframe.style.pointerEvents = 'auto';
    }

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    header.addEventListener('touchstart', startDrag, {passive:true});
    document.addEventListener('touchmove', doDrag, {passive:true});
    document.addEventListener('touchend', stopDrag);
})();
