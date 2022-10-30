@extends('layouts.loggedout')
@section('title')
<title>Privacy Policy - {{ env('APP_NAME') }}</title>
@endsection
@section('titlediscord')
<meta content="Privacy Policy - {{ env('APP_NAME') }}" property="og:title" />
@endsection
@section('descdiscord')
<meta content="ARCHBLOX is a work in progress 2012 ROBLOX revival with a heavy emphasis on Skeuomorphic UI." property="og:description" />
@endsection
@section('contentloggedout')
<h1>Privacy Policy</h1>
<p>ARCHBLOX is committed to providing a ROBLOX revival and this policy outlines our ongoing obligations to you in
    respect of how we manage your Personal Information.
    We have adopted the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) (the Privacy Act).
    The NPPs govern the way in which we collect, use, disclose, store, secure and dispose of your Personal Information.
    A copy of the Australian Privacy Principles may be obtained from the website of The Office of the Australian
    Information Commissioner at www.aoic.gov.au</p>
    <br>
<p>ARCHBLOX is not associated or partnered with Roblox Corp in any way.</p>
<h2>How we store your passwords</h2>
<p>As with every other site that uses passwords, we need a way to secure them, so no bad actors can read them. We use
    password hashing to store your passwords securely. In the event of a database breach, please change your password and email, to be safe. Please do not reuse any passwords.</p>
<h2>What is Personal Information and why do we collect it?</h2>
<p>Personal Information is information that identifies an individual. The Personal Information we collect include your
    username, age and email address.
    We also store your Places, Decals, T-Shirts, Shirts, Pants, Audios, Settings, Friends, ARCHBLOX Badges, Badges and ARKOTs until you delete it
    yourself, or we moderate it (see our Terms of Service). <a style="color: blue;"
        href="https://media.discordapp.net/attachments/987687460974788669/991175756602409041/unknown.png?width=1440&height=345">We
        do not store your IP Address.</a>
    We collect your Personal Information for the primary purpose of using the services. We may also use your Personal
    Information for secondary purposes closely related to the primary purpose, in circumstances where you would
    reasonably expect such use or disclosure.
    When we collect Personal Information, we will, where appropriate and where possible, explain to you why we are
    collecting the information and how we plan to use it.</p>
<h2>What happens when your account gets terminated?</h2>
<p>Within 3 months of being terminated, your account will be fully deleted. This includes all your stored data, and
    personal information.</p>
<h2>What happens if your account is inactive for a long time?</h2>
<p>After 1 year of inactivity, your account goes into a "disabled" state, where you can only modify/delete your Personal
    Information (Settings, Assets). You can either ask for it to be re-enabled or deleted. If it is inactive for another year after being
    disabled, it will be terminated. (See "What happens when your account gets terminated!" for more info)</p>
<h2>How do I delete my account?</h2>
<p>Ask one of the developers, or press the "Delete Account" button on the Settings page.</p>
<h2>Disclosure of Personal Information</h2>
<p>Your Personal Information will only be disclosed when required by law and when you request for it. (See
    Access/Deletion of your Personal Information for more information.)</p>
<h2>Security of Personal Information</h2>
<p>Your Personal Information is stored on our webserver. We've stored it in a manner that reasonably protects it from misuse and loss and from unauthorized access, modification or disclosure. If you would like to see what it looks like, click <a style="color: blue;"href="https://media.discordapp.net/attachments/987687460974788669/991175756602409041/unknown.png?width=1440&height=345">here</a>.</p>
<h2>Access/Deletion of your Personal Information</h2>
<p>You may access, delete and update and/or correct the Personal Information we hold (that is yours). If you wish to
    access your Personal Information, please open the Settings/Develop page, or contact us on our server if you wish to delete your account fully.</p>
<h2>Policy Updates</h2>
<p>This Policy can change from time to time. You will be notified of any change.</p>
<h2>Privacy Policy Complaints and Enquiries</h2>
<p>If you have any queries or complaints about our Privacy Policy, please contact us on our Discord, or contact us using the Messages system.</p>
<br>
@endsection