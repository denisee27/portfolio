<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('portfolio-images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('portfolio_id');
            $table->foreign('portfolio_id')->references('id')->on('portfolios')->cascadeOnDelete();
            $table->longText('photo');
            $table->timestamps(6);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('portfolio-images');
    }
};
