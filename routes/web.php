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

// Must be logged in
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'home'])->name('home');
    Route::get('/users', [App\Http\Controllers\PageController::class, 'users'])->name('users');
    Route::post('/users', [App\Http\Controllers\PageController::class, 'users'])->name('users');
    Route::get('/my/settings', [App\Http\Controllers\PageController::class, 'settings'])->name('settings');
    Route::get('/my/invites', [App\Http\Controllers\KeyController::class, 'index'])->name('key_index');
    Route::post('/my/invites', [App\Http\Controllers\KeyController::class, 'create'])->name('key_create');
    Route::post('/download', [App\Http\Controllers\PageController::class, 'download'])->name('download');

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
    Route::get('/iphone/keys', [App\Http\Controllers\AdminController::class, 'keys'])->name('admin_keys');
});