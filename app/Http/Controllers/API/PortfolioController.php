<?php

namespace App\Http\Controllers\API;

use App\Helpers\UploadFileHelper;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Portfolio;
use App\Models\PortfolioImage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PortfolioController extends Controller
{
    /**
     * index
     *
     * @param  mixed $request
     * @param  mixed $id
     * @return void
     */
    public function index(Request $request, $id = null)
    {
        $data = [];
        $items = Portfolio::query();
        $items->orderBy('order', 'asc');
        $items->with(['images']);
        // return response()->json(File::exists(public_path("uploads/9d344e35-230c-4cc8-bc5d-f34e3706aa11")));
        if (isset($request->filter) && $request->filter) {
            $filter = json_decode($request->filter, true);
            $items->where($filter);
        }

        if ($id == null) {
            if (isset($request->q) && $request->q) {
                $q = $request->q;
                $items->where(function ($query) use ($q) {
                    $query->where('name', 'like', '%' . $q . '%');
                });
            }
            if (isset($request->limit) && ((int) $request->limit) > 0) {
                $data = $items->paginate(((int) $request->limit))->toArray();
            } else {
                $data['data'] = $items->get();
                $data['total'] = count($data['data']);
            }
        } else {
            $data['data'] = $items->where('id', $id)->first();
            $data['total'] = 1;
        }
        $r = ['status' => Response::HTTP_OK, 'result' => $data];
        return response()->json($r, Response::HTTP_OK);
    }

    /**
     * create
     *
     * @param  mixed $request
     * @return void
     */
    public function create(Request $request)
    {
        $data = json_decode($request->data, true);
        $data['photos'] = $request->file('photos');
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'section' => 'required|string',
            'category' => 'required|string',
            'frontend' => 'required|string',
            'backend' => 'required|string',
            'status' => 'required|numeric:in:0,1',
            'order' => 'required|numeric',
            'description' => 'required|string',
            "photos" => "required|array",
            'photos.*' => 'required|file|mimes:jpg,jpeg,png|max:3120',
        ],[
            'photos.required' => 'Please Input Image!'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'wrong' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $data = (object) $validator->validated();
        DB::beginTransaction();
        try {
            $item = new Portfolio();
            $item->name = $data->name;
            $item->section = $data->section;
            $item->status = $data->status;
            $item->category = $data->category;
            $item->frontend = $data->frontend;
            $item->backend = $data->backend;
            $item->order = $data->order;
            $item->description = $data->description;
            $item->save();

            foreach($data->photos as $_p){
                $photo = (object)$_p;
                $uploadPhoto = (new UploadFileHelper())->save($photo);
                $image = new PortfolioImage();
                $image->portfolio_id = $item->id;
                $image->photo = $uploadPhoto;
                $image->save();
            }
        DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
        return $this->index($request);
    }

    /**
     * update
     *
     * @param  mixed $request
     * @return void
     */
    public function update(Request $request)
    {
        $data = json_decode($request->data, true);
        $data['photos'] = $request->file('photos');
        $validator = Validator::make($data, [
            'id' => ['required', 'string', Rule::exists(Portfolio::class, 'id')],
            'name' => 'required|string',
            'category' => 'required|string',
            'frontend' => 'required|string',
            'backend' => 'required|string',
            'section' => 'required|string',
            'status' => 'required|numeric:in:0,1',
            'order' => 'required|numeric',
            'description' => 'required|string',
            'deleteImage.*.id' => ["required","string",Rule::exists(PortfolioImage::class, "id")],
            'photos.*' => 'required|file|mimes:jpg,jpeg,png|max:3120',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'wrong' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = (object) $validator->validated();
        DB::beginTransaction();
        try {
            $item = Portfolio::where('id', $data->id)->first();
            $item->name = $data->name;
            $item->section = $data->section;
            $item->status = $data->status;
            $item->order = $data->order;
            $item->category = $data->category;
            $item->frontend = $data->frontend;
            $item->backend = $data->backend;
            $item->description = $data->description;
            $item->save();

            foreach($data->deleteImage ?? [] as $_delImg){
                $delImg = (object) $_delImg;
                $img = PortfolioImage::where('id',$delImg->id)->first();
                if (File::exists(public_path("uploads/" . $img->photo))) {
                    File::delete(public_path("uploads/" . $img->photo));
                }
                $img->delete();
            }

            foreach($data->photos ?? [] as $_p){
                $photo = (object)$_p;
                $uploadPhoto = (new UploadFileHelper())->save($photo);
                $image = new PortfolioImage();
                $image->portfolio_id = $data->id;
                $image->photo = $uploadPhoto;
                $image->save();
            }
        DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
        return $this->index($request);
    }

    /**
     * set_status
     *
     * @param  mixed $request
     * @return void
     */
    public function set_status(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => ['required', 'string', Rule::exists(Portfolio::class, 'id')],
            'status' => 'required|numeric:in:0,1'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => Response::HTTP_UNPROCESSABLE_ENTITY,
                'wrong' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = (object) $validator->validated();
        $item = Portfolio::where('id', $data->id)->first();
        $item->status = $data->status;
        $item->save();
        $r = ['status' => Response::HTTP_OK, 'result' => 'ok'];
        return response()->json($r, Response::HTTP_OK);
    }

    /**
     * delete
     *
     * @param  mixed $request
     * @return void
     */
    public function delete(Request $request)
    {
        $ids = json_decode($request->getContent());
        $data  = Portfolio::whereIn('id', $ids)->first();
        foreach($data->images as $img){
            if (File::exists(public_path("uploads/" . $img->photo))) {
                File::delete(public_path("uploads/" . $img->photo));
            }
        }
        $data->delete();
        return $this->index($request);
    }
}