use actix_cors::Cors;
use actix_web::{App, HttpServer, http};

// ハンドラーモジュールをインポート
mod handlers;
use handlers::hello::hello_world;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://localhost:8080");

    HttpServer::new(|| {
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

        App::new().wrap(cors).service(hello_world)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
