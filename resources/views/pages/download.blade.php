@extends('layouts.loggedout')
@section('title')
<title>Downloads - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Downloads - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Downloads</h1>
<p>ARCHBLOX will be installed to %LOCALAPPDATA%\Archblx</p>
<p class="important">You must be logged in to join games. Use studio to log in to your account.</p>
<br>
<p><strong>Requires .NET Framework 4.0, and Windows XP or newer. Not recommended for anything running Windows 7 or newer.</strong></p>
<p><a href="{{ asset('xp/ARCHBLOXLauncher_XP.exe') }}">Windows XP/Vista Launcher v1.3</a> | <a href="{{ asset('xp/ARCHBLOXBootstrapper_XP.exe') }}">Windows XP/Vista Studio v1.2</a></p>
<br>
<p><strong>The below downloads require Windows 7 or newer and they require .NET Core 3.1. These are recommended for anything running Windows 7 or newer.</strong></p>
<br>
<p>ARCHBLOX Launcher v2.9</p>
<p><a href="{{ asset('launcher/ARCHBLOXLauncher-32bit.exe') }}">32 Bit</a> | <a
        href="{{ asset('launcher/ARCHBLOXLauncher-64bit.exe') }}">64 Bit</a></p>
<br>
<p>ARCHBLOX Studio Bootstrapper v1.6</p>
<p><a href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-32bit.exe') }}">32 Bit</a> | <a
        href="{{ asset('bootstrapper/ARCHBLOXBootstrapper-64bit.exe') }}">64 Bit</a></p>
<br>
<p>Source Code</p>
<p><a href="https://github.com/Thomasluigi07/ARCHBLOXLauncher">Launcher</a> | <a
        href="https://github.com/Thomasluigi07/ARCHBLOXBootstrapper">Studio Bootstrapper</a></p>
<p><a href="https://github.com/Thomasluigi07/ARCHBLOXLauncherLegacy">Launcher (XP, Vista)</a> | <a
        href="https://github.com/Thomasluigi07/ARCHBLOXBootstrapperLegacy">Studio Bootstrapper (XP, Vista)</a></p>
<br>
<p>If you get a popup saying "Windows protected your PC", press "More info" and then press "Run anyway".</p>
<br>
<p>If you get a popup saying "Virus detected", open Windows Security (Windows Defender if on Windows 10 or earlier) and
    then press Virus & threat protection, press Manage Settings, select Add or Remove exclusions, make a folder you want
    to exclude and then choose that folder, install the exe there.</p>
<br>
<p>If you get a popup saying "The application has failed to start because its side-by-side configuration is incorrect", go <a href="https://www.microsoft.com/en-us/download/details.aspx?id=26368">here</a> to download Microsoft Visual C++ 2008 Redistibutable and choose "x86" when prompted.</p>
@endsection