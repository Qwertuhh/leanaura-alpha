import subprocess

subprocess.run(["uvicorn", "app.main:app", "--reload"])
