<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
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
        $badges = DB::table('badges')->get();

        if (!$user) {
            abort(404);
        }

        $data = [
            'user' => $user,
            'badges' => $badges
        ];

        return view('pages.profile')->with('data', $data);
    }

    public function users(Request $request)
    {
        if ($request->has('q')) {
            $users = DB::table('users')->where('name', 'LIKE', '%'.$request->q.'%')->paginate(10);
        } else {
            $users = User::paginate(10);
        }

        return view('pages.users')->with('users', $users);
    }
    
    public function settings()
    {
        return view('misc.settings');
    }

    public function friends()
    {
        return view('pages.friends');
    }
}
