// KayBiT_CEHinteractive - Rust Native Desktop Window Wrapper
// Creates a native, hardware-accelerated desktop window for Windows, macOS, and Linux
// using Wry/Tao or Tauri webview, bypassing Electron bloat.
//
// Dependencies (Cargo.toml):
//   [dependencies]
//   tao = "0.28"
//   wry = "0.40"
//
// Compile Command:
//   cargo build --release

use std::fs;
use std::path::Path;
use tao::{
    dpi::LogicalSize,
    event::{Event, StartCause, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::WindowBuilder,
};
use wry::WebViewBuilder;

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("KayBiT_CEHinteractive - CEH v13 Study Suite")
        .with_inner_size(LogicalSize::new(1280.0, 840.0))
        .with_min_inner_size(LogicalSize::new(960.0, 600.0))
        .build(&event_loop)
        .unwrap();

    // Check if dist/index.html exists locally
    let dist_index = Path::new("dist/index.html");
    let url = if dist_index.exists() {
        let abs_path = fs::canonicalize(dist_index).unwrap();
        format!("file://{}", abs_path.to_str().unwrap())
    } else {
        // Development fallback URL
        "http://localhost:3000".to_string()
    };

    println!("================================================================");
    println!("  KayBiT_CEHinteractive - Rust Native Window Wrapper");
    println!("  Rendering URL: {}", url);
    println!("================================================================");

    let _webview = WebViewBuilder::new(&window)
        .with_url(&url)
        .with_devtools(cfg!(debug_assertions))
        .build()?;

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            Event::NewEvents(StartCause::Init) => println!("[*] Window initialized."),
            Event::WindowEvent {
                event: WindowEvent::CloseRequested,
                ..
            } => *control_flow = ControlFlow::Exit,
            _ => (),
        }
    });
}
