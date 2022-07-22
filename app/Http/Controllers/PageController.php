<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


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

        $friends = $user->getFriends($perPage = 3);

        $data = [
            'user' => $user,
            'badges' => $badges,
            'friends' => $friends
        ];

        return view('pages.profile')->with('data', $data);
    }

    public function profile_friends($id)
    {
        $user = User::find($id);
        if (!$user) {
            abort(404);
        }

        $friends = $user->getFriends($perPage = 10);

        $data = [
            'user' => $user,
            'friends' => $friends
        ];

        return view('pages.profile_friends')->with('data', $data);
    }

    public function mutual_friends($id)
    {
        $user = User::find($id);
        if (!$user || $user->id == Auth::id()) {
            abort(404);
        }

        $friends = Auth::user()->getMutualFriends($user, $perPage = 10);

        $data = [
            'user' => $user,
            'friends' => $friends
        ];

        return view('pages.mutual_friends')->with('data', $data);
    }

    public function users(Request $request)
    {
        if ($request->has('q')) {
            $users = DB::table('users')->where('name', 'LIKE', '%' . $request->q . '%')->paginate(10);
        } else {
            $users = User::paginate(10);
        }

        return view('pages.users')->with('users', $users);
    }

    public function download()
    {
        return view('pages.download');
    }

    public function incomplete()
    {
        return view('pages.incomplete');
    }

    public function styleguide()
    {
        return view('pages.styleguide');
    }

    public function blog()
    {
        return view('misc.blog');
    }
}
