from PIL import Image
from transformers import LlavaProcessor, LlavaForConditionalGeneration
from typing import Dict, Any
import torch

# Initialize LLaVA model and processor
processor = None
llava = None

def initialize_llava():
    """Initialize the LLaVA model and processor."""
    global processor, llava
    if processor is None or llava is None:
        print("Loading LLaVA model...")
        processor = LlavaProcessor.from_pretrained("llava-hf/llava-1.5-7b-hf")
        llava = LlavaForConditionalGeneration.from_pretrained(
            "llava-hf/llava-1.5-7b-hf",
            torch_dtype=torch.float16,
            low_cpu_mem_usage=True
        )
        if torch.cuda.is_available():
            llava = llava.to("cuda")
        print("LLaVA model loaded.")

def process_llava(state: dict, prompt: str = "Describe this image in detail") -> dict:
    """
    Generate a description of the image using LLaVA.
    
    Args:
        state: Dictionary containing 'image_path'
        prompt: The prompt to use for the LLaVA model
        
    Returns:
        Updated state with 'llava_caption' and updated 'draw_cmds' for visualization
    """
    try:
        # Lazy load the model
        initialize_llava()
        
        # Open and process image
        img = Image.open(state["image_path"])
        
        # Prepare inputs
        inputs = processor(
            text=prompt,
            images=img,
            return_tensors="pt"
        )
        
        # Move to GPU if available
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
        
        # Generate caption
        with torch.inference_mode():
            output = llava.generate(
                **inputs,
                max_new_tokens=100,
                do_sample=True,
                temperature=0.7,
                top_p=0.9
            )
        
        # Decode and clean up the output
        caption = processor.decode(output[0], skip_special_tokens=True)
        caption = caption.replace(prompt, "").strip()
        
        # Update state with LLaVA caption
        state["llava_caption"] = caption
        
        # Add caption visualization to draw commands
        state.setdefault("draw_cmds", [])
        state["draw_cmds"].append({
            "type": "text",
            "x": 10,
            "y": 440,
            "text": caption[:150] + ("..." if len(caption) > 150 else ""),  # Limit text length
            "style": {"fontSize": 18, "fill": "#FFFFFF"}
        })
        
    except Exception as e:
        print(f"Error in LLaVA processing: {str(e)}")
        state["llava_error"] = str(e)
    
    return state
