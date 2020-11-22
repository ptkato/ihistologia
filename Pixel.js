const dotProduct = function(U, V) {
    return U.x * V.x + U.y * V.y;
};

const isInside = function(vertex, square) {
    const AB = { x: square.b.x - square.a.x, y: square.b.y - square.a.y };
    const AM = { x: vertex.x   - square.a.x, y: vertex.y   - square.a.y };
    const BC = { x: square.c.x - square.b.x, y: square.c.y - square.b.y };
    const BM = { x: vertex.x   - square.b.x, y: vertex.y   - square.b.y };

    return (0 <= dotProduct(AB, AM) && dotProduct(AB, AM) <= dotProduct(AB, AB))
        && (0 <= dotProduct(BC, BM) && dotProduct(BC, BM) <= dotProduct(BC, BC));
};

const toBinary = function(decimal, padding) {
    return decimal.toString(2).padStart(padding, 0);
};

const canvas = {
    get boundary() { return document.getElementById("canvas").getBoundingClientRect() },
    vertices: {
        get a() { return { x: 0,                      y: 0                     }; },
        get b() { return { x: 0,                      y: canvas.boundary.width }; },
        get c() { return { x: canvas.boundary.height, y: canvas.boundary.width }; },
        get d() { return { x: canvas.boundary.height, y: 0                     }; }
    },

    url: "http://127.0.0.1:5000/image/",
    images: [],
    level: 1
};

const mouse = {
    prevX: 0,
    prevY: 0
};





const draw = function(ctx, csize, isize, url, level, images, coords) {
    ctx.clearRect(0, 0, csize.width, csize.height);

    return draw_(ctx, isize, url, level, images.map((i) => {
        return Object.assign(i, {drawn: false});
    }), "0".repeat((level + 1) * 2), coords);
}

const draw_ = function(ctx, isize, url, level, images, id, coords) {
    if (!isInside(coords, canvas.vertices)) {
        return images;
    } else {
        const decimal = parseInt(id, 2);

        const index = images.findIndex((i) => (url + id) === i.image.src);
        const target = images[index];
        if (target) {
            if (target.drawn) {
                return images;
            } else {
                if (target.image.naturalWidth) {
                    ctx.drawImage(target.image, target.x + coords.x, target.y + coords.y);
                } else {
                    target.image.onload = () => ctx.drawImage(target.image, target.x + coords.x, target.y + coords.y);
                }

                images.push({
                    image: target.image,
                    x: target.x + coords.x,
                    y: target.y + coords.y,
                    drawn: true
                });
                images.splice(index);
            }
        } else {
            const image = new Image();
            image.src = url + id;
            console.log(decimal);

            image.onload = () => ctx.drawImage(image, coords.x, coords.y);
            images.push({
                image: image,
                x: coords.x,
                y: coords.y,
                drawn: true
            });
        }

        switch (decimal % 4) {
            case 0: 
                if (decimal >= 2 ** (level + 1) * 2)
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal - 2 ** (level + 1) * 2 + 2, id.length), { x: coords.x,               y: coords.y - isize.height });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal + 1, id.length),                        { x: coords.x + isize.width, y: coords.y                });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal + 2, id.length),                        { x: coords.x,               y: coords.y + isize.height });
                if (![0, 2].includes(decimal % (2 ** (level + 1) * 2)))
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal - 3, id.length),                        { x: coords.x - isize.width, y: coords.y                });
                break;
            case 1:
                if (decimal >= 2 ** (level + 1) * 2)
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal - 2 ** (level + 1) * 2 + 2, id.length), { x: coords.x,               y: coords.y - isize.height });
                if (![0, 2].includes((decimal + 3) % (2 ** (level + 1) * 2)))
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal + 3, id.length),                        { x: coords.x + isize.width, y: coords.y                });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal + 2, id.length),                        { x: coords.x,               y: coords.y + isize.height });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal - 1, id.length),                        { x: coords.x - isize.width, y: coords.y                });
                break;
            case 2:
                images = draw_(ctx, isize, url, level, images, toBinary(decimal - 2, id.length),                        { x: coords.x,               y: coords.y - isize.height });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal + 1, id.length),                        { x: coords.x + isize.width, y: coords.y                });
                if (decimal < 4 ** (level + 1) - 2 ** (level + 1) * 2)
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal + 2 ** (level + 1) * 2 - 2, id.length), { x: coords.x,               y: coords.y + isize.height });
                if (![0, 2].includes(decimal % (2 ** (level + 1) * 2)))
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal - 3, id.length),                        { x: coords.x - isize.width, y: coords.y                });
                break;
            case 3:
                images = draw_(ctx, isize, url, level, images, toBinary(decimal - 2, id.length),                        { x: coords.x,               y: coords.y - isize.height });
                if (![0, 2].includes((decimal + 3) % (2 ** (level + 1) * 2)))
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal + 3, id.length),                        { x: coords.x + isize.width, y: coords.y                });
                if (decimal < 4 ** (level + 1) - 2 ** (level + 1) * 2)
                    images = draw_(ctx, isize, url, level, images, toBinary(decimal + 2 ** (level + 1) * 2 - 2, id.length), { x: coords.x,               y: coords.y + isize.height });
                images = draw_(ctx, isize, url, level, images, toBinary(decimal - 1, id.length),                        { x: coords.x - isize.width, y: coords.y                });
                break;
        }

        return images;
    }
};

const main = function() {
    const c = document.getElementById("canvas");
    c.setAttribute("width",  1000); // window.getComputedStyle(document.body).getPropertyValue("width"));
    c.setAttribute("height", 1000); // window.getComputedStyle(document.body).getPropertyValue("height"));

    document.addEventListener("mousemove", (e) => {
        const image = new Image();
        image.src = canvas.url + "0".repeat((canvas.level + 1) * 2)

        image.onload = () => {
            if (c === document.activeElement && e.buttons === 1) {
                canvas.images = draw(c.getContext("2d"), canvas.boundary, {width: image.width, height: image.height},
                    canvas.url, canvas.level, canvas.images,
                    {x: e.clientX - mouse.prevX, y: e.clientY - mouse.prevY});
                
                mouse.prevX = e.clientX;
                mouse.prevY = e.clientY;
            }
        };
    });

    const image = new Image();
    image.src = canvas.url + "0".repeat((canvas.level + 1) * 2)

    image.onload = () => {
        canvas.images = draw(c.getContext("2d"), canvas.boundary, {width: image.width, height: image.height},
            canvas.url, canvas.level, canvas.images, {x: 0, y: 0});
    }
};
