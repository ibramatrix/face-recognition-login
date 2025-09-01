from sqlalchemy import Column, Integer, String, Text
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    embedding_json = Column(Text, nullable=False)  # store list of floats as JSON
