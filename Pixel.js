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

const isInsideSquare = function(vertex, square, isize) {
    return isInside(vertex, square)
        || isInside({x: vertex.x + isize.width, y: vertex.y}, square)
        || isInside({x: vertex.x,               y: vertex.y + isize.height}, square)
        || isInside({x: vertex.x + isize.width, y: vertex.y + isize.height}, square);
};

const toBinary = function(decimal, padding) {
    return decimal.toString(2).padStart(padding, 0);
};

const getId = function (source) {
    return /[01]+$/.exec(source)[0];
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
    width: 0,
    height: 0,
    images: [],
    level: 0
};

const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0
};





const draw = function(ctx, csize, isize, url, level, images, coords) {
    ctx.clearRect(0, 0, csize.width, csize.height);

    const seedImage = images[Math.floor((images.length - 1) / 2)] || {image: {src: "0".repeat((level + 1) * 2)}};
    const seedCoord = images[Math.floor((images.length - 1) / 2)]
        ? {x : seedImage.x + coords.x - coords.prevX, y: seedImage.y + coords.y - coords.prevY} : coords;

    return draw_(ctx, isize, url, level, images.map((i) => {
        return Object.assign(i, {drawn: false});
    }), getId(seedImage.image.src), seedCoord);
}

const draw_ = function(ctx, isize, url, level, images, id, coords) {
    if (level != canvas.level) {
        return images;
    }

    const decimal = parseInt(id, 2);
    const index = images.findIndex((i) => (url + id) == i.image.src);

    if (!isInsideSquare(coords, canvas.vertices, isize)) {
        if (index != -1) {
            images.splice(index);
        }
        return images;
    } else {
        const target = images[index];

        if (target) {
            if (target.drawn) {
                return images;
            } else {
                if (target.image.naturalWidth) {
                    ctx.drawImage(target.image, coords.x, coords.y);
                } else {
                    target.image.onload = () => ctx.drawImage(target.image, coords.x, coords.y);
                }
                
                images.push({
                    image: target.image,
                    x: coords.x,
                    y: coords.y,
                    drawn: true
                });
                images.splice(index);
            }
        } else {
            const image = new Image();
            image.src = url + id;

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

const init = function(c) {
    const image = new Image();
    image.src = canvas.url + "0".repeat((canvas.level + 1) * 2)

    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.images = draw(c.getContext("2d"), canvas.boundary, canvas,
            canvas.url, canvas.level, canvas.images, {x: 0, y: 0});
    }
}

const main = function() {
    const c = document.getElementById("canvas");
    c.setAttribute("width",  window.getComputedStyle(document.body).getPropertyValue("width"));
    c.setAttribute("height", window.getComputedStyle(document.body).getPropertyValue("height"));

    document.addEventListener("mousedown", (e) => {
        if (c === document.activeElement && e.button === 0) {
            mouse.prevX = e.clientX;
            mouse.prevY = e.clientY;
        }
    });
    document.addEventListener("mouseup", (e) => {
        if (c === document.activeElement && e.button === 0) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;

            canvas.images = draw(c.getContext("2d"), canvas.boundary, canvas,
                canvas.url, canvas.level, canvas.images, mouse);
        }
    });

    document.addEventListener("wheel", (e) => {
        if (c === document.activeElement) {
            if (e.deltaY > 0) {
                canvas.level += 1;
            } else {
                if (canvas.level > 0) {
                    canvas.level += -1;
                }
            }
            document.getElementById("level").innerText = canvas.level;
            init(c);
        }
    });

    init(c);
};
