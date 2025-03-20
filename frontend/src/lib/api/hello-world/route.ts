/**
 * Hello World APIからデータを取得する関数
 */
interface HelloResponse {
  message: string;
}

// バックエンドAPIからデータを取得
export async function getHelloWorld(): Promise<HelloResponse> {
  try {
    // Next.jsの設定したリライトを使用してプロキシ経由でアクセス
    const response = await fetch('/api/hello', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // サーバーサイドで実行する場合はリクエストURLを絶対パスに変換
      ...(typeof window === 'undefined' && {
        next: { revalidate: 0 },
      }),
    });

    if (!response.ok) {
      throw new Error(`APIリクエストに失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data as HelloResponse;
  } catch (error) {
    console.error('Hello World APIの呼び出し中にエラーが発生しました:', error);
    // エラーが発生した場合はデフォルト値を返す
    return { message: 'APIからのデータ取得に失敗しました' };
  }
}
