# Use official Python image
FROM python:3.10

# Set work directory inside the container
WORKDIR /code

# Install dependencies first (for caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose port (Hugging Face Spaces uses 7860)
EXPOSE 7860

# Run FastAPI with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
