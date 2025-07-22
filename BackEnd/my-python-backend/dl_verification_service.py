import os
import re
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
import pytesseract
import cv2
import numpy as np
from deepface import DeepFace

app = FastAPI()

class DLVerificationRequest(BaseModel):
    dl_image_url: str
    entered_dl_number: str
    selfie_image_url: str = None  # Optional
    customerName: str = None
    dateOfBirth: str = None


@app.post("/verify-dl")
def verify_dl(data: DLVerificationRequest):
    try:
        dl_text, preprocessed_image = extract_text_from_dl(data.dl_image_url)
        extracted_dl = extract_dl_number(dl_text)
        extracted_name = extract_name(dl_text)
        extracted_dob = extract_dob(dl_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR error: {str(e)}")

    if not extracted_dl:
        return {
            "extracted_text": dl_text,
            "status": "rejected",
            "reason": "Could not extract DL number. Check format or regex."
        }

    is_dl_number_match = normalize(data.entered_dl_number) == normalize(extracted_dl)
    is_name_match = (data.customerName is not None and extracted_name is not None and data.customerName.strip().lower() == extracted_name.strip().lower())
    is_dob_match = (data.dateOfBirth is not None and extracted_dob is not None and data.dateOfBirth.strip() == extracted_dob.strip())
    face_match = True

    if data.selfie_image_url:
        try:
            face_match = compare_faces(data.selfie_image_url, data.dl_image_url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Face match error: {str(e)}")

    status = "verified" if is_dl_number_match and is_name_match and is_dob_match and face_match else "rejected"

    return {
        "extracted_text": dl_text,
        "extracted_dl_number": extracted_dl,
        "extracted_name": extracted_name,
        "extracted_dob": extracted_dob,
        "is_dl_number_match": is_dl_number_match,
        "is_name_match": is_name_match,
        "is_dob_match": is_dob_match,
        "face_match": face_match,
        "status": status
    }

# Helper functions

def normalize(text):
    return text.strip().replace(" ", "").replace("-", "").upper()

def extract_text_from_dl(image_url):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content))
    processed = preprocess_image_for_ocr(image)
    text = pytesseract.image_to_string(processed)
    return text, processed

def preprocess_image_for_ocr(image):
    image = np.array(image)
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return Image.fromarray(thresh)

def extract_dl_number(text):
    pattern = r"\b[A-Z]{2}[- ]?\d{1,2}[- ]?\d{4}[- ]?\d{4,7}\b|\b[A-Z]{2}[- ]?\d{6,14}\b"
    match = re.search(pattern, text.replace('\n', ' ').replace('\r', ' '))
    return match.group().replace(" ", "").replace("-", "") if match else None

def extract_name(text):
    match = re.search(r"Name\s*[:.-]?\s*([A-Z][a-zA-Z]+\s[A-Z][a-zA-Z]+)", text)
    return match.group(1) if match else None

def extract_dob(text):
    match = re.search(r"\b(\d{2}[-/]\d{2}[-/]\d{4})\b", text)
    return match.group(1) if match else None

def compare_faces(selfie_url, dl_url, threshold=0.5):
    try:
        result = DeepFace.verify(
            img1_path=selfie_url,
            img2_path=dl_url,
            model_name="ArcFace",              # More robust than VGG-Face
            detector_backend="retinaface",     # More accurate face detector
            enforce_detection=True
        )

        # Extract distance and model threshold
        distance = result.get("distance", 1.0)
        model_threshold = result.get("threshold", 0.68)

        is_verified = distance <= threshold

        print(f"[DeepFace] Distance: {distance}, Threshold: {threshold}, Verified: {is_verified}")

        return is_verified

    except Exception as e:
        raise Exception(f"DeepFace error: {str(e)}")

