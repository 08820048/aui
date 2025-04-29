import { request } from './http';

// 网页美化接口
export function beautifyHtml({ html_code, style }) {
  return request('http://127.0.0.1:3000/beautify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html_code, style }),
  });
}

// 流式网页美化接口（SSE via fetch ReadableStream）
export async function beautifyHtmlStream({ html_code, style }, { onContent, onDone, onError, signal }) {
  const response = await fetch('http://127.0.0.1:3000/api/beautify/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html_code, style }),
    signal, // 传入中止信号
  });

  if (!response.ok || !response.body) {
    onError && onError('网络错误');
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let done = false;

  // 监听中止信号
  if (signal) {
    signal.addEventListener('abort', () => {
      reader.cancel();
      done = true;
    });
  }

  try {
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });
      // 按行分割 SSE，每行为 data: {...}
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        try {
          const event = JSON.parse(line.replace('data:', '').trim());
          if (event.error) {
            onError && onError(event.error);
            done = true;
            break;
          }
          if (event.content) {
            onContent && onContent(event.content);
          }
          if (event.done) {
            onDone && onDone();
            done = true;
            break;
          }
        } catch (e) {
          // 忽略解析失败
        }
      }
    }
  } catch (error) {
    // 如果是用户主动取消，则抛出中止错误
    if (signal && signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    // 其他错误则正常处理
    onError && onError(error.message || '请求失败');
  }
}
