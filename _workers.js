export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 游戏分类页面规则
    const categoryMatch = path.match(/^\/games\/category\/([^\/]+)\.html$/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      return Response.redirect(`${url.origin}/index.html?category=${category}`, 302);
    }
    
    // 游戏详情页面规则
    const gameMatch = path.match(/^\/games\/([^\/]+)\/([^\/]+)\.html$/);
    if (gameMatch) {
      const category = gameMatch[1];
      const game = gameMatch[2];
      return Response.redirect(`${url.origin}/game.html?id=${game}&category=${category}`, 302);
    }
    
    // 如果是静态资源，直接返回
    if (path.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|webp|json)$/)) {
      return fetch(request);
    }
    
    // 处理实际存在的文件
    try {
      const response = await fetch(request);
      if (response.ok) {
        return response;
      }
    } catch (e) {
      // 忽略错误，继续处理
    }
    
    // 对于404错误，返回index.html
    return fetch(`${url.origin}/index.html`);
  }
} 