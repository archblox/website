@extends('layouts.app')
@section('title')
<title>Blog - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Blog - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress revival." property="og:description" />
@endsection
@section('extras')
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript">
    $(window).load(function(){
        $("a").click(function(){
            top.window.location.href=$(this).attr("href");
            return true;
        })
    })
</script>
<style>
body {
    height: 100%;
    margin: 0;
    width: 100%;
    overflow: hidden;
}
</style>
@endsection
@section('custom_content')
<iframe src="https://archblox.blogspot.com" title="ARCHBLOX Blog" width="100%" height="100%" style="border:none;"></iframe>
@endsection