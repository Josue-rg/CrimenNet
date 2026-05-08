from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import ssl
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+pg8000://user:password@localhost:5432/crimennet")

# Configuración especial para Neon/SSL si se usa pg8000
connect_args = {}
if "neon.tech" in DATABASE_URL and "pg8000" in DATABASE_URL:
    ssl_context = ssl.create_default_context()
    # Eliminar sslmode de la URL si existe, ya que pg8000 no lo reconoce como parámetro de consulta
    if "?sslmode=" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("?sslmode=")[0]
    elif "&sslmode=" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.split("&sslmode=")[0]
    
    connect_args = {"ssl_context": ssl_context}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
