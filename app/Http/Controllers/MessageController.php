<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Multicaret\Acquaintances\Traits\Friendable;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function inbox()
    {
        $messages = Message::where('sendto_id', Auth::id())->where('deleted', false)->latest()->paginate(10);

        return view('messages.index')->with('messages', $messages);
    }

    public function inbox_sent()
    {
        $messages = Message::where('user_id', Auth::id())->latest()->paginate(10);

        return view('messages.sent')->with('messages', $messages);
    }

    public function deleted()
    {
        $messages = Message::where('sendto_id', Auth::id())->where('deleted', true)->latest()->paginate(10);

        return view('messages.deleted')->with('messages', $messages);
    }

    public function compose()
    {
        return view('messages.create');
    }

    public function delete_all()
    {
        $messages = Message::where('sendto_id', Auth::id())->where('deleted', false)->get();

        if ($messages->isEmpty()){
            return redirect()->back()->withErrors(['You have no messages!']);
        }

        foreach ($messages as $message) {
            $message->deleted = true;
            $message->save();
        }

        return redirect('/my/messages')->with('success', 'All your messages have been deleted.');
    }

    public function recover_all()
    {
        $messages = Message::where('sendto_id', Auth::id())->where('deleted', true)->get();

        if ($messages->isEmpty()){
            return redirect()->back()->withErrors(['You have no deleted messages!']);
        }

        foreach ($messages as $message) {
            $message->deleted = false;
            $message->save();
        }

        return redirect('/my/messages')->with('success', 'All your messages have been recovered.');
    }

    public function content($id)
    {
        $message = Message::where('id', $id)->first();
        $valid = false;

        if (!$message) {
            abort(404);
        }

        if ($message->sendto_id == Auth::id() || $message->user_id == Auth::id()) {
            $valid = true;
        }

        if ($valid) {
            if (!$message->read && $message->sendto_id == Auth::id()) {
                $message->read = true;
                $message->save();
            }
        }

        if ($valid) {
            return view('messages.content')->with('message', $message);
        } else {
            abort(404);
        }
    }

    public function send_message(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'exists:users'],
            'subject' => ['required', 'string', 'min:3', 'max:50'],
            'message' => ['required', 'string', 'min:3', 'max:10000'],
        ]);

        $userToFind = User::where('name', $request->name)->first();
        $messageable = true;
        $errorMsg = array();

        if (Auth::id() == $userToFind->id) {
            return redirect()->back()->withErrors(['You cannot message yourself!']);
        }
        
        switch ($userToFind->settings->message_preference) {
            case 2:
                $messageable = true;
                break;
            case 1:
                if (!Auth::user()->isFriendWith($userToFind)) {
                    $messageable = false;
                    $errorMsg = ["You must be friends with " . $userToFind->name . " to message them."];
                }
                break;
            default:
                $messageable = false;
                $errorMsg = ["This user has disabled messaging."];
        }

        if (!$messageable) {
            return redirect()->back()->withErrors($errorMsg);
        }

        $msg = new Message;
        $msg->user_id = Auth::id();
        $msg->sendto_id = $userToFind->id;
        $msg->subject = $request->subject;
        $msg->content = $request->message;
        $msg->save();

        return redirect('/my/messages/sent')->with('success', 'Message sent.');
    }

    public function delete_message($id)
    {
        $message = Message::where('id', $id)->first();
        $valid = false;

        if (!$message) {
            abort(404);
        }

        if (Auth::id() == $message->sendto_id) {
            $valid = true;
        }

        if ($valid) {
            $successMsg = "";
            $deletedStatus = false;

            if (!$message->deleted) {
                $deletedStatus = true;
                $successMsg = "Message deleted.";
            } else {
                $deletedStatus = false;
                $successMsg = "Message recovered.";
            }
            $message->deleted = $deletedStatus;
            $message->save();

            return redirect('/my/messages')->with('success', $successMsg);
        } else {
            abort(404);
        }
    }
}
