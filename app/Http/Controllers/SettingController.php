<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\UserSetting;

class SettingController extends Controller
{
    public function settings()
    {
        return view('misc.settings');
    }

    public function change_settings(Request $request)
    {
        $option = $request->activeSetting;
        $changeMsg = null;
        $user = Auth::user();
        $userSetting = Auth::user()->settings;

        switch ($option) {
            case 1:
                $request->validate([
                    'name' => ['required', 'string', 'min:3', 'max:20', 'unique:users', 'regex:/^(?!^\.)(?!.*[-_.]$)[a-zA-Z0-9-_. ]+$/'],
                    'username_change_confirm' => 'accepted'
                ]);

                if (Auth::user()->settings->changed_name) {
                    return redirect()->back()->withErrors(['You have already changed your username!']);
                }

                $oldUsername = $user->name;

                $user->name = $request->name;
                $user->save();

                $userSetting->old_name = $oldUsername;
                $userSetting->changed_name = true;
                $userSetting->save();

                $changeMsg = "Your username has been changed.";
                break;
            case 2:
                $request->validate([
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:users', 'confirmed', 'email:rfc,dns'],
                ]);

                $user->email = $request->email;
                $user->save();

                $changeMsg = "Your email has been changed.";
                break;
            case 3:
                $request->validate([
                    'dob' => ['required', 'date_format:Y-m-d', 'before:today', 'after:01/01/1970'],
                ]);

                $user->dob = $request->dob;
                $user->save();

                $changeMsg = "Your date of birth has been changed.";
                break;
            case 4:
                $request->validate([
                    'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/'],
                ]);

                if (!Hash::check($request->old_password, Auth::user()->password)) {
                    return redirect()->back()->withErrors(['Your old password is incorrect!']);
                }

                $user->password = Hash::make($request->password);
                $user->save();

                $changeMsg = "Your password has been changed.";
                break;
            case 5:
                $request->validate([
                    'date_preference' => ['required', 'string', 'in:d/m/Y,m/d/Y,Y/d/m'],
                ]);

                $userSetting->date_preference = $request->date_preference;
                $userSetting->save();

                $changeMsg = "Your date display preference has been changed.";
                break;
            case 6:
                $request->validate([
                    'time_preference' => ['required', 'string', 'in:0,1'],
                ]);

                $userSetting->time_preference_24hr = $request->time_preference;
                $userSetting->save();

                $changeMsg = "Your time display preference has been changed.";
                break;
            case 7:
                $request->validate([
                    'message_preference' => ['required', 'string', 'in:2,1,0'],
                ]);

                $userSetting->message_preference = $request->message_preference;
                $userSetting->save();

                $changeMsg = "Your message privacy preference has been changed.";
                break;
            default:
                abort(404);
        }

        return redirect()->back()->with('change', $changeMsg);
    }

    public function change_bio(Request $request)
    {
        $request->validateWithBag('bio_form', [
            'bio' => ['required', 'min:3', 'max:2000'],
        ]);

        $user = Auth::user();
        $user->blurb = $request->bio;
        $user->save();

        return redirect()->back()->with('success', 'Your bio has been updated.');
    }

    public function change_theme(Request $request)
    {
        $request->validateWithBag('theme', [
            'theme_change' => ['required', 'string', 'in:1,2,3,4,5,6'],
        ]);

        $userSetting = Auth::user()->settings;
        $userSetting->theme = $request->theme_change;
        $userSetting->save();

        return redirect()->back()->with('theme', 'Your theme has been updated.');
    }
}
