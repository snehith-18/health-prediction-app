import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai


# Load API key from backend/.env
load_dotenv(Path(__file__).with_name(".env"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_NAME = "gemini-3.8-flash"


def generate_health_remarks(glucose, haemoglobin, cholesterol):
    """
    Generate informational health screening remarks using Gemini AI.
    Patient identity information is not sent to Gemini.
    """

    if not GEMINI_API_KEY:
        raise RuntimeError(
            "Gemini API key is missing. Check your backend/.env file."
        )

    prompt = f"""
    You are an AI health information assistant.

    Review the following patient blood test values:

    Glucose: {glucose}
    Haemoglobin: {haemoglobin}
    Cholesterol: {cholesterol}

    Generate a short health screening remark.

    Instructions:
    1. Explain whether any values may need further medical review.
    2. Do not provide a medical diagnosis.
    3. Do not recommend medicines or treatments.
    4. Do not assume measurement units or reference ranges.
    5. Mention that interpretation requires laboratory reference
       ranges and clinical context.
    6. Recommend consulting a qualified healthcare professional.
    7. Use simple, professional language.
    8. Keep the response within 80 words.
    """

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response.")

        return response.text.strip()

    except Exception as error:
        print("\n===================================")
        print("GEMINI API ERROR")
        print("Model:", MODEL_NAME)
        print("Error Type:", type(error).__name__)
        print("Error Details:", repr(error))
        print("===================================\n")

        raise RuntimeError(
            "Unable to generate health remarks."
        ) from error