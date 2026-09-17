from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("ai-models/safetyvision.pt")


CLASS_MAPPING = {
    "NO-Hardhat": "no_helmet",
    "NO-Gloves": "no_gloves",
    "NO-Safety Vest": "no_vest",
    "Hardhat": "helmet",
    "Gloves": "gloves",
    "Safety Vest": "vest",
}


@app.get("/health")
def health():
    return {"status": "AI server is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    results = model(image)

    detections = []

    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            if confidence < 0.5:
                continue

            original_class = result.names[class_id]

            if original_class not in CLASS_MAPPING:
                continue

            detections.append({
                "class": CLASS_MAPPING[original_class],
                "confidence": round(confidence, 2),
            })

    return {
        "detections": detections
    }