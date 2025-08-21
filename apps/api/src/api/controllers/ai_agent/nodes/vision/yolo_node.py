def detect_objects(image):
    from ultralytics import YOLO
    model = YOLO("yolov8n.pt")
    results = model(image)
    return results[0].boxes.xyxy  # bounding boxes
