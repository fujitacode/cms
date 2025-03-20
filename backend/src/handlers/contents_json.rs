use actix_web::{post, web, HttpResponse, Responder, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::sync::Mutex;
use uuid::Uuid;

// コンテンツのリクエスト形式
#[derive(Deserialize)]
pub struct ContentRequest {
    pub title: String,
    pub content: String,
}

// コンテンツのレスポンス形式
#[derive(Serialize)]
pub struct ContentResponse {
    pub id: String,
    pub title: String,
    pub content: String,
    pub created_at: String,
}

// 保存するJSONの形式
#[derive(Serialize, Deserialize)]
pub struct ContentData {
    pub id: String,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub updated_at: String,
}

// データディレクトリパスを管理するための構造体
pub struct ContentStorage {
    pub base_dir: Mutex<String>,
}

impl ContentStorage {
    pub fn new(base_dir: &str) -> Self {
        // ディレクトリが存在しない場合は作成
        if !Path::new(base_dir).exists() {
            fs::create_dir_all(base_dir).expect("ディレクトリの作成に失敗しました");
        }
        
        Self {
            base_dir: Mutex::new(base_dir.to_string()),
        }
    }
}

// コンテンツ作成APIエンドポイント
#[post("/api/contents")]
pub async fn create_content(
    content_req: web::Json<ContentRequest>,
    storage: web::Data<ContentStorage>,
) -> Result<impl Responder> {
    // 現在の日時を取得
    let now = chrono::Utc::now();
    let timestamp = now.to_rfc3339();
    
    // ユニークIDを生成
    let id = Uuid::new_v4().to_string();
    
    // コンテンツデータを作成
    let content_data = ContentData {
        id: id.clone(),
        title: content_req.title.clone(),
        content: content_req.content.clone(),
        created_at: timestamp.clone(),
        updated_at: timestamp.clone(),
    };
    
    // JSONに変換
    let json_data = serde_json::to_string_pretty(&content_data)
        .map_err(|e| {
            eprintln!("JSONシリアライズエラー: {}", e);
            actix_web::error::ErrorInternalServerError("JSONの生成に失敗しました")
        })?;
    
    // ファイルに保存
    let base_dir = storage.base_dir.lock().unwrap();
    let file_path = format!("{}/{}.json", *base_dir, id);
    
    fs::write(&file_path, json_data).map_err(|e| {
        eprintln!("ファイル書き込みエラー: {}", e);
        actix_web::error::ErrorInternalServerError("ファイルの保存に失敗しました")
    })?;
    
    // 成功レスポンスを返す
    let response = ContentResponse {
        id,
        title: content_req.title.clone(),
        content: content_req.content.clone(),
        created_at: timestamp,
    };
    
    Ok(HttpResponse::Created().json(response))
}