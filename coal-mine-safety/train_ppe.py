from ultralytics import YOLO

model = YOLO("runs/detect/train/weights/best.pt")

model.train(
    data="construction-ppe.yaml",
    epochs=20,
    imgsz=640
)