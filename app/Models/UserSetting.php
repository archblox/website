<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    protected $table = 'user_settings';
    public $primaryKey = 'id';
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'old_name',
        'changed_name',
        'date_preference',
        'time_preference_24hr',
        'theme',
        'message_preference',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
