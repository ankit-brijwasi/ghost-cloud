from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

def _get_media_dir():
    path = Path(BASE_DIR) / "media"
    path.mkdir(parents=True, exist_ok=True)
    return path

MEDIA_DIR = _get_media_dir()