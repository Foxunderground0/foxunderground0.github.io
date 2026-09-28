"""Create website media copies from the named project folders in Downloads."""

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
from pathlib import Path
import subprocess

from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parents[1]
SOURCES = [
    ("pitm", "pitm"),
    ("rizz8", "rizz8"),
    ("cardy", "cardy"),
    ("kissandost", "kissan-dost"),
    ("motioncoupledsensing", "motion-coupled"),
    ("imd pictures", "imd-security"),
    ("smart band 4 layer pcb project - seperate form the arcive paper", "wristband"),
    ("smart band llm health sensing arxive paper - guardian angel", "wearables"),
    ("sysnet lab digitally controlled voltage trace generator", "voltage-trace-bench"),
    ("smart switch demonstration - not related to anything else this was just a demo project in my freshman year to teach iot to children", "summer-school-iot"),
    ("psifi line folowing robot competition dynamic path finding algo", "robot-path-tracking"),
    ("esp32longrange wit summer", "wit-long-range"),
    ("3d modelling car chassies frelance", "chassis-modeling"),
    ("misclanous pictures for the gallary only not linked to a project", None),
]
IMAGES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"}
VIDEOS = {".mp4", ".mov", ".mkv", ".avi", ".m4v"}
EXCLUDED_FROM_GALLERY = {"wearables-019", "rizz8-032"}


def run(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr[-1600:])
    return result.stdout


def image_copies(image, directory, stem):
    image = ImageOps.exif_transpose(image).convert("RGB")
    full = image.copy()
    full.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    preview = image.copy()
    preview.thumbnail((480, 480), Image.Resampling.LANCZOS)
    full_path = directory / f"{stem}.webp"
    thumb_path = directory / f"{stem}-thumb.webp"
    full.save(full_path, "WEBP", quality=78, method=6)
    preview.save(thumb_path, "WEBP", quality=70, method=6)
    return full_path, thumb_path, preview.size


def convert(job):
    source, project, index = job
    group = project or "miscellaneous"
    directory = SITE / "assets" / "media" / group
    directory.mkdir(parents=True, exist_ok=True)
    kind = "video" if source.suffix.lower() in VIDEOS else "image"
    stem = f"{group}-{index:03d}"
    duration = None
    if kind == "image":
        with Image.open(source) as image:
            full, thumb, (width, height) = image_copies(image, directory, stem)
        poster = None
    else:
        info = json.loads(run(["ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", str(source)]))
        duration = float(info["format"].get("duration", 0))
        full = directory / f"{stem}.mp4"
        if not full.exists():
            run([
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(source),
                "-map", "0:v:0", "-map", "0:a:0?", "-map_metadata", "-1",
                "-vf", "scale=w='min(960,iw)':h='min(960,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24",
                "-c:v", "libx264", "-preset", "fast", "-crf", "29", "-threads", "2",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k",
                "-movflags", "+faststart", str(full),
            ])
        frame = directory / f"{stem}-frame.png"
        run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(min(1.0, duration / 4)), "-i", str(full), "-frames:v", "1", str(frame)])
        with Image.open(frame) as image:
            poster, thumb, (width, height) = image_copies(image, directory, f"{stem}-poster")
        frame.unlink()
    relative = lambda path: path.relative_to(SITE).as_posix() if path else None
    item = {
        "id": stem, "project": project, "type": kind,
        "src": relative(full), "thumbnail": relative(thumb), "poster": relative(poster),
        "width": width, "height": height, "duration": round(duration, 2) if duration is not None else None,
        "hideFromGallery": stem in EXCLUDED_FROM_GALLERY,
    }
    files = [full, thumb] + ([poster] if poster else [])
    report = {
        "id": stem, "project": project, "source": str(source), "sourceBytes": source.stat().st_size,
        "websiteBytes": sum(path.stat().st_size for path in files),
    }
    return item, report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=Path.home() / "Downloads")
    args = parser.parse_args()
    jobs = []
    for folder, project in SOURCES:
        base = args.source / folder
        if not base.is_dir():
            raise FileNotFoundError(base)
        files = sorted(path for path in base.rglob("*") if path.is_file() and path.suffix.lower() in IMAGES | VIDEOS)
        jobs.extend((path, project, index) for index, path in enumerate(files, 1))
    results = {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        pending = {pool.submit(convert, job): job for job in jobs}
        for future in as_completed(pending):
            item, report = future.result()
            results[item["id"]] = (item, report)
            if len(results) % 10 == 0 or len(results) == len(jobs):
                print(f"Converted {len(results)}/{len(jobs)} media files", flush=True)
    ordered = [results[f"{project or 'miscellaneous'}-{index:03d}"] for _, project, index in jobs]
    (SITE / "assets/media/manifest.json").write_text(json.dumps([item for item, _ in ordered], indent=2) + "\n")
    report = {
        "files": [item for _, item in ordered],
        "sourceBytes": sum(item["sourceBytes"] for _, item in ordered),
        "websiteBytes": sum(item["websiteBytes"] for _, item in ordered),
    }
    (SITE.parent / "media-import-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(f"Finished. {len(jobs)} files. {report['sourceBytes'] / 1e6:.1f} MB to {report['websiteBytes'] / 1e6:.1f} MB.")


if __name__ == "__main__":
    main()
