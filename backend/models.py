from sqlalchemy import Column, Integer, String, Date, Float, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    dob = Column(Date, nullable=False)

    email = Column(String(150), nullable=False)

    glucose = Column(Float, nullable=False)

    haemoglobin = Column(Float, nullable=False)

    cholesterol = Column(Float, nullable=False)

    remarks = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=True
    )