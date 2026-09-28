"""Optimize raster media in a PPTX while preserving all slide and animation XML."""

from io import BytesIO
from pathlib import Path
import zipfile

from PIL import Image, ImageOps

SOURCE = Path.home() / "Downloads/esp32longrange wit summer/WIT.pptx"
TARGET = Path(__file__).resolve().parents[1] / "assets/presentations/WIT_Summer_Internship.pptx"
MEDIA_PREFIX = "ppt/media/"
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg"}


def optimized_image(data, suffix):
    image = ImageOps.exif_transpose(Image.open(BytesIO(data)))
    if max(image.size) > 2048:
        image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
    output = BytesIO()
    if suffix == ".png":
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        image = image.quantize(colors=256, method=Image.Quantize.FASTOCTREE if image.mode == "RGBA" else Image.Quantize.MEDIANCUT)
        image.save(output, format="PNG", optimize=True, compress_level=9)
    else:
        image.convert("RGB").save(output, format="JPEG", quality=84, optimize=True, progressive=True)
    return output.getvalue()


def main():
    if not SOURCE.is_file():
        raise FileNotFoundError(SOURCE)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    before = SOURCE.stat().st_size
    image_bytes_before = 0
    image_bytes_after = 0
    changed = 0
    with zipfile.ZipFile(SOURCE) as original, zipfile.ZipFile(TARGET, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output:
        for info in original.infolist():
            data = original.read(info.filename)
            if info.filename.startswith(MEDIA_PREFIX) and Path(info.filename).suffix.lower() in IMAGE_SUFFIXES:
                image_bytes_before += len(data)
                converted = optimized_image(data, Path(info.filename).suffix.lower())
                image_bytes_after += len(converted)
                if len(converted) < len(data):
                    data = converted
                    changed += 1
                else:
                    image_bytes_after += len(data) - len(converted)
            output.writestr(info, data)
    after = TARGET.stat().st_size
    print(f"Re-encoded {changed} embedded images.")
    print(f"PPTX size {before / 1e6:.1f} MB to {after / 1e6:.1f} MB.")
    print(f"Embedded image data {image_bytes_before / 1e6:.1f} MB to {image_bytes_after / 1e6:.1f} MB.")


if __name__ == "__main__":
    main()
