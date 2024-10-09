<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(){
        return response()->json(["status"=>true]);
    }
}
