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
        Schema::table('portfolios', function (Blueprint $table) {
            $table->string('category',128)->nullable()->after('status');
            $table->string('frontend',128)->nullable()->after('category');
            $table->string('backend',128)->nullable()->after('frontend');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('frontend');
            $table->dropColumn('backend');
        });
    }
};
