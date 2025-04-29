// 基础请求封装
export async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok || result.code !== 0) {
      throw new Error(result.message || '请求失败');
    }
    return result.data;
  } catch (err) {
    throw err;
  }
}
