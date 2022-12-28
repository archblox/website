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
@section('AdminPanel')
<div class="NewAdminPanel">
        <nav class="Admin-Navigation">
            <div class="Header">
                <a href="{{ route('home') }}" title="ARCHBLOX Home" class="PanelLogo"></a>
                <span class="SubSlogan">Admin Panel</span>
                <div class="usernamecontainer">
                <a class="usernamelink" href="@guest {{ route('login') }} @else {{ route('profile', Auth::id()) }} @endguest">{{ Auth::user()->name }}</a>
                </div>
            </div>
            <ul class="SubHeader">
                <li class="sub-menu">
                    <a class="menu" href="{{ route('admin_users') }}">Users</a>
                </li>
                <li class="sub-menu">
                    <a class="menu" href="{{ route('admin_index') }}" active>Status</a>
                </li>
                <li class="sub-menu">
                    <a class="menu" href="{{ route('admin_tree') }}">Invites</a>
                </li>
            </ul>
        </nav>
        <div class="AdminContainer">
          <h4 class="H-20sB UH-vXb0">Welcome {{ Auth::user()->name }}</h4>
          <h2 class="H-32sB SH-8B07">Status</h2>
          <div class="S-Ia06">
               <h3 class="H-24sB SSH-kR0q">Status</h3>
               <div class="S-5mjl">
                    <div class="S-aS25">
                         <h5 class="S-H1sm">Registered</h5>
                         <h5 class="S-H2sm">{{ App\Models\User::count() }}</h5>
                    </div>
                    <div class="S-aS25">
                         <h5 class="S-H1sm">Admins</h5>
                         <h5 class="S-H2sm">{{ App\Models\User::where('admin', true)->count() }}</h5>
                    </div>
                    <div class="S-aS25">
                         <h5 class="S-H1sm">Online Past Day</h5>
                         <h5 class="S-H2sm">{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subDay()->toDateTimeString())->count(); }}</h5>
                    </div>
                    <div class="S-aS25">
                         <h5 class="S-H1sm">Online</h5>
                         <h5 class="S-H2sm">{{ App\Models\User::where('last_seen', '>', Carbon\Carbon::now()->subMinute()->toDateTimeString())->count(); }}</h5>
                    </div>
               </div>
               <div class="S-5mjl">
                    <div class="S-aS50">
                         <h5 class="S-H1sm">Invite Key(s)</h5>
                         <h5 class="S-H2sm">{{ App\Models\InviteKey::count() }}</h5>
                    </div>
                    <div class="S-aS50">
                         <h5 class="S-H1sm">Unused Invite Key(s)</h5>
                         <h5 class="S-H2sm">{{ App\Models\InviteKey::where('active', true)->count() }}</h5>
                    </div>
               </div>
          </div>
     </div>
</div>
@endsection