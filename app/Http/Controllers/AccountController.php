<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserSetting;


class AccountController extends Controller
{
    public function delete()
    {
        return view('dangerzone.delete');
    }

    public function deleteaccount()
    {
        $user = Auth::User();

        Auth::logout();

        $user->delete();

        return view('index');
    }
}
?>