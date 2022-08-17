@extends('layouts.admin')
@section('title')
    <title>
        Admin | User List - {{ env('APP_NAME') }}</title>
    <style>
        .flex {
            display: block !important;
        }
    </style>
@endsection

@section('Body')
<div id="Body" style="width: 970px;">
<h2 class="MainHeader">
    User List
</h2>
<h5 class="SubHeader Reminder">
    Reminder to not share details without the users permission. Don't Abuse!
</h5>
<div class="Userlist">
<form method="GET" action="{{ route('admin_users') }}">
<div>
<input type="text" id="SearchInput" name="Searchbtn" placeholder="Search" value="{{ request()->q }}">
@if (request()->query('Searchbtn'))
<a href="{{ route('admin_users') }}" class="SearchCloseBtn">X</a>
@endif
<button class="bluebutton" name="searchBy" value="name">Search by Username</button><button class="bluebutton" name="searchBy" value="id">Search by ID</button></div>
</form>
@foreach ($users as $user)
<div class="SearchContainer">
</div>
@endforeach
</div>
</div>
@endsection
@section('content')
    <div id="UserList">
        <h2>User List</h2>
        <p>Remember, use your powers for good, not for evil.</p>
        <p>Please do not share a user's birth date or email address without their permission.</p>
        @if (request()->query('q'))
        <a href="{{ route('admin_users') }}" style="color:navy">Clear Search</a>
        @endif

        <form method="GET" action="{{ route('admin_users') }}">
            <div style="margin-top:10px;margin-bottom:10px;"><input type="text" id="q" name="q" placeholder="Search..." value="{{ request()->q }}"><button
                    class="bluebutton" style="margin-left:2px" name="searchBy" value="name">Search by Username</button><button class="bluebutton" style="margin-left:2px" name="searchBy" value="id">Search by ID</button></div>
        </form>
        @foreach ($users as $user)
            <div id="SearchContainer">
                <div class="ProfileContainerBox" id="ProfileContainerBox1" style="background-color: white;">
                    <div id="ProfileContainerBox1ImageContainer">
                        <img alt="Profile Image" src="https://archblox.com/img/defaultrender.png" width="60px"
                            height="100%">
                    </div>
                    <div id="ProfileContainerBox1TextContainer" style="color:black">
                        <p><strong>Username:</strong> {{ $user->name }}</p>
                        @if ($user->admin)
                            <p><strong>E-Mail:</strong> <i>Admin E-Mail Hidden</i></p>
                        @else
                            <p><strong>E-Mail:</strong> {{ $user->email }}</p>
                        @endif
                        <p><strong>ID:</strong> {{ $user->id }}</p>
                        <p><strong>DOB:</strong> {{ Carbon\Carbon::parse($user->dob)->format('d/m/Y') }}</p>
                        <p><strong>Rank:</strong>
                            @if ($user->admin)
                                Admin
                            @else
                                Member
                            @endif
                        </p>
                        <p><strong>Status:</strong> Normal</p>
                        <p><strong>Invited By:</strong> <a style="color:blue"
                                href="{{ route('profile', App\Models\User::where('id', $user->invited_by)->first()->id) }}">{{ App\Models\User::where('id', $user->invited_by)->first()->name }}</a>
                            (ID: {{ App\Models\User::where('id', $user->invited_by)->first()->id }})
                        </p>
                        <!--
                                <button class="greybutton">Check Reports For This User</button>
                                <button class="bluebutton">Edit User Data</button>
                                <button class="bluebutton">Warn/Ban History</button>
                                <button class="redbutton">Warn</button>
                                <button class="redbutton">Ban/Terminate</button>-->
                    </div>
                </div>
            </div>
        @endforeach
        @if ($users->isEmpty())
            <h5>No user was found, check if you entered the correct details.</h5>
        @endif
    </div>
    {{ $users->appends($_GET)->links() }}
@endsection
