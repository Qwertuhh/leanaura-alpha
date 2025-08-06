from typing import Dict, Any, Optional
from langgraph.graph import StateGraph
from controllers.ai_agent.nodes.vision import yolo_node, sam_node, ocr_node, llava_node

class VisionPipeline:
    """
    A pipeline for processing images using various computer vision models.
    
    This pipeline chains together multiple vision processing nodes:
    1. YOLO for object detection
    2. SAM for image segmentation
    3. OCR for text extraction
    4. LLaVA for image understanding
    """
    
    def __init__(self):
        """Initialize the vision pipeline with all processing nodes."""
        # Create the graph
        self.workflow = StateGraph(dict)
        
        # Add nodes to the graph
        self.workflow.add_node("yolo", yolo_node)
        self.workflow.add_node("sam", sam_node)
        self.workflow.add_node("ocr", ocr_node)
        self.workflow.add_node("llava", llava_node)
        
        # Define the graph edges
        self.workflow.add_edge("yolo", "sam")
        self.workflow.add_edge("sam", "ocr")
        self.workflow.add_edge("ocr", "llava")
        
        # Set the entry point
        self.workflow.set_entry_point("yolo")
        
        # Compile the graph
        self.app = self.workflow.compile()
    
    async def process_image(self, image_path: str) -> Dict[str, Any]:
        """
        Process an image through the vision pipeline.
        
        Args:
            image_path: Path to the image file to process
            
        Returns:
            Dictionary containing the processing results
        """
        # Initialize state with the image path
        state = {
            "image_path": image_path,
            "draw_cmds": []
        }
        
        try:
            # Run the pipeline
            result = await self.app.ainvoke(state)
            return {
                "success": True,
                "detections": result.get("detections", []),
                "masks": result.get("masks", []),
                "ocr_text": result.get("ocr_text", ""),
                "llava_caption": result.get("llava_caption", ""),
                "draw_commands": result.get("draw_cmds", [])
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "draw_commands": state.get("draw_cmds", [])
            }

# Create a global instance of the vision pipeline
vision_pipeline = VisionPipeline()

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def test_pipeline():
        pipeline = VisionPipeline()
        result = await pipeline.process_image("path/to/your/image.jpg")
        print("Processing results:")
        print(f"Detections: {len(result.get('detections', []))} objects")
        print(f"Extracted text: {result.get('ocr_text', '')}")
        print(f"Image caption: {result.get('llava_caption', '')}")
    
    asyncio.run(test_pipeline())
