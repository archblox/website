<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Webpatser\Uuid\Uuid;
use App\Models\InviteKey;
use App\Models\User;

class KeyController extends Controller
{
    public function index()
    {
        $fetchKeys = InviteKey::where('created_by', Auth::id())->latest()->get();
        $activeKey = InviteKey::where('created_by', Auth::id())->latest()->first();

        if (!$fetchKeys->isEmpty()) {
            if ($activeKey->created_at->addWeek()->gt(Carbon::now())) {
                $canCreate = false;
            } else {
                $canCreate = true;
            }
        } else {
            $canCreate = true;
        }

        $data = [
            'canCreate' => $canCreate,
            'fetchKeys' => $fetchKeys,
        ];

        return view('invite.index')->with('data', $data);
    }

    public function create()
    {
        $fetchKeys = InviteKey::where('created_by', Auth::id())->latest()->get();
        $activeKey = InviteKey::where('created_by', Auth::id())->latest()->first();

        // Validation
        if (!$fetchKeys->isEmpty() && $activeKey->created_at->addWeek()->gt(Carbon::now())) {
            if (!User::isAdmin())
                abort(404);
        }

        $key = new InviteKey;
        $key->key = Uuid::generate()->string;
        $key->created_by = Auth::id();
        $key->user_invited = 0;
        $key->save();

        return redirect()->route('key_index');
    }
}
