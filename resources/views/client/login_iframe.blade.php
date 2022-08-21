<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <title>
        ARCHBLOX Login
    </title>
    <link rel="stylesheet"
        href="http://web.archive.org/web/20130715023249cs_/https://www.roblox.com/CSS/Base/CSS/FetchCSS?path=main___bf363dfd925930252a5f326c7990c31c_m.css">
</head>

<body style="background: #E1E1E1;">
    <div id="LoginForm">
        <div class="newLogin" id="newLoginContainer">
            <form method="POST" action="{{ route('login') }}">
                @csrf
                <div class="UserNameDiv">
                    <label class="LoginFormLabel" for="UserName">Username</label>
                    <br><input name="login" type="text" id="login" value="{{ old('login') }}" class="LoginFormInput"
                        required autofocus tabindex="1">
                </div>
                <div class="PasswordDiv">
                    <label class="LoginFormLabel" for="Password">Password</label>
                    <a href="ResetPasswordRequest.aspx" target="_top" class="ResetPassword">Forgot password?</a>
                    <br><input name="password" type="password" id="password" class="LoginFormInput" required
                        autocomplete="current-password" style="width:152px;" tabindex="2">
                </div>
            <div id="ErrorMessage" style="color:Red"></div>
            <div class="LoginFormFieldSet">
                <span style="font: normal 12px arial;color: black;position: absolute;top: 50%;margin-top: -8px;">
                    Not a member?
                    <a href="NewAge.aspx" style="font: bold 12px Arial;color: #095FB5;" target="_top">Sign up!</a>
                </span>
                <span id="LoginButtonActive"><a id="LoginButton" type="submit" onClick="this.form.submit();this.disabled=true" tabindex="4" class="iFrameBlueLogin"></a></span>
                <span id="LoggingInStatus"
                    style="display: none; font: bold 12px arial; position: absolute; right: 8px;margin-top: -11px;top: 50%;">
                    <img src="https://web.archive.org/web/20130715023249im_/https://s3.amazonaws.com/images.roblox.com/6ec6fa292c1dcdb130dcf316ac050719.gif"
                        style="margin-right: 5px;width: 20px;height: 20px;" alt="">
                    <span style="top: -5px;position: absolute;position: relative;">Logging in...</span>
                </span>
            </div>
            </form>
        </div>
    </div>
    </div>
    <script type="text/javascript">
    $(function() {
        Roblox.iFrameLogin.Resources = {
            //<sl:translate>
            invalidCaptchaEntry: 'Invalid Captcha entry'
            //</sl:translate>
        };
        Roblox.iFrameLogin.init();
    });
    </script>
</body>

</html>