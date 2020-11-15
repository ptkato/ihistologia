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
}

const draw = function(ctx, source, coords) {
    if (!coords) {
        ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        coords = { x: 0, y: 0 };

        canvas.quadrants.images = canvas.quadrants.images.filter(i => {
            return isInside({ x: i.x,                 y: i.y                  })
                || isInside({ x: i.x + i.image.width, y: i.y                  })
                || isInside({ x: i.x + i.image.width, y: i.y + i.image.height })
                || isInside({ x: i.x,                 y: i.y + i.image.height });
        });
        canvas.quadrants.images.forEach(i => i.drawn = false);
    }

    const img = new Image();
    img.src = source;

    if (!img.naturalWidth) {
        img.onload = function() {
            ctx.drawImage(img, coords.x, coords.y);
            canvas.quadrants.images.push({
                drawn = true,
                image = img,
                x = coords.x,
                y = coords.y
            });
        };
    } else {
        canvas.quadrants.images.forEach(i => {
            if (!i.drawn) {
                const vector = { x: canvas.mouse.x - canvas.mouse.prevX, y: canvas.mouse.y - canvas.mouse.prevY };
                ctx.drawImage(img, i.x + vector.x, i.y + vector.y);
                i.drawn = true;
                // i.image = img;
                i.x += vector.x;
                i.y += vector.y;

                draw(ctx, "", { x: i.x,                 y: i.y - i.image.height });
                draw(ctx, "", { x: i.x + i.image.width, y: i.y                  });
                draw(ctx, "", { x: i.x,                 y: i.y + i.image.height });
                draw(ctx, "", { x: i.x - i.image.width, y: i.y                  });
            }
        });
    }

    canvas.quadrants.images.forEach(i => {
        draw(ctx, { x: i.image.width, y: i.image.height });
    });
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

    draw(canvas.context);
};
