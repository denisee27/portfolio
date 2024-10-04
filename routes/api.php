<?php

use Illuminate\Http\Request;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\NavigationController;
use App\Http\Controllers\API\PortfolioController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function () {
    return response()->json(['success' => false, 'code' => '404']);
});
Route::post('auth/login', [AuthController::class, 'login']);
Route::group(['middleware' => ['api', 'clear']], function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/logout', [AuthController::class, 'logout']);
        Route::get('/nav', [AuthController::class, 'navigation']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    Route::group(['prefix' => 'navigations'], function () {
        Route::get('/', [NavigationController::class, 'index']);
        Route::get('/{id:[a-zA-Z-?0-9]+}',[NavigationController::class, 'index']);
        Route::post('/create', [NavigationController::class, 'create']);
        Route::post('/update', [NavigationController::class, 'update']);
        Route::delete('/delete', [NavigationController::class, 'delete']);
    });
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id:[a-zA-Z-?0-9]+}', [UserController::class, 'index']);
        Route::post('/create', [UserController::class, 'create']);
        Route::post('/update', [UserController::class, 'update']);
        Route::post('/set-status', [UserController::class, 'set_status']);
        Route::delete('/delete', [UserController::class, 'delete']);
    });
    Route::group(['prefix' => 'portfolios'], function () {
        Route::get('/', [PortfolioController::class, 'index']);
        Route::get('/{id:[a-zA-Z-?0-9]+}', [PortfolioController::class, 'index']);
        Route::post('/create', [PortfolioController::class, 'create']);
        Route::post('/update', [PortfolioController::class, 'update']);
        Route::post('/set-status', [PortfolioController::class, 'set-status']);
        Route::delete('/delete', [PortfolioController::class, 'delete']);
    });
});

