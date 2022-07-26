<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Multicaret\Acquaintances\Traits\Friendable;

class FriendController extends Controller
{
    use Friendable;

    public function friends(Request $request)
    {
        /*
        use Illuminate\Support\Str;
        if ($request->has('q')) {
            $userFriends = Auth::user()->getFriends();
            foreach ($userFriends as $users) {
                if (Str::contains($users->name, $request->get('q'))) {
                    $user = collect($users);
                    dd($user);
                }
            }
        }*/

        /* ADD THIS: search feature */

        $user = Auth::user()->getFriends($perPage = 10);

        return view('pages.friends')->with('userFriends', $user);
    }

    public function requests()
    {
        $user = Auth::user()->getFriendRequests();

        return view('pages.requests')->with('userRequests', $user);
    }

    public function handle($id, Request $request)
    {
        $action = $request->input('action');

        if ($action == 'accept') {
            $this->accept($id);
        } else {
            $this->decline($id);
        }

        return redirect()->route('requests');
    }

    public function accept($id): void
    {
        $user = Auth::user();
        $recipient = User::findOrFail($id);

        if (!$user->hasFriendRequestFrom($recipient)) {
            abort(404);
        }

        $user->acceptFriendRequest($recipient);
    }

    public function decline($id): void
    {
        $user = Auth::user();
        $recipient = User::findOrFail($id);

        if (!$user->hasFriendRequestFrom($recipient)) {
            abort(404);
        }

        $user->denyFriendRequest($recipient);
    }

    public function add($id)
    {
        $user = Auth::user();
        $recipient = User::findOrFail($id);

        if ($recipient->id == $user->id) {
            abort(404);
        }

        if ($user->hasSentFriendRequestTo($recipient) || $user->hasFriendRequestFrom($recipient)) {
            abort(404);
        }

        $user->befriend($recipient);
        return redirect()->back();
    }

    public function remove($id)
    {
        $user = Auth::user();
        $recipient = User::findOrFail($id);

        if ($recipient->id == $user->id) {
            abort(404);
        }

        if (!$user->isFriendWith($recipient)) {
            abort(404);
        }

        $user->unfriend($recipient);
        return redirect()->back();
    }
}
