<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Multicaret\Acquaintances\Traits\Friendable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, Friendable;

    protected $table = 'users';
    public $primaryKey = 'id';
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'dob',
        'password',
        'badges',
        'invited_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'badges' => 'array'
    ];

    public static function isAdmin()
    {
        if (Auth::guest() || !Auth::user()->admin) {
            return false;
        } else {
            return true;
        }
    }

    public function feedposts()
    {
        return $this->hasMany('App\Models\FeedPost');
    }

    public function messages()
    {
        return $this->hasMany('App\Models\Message');
    }

    public function settings()
    {
        return $this->hasOne('App\Models\UserSetting');
    }
}
