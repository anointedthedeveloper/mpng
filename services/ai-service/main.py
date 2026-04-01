from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from rembg import remove

app = FastAPI(title="mpng AI Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    data = await file.read()
    result = remove(data)
    return Response(content=result, media_type="image/png")
