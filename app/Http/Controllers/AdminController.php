<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function users(Request $request)
    {
        if ($request->searchBy == 'name' && $request->has('q')) {
            $users = DB::table('users')->where('name', 'LIKE', '%' . $request->q . '%')->paginate(10);
        } else if ($request->searchBy == 'id' && $request->has('q')) {
            $users = DB::table('users')->where('id', $request->q)->paginate(10);
        } else {
            $users = User::paginate(10);
        }

        return view('admin.users')->with('users', $users);
    }

    public function tree(Request $request)
    {
        if ($request->searchBy == 'name' && $request->has('q')) {
            $user = DB::table('users')->where('name', $request->q)->first();
        } else if ($request->searchBy == 'id' && $request->has('q')) {
            $user = DB::table('users')->where('id', $request->q)->first();
        } else {
            $user = array();
        }

        if (empty($user)) {
            $children = null;
            $invited_by = null;
        } else {
            $children = User::where('invited_by', $user->id)->get();
            $invited_by = User::find($user->invited_by)->name;
        }

        $data = [
            'user' => $user,
            'children' => $children,
            'invited_by' => $invited_by,
        ];

        return view('admin.tree')->with('data', $data);
    }
}
