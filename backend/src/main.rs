use actix_web::{App, HttpResponse, HttpServer, Responder, get};
use serde::Serialize;

#[derive(Serialize)]
struct HelloResponse {
    message: String,
}

#[get("/api/hello")]
async fn hello_world() -> impl Responder {
    let response = HelloResponse {
        message: String::from("Hello, World!"),
    };

    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://localhost:8080");

    HttpServer::new(|| App::new().service(hello_world))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
