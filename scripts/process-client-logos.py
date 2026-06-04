#!/usr/bin/env python3
"""Procesa logos de clientes: quita fondo, recorta y normaliza altura 72px."""
from __future__ import annotations

import os
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(
    os.environ.get(
        "XINERGY_ASSETS",
        ROOT.parent.parent / ".cursor/projects/Users-diegojorreto-Cursor-Projects-Xinergy-2026/assets",
    )
)
OUT = ROOT / "public" / "clients"
TARGET_H = 72
SKIP = ("__v_", "Pantones", "image-", "Chubb")


def flood_edges(img: Image.Image, ref: tuple[int, int, int], tol: int = 28) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    seen: set[tuple[int, int]] = set()
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    def match(r: int, g: int, b: int) -> bool:
        return abs(r - ref[0]) <= tol and abs(g - ref[1]) <= tol and abs(b - ref[2]) <= tol

    while q:
        x, y = q.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= w or y >= h:
            continue
        seen.add((x, y))
        r, g, b, a = px[x, y]
        if match(r, g, b):
            px[x, y] = (0, 0, 0, 0)
            q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    return img


def remove_pure_black(img: Image.Image, threshold: int = 14) -> Image.Image:
    img = img.convert("RGBA")
    px = list(img.getdata())
    img.putdata(
        [(r, g, b, 0) if r <= threshold and g <= threshold and b <= threshold else (r, g, b, a) for r, g, b, a in px]
    )
    return img


def corner_rgb(img: Image.Image) -> tuple[int, int, int]:
    img = img.convert("RGB")
    w, h = img.size
    pts = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    return tuple(sum(img.getpixel(p)[i] for p in pts) // 4 for i in range(3))


def trim(img: Image.Image, pad: int = 4) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop(
        (max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad))
    )


def normalize(img: Image.Image) -> Image.Image:
    scale = TARGET_H / img.height
    return img.resize((max(1, int(img.width * scale)), TARGET_H), Image.Resampling.LANCZOS)


def process_teleton(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    out = []
    for r, g, b, a in img.getdata():
        white = r > 175 and g > 175 and b > 175
        red = r > 85 and g < 130 and b < 130 and r > g and r > b
        dark_red = 35 < r < 210 and g < 70 and b < 70
        out.append((r, g, b, 255) if (white or red or dark_red) else (0, 0, 0, 0))
    img.putdata(out)
    return img


def process_brinks(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 200 and g > 200 and b > 200:
                px[x, y] = (0, 0, 0, 0)
            elif b < 95 or (r < 90 and g < 90 and b < 90):
                px[x, y] = (0, 0, 0, 0)
    return img


def process(src: Path) -> Image.Image | None:
    key = src.stem.split("-")[0].lower()
    if key == "chubb":
        return None
    img = Image.open(src)

    if key == "teleton":
        img = process_teleton(img)
    elif key == "brinks":
        img = process_brinks(img)
    elif key == "inchcape":
        img = remove_pure_black(img, 8)
    elif key == "softys":
        img = flood_edges(img, (255, 255, 255), 35)
        img = remove_pure_black(img)
    else:
        ref = corner_rgb(img)
        img = flood_edges(img, ref, 32 if sum(ref) < 120 else 35)
        img = remove_pure_black(img)

    img = trim(img)
    if not img.getbbox():
        return None
    return normalize(img)


def dst_name(src: Path) -> str:
    stem = src.stem.split("-")[0]
    return "Banbif_logo.svg.png" if stem == "Banbif_logo.svg" else f"{stem}.png"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for src in sorted(ASSETS.iterdir()):
        if src.suffix.lower() not in (".png", ".webp"):
            continue
        if any(src.name.startswith(p) for p in SKIP):
            continue
        dst = OUT / dst_name(src)
        try:
            out = process(src)
            if out is None:
                print(f"⚠ omitido: {src.name}")
                if dst.exists():
                    dst.unlink()
                continue
            out.save(dst, "PNG", optimize=True)
            print(f"✓ {dst.name}")
        except Exception as exc:
            print(f"✗ {src.name}: {exc}")


if __name__ == "__main__":
    main()
