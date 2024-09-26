<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends BaseModel
{
    /**
     * notifications
     *
     * @return void
     */
    public function images()
    {
        return $this->hasMany(PortfolioImage::class);
    }
}
