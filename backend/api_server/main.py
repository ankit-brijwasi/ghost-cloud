from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis_om import get_redis_connection, JsonModel, Migrator, Field

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

redis = get_redis_connection(
    host="host.docker.internal",
    port=6379,
    decode_responses=True
)

class File(JsonModel):
    name: str = Field(index=True, full_text_search=True)
    type: str
    size: int
    upload_id: str
    status: str

    class Meta:
        database = redis

Migrator().run()

def serialize_files(pk):
    file: File = File.get(pk)
    return {
        "id": file.pk,
        "name": file.name,
        "size": file.size,
        "status": file.status,
        "type": file.type,
        "upload_id": file.upload_id
    }

@app.get("/")
async def home():
    return {"message": "visit the /docs page for api docs"}

@app.get("/files/")
async def list_files():
    return [serialize_files(pk) for pk in File.all_pks()]

@app.get("/files/{pk}")
async def retrieve_file(pk: str):
    return serialize_files(pk)

@app.delete("/files/{pk}")
async def remove_file(pk: str):
    file: File = File.get(pk)
    return file.delete(pk)

@app.get("/search/{query}")
async def search(query):
    return File.find(File.name % query).all()

@app.get("/rm")
async def rm():
    files = File.all_pks()
    for pk in files:
        obj = File.get(pk)
        a = obj.delete(pk)
        print(a)

    return "ok"