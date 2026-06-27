# Live Object Detector

Real-time object detection in the browser — point your phone (or webcam) at the
world and get live bounding boxes + labels. The model runs **entirely on your
device**; no image ever leaves the browser.

- **Model:** COCO-SSD (lite MobileNet v2) — 80 everyday object classes
- **Runtime:** TensorFlow.js (WebGL), loaded from CDN
- **Stack:** a single static `index.html`, no build step, no backend

## Use it

Open the GitHub Pages URL on a phone or laptop, tap **Activer la caméra**, allow
camera access. Use the **↺ Caméra** button to switch front/back camera.

Camera access requires HTTPS — that's why it's served via GitHub Pages (or
`localhost` for local dev).

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```
