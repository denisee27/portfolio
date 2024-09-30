<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(){
        $portfolio = Portfolio::with(['images'])->get();
        $allPort = PortfolioImage::inRandomOrder()->get();
        $data = [
            'portfolios' => $portfolio,
            'allports' => $allPort,
        ];
        return view('welcome',$data);
    }
}
