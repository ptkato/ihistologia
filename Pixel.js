var canvas;

const draw = function(ctx, source) {
    const img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = source;
};

const dotProduct = function(U, V) {
    return U.x * V.x + U.y * V.y;
};

const mouseMove = function(e) {
    canvas.mouse.x = e.clientX;
    canvas.mouse.y = e.clientY;

    const AB = { x: canvas.vertex.b.x - canvas.vertex.a.x, y: canvas.vertex.b.y - canvas.vertex.a.y };
    const AM = { x: canvas.mouse.x    - canvas.vertex.a.x, y: canvas.mouse.y    - canvas.vertex.a.y };
    const BC = { x: canvas.vertex.c.x - canvas.vertex.b.x, y: canvas.vertex.c.y - canvas.vertex.b.y };
    const BM = { x: canvas.mouse.x    - canvas.vertex.b.x, y: canvas.mouse.y    - canvas.vertex.b.y };

    canvas.mouse.isInside = (0 <= dotProduct(AB, AM) && dotProduct(AB, AM) <= dotProduct(AB, AB))
                         && (0 <= dotProduct(BC, BM) && dotProduct(BC, BM) <= dotProduct(BC, BC));

    console.log("Dragging: " + canvas.isDragging);
    console.log("Inside: " + canvas.mouse.isInside);
}

const mouseDown = function(e) {
    canvas.isDragging = canvas.mouse.isInside;
};

const mouseUp = function(e) {
    canvas.isDragging = false;

};


const init = function() {
    canvas = {
        element: document.getElementById("canvas"),
        get context() { return canvas.element.getContext(); },
        isDragging: false,
    
        mouse: {
            isInside: false,
            x: 0,
            y: 0
        },
    
        get boundary() { return canvas.element.getBoundingClientRect(); },
        vertex: {
            get a() { return { x: canvas.boundary.top,    y: canvas.boundary.left  }; },
            get b() { return { x: canvas.boundary.top,    y: canvas.boundary.right }; },
            get c() { return { x: canvas.boundary.bottom, y: canvas.boundary.left  }; },
            get d() { return { x: canvas.boundary.bottom, y: canvas.boundary.right }; }
        }
    }

    canvas.element.setAttribute("width",  500);//window.getComputedStyle(document.body).getPropertyValue("width"));
    canvas.element.setAttribute("height", 500);//window.getComputedStyle(document.body).getPropertyValue("height"));

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup",   mouseUp);
    document.addEventListener("mousedown", mouseDown);
};