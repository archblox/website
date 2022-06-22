<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PageController extends Controller
{
    /**
     * Show the application's privacy policy.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function privacy()
    {
        return view('misc.privacy');
    }

    public function tos()
    {
        return view('misc.tos');
    }

    public function profile($id)
    {
        $user = User::find($id);
        if (!$user) {
            abort(404);
        }
        return view('pages.profile')->with('user', $user);
    }
}
