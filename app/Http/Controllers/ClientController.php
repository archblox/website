<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Storage;

class ClientController extends Controller
{
    public function studio()
    {
        $content = Storage::disk('client')->get('studio.ashx');

        return $content;
    }

    public function ide()
    {
        return view('pages.idelanding');
    }

    public function visit()
    {
        return view('client.visit');
    }

    public function join()
    {
        return view('client.join');
    }

    public function toolbox()
    {
        return view('client.toolbox');
    }
}
