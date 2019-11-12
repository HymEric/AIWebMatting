FROM python:3.6.8

WORKDIR /usr/src/app

COPY algorithm/requirements.txt algorithm/requirements.txt
COPY backend/requirements.txt backend/requirements.txt

RUN pip install --no-cache-dir -r algorithm/requirements.txt && \
pip install --no-cache-dir -r backend/requirements.txt

COPY . .

ENTRYPOINT ["python", "-m", "backend.backend"]
