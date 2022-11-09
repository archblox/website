@extends('layouts.admin')
@section('title')
    <title>Admin | Dashboard - {{ env('APP_NAME') }}</title>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<h2 class="MainHeader hidden">
     ARCHBLOX Status
</h2>
<h2 class="MainHeader">
     Status
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
<div class="Stats-Wrapper">
<span class="Stats Counter">
{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subMinute()->toDateTimeString())->count(); }}
</span>
<span class="Stats">
     Currently Online.
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