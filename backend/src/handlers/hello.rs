use actix_web::{HttpResponse, Responder, get};
use serde::Serialize;

#[derive(Serialize)]
pub struct HelloResponse {
    pub message: String,
}

#[get("/api/hello")]
pub async fn hello_world() -> impl Responder {
    let response = HelloResponse {
        message: String::from("Hello, World!"),
    };

    HttpResponse::Ok().json(response)
}
