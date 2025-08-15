import subprocess
import sys

subprocess.run([
    sys.executable, "-m", "uvicorn", "main:app",
    "--reload",
    "--host", "localhost",
    "--port", "8000",
    "--reload-dir", "."
], check=True)
