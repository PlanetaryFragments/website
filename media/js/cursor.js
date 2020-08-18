//////////////////////////////////////////////////////////////////////////
// Dynamically change the cursor type based on content ///////////////////
//////////////////////////////////////////////////////////////////////////

// define the position variables for the cursor
let clientX = -100;
let clientY = -100;
const cursor_tracker = document.querySelector('.cursor-tracker');   // This is an object for the cursor itself

// Now we are going to create a function to set our cursor varibles to the actual cursor
const init_cursor = () => {
    // Add a listener to the mouse move event so that to track the position of the cursor in realtime
    document.addEventListener("mousemove", e => {
        clientX = e.clientX;                                        // Obtain the position of the cursor X-value
        clientY = e.clientY;                                        // Obtain the position of the cursor Y-value
    });

    // We want to now move our cursor tracker div to the cursor's position
    // Apparently by using requestAnimation() we smooth performance, by asynchronously performing iterations
    const render = () => {
        cursor_tracker.style.transform = `translate(${clientX}px,${clientY}px)`; // Translate the cursor position
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};

init_cursor();  // Start the cursor tracking


// Outside canvas
let lastX = 0;                                  // Stores the last cursor position X
let lastY = 0;                                  // Stores the last cursor position Y
let is_stuck = false;                           // if the cursor is stuck hovering
let group, stuckX, stuckY, fillOuterCursor;     // global varibles initialised later

// Function that will do all the outer canvas animation
const init_canvas = () => {
    const canvas = document.querySelector('.cursor-canvas');    // Variable to store the canvas element
    const shape_bounds = {                                      // Dimensions of the canvas
        width: 75,
        height: 75
    };

    paper.setup(canvas);                    // Use the paper library to draw on the canvas with beautiful animations
    const stroke_color = 'rgba(0,0,0,1)';   // Set the color of the stroke
    const stroke_width = 2;                 // Width of the outer circle
    const segments = 8;                     // Number of points used to define the circle and its deformation
    const radius = 20;                      // Radius of circle in pixels
    const noise_scale = 150;                // Scale of the noise for when hovered
    const noise_range = 4;                  // Range of distortion (perlin noise)
    let is_noisy = false;                   // Flag to turn the noise on and off

    // Create the basic shape of the outer circle
    const polygon = new paper.Path.RegularPolygon(new paper.Point(0,0),segments,radius);
    polygon.strokeColor = stroke_color;   // Set stroke color
    polygon.strokeWidth = stroke_width;    // and width
    polygon.smooth();                       // This will use cubic spline interpolation to smooth the curve
    group = new paper.Group([polygon]);     // Create a group to animate the spline
    group.applyMatrix = false;

    const noise_objects = polygon.segments.map(() => new SimplexNoise());   // Noise objects
    let big_coordinates = [];                                               // The coordinates of the noise elements

    // This is a function to perform linear interpolation
    // It's going to be useful estimating the trailing dimentions of the cursor
    const lerp = (a,b,n) => { 
        return (1 - n)*a + n*b;
    };

    // and a map function, also useful for the same reason
    const map = (value, in_min, in_max, out_min, out_max) => {
        return (((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min);
    };


    // Now we are going to draw the surrounding circle
    // We are going to do it with 60fps! (apparently)
    paper.view.onFrame = event => {
        // If the cursor is not stuck hovering above something
        if (!is_stuck){
            lastX = lerp(lastX,clientX,0.2);                // Linearly interpolate the x coordinate
            lastY = lerp(lastY,clientY,0.2);                // Linearly interpolate the y coordinate
            group.position = new paper.Point(lastX,lastY);  // Draw the group at (lastX, lastY)
        }
        // If the cursor is stuck hovering above something
        else if (is_stuck) {
            lastX = lerp(lastX, stuckX, 0.2);
            lastY = lerp(lastY, stuckY, 0.2);
            group.position = new paper.Point(lastX,lastY);
        }

        // While it is stuck
        if (is_stuck && polygon.bounds.width < shape_bounds.width){
            polygon.scale(1.08);        // Scale the shape up
        }
        else if (!is_stuck && polygon.bounds > 30){
            // Remove the noise
            if (is_noisy){
                polygon.segments.forEach((segment,i) => {
                    segment.point.set(big_coordinates[i][0],big_coordinates[i][1]);
                });
                is_noisy = false;
                big_coordinates = [];
            }

            const scale_down = 0.92;
            polygon.scale(scale_down);
        }

        if (is_stuck && polygon.bounds.width >= shape_bounds.width){
            is_noisy = true;
            if (big_coordinates.length === 0){
                polygon.segments.forEach((segment,i)=>{
                    big_coordinates[i] = [segment.point.x,segment.point.y];
                });
            }

            // Add the noise on the polygon
            polygon.segments.forEach((segment,i) => {
                // Create the noise values
                const noiseX = noise_objects[i].noise2D(event.count/noise_scale,0); 
                const noiseY = noise_objects[i].noise2D(event.count/noise_scale,1); 

                // Make the noise in the predefined range
                const distortionX = map(noiseX, -1, 1, -noise_range, noise_range);
                const distortionY = map(noiseY, -1, 1, -noise_range, noise_range);

                // Apply the noise
                const newX = big_coordinates[i][0] + distortionX;
                const newY = big_coordinates[i][1] + distortionY;

                // set new (noisy) coodrindate of point
                segment.point.set(newX, newY);

                console.log(noiseX,noiseY);
            });
        };
        polygon.smooth();
    };
};

init_canvas();  // Draw the outer circle

// Manage hovering cursor transformations on hover

// Function to handle the shape change of the cursor 
const init_hovers = () => {

    // Create a function to detect the hover
    const handle_mouse_enter = e => {
        const item = e.currentTarget;                               // Get the element you are hovering above
        const item_box = item.getBoundingClientRect();              // Get the rectangle that bounds this element

        stuckX = Math.round(item_box.left + item_box.width/2);      // Set the stuck position of the citcle as the rectangle's center
        stuckY = Math.round(item_box.top + item_box.height/2);      // Set the stuck position of the citcle as the rectangle's center
        is_stuck = true;                                            // Update the flag to indicate the the cursor should not move
    };

    // Create another listener to ensure that the cursor updates
    // when you leave the hovered element
    const handle_mouse_leave = () => {
        is_stuck = false                // Update the flag to indicate the the cursor can now move
    };

    // We now need to add our event listeners to our document
    const hoverable_items = document.querySelectorAll('.hoverable');        // Every item that can be hovered on in this way has a hoverable class on it
    hoverable_items.forEach(item => {
        item.addEventListener('mousenter', handle_mouse_enter);              // Add the listener for the entering event
        item.addEventListener('mouseleave',handle_mouse_leave);             // Add the listener for the exiting event
    });
};

init_hovers();      // Start the hovering madness!

