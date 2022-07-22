<!DOCTYPE html>
<html lang="en-us">
    <head>
        <title>Privacy Policy - {{ env('APP_NAME') }}</title>
        <meta charset="utf-8">
        <meta content="Privacy Policy - ARCHBLOX" property="og:title" />
        <meta content="ARCHBLOX is a work in progress revival." property="og:description" />
        <meta content="https://archblox.com" property="og:url" />
        <meta content="https://archblox.com/img/MORBLOXlogo.png" property="og:image" />
        <meta content="#4b4b4b" data-react-helmet="true" name="theme-color" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="{{ asset('img/MORBLOX.png') }}" />
        <link rel="apple-touch-startup-image" href="{{ asset('img/MORBLOXsplash.png') }}" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>
    <body>
        <br>
        <br>
        <div id="logo_signup">
            <a href="{{ route('index') }}"><img alt="ARCHBLOX Logo" src="{{ asset('img/ARCHBLOXarched.png') }}"
                width="200" height="40" /></a>
            <p id="morbin">We're Still Morbin'</p>
        </div>
        <div class="content_signup">
            <h1>Privacy Policy</h1>
            <p>ARCHBLOX is committed to providing a silly ROBLOX revival and this policy outlines our ongoing obligations to you in respect of how we manage your Personal Information.
                We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the Privacy Act). The NPPs govern the way in which we collect, use, disclose, store, secure and dispose of your Personal Information.
                A copy of the Australian Privacy Principles may be obtained from the website of The Office of the Australian Information Commissioner at www.aoic.gov.au</p>
            <h2>Req. Legal Disclaimer</h2>
            <p>ARCHBLOX is not associated, partnered or owned with Roblox Corp in any way.</p>
            <h2>How we store your passwords</h2>
            <p>As with every other site that uses passwords, we need a way to secure them, so no bad actors can read them. We use bcrypt to store your passwords securely.</p>
            <h2>What is Personal Information and why do we collect it?</h2>
            <p>Personal Information is information that identifies an individual. The Personal Information we collect include your username, age and email address.
                We also store your Places, Decals, T-Shirts, Shirts, Pants, Audios, Settings, Friends and ARKOTs until you delete it yourself, or we moderate it (see our Terms of Service).
                This Personal Information is obtained from our website archblox.com. <a style="color: blue;" href="https://media.discordapp.net/attachments/987687460974788669/991175756602409041/unknown.png?width=1440&height=345">We do not store your IP Address.</a>
                We collect your Personal Information for the primary purpose of using the services. We may also use your Personal Information for secondary purposes closely related to the primary purpose, in circumstances where you would reasonably expect such use or disclosure.
                When we collect Personal Information, we will, where appropriate and where possible, explain to you why we are collecting the information and how we plan to use it.</p>
            <h2>What happens when your account gets terminated?</h2>
            <p>Within 3 months of being terminated, your account will be forever deleted. This includes all your stored data, and personal information. YOU CAN APPEAL YOUR TERMINATION.</p>
            <h2>What happens if your account is inactive for a long time?</h2>
            <p>After 1 year of inactivity, your account goes into a "disabled" state, where you can only change your Personal Information. You can either ask for it to be re-enabled or deleted. If it is inactive for another year after being disabled, it will be terminated, and then will lose all the stored data after the 3-month period of being terminated.</p>
            <h2>Disclosure of Personal Information</h2>
            <p>Your Personal Information will only be disclosed when required by law and when you request for it. (See Access/Deletion of your Personal Information for more information.)</p>
            <h2>Security of Personal Information</h2>
            <p>Your Personal Information is stored in a manner that reasonably protects it from misuse and loss and from unauthorized access, modification or disclosure.</p>
            <h2>Access/Deletion of your Personal Information</h2>
            <p>You may access, delete and update and/or correct the Personal Information we hold (that is yours). If you wish to access your Personal Information, please open the Settings/Build page, or contact us on our server.
                In order to protect your Personal Information, we may require identification from you before releasing the requested information.</p>
            <h2>Policy Updates</h2>
            <p>This Policy can change from time to time and is available on our website. You will be notified of this change.</p>
            <h2>Privacy Policy Complaints and Enquiries</h2>
            <p>If you have any queries or complaints about our Privacy Policy, please contact us on our Discord.</p>
            <br>
        </div>
        <div id="footer_signup">
            <p>ARCHBLOX is not affiliated with Roblox Corp, Lego, Sony, SEGA, Microsoft, Nintendo and Morbius. It's Morbin time!</p>
            <p><a href="{{ route('privacy') }}">Privacy Policy</a> <a href="{{ route('tos') }}">Terms of Service</a></p>      
        </div id="footer">
    </body>
</html>