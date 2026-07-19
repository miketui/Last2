#!/usr/bin/env python3
"""Audit every rendered PDF page for clipping and create contact sheets."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageOps


def page_number(path: Path) -> int:
    match = re.search(r"(\d+)$", path.stem)
    if not match:
        raise ValueError(f"page image lacks a numeric suffix: {path}")
    return int(match.group(1))


def ink_fraction(image: Image.Image) -> float:
    histogram = image.convert("L").histogram()
    return sum(histogram[:225]) / (image.width * image.height)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--render-dir", type=Path, required=True)
    parser.add_argument("--contact-dir", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    doc = fitz.open(args.pdf)
    expected_pages = len(doc)
    files = sorted(args.render_dir.glob("page-*.jpg"), key=page_number)
    count_ok = len(files) == expected_pages

    edge_ink_pages: list[int] = []
    sparse_pages: list[dict[str, float | int]] = []
    raster_sizes: set[tuple[int, int]] = set()
    for number, path in enumerate(files, 1):
        with Image.open(path) as source:
            image = source.convert("RGB")
        raster_sizes.add(image.size)
        width, height = image.size
        bands = [
            image.crop((0, 0, width, 3)),
            image.crop((0, height - 3, width, height)),
            image.crop((0, 0, 3, height)),
            image.crop((width - 3, 0, width, height)),
        ]
        if any(
            any(pixel < 210 for pixel in band.convert("L").tobytes())
            for band in bands
        ):
            edge_ink_pages.append(number)
        fraction = ink_fraction(image)
        if fraction < 0.0006:
            sparse_pages.append({"page": number, "ink_fraction": fraction})

    outside_spans: list[dict[str, object]] = []
    page_sizes: set[tuple[float, float]] = set()
    for number, page in enumerate(doc, 1):
        page_sizes.add((round(page.rect.width, 2), round(page.rect.height, 2)))
        for block in page.get_text("dict").get("blocks", []):
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    text = span.get("text", "").strip()
                    if not text:
                        continue
                    x0, y0, x1, y1 = span["bbox"]
                    if (
                        x0 < -0.5
                        or y0 < -0.5
                        or x1 > page.rect.width + 0.5
                        or y1 > page.rect.height + 0.5
                    ):
                        outside_spans.append(
                            {"page": number, "text": text[:100], "bbox": span["bbox"]}
                        )
    doc.close()

    args.contact_dir.mkdir(parents=True, exist_ok=True)
    columns, rows = 4, 5
    thumb_width, thumb_height, label_height = 145, 208, 20
    batch_size = columns * rows
    for sheet_index in range((len(files) + batch_size - 1) // batch_size):
        batch = files[sheet_index * batch_size : (sheet_index + 1) * batch_size]
        sheet = Image.new(
            "RGB",
            (columns * thumb_width, rows * (thumb_height + label_height)),
            "#d8d8d8",
        )
        draw = ImageDraw.Draw(sheet)
        for offset, path in enumerate(batch):
            number = sheet_index * batch_size + offset + 1
            row, column = divmod(offset, columns)
            with Image.open(path) as source:
                thumb = ImageOps.contain(
                    source.convert("RGB"), (thumb_width - 8, thumb_height - 8)
                )
            x = column * thumb_width + (thumb_width - thumb.width) // 2
            y = row * (thumb_height + label_height) + 4
            sheet.paste(thumb, (x, y))
            draw.text(
                (column * thumb_width + 5, row * (thumb_height + label_height) + thumb_height),
                f"p{number}",
                fill="black",
            )
        first = sheet_index * batch_size + 1
        last = min((sheet_index + 1) * batch_size, len(files))
        sheet.save(args.contact_dir / f"pages-{first:03d}-{last:03d}.png")

    passed = count_ok and not edge_ink_pages and not outside_spans and len(page_sizes) == 1
    result = {
        "result": "PASS" if passed else "FAIL",
        "pdf_pages": expected_pages,
        "pages_rendered": len(files),
        "raster_sizes": sorted(raster_sizes),
        "pdf_page_sizes_points": sorted(page_sizes),
        "outermost_3px_edge_ink_pages": edge_ink_pages,
        "text_spans_outside_crop_box": outside_spans,
        "sparse_pages": sparse_pages,
        "contact_sheets": len(list(args.contact_dir.glob("*.png"))),
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
