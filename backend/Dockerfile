FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["sh", "-c", "gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers ${API_WORKERS:-2} --bind 0.0.0.0:${PORT:-8000} --access-logfile - --error-logfile - --keep-alive 30 --max-requests 1000 --max-requests-jitter 100"]
