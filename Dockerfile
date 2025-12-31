# Create a production Dockerfile for FastAPI.
# Use multi-stage build, non-root user, and optimized image size.
FROM python:3.12-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
USER nobody
CMD ["uvicorn", "main:app", "--host", "0.0.0
", "--port", "80"]
EXPOSE 80
# End of Dockerfile
