<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class AuthenticateMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Throwable $e) {
            throw $e;
        }

        if ($user === false) {
            throw new AuthorizationException('Token is invalid');
        }

        if ($request->path() == 'auth/logout') {
            goto response;
        }

        if ($user->status == -1) {
            throw new AccessDeniedHttpException('Your account was blocked');
        }

        if ($user->status == 0) {
            throw new AccessDeniedHttpException('Your account is inactive');
        }

        if ($request->method() == 'GET' && !$request->wantsJson()) {
            return $next($request);
        }

        if (in_array((explode('/', $request->path())[3] ?? null), ['import-example', 'export', 'download', 'download-template', 'download-attachment'])) {
            return $next($request);
        }
        if (in_array((explode('/', $request->path())[2] ?? null), ['download', 'download-attachment'])) {
            return $next($request);
        }

        if (in_array(explode('/', $request->path())[1], ['auth', 'dashboard', 'img-uploads', 'navigation', 'import-example', 'export', 'download', 'notifications'])) {
            goto response;
        }

        if (isset($request->forceView) && $request->method() == 'GET') {
            goto response;
        }

        $currrent_url = explode('/', $request->path());
        $user_menu = $user->role->access;
        $menu = DB::table('navigations')->where(['link' => $currrent_url[1]])->first(['action']);
        if (!$menu) {
            if ($user_menu[0] != '*') {
                throw new AccessDeniedHttpException('Access forbidden');
            } else {
                goto response;
            }
        }

        $menu_action = json_decode($menu->action ?? '[]') ?? [];
        $action = array();
        if ($user_menu[0] == '*') {
            foreach ($menu_action as $a) {
                $action[$a] = true;
            }
            goto response;
        }

        $user_menu = collect($user_menu);
        $access_link = $user_menu->where('link', $currrent_url[2])->first();
        if (!$access_link) {
            throw new AccessDeniedHttpException('Access forbidden');
        }


        $action = (array)$access_link;
        if (in_array($request->method(), ['POST', 'PATCH', 'PUT', 'DELETE'])) {
            $_access = explode('/', $request->path());
            $request_access = $_access[count($_access) - 1];
            $request_access = $request_access == 'set-status' || $request_access == 'approve' || $request_access == 'reject' || $request_access == 'allocate' ? 'update' : $request_access;
            if (!isset($action[$request_access])) {
                throw new AccessDeniedHttpException('Access forbidden');
            }
            if (!$action[$request_access]) {
                throw new AccessDeniedHttpException('Access forbidden');
            }
        }
        response:
        $response = $next($request);
        $response->header('X-Access', base64_encode(json_encode($action ?? null)));
        return $response;
    }
}