/* FlareDrive 网盘：给跨域名上传/读图加 CORS 头
   放到仓库的 functions/_middleware.ts（与 api、raw 目录同级），推送后 Pages 自动重新部署 */

export const onRequest: PagesFunction = async (context) => {
  const req = context.request;

  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Authorization,Content-Type,fd-thumbnail,x-amz-copy-source",
    "Access-Control-Expose-Headers": "etag",
    "Access-Control-Max-Age": "86400",
  };

  // 预检请求直接放行，不进后面的业务逻辑
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  const res = await context.next();
  const h = new Headers(res.headers);
  for (const k of Object.keys(cors)) h.set(k, cors[k]);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
};
