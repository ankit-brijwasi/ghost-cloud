import json
from main import redis, File

def file_uploaded(data: dict):
    print("saving:", data)
    data["status"] = "compressing"
    file = File(**data)
    file.save()

    print("pushing:", file.dict())
    redis.publish("file_compress", json.dumps(file.dict()))

def file_compressed(data: dict):
    def compress_video():
        import time

        print("simulate compression")
        time.sleep(5)

    compress_video()
    print("saving:", data)
    file = File.get(data["pk"])
    file.status = "compressed"
    file.save()

def upload_event_listener():
    p = redis.pubsub()
    p.subscribe("file_uploaded")

    while True:
        message = p.get_message()

        if message and not message['data'] == 1:
            data = json.loads(message['data'])
            file_uploaded(data)

def compress_event_listener():
    from threading import Thread
    p = redis.pubsub()
    p.subscribe("file_compress")

    for message in p.listen():
        if message and not message['data'] == 1:
            data = json.loads(message['data'])
            task = Thread(target=file_compressed, args=(data,))
            task.start()

if __name__ == "__main__":
    import sys

    try:
        command = sys.argv[1]
        if command == "upload":
            upload_event_listener()
        elif command == "compress":
            compress_event_listener()
        else:
            print("invalid command:", command)
            exit(0)
    except IndexError:
        print("Please pass the command")
        