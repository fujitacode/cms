import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:8080/api/:path*",
			},
		];
	},
	// サーバーサイドレンダリング実行時のExperimental設定
	experimental: {
		// サーバコンポーネントからの外部APIリクエストを許可
		serverActions: {
			allowedOrigins: ["localhost:3000", "localhost:8080"],
		},
	},
};

export default nextConfig;
