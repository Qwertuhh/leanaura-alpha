import cv2
import numpy as np
from typing import List, Dict, Any
from segment_anything import sam_model_registry, SamPredictor

# Initialize SAM model and predictor
sam = sam_model_registry["vit_b"](checkpoint="sam_vit_b.pth")
predictor = SamPredictor(sam)

def process_sam(state: dict) -> dict:
    """
    Process an image using SAM for segmentation based on detections.

    Args:
        state: Dictionary containing 'image_path' and 'detections'

    Returns:
        Updated state with 'masks' and updated 'draw_cmds' for visualization
    """
    # Read image and set up predictor
    img = cv2.imread(state["image_path"])
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    predictor.set_image(img)

    # Initialize masks list if not exists
    state["masks"] = []

    # Process each detection box
    for box in state.get("detections", [])[:1]:  # Just use first detection for now
        masks, scores, _ = predictor.predict(
            box=box,
            multimask_output=True
        )

        if len(masks) > 0:
            # Get the best mask
            best_mask = masks[np.argmax(scores)]
            state["masks"].append(best_mask)

            # Add mask visualization to draw commands
            state.setdefault("draw_cmds", [])
            ys, xs = np.where(best_mask)
            for x, y in zip(xs, ys):
                state["draw_cmds"].append({
                    "type": "rectangle",
                    "x": int(x),
                    "y": int(y),
                    "width": 1,
                    "height": 1,
                    "style": {"fill": "rgba(255,0,0,0.3)"}
                })

    return state
