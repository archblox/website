@extends('layouts.admin')
@section('title')
    <title>Admin | Dashboard - {{ env('APP_NAME') }}</title>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<h2 class="MainHeader">
     Home
</h2>
<div class="StatsContainer">
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\User::count() }}
</span>
<span class="Stats">
     Registered
</span>
</div>
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\User::where('admin', true)->count() }}
</span>
<span class="Stats">
     Admin(s)
</span>
</div>
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subDay()->toDateTimeString())->count(); }}
</span>
<span class="Stats">
     Online within the past day.
</span>
</div>
<br>
<span class="Stat-Separator"></span>
<br>
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\InviteKey::count() }}
</span>
<span class="Stats">
     Invite Key(s)
</span>
</div>
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\InviteKey::where('active', true)->count() }}
</span>
<span class="Stats">
     Unused Invite Key(s)
</span>
</div>
</div>
</div>
@endsection
@section('content')
    <h1>{{ env('APP_NAME') }}</h1>
        <h5>Administration Area</h5><br>
        <p><strong>{{ App\Models\User::count() }}</strong> users registered, <strong>{{ App\Models\User::where('admin', true)->count() }}</strong> total admins, <strong>{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subDay()->toDateTimeString())->count(); }}</strong> users online in the past 24 hours.</p><br>
        <p><strong>{{ App\Models\InviteKey::count() }}</strong> invite keys exist, <strong>{{ App\Models\InviteKey::where('active', true)->count() }}</strong> keys haven't been used yet.</p>
@endsection