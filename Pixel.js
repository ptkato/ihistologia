var canvas = {};

const dotProduct = function(U, V) {
    return U.x * V.x + U.y * V.y;
};

const isInside = function(vertex) {
    const AB = { x: canvas.vertex.b.x - canvas.vertex.a.x, y: canvas.vertex.b.y - canvas.vertex.a.y };
    const AM = { x: vertex.x          - canvas.vertex.a.x, y: vertex.y          - canvas.vertex.a.y };
    const BC = { x: canvas.vertex.c.x - canvas.vertex.b.x, y: canvas.vertex.c.y - canvas.vertex.b.y };
    const BM = { x: vertex.x          - canvas.vertex.b.x, y: vertex.y          - canvas.vertex.b.y };

    return (0 <= dotProduct(AB, AM) && dotProduct(AB, AM) <= dotProduct(AB, AB))
        && (0 <= dotProduct(BC, BM) && dotProduct(BC, BM) <= dotProduct(BC, BC));
};

const draw = function(ctx, source, coords) {
    if (!coords) {
        ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        coords = { x: 0, y: 0 };

        canvas.quadrants.images = canvas.quadrants.images.filter(i => {
            return isInside({ x:  i.x,                      y:  i.y                       })
                || isInside({ x: (i.x + i.image.width) * 2, y:  i.y                       })
                || isInside({ x: (i.x + i.image.width) * 2, y: (i.y + i.image.height) * 2 })
                || isInside({ x:  i.x,                      y: (i.y + i.image.height) * 2 });
        });
        canvas.quadrants.images.forEach(i => i.drawn = false);
    }

    const imgQ1 = new Image();
    imgQ1.src = canvas.url + source + "00";
    const imgQ2 = new Image();
    imgQ2.src = canvas.url + source + "01";
    const imgQ3 = new Image();
    imgQ3.src = canvas.url + source + "10";
    const imgQ4 = new Image();
    imgQ4.src = canvas.url + source + "11";

    const imgIndex = canvas.quadrants.images.findIndex(i => imgQ1.src === i.image.src)
    const img = canvas.quadrants.images[imgIndex];

    if (!!imgIndex || !img.naturalWidth) {
        imgQ1.onload = () => {
                                 ctx.drawImage(imgQ1, coords.x,               coords.y);
            imgQ2.onload = () => ctx.drawImage(imgQ2, coords.x + imgQ1.width, coords.y);
            imgQ3.onload = () => ctx.drawImage(imgQ3, coords.x,               coords.y + imgQ1.height);
            imgQ4.onload = () => ctx.drawImage(imgQ4, coords.x + imgQ1.width, coords.y + imgQ1.height);

            canvas.quadrants.images.push({
                drawn = true,
                image = imgQ1,
                images = [imgQ1, imgQ2, imgQ3, imgQ4],
                x = coords.x,
                y = coords.y
            });
        };
    } else {
        const vector = { x: canvas.mouse.x - canvas.mouse.prevX, y: canvas.mouse.y - canvas.mouse.prevY };
        ctx.drawImage(imgQ1, img.x + vector.x,               img.y + vector.y);
        ctx.drawImage(imgQ2, img.x + imgQ1.width + vector.x, img.y + vector.y);
        ctx.drawImage(imgQ3, img.x,                          img.y + imgQ1.height + vector.y);
        ctx.drawImage(imgQ4, img.x + imgQ1.width + vector.x, img.y + imgQ1.height + vector.y);

        canvas.quadrants.images.splice(imgIndex, 1, Object.assign(img, {
            drawn: true,
            x: img.x + vector.x,
            y: img.x + vector.y
        }));
    }

    if (parseInt(source + "00", 2) >= 2 ** (canvas.level + 1) * 2)
        draw(ctx, (parseInt(source, 2) - (2 ** (canvas.level + 1) / 2)).toString(2).padStart(source.length, 0),
            { x: img.x, y: img.y - img.height * 2 });

    if (true)
        draw(ctx, (parseInt(source, 2) + 4).toString(2).padStart(source.length, 0),
            { x: img.x + img.width * 2, y: img.y });

    if (parseInt(source + "00", 2) < 4 ** (canvas.level + 1) - 2 ** (canvas.level + 1) * 2)
        draw(ctx, (parseInt(source, 2) + (2 ** (canvas.level + 1) / 2)).toString(2).padStart(source.length, 0),
            { x: img.x, y: img.y + img.height * 2 });

    if (parseInt(source + "00", 2) % (2 ** (canvas.level + 1) * 2))
        draw(ctx, (parseInt(source, 2) - 4).toString(2).padStart(source.length, 0),
            { x: img.x - img.width * 2, y: img.y });
};

const mouseMove = function(e) {
    canvas.mouse.x = e.clientX;
    canvas.mouse.y = e.clientY;

    console.log("Dragging: " + canvas.isDragging);

    if (canvas.isDragging) {
        draw(canvas.context);
    }

    canvas.mouse.prevX = e.clientX;
    canvas.mouse.prevY = e.clientY;
};

const mouseDown = function(e) {
    if (canvas.element === document.activeElement) {
        canvas.isDragging = true;
    }
};

const mouseUp = function(e) {
    canvas.isDragging = false;
};

const init = function() {
    canvas = {
        url: "http://localhost:5000/image/",
        element: document.getElementById("canvas"),
        get context() { return canvas.element.getContext("2d"); },
        isDragging: false,
    
        mouse: {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0
        },
    
        get boundary() { return canvas.element.getBoundingClientRect(); },
        vertex: {
            get a() { return { x: canvas.boundary.top + window.scrollY, y: canvas.boundary.left + window.scrollX }; },
            get b() { return { x: canvas.boundary.top + window.scrollY, y: canvas.boundary.right                 }; },
            get c() { return { x: canvas.boundary.bottom,               y: canvas.boundary.right                 }; },
            get d() { return { x: canvas.boundary.bottom,               y: canvas.boundary.left + window.scrollX }; }
        },

        level: 0,
        quadrants: {
            width: 0,
            height: 0,
            images: []
        
            /*{
                drawn: false,
                image: null,
                images: [],
                x: 0,
                y: 0
            }*/
        
        }
    };
    
    canvas.element.setAttribute("width",  500); // window.getComputedStyle(document.body).getPropertyValue("width"));
    canvas.element.setAttribute("height", 500); // window.getComputedStyle(document.body).getPropertyValue("height"));

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup",   mouseUp);
    document.addEventListener("mousedown", mouseDown);

    draw(canvas.context, "00");
};
