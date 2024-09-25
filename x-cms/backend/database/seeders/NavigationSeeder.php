<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sql = "
		INSERT INTO `navigations` (`id`, `parent_id`, `name`, `icon`, `link`, `action`, `position`, `status`, `created_at`, `updated_at`) VALUES
									   (3, NULL, 'Settings', 'settings', '', 'null', 10, 1, '2024-09-24 16:13:13', '2024-09-24 16:13:13'),
									   (4, 3, 'Users', '', 'users', '[\"create\",\"update\",\"delete\"]', 0, 1, '2024-09-24 16:14:19', '2024-09-24 16:14:19'),
									   (5, NULL, 'Portfolio', 'fact_check', 'portfolios', '[\"create\",\"update\",\"delete\"]', 0, 1, '2024-09-24 22:53:05', '2024-09-24 22:53:05');
		";
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        DB::table('navigations')->truncate();
        DB::unprepared($sql);
    }
}
