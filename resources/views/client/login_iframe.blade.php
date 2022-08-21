<html lang="en-us" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>
        ARCHBLOX Login
    </title>
    <link rel="stylesheet"
        href="{{ asset('css/FetchCSS.css') }}">
</head>

<body style="background: #E1E1E1;">
    <div id="NotLoggedInPanel">
        <form name="FacebookLoginForm" id="FacebookLoginForm" method="POST" action="{{ route('login') }}">
            <div id="LoginForm">
                <div class="newLogin" id="newLoginContainer">
                    <div class="UserNameDiv">
                        <label class="LoginFormLabel" for="UserName">Username</label>
                        <br><input name="login" title="Username Field" placeholder=" " type="text" id="login" value="{{ old('login') }}" class="LoginFormInput"
                            required autofocus tabindex="1">
                    </div>
                    <div class="PasswordDiv">
                        <label class="LoginFormLabel" for="Password">Password</label>
                        <a href="{{ route('password.request') }}" target="_top" class="ResetPassword">Forgot password?</a>
                        <br><input name="password" title="Password Field" placeholder=" " type="password" id="password" class="LoginFormInput" required
                            autocomplete="current-password" style="width:152px;" tabindex="2">
                    </div>
                    <div id="ErrorMessage" style="color:Red"></div>
                    <div class="LoginFormFieldSet">
                        <span
                            style="font: normal 12px arial;color: black;position: absolute;top: 47%;margin-top: 8px;">
                            Not a member?
                            <a href="{{ route('register') }}" style="font: bold 12px Arial;color: #095FB5;"
                                target="_top">Sign up!</a>
                        </span>
                        <span
                            style="font: normal 12px arial;color: black;position: absolute;top: 65%;margin-top: 8px;">
                            Log in not working?
                            <a href="{{ route('login') }}" style="font: bold 12px Arial;color: #095FB5;"
                                target="_top">Click here!</a>
                        </span>
                        <span id="LoginButtonActive"><button style="border: none; background-position: 0 0; top: 50%" id="LoginButton" type="submit"
                                onClick="this.form.submit();this.disabled=true" tabindex="4"
                                class="iFrameBlueLogin"></button></span>
                        <span id="LoggingInStatus"
                            style="display: none; font: bold 12px arial; position: absolute; right: 8px;margin-top: -11px;top: 50%;">
                            <img src="https://web.archive.org/web/20130715023249im_/https://s3.amazonaws.com/images.roblox.com/6ec6fa292c1dcdb130dcf316ac050719.gif"
                                style="margin-right: 5px;width: 20px;height: 20px;" alt="">
                            <span style="top: -5px;position: absolute;position: relative;">Logging in...</span>
                        </span>
                    </div>
                </div>
            </div>
        </form>
    </div>
</body>

</html>