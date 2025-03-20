// コンテンツ作成画面
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateContentPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/contents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error(`APIエラー: ${response.status}`);
            }

            const data = await response.json();
            console.log("コンテンツが作成されました:", data);

            // 成功時の処理（例: 一覧ページにリダイレクトなど）
            alert("コンテンツが正常に作成されました！");
            // router.push("/cms/contents"); // 一覧ページができたらコメント解除

            // フォームをリセット
            setTitle("");
            setContent("");
        } catch (err: any) {
            console.error("コンテンツ作成エラー:", err);
            setError(err.message || "コンテンツの作成中にエラーが発生しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">コンテンツ作成</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            タイトル
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="タイトルを入力してください"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            内容
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="コンテンツの内容を入力してください"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:bg-blue-400"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "作成中..." : "作成する"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
