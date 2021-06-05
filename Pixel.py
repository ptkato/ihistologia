#!/usr/bin/env python3

import sys
import os

from PIL  import Image, ImageFont, ImageDraw
from math import log2, pow

from flask import Flask, send_file

app = Flask(__name__)

@app.route("/image/<path:image>")
def serve_image(image):
    return send_file(image)

def crop(k, dir, im, x, y, sx, sy):
    if (k == 0):
        return

    font = ImageFont.truetype("JackInput.ttf", 50)
    os.makedirs(dir, exist_ok=True)
    q1 = im.crop((0, 0, x/2, y/2))
    rq1 = q1.resize((sx, sy), Image.LANCZOS)
    dq1 = ImageDraw.Draw(rq1)
    dq1.text((0, 0), str(int((dir.replace('/', '')[2:]) + "00", 2)), (255, 0, 0), font=font)
    rq1.save(dir + (dir.replace('/', '')[2:]) + "00.jpg", "JPEG")
    
    os.makedirs(dir, exist_ok=True)
    q2 = im.crop((x/2, 0, x, y/2))
    rq2 = q2.resize((sx, sy), Image.LANCZOS)
    dq2 = ImageDraw.Draw(rq2)
    dq2.text((0, 0), str(int((dir.replace('/', '')[2:]) + "01", 2)), (255, 0, 0), font=font)
    rq2.save(dir + (dir.replace('/', '')[2:]) + "01.jpg", "JPEG")

    os.makedirs(dir, exist_ok=True)
    q3 = im.crop((0, y/2, x/2, y))
    rq3 = q3.resize((sx, sy), Image.LANCZOS)
    dq3 = ImageDraw.Draw(rq3)
    dq3.text((0, 0), str(int((dir.replace('/', '')[2:]) + "10", 2)), (255, 0, 0), font=font)
    rq3.save(dir + (dir.replace('/', '')[2:]) + "10.jpg", "JPEG")

    os.makedirs(dir, exist_ok=True)
    q4 = im.crop((x/2, y/2, x, y))
    rq4 = q4.resize((sx, sy), Image.LANCZOS)
    dq4 = ImageDraw.Draw(rq4)
    dq4.text((0, 0), str(int((dir.replace('/', '')[2:]) + "11", 2)), (255, 0, 0), font=font)
    rq4.save(dir + (dir.replace('/', '')[2:]) + "11.jpg", "JPEG")
    
    crop(k-1, dir + "00/", q1, q1.width, q1.height, sx, sy)
    crop(k-1, dir + "01/", q2, q2.width, q2.height, sx, sy)
    crop(k-1, dir + "10/", q3, q3.width, q3.height, sx, sy)
    crop(k-1, dir + "11/", q4, q4.width, q4.height, sx, sy)

def main():
    im = Image.open(sys.argv[1])
    target_size = int(sys.argv[2])

    k = int(log2(im.width) - log2(target_size))

    crop(k, "00/", im, im.width, im.height, int(im.width/pow(2, k)), int(im.height/pow(2, k)))

if __name__ == "__main__":
    # main()
    app.run()