FROM python:3.8.10-slim
ENV PYTHONUNBUFFERED=1

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN pip install -r requirements.txt