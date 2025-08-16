import uvicorn
import argparse
from dotenv import load_dotenv
import os

load_dotenv()

PORT = int(os.getenv("PORT", 8000))

def parse_args():
    parser = argparse.ArgumentParser(description='Run the API server')
    parser.add_argument('--dev', action='store_true', help='Enable development mode')
    return parser.parse_args()

def main() -> None:
    args = parse_args()

    # Set reload based on the --dev flag
    reload = args.dev
    print(f"Running in {'development' if args.dev else 'production'} mode")
    print(f"reload is set to: {reload}")
    
    uvicorn.run(
        "api.main:app",
        host="127.0.0.1",
        port=PORT,
        reload=args.dev,
        reload_dirs=["src/api"] if args.dev else None
    )

if __name__ == "__main__":
    main()
