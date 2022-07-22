<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use App\Models\UserSetting;
use App\Models\InviteKey;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'min:3', 'max:20', 'unique:users', 'regex:/^(?!^\.)(?!.*[-_.]$)[a-zA-Z0-9-_. ]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users', 'confirmed', 'email:rfc,dns'],
            'dob' => ['required', 'date_format:Y-m-d', 'before:today', 'after:01/01/1970'],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        $this->verifyKey($data['key']);
        $invited_by = $this->getInviter($data['key']);
        $this->updateKeyTable($data['key']);

        UserSetting::create(['user_id' => User::all()->last()->id+1]);
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'dob' => $data['dob'],
            'password' => Hash::make($data['password']),
            'badges' => [3],
            'invited_by' => $invited_by,
        ]);
    }

    protected function verifyKey($key)
    {
        $fetchKey = InviteKey::where('key', $key)->orderBy('id', 'desc')->first();

        if (empty($fetchKey) || !$fetchKey->active) {
            throw ValidationException::withMessages(['key' => 'Incorrect invite key']);
        } else {
            return true;
        }
    }

    protected function getInviter($key)
    {
        $fetchKey = InviteKey::where('key', $key)->orderBy('id', 'desc')->first();

        return $fetchKey->created_by;
    }

    protected function updateKeyTable($key) : void
    {
        if (!User::exists()) {
            $newId = 0;
        } else {
            $newId = User::orderBy('id', 'desc')->first()->id;
        }

        $updateDetails = [
            'user_invited' => ++$newId,
            'active' => false,
        ];

        InviteKey::where('key', $key)->orderBy('id', 'desc')->first()->update($updateDetails);
    }
}
