from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date, datetime
from typing import Optional


class PatientCreate(BaseModel):

    full_name: str = Field(min_length=2, max_length=100)

    dob: date

    email: EmailStr

    glucose: float = Field(gt=0)

    haemoglobin: float = Field(gt=0)

    cholesterol: float = Field(gt=0)

    @field_validator("dob", mode="before")
    @classmethod
    def validate_dob(cls, value):

        if isinstance(value, str):
            try:
                value = datetime.strptime(
                    value, "%d/%m/%Y"
                ).date()
            except ValueError:
                raise ValueError(
                    "Date must be in dd/mm/yyyy format"
                )

        if value > date.today():
            raise ValueError(
                "Date of birth cannot be in the future"
            )

        return value


class PatientResponse(BaseModel):

    id: int
    full_name: str
    dob: date
    email: str
    glucose: float
    haemoglobin: float
    cholesterol: float
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }