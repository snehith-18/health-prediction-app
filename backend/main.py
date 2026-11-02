from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import Base, engine
from dependencies import get_db
from ai_service import generate_health_remarks

import models
import schemas


app = FastAPI(
    title="Health Prediction API",
    description="Patient Health Management Application",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# DUPLICATE PATIENT CHECK
def check_duplicate_patient(
    db: Session,
    patient_data,
    exclude_patient_id=None
):
    query = db.query(models.Patient).filter(
        func.lower(
            func.trim(models.Patient.full_name)
        ) == patient_data.full_name.strip().lower(),

        models.Patient.dob == patient_data.dob,

        func.lower(
            func.trim(models.Patient.email)
        ) == str(patient_data.email).strip().lower()
    )

    # Exclude current patient during update
    if exclude_patient_id is not None:
        query = query.filter(
            models.Patient.id != exclude_patient_id
        )

    existing_patient = query.first()

    if existing_patient:
        raise HTTPException(
            status_code=409,
            detail="This patient is already registered. A duplicate record cannot be created."
        )


# AI remarks generation helper
def get_ai_remarks(patient):
    try:
        return generate_health_remarks(
            glucose=patient.glucose,
            haemoglobin=patient.haemoglobin,
            cholesterol=patient.cholesterol
        )

    except Exception as error:
        print(
            "AI remarks generation failed:",
            repr(error)
        )

        return "AI remarks could not be generated. Please retry later."


# HOME
@app.get("/")
def home():
    return {
        "message": "Health Prediction API is running!"
    }


# HEALTH CHECK
@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "application": "Health Prediction System"
    }


# CREATE PATIENT
@app.post(
    "/patients/",
    response_model=schemas.PatientResponse
)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db)
):

    # Check duplicate before calling AI
    check_duplicate_patient(db, patient)

    remarks = get_ai_remarks(patient)

    new_patient = models.Patient(
        full_name=patient.full_name,
        dob=patient.dob,
        email=patient.email,
        glucose=patient.glucose,
        haemoglobin=patient.haemoglobin,
        cholesterol=patient.cholesterol,
        remarks=remarks
    )

    try:
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        return new_patient

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save patient record"
        )


# GET ALL PATIENTS
@app.get(
    "/patients/",
    response_model=list[schemas.PatientResponse]
)
def get_patients(db: Session = Depends(get_db)):

    patients = db.query(models.Patient).all()

    return patients


# GET PATIENT BY ID
@app.get(
    "/patients/{patient_id}",
    response_model=schemas.PatientResponse
)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(models.Patient).filter(
        models.Patient.id == patient_id
    ).first()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# UPDATE PATIENT
@app.put(
    "/patients/{patient_id}",
    response_model=schemas.PatientResponse
)
def update_patient(
    patient_id: int,
    patient_data: schemas.PatientCreate,
    db: Session = Depends(get_db)
):

    patient = db.query(models.Patient).filter(
        models.Patient.id == patient_id
    ).first()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # Check duplicates while excluding current patient
    check_duplicate_patient(
        db,
        patient_data,
        exclude_patient_id=patient_id
    )

    remarks = get_ai_remarks(patient_data)

    patient.full_name = patient_data.full_name
    patient.dob = patient_data.dob
    patient.email = patient_data.email
    patient.glucose = patient_data.glucose
    patient.haemoglobin = patient_data.haemoglobin
    patient.cholesterol = patient_data.cholesterol
    patient.remarks = remarks

    try:
        db.commit()
        db.refresh(patient)

        return patient

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to update patient record"
        )


# REGENERATE AI REMARKS
@app.post("/patients/{patient_id}/generate-remarks")
def regenerate_patient_remarks(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(models.Patient).filter(
        models.Patient.id == patient_id
    ).first()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    try:
        remarks = generate_health_remarks(
            glucose=patient.glucose,
            haemoglobin=patient.haemoglobin,
            cholesterol=patient.cholesterol
        )

        patient.remarks = remarks

        db.commit()
        db.refresh(patient)

        return {
            "message": "AI remarks generated successfully",
            "patient_id": patient.id,
            "remarks": patient.remarks
        }

    except Exception as error:
        db.rollback()

        print(
            "Remarks regeneration failed:",
            repr(error)
        )

        raise HTTPException(
            status_code=503,
            detail="Unable to generate AI remarks. Please try again later."
        )


# DELETE PATIENT
@app.delete("/patients/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = db.query(models.Patient).filter(
        models.Patient.id == patient_id
    ).first()

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    try:
        db.delete(patient)
        db.commit()

        return {
            "message": "Patient deleted successfully",
            "patient_id": patient_id
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to delete patient record"
        )