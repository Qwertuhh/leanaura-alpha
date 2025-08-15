from ultralytics import YOLO

# Initialize YOLO model
yolo = YOLO("yolov8n.pt")

def process_yolo(state: dict) -> dict:
    """
    Process an image using YOLOv8 for object detection.
    
    Args:
        state: Dictionary containing the current state with 'image_path'
        
    Returns:
        Updated state with 'detections' and 'draw_cmds' added
    """
    img_path = state["image_path"]
    res = yolo(img_path)[0]
    boxes = res.boxes.xyxy.tolist()
    state["detections"] = boxes

    # Initialize draw commands if not exists
    state.setdefault("draw_cmds", [])
    
    # Add detection boxes to draw commands
    for x1, y1, x2, y2 in boxes:
        state["draw_cmds"].append({
            "type": "rectangle",
            "x": x1, 
            "y": y1,
            "width": x2 - x1, 
            "height": y2 - y1,
            "style": {"stroke": "#00FF00", "strokeWidth": 2}
        })
    
    return state
