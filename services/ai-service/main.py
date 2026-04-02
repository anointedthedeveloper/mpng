from io import BytesIO

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image
from rembg import remove

app = FastAPI(title="mpng AI Service")


@app.get("/health")
def health():
    return {"status": "ok"}


def _read_rgba_image(raw: bytes) -> Image.Image:
    try:
        return Image.open(BytesIO(raw)).convert("RGBA")
    except Exception as exc:  # pragma: no cover - defensive response shape
        raise HTTPException(status_code=400, detail="Invalid image upload") from exc


def _combine_masks(user_mask: Image.Image, crop: Image.Image) -> np.ndarray:
    crop_mask = np.zeros((crop.height, crop.width), dtype=np.uint8)

    user_alpha = np.array(user_mask.getchannel("A"))
    user_binary = np.where(user_alpha > 16, 255, 0).astype(np.uint8)
    crop_mask[: user_binary.shape[0], : user_binary.shape[1]] = np.maximum(
        crop_mask[: user_binary.shape[0], : user_binary.shape[1]],
        user_binary,
    )

    # Use rembg to segment the crop and reinforce the painted region.
    crop_buffer = BytesIO()
    crop.save(crop_buffer, format="PNG")
    segmented = Image.open(BytesIO(remove(crop_buffer.getvalue()))).convert("RGBA")
    segmented_alpha = np.array(segmented.getchannel("A"))
    crop_mask = np.maximum(crop_mask, np.where(segmented_alpha > 20, 255, 0).astype(np.uint8))

    kernel = np.ones((7, 7), np.uint8)
    crop_mask = cv2.dilate(crop_mask, kernel, iterations=1)
    return crop_mask


@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    data = await file.read()
    result = remove(data)
    return Response(content=result, media_type="image/png")


@app.post("/remove-object")
async def remove_object(file: UploadFile = File(...), mask: UploadFile = File(...)):
    image_raw = await file.read()
    mask_raw = await mask.read()

    image = _read_rgba_image(image_raw)
    mask_img = _read_rgba_image(mask_raw).resize(image.size)

    mask_alpha = np.array(mask_img.getchannel("A"))
    if mask_alpha.max() < 16:
        raise HTTPException(status_code=400, detail="Mask is empty")

    ys, xs = np.where(mask_alpha > 16)
    if len(xs) == 0 or len(ys) == 0:
        raise HTTPException(status_code=400, detail="Mask is empty")

    x_min = int(xs.min())
    x_max = int(xs.max())
    y_min = int(ys.min())
    y_max = int(ys.max())

    pad = max(32, int(max(x_max - x_min, y_max - y_min) * 0.25))
    left = max(0, x_min - pad)
    top = max(0, y_min - pad)
    right = min(image.width, x_max + pad)
    bottom = min(image.height, y_max + pad)

    crop = image.crop((left, top, right, bottom))
    crop_mask = _combine_masks(mask_img.crop((left, top, right, bottom)), crop)

    source = cv2.cvtColor(np.array(image.convert("RGB")), cv2.COLOR_RGB2BGR)
    full_mask = np.zeros((image.height, image.width), dtype=np.uint8)
    full_mask[top:bottom, left:right] = crop_mask

    inpainted = cv2.inpaint(source, full_mask, 3, cv2.INPAINT_TELEA)
    output = Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB))
    out = BytesIO()
    output.save(out, format="PNG")
    return Response(content=out.getvalue(), media_type="image/png")
