FROM python:3.10

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create cache folder and fix permissions
RUN mkdir /.cache
RUN chmod -R 777 /.cache

EXPOSE 7860

RUN mkdir -p /code/backend/transformers_cache && chmod -R 777 /code/backend/transformers_cache

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
