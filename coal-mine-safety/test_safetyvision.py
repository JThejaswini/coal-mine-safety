from ultralytics import YOLO
import cv2

model = YOLO("ai-models/safetyvision.pt")

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Could not open camera")
    exit()

print("Camera started. Press Q to quit.")

while True:
    ret, frame = cap.read()

    if not ret:
        print("Failed to read camera")
        break

    results = model(frame)

    annotated_frame = results[0].plot()

    cv2.imshow(
        "SafetyVision Test",
        annotated_frame
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()