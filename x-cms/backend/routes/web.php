<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

Route::get('/', function () {
    abort(404);
});

Route::post('auth/login', 'API\AuthController@login');

Route::group(['middleware' => 'auth'], function () {

    Route::group(['prefix' => 'auth'], function () {
        Route::get('/logout', 'API\AuthController@logout');
        Route::get('/nav', 'API\AuthController@navigation');
        Route::get('/profile', 'API\AuthController@profile');
        Route::post('/refresh', 'API\AuthController@refresh');
    });

    Route::group(['prefix' => 'navigations'], function () {
        Route::get('/', 'API\NavigationController@index');
        Route::get('/{id:[a-zA-Z-?0-9]+}', 'API\NavigationController@index');
        Route::post('/create', 'API\NavigationController@create');
        Route::post('/update', 'API\NavigationController@update');
        Route::delete('/delete', 'API\NavigationController@delete');
    });

    Route::group(['prefix' => 'users'], function () {
        Route::get('/', 'API\UserController@index');
        Route::get('/{id:[a-zA-Z-?0-9]+}', 'API\UserController@index');
        Route::post('/create', 'API\UserController@create');
        Route::post('/update', 'API\UserController@update');
        Route::post('/set-status', 'API\UserController@set_status');
        Route::delete('/delete', 'API\UserController@delete');
    });
    Route::group(['prefix' => 'portfolios'], function () {
        Route::get('/', 'API\PortfolioController@index');
        Route::get('/{id:[a-zA-Z-?0-9]+}', 'API\PortfolioController@index');
        Route::post('/create', 'API\PortfolioController@create');
        Route::post('/update', 'API\PortfolioController@update');
        Route::post('/set-status', 'API\PortfolioController@set_status');
        Route::delete('/delete', 'API\PortfolioController@delete');
    });
});
