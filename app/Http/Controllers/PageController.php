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
        $friends = $user->getFriends($perPage = 3);

        if (!$user) {
            abort(404);
        }

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
        $friends = $user->getFriends($perPage = 10);

        if (!$user) {
            abort(404);
        }

        $data = [
            'user' => $user,
            'friends' => $friends
        ];

        return view('pages.profile_friends')->with('data', $data);
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

    public function settings()
    {
        return view('misc.settings');
    }

    public function change_settings(Request $request)
    {
        $request->validate([
            'bio' => 'required|min:3|max:2000'
        ]);

        $user = Auth::user();
        $user->blurb = $request->bio;
        $user->save();

        return redirect()->back()->with('success', 'Your bio has been updated.');
    }

    public function download()
    {
        return view('pages.download');
    }
}
