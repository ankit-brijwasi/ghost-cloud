import json
from pathlib import Path

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from redis_om import get_redis_connection, HashModel

from config import MEDIA_DIR

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

class FileUpload(HashModel):
    name: str
    type: str
    size: int
    upload_path: str

    class Meta:
        database = redis

@app.put("/files/upload/")
async def upload_file(file: UploadFile):
    # save the file
    try:
        upload_path = str(MEDIA_DIR / file.filename)
        with open(upload_path, 'wb') as f:
            while contents := file.file.read(1024 * 1024):
                f.write(contents)

        file_upload = FileUpload(
            name=file.filename,
            type=file.content_type,
            size=Path(upload_path).stat().st_size,
            upload_path=upload_path,
        )
        file_upload.save()
    except Exception as e:
        print(e)
        return {"detail": "An error occured while uploading"}
    finally:
        file.file.close()

    # connect with api server via redis pub/sub
    data = {
        "name": file_upload.name,
        "type": file_upload.type,
        "size": file_upload.size,
        "upload_id": file_upload.pk,
        "status": "uploaded"
    }
    redis.publish("file_uploaded", json.dumps(data))
    return data

@app.get("/files/{upload_id}/resource")
async def upload_file(upload_id: str):
    file = FileUpload.get(upload_id)
    return FileResponse(file.upload_path)

@app.get("/rm")
async def rm():
    files = FileUpload.all_pks()
    for pk in files:
        obj = FileUpload.get(pk)
        a = obj.delete(pk)
        print(a)

    return "ok"