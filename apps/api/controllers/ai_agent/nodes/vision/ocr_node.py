import pytesseract
from PIL import Image
from typing import Dict, Any

def process_ocr(state: dict) -> dict:
    """
    Perform OCR on the input image to extract text.
    
    Args:
        state: Dictionary containing 'image_path'
        
    Returns:
        Updated state with 'ocr_text' and updated 'draw_cmds' for visualization
    """
    try:
        # Open and process image with Tesseract
        img = Image.open(state["image_path"])
        text = pytesseract.image_to_string(img).strip()
        
        # Update state with OCR results
        state["ocr_text"] = text
        
        # Add text visualization to draw commands
        state.setdefault("draw_cmds", [])
        state["draw_cmds"].append({
            "type": "text",
            "x": 10,
            "y": 20,
            "text": text[:100] + ("..." if len(text) > 100 else ""),  # Limit text length
            "style": {"fontSize": 16, "fill": "#FFFF00"}
        })
        
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        state["ocr_error"] = str(e)
    
    return state
