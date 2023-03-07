<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Message;
use App\Models\UserSetting;
use App\Models\InviteKey;
use App\Models\FeedPost;


class AccountController extends Controller
{
    public function delete()
    {
        return view('dangerzone.delete');
    }

    public function deleteaccount()
    {
        $user = Auth::User();


        InviteKey::where('created_by', Auth::id())->delete();
        InviteKey::where('user_invited', Auth::id())->delete();

        Message::where('user_id', Auth::id())->delete();
        Message::where('sendto_id', Auth::id())->delete();

        FeedPost::where('user_id', Auth::id())->delete();

        Auth::logout();

        $user->delete();

        return view('index');
    }
}
?>