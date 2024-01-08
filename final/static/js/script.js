function updateClock(){
    var now = new Date();
    var year = now.getFullYear() - 1911;
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    document.getElementById('time').textContent = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds;
}
setInterval(updateClock, 1000);
