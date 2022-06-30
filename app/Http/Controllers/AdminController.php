<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function users(Request $request)
    {
        if ($request->searchBy == 'name' && $request->has('q')) {
            $users = DB::table('users')->where('name', 'LIKE', '%'.$request->q.'%')->paginate(10);
        } else if ($request->searchBy == 'id' && $request->has('q')) {
            $users = DB::table('users')->where('id', $request->q)->paginate(10);
        } else {
            $users = User::paginate(10);
        }

        return view('admin.users')->with('users', $users);
    }

    public function keys()
    {
        return view('admin.keys');
    }
}
