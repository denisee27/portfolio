<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HomeController extends Controller
{
    public function index(){
        $portfolio = Portfolio::with(['images'])->get();
        $allPort = PortfolioImage::inRandomOrder()->get()->take(10);
        $data = [
            'portfolios' => $portfolio,
            'allports' => $allPort,
        ];
        return view('welcome',$data);
    }

    public function email(){
        return response('OK', 200);

    }

}
