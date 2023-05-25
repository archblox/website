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
Route::get('/styleguide', [App\Http\Controllers\PageController::class, 'styleguide'])->name('styleguide');
Route::get('/blog', [App\Http\Controllers\PageController::class, 'blog'])->name('blog');
Route::get('/incomplete', [App\Http\Controllers\PageController::class, 'incomplete'])->name('incomplete');
Route::get('/not-approved', [App\Http\Controllers\PageController::class, 'notapproved'])->name('notapproved');
Route::get('/maintenance', [App\Http\Controllers\PageController::class, 'maintenance'])->name('maintenance');
Route::get('/buttonhell', [App\Http\Controllers\PageController::class, 'buttonhell'])->name('buttonhell');
    // games & game page
    Route::get('/games', [App\Http\Controllers\PageController::class, 'games'])->name('games');
    Route::get('/games/1', [App\Http\Controllers\PageController::class, 'gamepage'])->name('gamepage');
    Route::get('/games/2', [App\Http\Controllers\PageController::class, 'thomasgame'])->name('thomasgame');

// Must be logged in
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [App\Http\Controllers\HomeController::class, 'home'])->name('home');

    // catalog
    Route::get('/catalog', [App\Http\Controllers\PageController::class, 'catalog'])->name('catalog');

    // avatar
    Route::get('/my/avatar', [App\Http\Controllers\PageController::class, 'avatar'])->name('avatar');

    // Rate limit + auth
    Route::middleware(['throttle:feed_post'])->group(function () {
        Route::post('/home', [App\Http\Controllers\HomeController::class, 'feed_post'])->name('feed_post'); // Posting to the feed
        Route::post('/my/messages/compose', [App\Http\Controllers\MessageController::class, 'send_message'])->name('send_message'); // Sending a message to a user
    });

    Route::get('/user/{id}/friends/mutual', [App\Http\Controllers\PageController::class, 'mutual_friends'])->name('mutual_friends');
    Route::get('/my/settings', [App\Http\Controllers\SettingController::class, 'settings'])->name('settings');
    Route::post('/my/settings', [App\Http\Controllers\SettingController::class, 'change_bio'])->name('change_bio');
    Route::post('/my/settings/change', [App\Http\Controllers\SettingController::class, 'change_settings'])->name('change_settings');
    Route::post('/my/settings/theme', [App\Http\Controllers\SettingController::class, 'change_theme'])->name('change_theme');
    Route::get('/my/invites', [App\Http\Controllers\KeyController::class, 'index'])->name('key_index');
    Route::post('/my/invites', [App\Http\Controllers\KeyController::class, 'create'])->name('key_create');

    // Account Management routes

    // NO use brokey :(((
    //Route::get('/deleteaccount', [App\Http\Controllers\AccountController::class, 'delete'])->name('delete');
    //Route::post('/deleteaccountrequestbyebye', [App\Http\Controllers\AccountController::class, 'deleteaccount'])->name('deleteaccount');


    // Friendship system routes
    Route::get('/my/friends', [App\Http\Controllers\FriendController::class, 'friends'])->name('friends');
    Route::get('/my/friends/requests', [App\Http\Controllers\FriendController::class, 'requests'])->name('requests');
    Route::post('/my/friends/requests/{id}', [App\Http\Controllers\FriendController::class, 'handle'])->name('friend_handle');
    Route::post('/friends/add/{id}', [App\Http\Controllers\FriendController::class, 'add'])->name('friend_add');
    Route::post('/friends/remove/{id}', [App\Http\Controllers\FriendController::class, 'remove'])->name('friend_remove');

    // Message system routes
    Route::get('/my/messages', [App\Http\Controllers\MessageController::class, 'inbox'])->name('inbox');
    Route::post('/my/messages', [App\Http\Controllers\MessageController::class, 'delete_all'])->name('delete_all');
    Route::get('/my/messages/sent', [App\Http\Controllers\MessageController::class, 'inbox_sent'])->name('inbox_sent');
    Route::get('/my/messages/compose', [App\Http\Controllers\MessageController::class, 'compose'])->name('compose');
    Route::get('/my/messages/deleted', [App\Http\Controllers\MessageController::class, 'deleted'])->name('deleted');
    Route::post('/my/messages/deleted', [App\Http\Controllers\MessageController::class, 'recover_all'])->name('recover_all');
    Route::get('/my/messages/{id}', [App\Http\Controllers\MessageController::class, 'content'])->name('content');
    Route::post('/my/messages/{id}', [App\Http\Controllers\MessageController::class, 'delete_message'])->name('delete_message');
});

// Admin only
Route::group(['middleware' => 'AdminCheck'], function() {
    Route::get('/admin/dashboard', [App\Http\Controllers\AdminController::class, 'index'])->name('admin_index');
    Route::get('/admin/users', [App\Http\Controllers\AdminController::class, 'users'])->name('admin_users');
    Route::get('/admin/tree', [App\Http\Controllers\AdminController::class, 'tree'])->name('admin_tree');
});

// Client routes
Route::get('/game/studio.ashx', [App\Http\Controllers\ClientController::class, 'studio'])->name('studio');
Route::get('/game/visit.ashx', [App\Http\Controllers\ClientController::class, 'visit'])->name('visit');
Route::get('/game/ChatFilter.ashx', [App\Http\Controllers\ClientController::class, 'chatfilter'])->name('chatfilter');
Route::get('/game/join.ashx', [App\Http\Controllers\ClientController::class, 'join'])->name('join');
Route::get('/IDE/Landing.aspx', [App\Http\Controllers\ClientController::class, 'idelanding'])->name('idelanding');
Route::get('/ide/welcome', [App\Http\Controllers\ClientController::class, 'idelanding'])->name('idewelcome');
Route::get('/ide/login', [App\Http\Controllers\ClientController::class, 'login_iframe'])->name('login_iframe');
Route::get('/IDE/Upload.aspx', [App\Http\Controllers\ClientController::class, 'ideupload'])->name('ideupload');
Route::get('/IDE/ClientToolbox.aspx', [App\Http\Controllers\ClientController::class, 'toolbox'])->name('toolbox');
Route::get('/UploadMedia/PostImage.aspx', [App\Http\Controllers\ClientController::class, 'postimage'])->name('postimage');
Route::get('/UploadMedia/UploadVideo.aspx', [App\Http\Controllers\ClientController::class, 'uploadvideo'])->name('uploadvideo');
Route::get('/Game/KeepAlivePinger.ashx', [App\Http\Controllers\ClientController::class, 'keepalive'])->name('keepalive');
Route::get('/Game/Tools/InsertAsset.ashx', [App\Http\Controllers\ClientController::class, 'insertasset'])->name('insertasset');
Route::get('/UI/Save.aspx', [App\Http\Controllers\ClientController::class, 'modelupload'])->name('modelupload');
Route::get('/Game/Tools/ThumbnailAsset.ashx', [App\Http\Controllers\ClientController::class, 'stampertools'])->name('stampertools');
Route::get('/Game/edit.ashx', [App\Http\Controllers\ClientController::class, 'edit'])->name('edit');
Route::get('/Asset/BodyColors.ashx', [App\Http\Controllers\ClientController::class, 'bodycolors'])->name('bodycolors');
Route::get('/Asset/CharacterFetch.ashx', [App\Http\Controllers\ClientController::class, 'characterfetch'])->name('characterfetch');
Route::get('/asset', [App\Http\Controllers\ClientController::class, 'assetIndex'])->name('assetIndex');