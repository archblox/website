<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

// Public pages
Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('index');
Route::get('/privacy', [App\Http\Controllers\PageController::class, 'privacy'])->name('privacy');
Route::get('/tos', [App\Http\Controllers\PageController::class, 'tos'])->name('tos');
Route::get('/user/{id}', [App\Http\Controllers\PageController::class, 'profile'])->name('profile');
Route::get('/user/{id}/friends', [App\Http\Controllers\PageController::class, 'profile_friends'])->name('profile_friends');
Route::get('/users', [App\Http\Controllers\PageController::class, 'users'])->name('users');
Route::post('/users', [App\Http\Controllers\PageController::class, 'users'])->name('users');
Route::get('/download', [App\Http\Controllers\PageController::class, 'download'])->name('download');

// Must be logged in
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'home'])->name('home');

    // Rate limit + auth
    Route::middleware(['throttle:feed_post'])->group(function () {
        Route::post('/home', [App\Http\Controllers\HomeController::class, 'feed_post'])->name('feed_post');
    });

    Route::get('/user/{id}/friends/mutual', [App\Http\Controllers\PageController::class, 'mutual_friends'])->name('mutual_friends');
    Route::get('/my/settings', [App\Http\Controllers\SettingController::class, 'settings'])->name('settings');
    Route::post('/my/settings', [App\Http\Controllers\SettingController::class, 'change_bio'])->name('change_bio');
    Route::post('/my/settings/change', [App\Http\Controllers\SettingController::class, 'change_settings'])->name('change_settings');
    Route::get('/my/invites', [App\Http\Controllers\KeyController::class, 'index'])->name('key_index');
    Route::post('/my/invites', [App\Http\Controllers\KeyController::class, 'create'])->name('key_create');

    // Incomplete Pages Placeholder -- Replace/Remove these when they are added
    Route::get('/incomplete', [App\Http\Controllers\PageController::class, 'incomplete'])->name('incomplete');

    // Friendship system routes
    Route::get('/my/friends', [App\Http\Controllers\FriendController::class, 'friends'])->name('friends');
    Route::get('/my/friends/requests', [App\Http\Controllers\FriendController::class, 'requests'])->name('requests');
    Route::post('/my/friends/requests/{id}', [App\Http\Controllers\FriendController::class, 'handle'])->name('friend_handle');
    Route::post('/friends/add/{id}', [App\Http\Controllers\FriendController::class, 'add'])->name('friend_add');
    Route::post('/friends/remove/{id}', [App\Http\Controllers\FriendController::class, 'remove'])->name('friend_remove');
});

// Admin only
Route::group(['middleware' => 'AdminCheck'], function() {
    Route::get('/iphone/dashboard', [App\Http\Controllers\AdminController::class, 'index'])->name('admin_index');
    Route::get('/iphone/users', [App\Http\Controllers\AdminController::class, 'users'])->name('admin_users');
    Route::get('/iphone/tree', [App\Http\Controllers\AdminController::class, 'tree'])->name('admin_tree');
});

// Client routes
Route::get('/game/studio.ashx', [App\Http\Controllers\ClientController::class, 'studio'])->name('studio');
Route::get('/game/visit.ashx', [App\Http\Controllers\ClientController::class, 'visit'])->name('visit');
Route::get('/game/ChatFilter.ashx', [App\Http\Controllers\ClientController::class, 'chatfilter'])->name('chatfilter');
Route::get('/game/join.ashx', [App\Http\Controllers\ClientController::class, 'join'])->name('join');
Route::get('/IDE/Landing.aspx', [App\Http\Controllers\ClientController::class, 'idelanding'])->name('idelanding');
Route::get('/ide/welcome', [App\Http\Controllers\ClientController::class, 'idelanding'])->name('idewelcome');
Route::get('/IDE/ClientToolbox.aspx', [App\Http\Controllers\ClientController::class, 'toolbox'])->name('toolbox');
Route::get('/UploadMedia/PostImage.aspx', [App\Http\Controllers\ClientController::class, 'postimage'])->name('postimage');
Route::get('/UploadMedia/UploadVideo.aspx', [App\Http\Controllers\ClientController::class, 'uploadvideo'])->name('uploadvideo');
Route::get('/Game/KeepAlivePinger.ashx', [App\Http\Controllers\ClientController::class, 'keepalive'])->name('keepalive');