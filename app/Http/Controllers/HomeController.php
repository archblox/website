<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\FeedPost;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    /*public function __construct()
    {
        $this->middleware('auth');
    }*/

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        if (auth()->user()) {
            return redirect(route('home'));
        }
        return view('index');
    }

    public function home()
    {
        $friends = Auth::user()->getFriends($perPage = 3);
        $posts = FeedPost::where(function ($query) {
            $userFriends = Auth::user()->getFriends();
            $friendIds = array();

            foreach ($userFriends as $uF) {
                array_push($friendIds, $uF->id);
            }

            $query->whereIn('user_id', $friendIds)
                ->orWhere('user_id', '=', Auth::id());
        })->orderBy('id', 'desc')->paginate(10);

        $data = [
            'friends' => $friends,
            'posts' => $posts,
        ];

        return view('home')->with('data', $data);
    }

    public function feed_post(Request $request)
    {
        $request->validate([
            'status' => 'required|min:3|max:100'
        ]);

        $post = new FeedPost;
        $post->user_id = Auth::id();
        $post->status = $request->status;
        $post->save();

        return redirect()->back()->with('success', 'Posted!');
    }
}
