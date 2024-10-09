<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        User::truncate();
        $role = Role::first();
        $item = new User();
        $item->nik = 'super-admin';
        $item->role_id = $role->id;
        $item->name = 'Super Administrator';
        $item->email = 'admin@demo.com';
        $item->password =Hash::make('admin123');
        $item->save();
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
    }
}
