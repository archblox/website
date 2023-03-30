function getDarkMode() {
    var currentTime = new Date().getHours();
    if (6 >= currentTime || currentTime > 18) {
        var li = document.createElement('link');
        var href = "{{ asset('css/appdark.css?id='.Str::random(8)) }}";
        var rel = 'stylesheet';
        li.setAttribute('href', href);
        li.setAttribute('rel', rel);
        var s = document.getElementsByTagName('head')[0];
        s.appendChild(li, s);

        var li = document.createElement('meta');
        var content = "#1952A6";
        var datareacthelmet = 'true';
        var name = "theme-color"
        li.setAttribute('content', content);
        li.setAttribute('data-react-helmet', datareacthelmet);
        li.setAttribute('name',name)
        var s = document.getElementsByTagName('head')[0];
        s.appendChild(li, s);
    } else {
        var li = document.createElement('meta');
        var content = "#1952A6";
        var datareacthelmet = 'true';
        var name = "theme-color"
        li.setAttribute('content', content);
        li.setAttribute('data-react-helmet', datareacthelmet);
        li.setAttribute('name',name)
        var s = document.getElementsByTagName('head')[0];
        s.appendChild(li, s);
     }
}