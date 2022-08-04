<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Storage;

class ClientController extends Controller
{
    /*
    public function studio()
    {
        $content = Storage::disk('client')->get('studio.ashx');

        return $content;
    }*/

    public function studio()
    {
        return view('client.studio');
    }

    public function idelanding()
    {
        return view('client.idelanding');
    }

    public function visit()
    {
        return view('client.visit');
    }

    public function join()
    {
        return view('client.join');
    }

    public function chatfilter()
    {
        return view('client.chatfilter');
    }

    public function toolbox()
    {
        return view('client.toolbox');
    }

    public function postimage()
    {
        return view('client.postimage');
    }

    public function uploadvideo()
    {
        return view('client.uploadvideo');
    }

    public function keepalive()
    {
        return view('client.keepalive');
    }
    
    public function ideupload()
    {
        return view('client.ideupload');
    }
}
