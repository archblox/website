<?php

namespace App\Http\Middleware;

use Closure;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;

class UserLastActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $expireTime = Carbon::now()->addMinute(2); // keep online for 2 min
            Cache::put('is_online_' . Auth::user()->id, true, $expireTime);

            /*Last Seen
            User::where('id', Auth::user()->id)->update(['last_seen' => Carbon::now()]);*/
        }
        return $next($request);
    }
}
