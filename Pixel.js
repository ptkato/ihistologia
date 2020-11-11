var canvas = {};

const draw = function(ctx, source, coords) {
    ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
    const img = new Image();
    img.src = source;

    if (!img.naturalWidth) {
        img.onload = function() {
            ctx.drawImage(img, coords.x, coords.y);
            canvas.fragments.images.x = coords.x;
            canvas.fragments.images.y = coords.y;
        };
    } else {
        const vector = { x: canvas.mouse.x - canvas.mouse.prevX, y: canvas.mouse.y - canvas.mouse.prevY };
        ctx.drawImage(img, canvas.fragments.images.x + vector.x, canvas.fragments.images.y + vector.y);
        canvas.fragments.images.x += vector.x;
        canvas.fragments.images.y += vector.y;
    }
    canvas.fragments.images.image = img;
};

// const dotProduct = function(U, V) {
//     return U.x * V.x + U.y * V.y;
// };

const mouseMove = function(e) {
    canvas.mouse.x = e.clientX;
    canvas.mouse.y = e.clientY;

    // const AB = { x: canvas.vertex.b.x - canvas.vertex.a.x, y: canvas.vertex.b.y - canvas.vertex.a.y };
    // const AM = { x: canvas.mouse.x    - canvas.vertex.a.x, y: canvas.mouse.y    - canvas.vertex.a.y };
    // const BC = { x: canvas.vertex.c.x - canvas.vertex.b.x, y: canvas.vertex.c.y - canvas.vertex.b.y };
    // const BM = { x: canvas.mouse.x    - canvas.vertex.b.x, y: canvas.mouse.y    - canvas.vertex.b.y };

    // canvas.mouse.isInside = (0 <= dotProduct(AB, AM) && dotProduct(AB, AM) <= dotProduct(AB, AB))
    //                      && (0 <= dotProduct(BC, BM) && dotProduct(BC, BM) <= dotProduct(BC, BC));

    console.log("Dragging: " + canvas.isDragging);
    // console.log("Inside: " + canvas.mouse.isInside);

    if (canvas.isDragging) {
        draw(canvas.context, "https://snippets.cdn.mozilla.net/media/icons/56efef37-8e21-49df-9699-df9ae2c8a088.png", canvas.mouse);
    }

    canvas.mouse.prevX = e.clientX;
    canvas.mouse.prevY = e.clientY;
};

const mouseDown = function(e) {
    // if (canvas.mouse.isInside) {
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
            // isInside: false,
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0
        },
    
        // get boundary() { return canvas.element.getBoundingClientRect(); },
        // vertex: {
        //     get a() { return { x: canvas.boundary.top + window.scrollY, y: canvas.boundary.left + window.scrollX }; },
        //     get b() { return { x: canvas.boundary.top + window.scrollY, y: canvas.boundary.right                 }; },
        //     get c() { return { x: canvas.boundary.bottom,               y: canvas.boundary.right                 }; },
        //     get d() { return { x: canvas.boundary.bottom,               y: canvas.boundary.left + window.scrollX }; }
        // }

        fragments: {
            width: 0,
            height: 0,
            images: // []
        
            {
                image: null,
                x: 0,
                y: 0
            }
        
        }
    };
    
    canvas.element.setAttribute("width",  500); // window.getComputedStyle(document.body).getPropertyValue("width"));
    canvas.element.setAttribute("height", 500); // window.getComputedStyle(document.body).getPropertyValue("height"));

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup",   mouseUp);
    document.addEventListener("mousedown", mouseDown);
};
