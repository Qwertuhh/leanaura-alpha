import subprocess

subprocess.run(["uvicorn", "src.main:src", "--host", "127.0.0.1", "--port", "8000"])
