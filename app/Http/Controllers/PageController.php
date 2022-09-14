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
        $user = User::findOrFail($id);
        $badges = DB::table('badges')->get();
        $friends = $user->getFriends($perPage = 3);

        $data = [
            'user' => $user,
            'badges' => $badges,
            'friends' => $friends
        ];

        return view('pages.profile')->with($data);
    }

    public function profile_friends($id)
    {
        $user = User::findOrFail($id);
        $friends = $user->getFriends($perPage = 10);

        $data = [
            'user' => $user,
            'friends' => $friends
        ];

        return view('pages.profile_friends')->with($data);
    }

    public function mutual_friends($id)
    {
        $user = User::findOrFail($id);
        if ($user->id == Auth::id()) {
            abort(404);
        }

        $friends = Auth::user()->getMutualFriends($user, $perPage = 10);

        $data = [
            'user' => $user,
            'friends' => $friends
        ];

        return view('pages.mutual_friends')->with($data);
    }

    public function users(Request $request)
    {
        if ($request->has('q')) {
            $users = User::where('name', 'LIKE', '%' . $request->q . '%')->paginate(10);
        } else {
            $users = User::latest('last_seen')->paginate(10);
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

    public function notapproved()
    {
        return view('notapproved');
    }

    public function maintenance()
    {
        return view('maintenance');
    }

    public function catalog()
    {
        return view('pages.catalog');
    }

    public function games()
    {
        return view('pages.games');
    }

    public function gamepage()
    {
        return view('pages.gamepage');
    }

    public function avatar()
    {
        return view('pages.avatar');
    }
}
