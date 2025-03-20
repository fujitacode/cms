/**
 * Hello World APIからデータを取得する関数
 */
interface HelloResponse {
	message: string;
}

// バックエンドAPIからデータを取得
export async function getHelloWorld(): Promise<HelloResponse> {
	try {
		// 実行環境に応じてAPIのURLを設定
		const apiUrl = typeof window === "undefined"
			? "http://localhost:8080/api/hello" // サーバーサイドでの実行時
			: "/api/hello"; // クライアントサイドでの実行時

		console.log(`APIリクエスト先: ${apiUrl}`);
		
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store", // キャッシュを無効化
		});

		if (!response.ok) {
			throw new Error(`APIリクエストに失敗しました: ${response.status}`);
		}

		const data = await response.json();
		console.log("API応答データ:", data);
		return data as HelloResponse;
	} catch (error) {
		console.error("Hello World APIの呼び出し中にエラーが発生しました:", error);
		// エラーが発生した場合はデフォルト値を返す
		return { message: "APIからのデータ取得に失敗しました" };
	}
}
