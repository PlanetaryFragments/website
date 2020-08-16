//////////////////////////////////////////////////////////////////////////
// Change background color with scroll ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// Functions to convert color codes from one to the other
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Absolute value
function abs(n){
    return n >= 0 ? n : -n;
}

// The acutal thing ///////////////////////////////////////////////////////
var target = document.getElementById('bg');                 // Get the target div form its id
var color1 = hexToRgb(target.dataset.color1);               // Get the initial color
var color2 = hexToRgb(target.dataset.color2);               // Get the final color
var accent_color = hexToRgb(target.dataset.accent_color);   // Get the accent Color
var trigger = target.dataset.trigger;                       // Get the percentage height from viewport that this transformation is triggered
var cursror_x = 0                                           // initial value for cursor
var cursror_y = 0                                           // initial value for cursor
var new_color = color1                                      // Initial color value 
var new_accent_color = color1                               // Initial color value

// Sets a radial gradient background between two colors with the ceter at (x,y)
function set_background_gradient(target,x,y,color_bg,color_acc){
    target.style.background = "radial-gradient(circle closest-side at "+x.toString()+"px "+y.toString()+"px, "+color_acc+", "+color_bg+")";
}

// Add an event listener for scroll on window
window.addEventListener('scroll', (event)=>{
    let y = (window.scrollY/window.innerHeight - trigger/100)*2;            // this value is 0 at the target percentage height of the page
    
    let progress = abs(y-0.5) <= 0.5 ? y : (y>1 ? 1 : 0);                   // this value is 0 before the target goes to 1 and then is 1 forever
   
    let new_r = Math.round((1 - progress)*color1.r + progress*color2.r);    // Change the red component
    let new_g = Math.round((1 - progress)*color1.g + progress*color2.g);    // Change the green component
    let new_b = Math.round((1 - progress)*color1.b + progress*color2.b);    // Change the blue component

    new_color = rgbToHex(new_r,new_g,new_b)                                 // Write a final color

    new_r = Math.round((1 - progress)*color1.r + progress*accent_color.r);  // Change the red component
    new_g = Math.round((1 - progress)*color1.g + progress*accent_color.g);  // Change the green component
    new_b = Math.round((1 - progress)*color1.b + progress*accent_color.b);  // Change the blue component

    new_accent_color = rgbToHex(new_r,new_g,new_b);                         // Write a final color

    set_background_gradient(target,cursror_x,cursror_y,new_color,new_accent_color);
});

// Add an event listener for mouse motion to follow the light
window.addEventListener('mousemove',(event)=>{
    cursror_x = event.clientX + window.scrollX;     // Update the position of the mouse on the global thingy
    cursror_y = event.clientY + window.scrollY;     // Update the position of the moise on the global thingy

    set_background_gradient(target,cursror_x,cursror_y,new_color,new_accent_color); // Set background 
});