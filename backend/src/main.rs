use actix_cors::Cors;
use actix_web::{App, HttpServer, http, web};
use std::path::PathBuf;

// ハンドラーモジュールをインポート
mod handlers;
use handlers::contents_json::{ContentStorage, create_content};
use handlers::hello::hello_world;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://localhost:8080");

    // コンテンツ保存ディレクトリの設定
    let contents_dir = PathBuf::from("./data/contents");
    if !contents_dir.exists() {
        std::fs::create_dir_all(&contents_dir)?;
    }

    // ContentStorageの初期化
    let content_storage = web::Data::new(ContentStorage::new(contents_dir.to_str().unwrap()));

    HttpServer::new(move || {
        // CORSの設定
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .app_data(content_storage.clone()) // ContentStorageをアプリケーションデータとして共有
            .service(hello_world)
            .service(create_content) // コンテンツ作成エンドポイントを登録
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
