"""Crop official logo mockups to tight PNG assets with paper background removed."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MARK_SRC = Path(
    r"C:\Users\345959\.cursor\projects\c-Users-345959-Downloads-Basic\assets\c__Users_345959_AppData_Roaming_Cursor_User_workspaceStorage_a659eb2af6300bb2c655601f54ec129a_images_image-92709730-7f4a-41cc-bac8-c3d62f323a32.png"
)
LOCKUP_SRC = Path(
    r"C:\Users\345959\.cursor\projects\c-Users-345959-Downloads-Basic\assets\c__Users_345959_AppData_Roaming_Cursor_User_workspaceStorage_a659eb2af6300bb2c655601f54ec129a_images_image-48fe3780-5208-4aab-9083-9d507d2ce71b.png"
)


def paper_color(arr: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    samples = np.concatenate(
        [
            arr[0:8, 0:8, :3].reshape(-1, 3),
            arr[0:8, w - 8 : w, :3].reshape(-1, 3),
            arr[h - 8 : h, 0:8, :3].reshape(-1, 3),
            arr[h - 8 : h, w - 8 : w, :3].reshape(-1, 3),
        ],
        axis=0,
    ).astype(np.float32)
    return np.median(samples, axis=0)


def knock_out_paper(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.array(im, dtype=np.uint8)
    rgb = arr[:, :, :3].astype(np.float32)
    paper = paper_color(arr)
    dist = np.linalg.norm(rgb - paper, axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    # Paper and soft shadow near paper tone
    remove = (dist < 42) & (sat < 28)
    arr[remove, 3] = 0
    fringe = (dist < 58) & (sat < 32) & (~remove)
    arr[fringe, 3] = np.clip(arr[fringe, 3].astype(np.int32) - 140, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def square_crop_around_logo(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.float32)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    gray = rgb.mean(axis=2)
    mask = (sat > 16) & (gray < 210)
    ys, xs = np.where(mask)
    if ys.size == 0:
        return im
    pad = int(max(ys.max() - ys.min(), xs.max() - xs.min()) * 0.12)
    cy = (ys.min() + ys.max()) // 2
    cx = (xs.min() + xs.max()) // 2
    half = max(ys.max() - ys.min(), xs.max() - xs.min()) // 2 + pad
    top = max(0, cy - half)
    bottom = min(arr.shape[0], cy + half)
    left = max(0, cx - half)
    right = min(arr.shape[1], cx + half)
    side = max(bottom - top, right - left)
    top = max(0, cy - side // 2)
    left = max(0, cx - side // 2)
    bottom = min(arr.shape[0], top + side)
    right = min(arr.shape[1], left + side)
    return im.crop((left, top, right, bottom))


def vertical_crop_lockup(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.float32)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    gray = rgb.mean(axis=2)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    blue_ink = (b > r + 10) & (b > g + 6) & (b > 70)
    gold_ink = (r > 125) & (g > 95) & (b < 145) & (sat > 18)
    mask = blue_ink | gold_ink | ((sat > 28) & (gray < 190))
    ys, xs = np.where(mask)
    pad_y = max(6, int(0.02 * arr.shape[0]))
    pad_x = max(6, int(0.03 * arr.shape[1]))
    top = max(0, int(ys.min()) - pad_y)
    bottom = min(arr.shape[0], int(ys.max()) + pad_y + 1)
    left = max(0, int(xs.min()) - pad_x)
    right = min(arr.shape[1], int(xs.max()) + pad_x + 1)
    return im.crop((left, top, right, bottom))


def save_png(im: Image.Image, path: Path) -> None:
    im.save(path, optimize=True)
    print(f"Wrote {path} ({im.size[0]}x{im.size[1]})")


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)

    mark = Image.open(MARK_SRC)
    mark = square_crop_around_logo(mark)
    mark = knock_out_paper(mark)
    save_png(mark, ASSETS / "logo-mark.png")

    lockup = Image.open(LOCKUP_SRC)
    lockup = vertical_crop_lockup(lockup)
    lockup = knock_out_paper(lockup)
    save_png(lockup, ASSETS / "logo-lockup.png")

    w, h = mark.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(mark, ((side - w) // 2, (side - h) // 2), mark)
    fav = square.resize((512, 512), Image.Resampling.LANCZOS)
    save_png(fav, ASSETS / "logo-mark-512.png")
    save_png(square.resize((32, 32), Image.Resampling.LANCZOS), ASSETS / "favicon-32.png")


if __name__ == "__main__":
    main()
