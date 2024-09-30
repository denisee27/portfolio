<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioImage extends BaseModel
{
    /**
     * notifications
     *
     * @return void
     */
    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }
}
