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
}
