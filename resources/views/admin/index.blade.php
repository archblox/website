@extends('layouts.admin')
@section('title')
    <title>Admin | Dashboard - {{ env('APP_NAME') }}</title>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<div class="Container">
<h2 class="MainHeader">
    Administration Area
</h2>
</div>
</div>
@endsection
@section('content')
    <h1>{{ env('APP_NAME') }}</h1>
        <h5>Administration Area</h5><br>
        <p><strong>{{ App\Models\User::count() }}</strong> users registered, <strong>{{ App\Models\User::where('admin', true)->count() }}</strong> total admins, <strong>{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subDay()->toDateTimeString())->count(); }}</strong> users online in the past 24 hours.</p><br>
        <p><strong>{{ App\Models\InviteKey::count() }}</strong> invite keys exist, <strong>{{ App\Models\InviteKey::where('active', true)->count() }}</strong> keys haven't been used yet.</p>
@endsection