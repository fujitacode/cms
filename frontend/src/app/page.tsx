import Image from "next/image";
import { getHelloWorld } from "../lib/api/hello-world/route";

export default async function Home() {
  // サーバーコンポーネントでAPIデータを取得
  const helloData = await getHelloWorld();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center">CMSプロジェクト</h1>
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">バックエンドAPIからのレスポンス:</h2>
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="text-lg">{helloData.message}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
