#!/usr/bin/env python3
"""Procesa logos de partners: quita fondo, recorta y normaliza altura 72px."""
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
OUT = ROOT / "public" / "partners"
TARGET_H = 72

# (asset filename prefix, output filename, trim_only)
PARTNERS: list[tuple[str, str, bool]] = [
    ("aws-", "aws.png", False),
    ("cleverit-", "cleverit.png", False),
    ("Digevo-", "digevo.png", False),
    ("DUX-", "dux.png", False),
    ("EY_logo_2019.svg-", "ey.png", False),
    ("GEP-", "gep.png", False),
    ("Globant-", "globant.png", False),
    ("iconstruye-", "iconstruye.png", False),
    ("iNDEXA-", "indexa.png", False),
    ("jaggaer-", "jaggaer.png", False),
    ("Keedian-", "keedian.png", False),
    ("LIDEV-", "lidev.png", False),
    ("MONDAY-", "monday.png", False),
    ("noovatech_logo_transparente_recortado-", "noovatech.png", False),
    ("porsche_consulting_logo_transparente-", "porsche_consulting.png", True),
    ("sap_ariba_logo_transparente-", "sap_ariba.png", False),
    ("senegocia-", "senegocia.png", False),
    ("UiPath-Logo-", "uipath.png", False),
    ("valtin_consulting-", "valtin_consulting.png", False),
    ("visa-", "visa.png", False),
    ("webdox-", "webdox.png", False),
]


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


def process(src: Path, *, trim_only: bool = False) -> Image.Image | None:
    img = Image.open(src)
    if trim_only:
        img = img.convert("RGBA")
    else:
        ref = corner_rgb(img)
        img = flood_edges(img, ref, 32 if sum(ref) < 120 else 35)
        img = remove_pure_black(img)
    img = trim(img)
    if not img.getbbox():
        return None
    return normalize(img)


def find_asset(prefix: str) -> Path | None:
    for src in ASSETS.iterdir():
        if src.name.startswith(prefix) and src.suffix.lower() == ".png":
            return src
    return None


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for prefix, dst_name, trim_only in PARTNERS:
        src = find_asset(prefix)
        dst = OUT / dst_name
        if src is None:
            print(f"✗ no encontrado: {prefix}")
            continue
        try:
            out = process(src, trim_only=trim_only)
            if out is None:
                print(f"⚠ omitido: {src.name}")
                continue
            out.save(dst, "PNG", optimize=True)
            print(f"✓ {dst.name}")
        except Exception as exc:
            print(f"✗ {src.name}: {exc}")


if __name__ == "__main__":
    main()
