import os
import uuid
import subprocess
import boto3
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse

app = FastAPI(title="mpng Media Service")

S3_BUCKET = os.getenv("S3_BUCKET", "mpng-uploads")
s3 = boto3.client("s3")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/trim")
async def trim_video(
    file: UploadFile = File(...),
    start: float = Form(...),
    end: float = Form(...),
):
    tmp_in = f"/tmp/{uuid.uuid4()}-{file.filename}"
    tmp_out = f"/tmp/{uuid.uuid4()}-trimmed.mp4"

    with open(tmp_in, "wb") as f:
        f.write(await file.read())

    duration = end - start
    subprocess.run(
        ["ffmpeg", "-y", "-ss", str(start), "-i", tmp_in, "-t", str(duration), "-c", "copy", tmp_out],
        check=True,
    )

    key = f"videos/{uuid.uuid4()}-trimmed.mp4"
    s3.upload_file(tmp_out, S3_BUCKET, key, ExtraArgs={"ContentType": "video/mp4"})

    os.remove(tmp_in)
    os.remove(tmp_out)

    url = f"https://{S3_BUCKET}.s3.amazonaws.com/{key}"
    return JSONResponse({"url": url})
