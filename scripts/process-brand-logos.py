#!/usr/bin/env python3
"""Convierte los logos Xinergy oficiales a PNG RGBA (fondo negro → transparente)."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(os.environ.get("XINERGY_ASSETS", ROOT.parent.parent / ".cursor/projects/Users-diegojorreto-Cursor-Projects-Xinergy-2026/assets"))
OUT = ROOT / "public" / "brand"

MAPPING = {
    "__v_blanca-4a7e0781-3490-4d45-b700-ce3ae8b130c9.png": "logo-white.png",
    "__v_color-ead6c855-3ad4-45c5-8af2-baf04d7da916.png": "logo-color.png",
    "__v_negra-1cc18e87-1208-438d-9333-839cbe32507b.png": "logo-black.png",
    "__v_negativa-d7866050-499d-4ae7-bbed-33c801662ca1.png": "logo-negative.png",
    "__v_sobrenaranjo-4ab21da9-4eff-49cf-9fa6-c30605564901.png": "logo-on-orange.png",
    "__v_escalagrises-5fb0636b-02dc-4e1c-94bb-d6b95179996f.png": "logo-grayscale.png",
}


def remove_black_bg(src: Path, dst: Path, threshold: int = 35) -> None:
    img = Image.open(src).convert("RGBA")
    pixels = []
    for r, g, b, a in img.getdata():
        if r < threshold and g < threshold and b < threshold:
            pixels.append((r, g, b, 0))
        else:
            pixels.append((r, g, b, 255))
    img.putdata(pixels)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, "PNG", optimize=True)
    print(f"✓ {dst.name}")


def main() -> None:
    for src_name, dst_name in MAPPING.items():
        src = ASSETS / src_name
        if not src.exists():
            print(f"⚠ omitido (no existe): {src}")
            continue
        remove_black_bg(src, OUT / dst_name)


if __name__ == "__main__":
    main()
