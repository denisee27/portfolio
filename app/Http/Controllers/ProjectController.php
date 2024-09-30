<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index($id){
        $portfolio = Portfolio::where('id',$id)->first();
        $data = [
            'data' => $portfolio
        ];
        return view('project-detail',$data);
    }
}
