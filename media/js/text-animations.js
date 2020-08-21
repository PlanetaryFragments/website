//////////////////////////////////////////////////////////////////////////
// Title reveal animation ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// Get all the titles from the page
var titles = document.getElementsByClassName('animated-title');

// For all the titles put each letter in a span.
for (var i=0;i<titles.length;i++){
    titles[i].innerHTML = titles[i].textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}

// Animate each span with anime
anime.timeline()
.add({
    targets: '.animated-title .letter', // All the elements with these classes will be selected
    translateX: [40,0],                 // Translation
    translateZ: 0,                  
    opacity: [0,1],                     // Opacity range
    easing: "easeOutExpo",              // Animation style
    duration: 1200,                     // Duration for each letter
    delay: (el, i) => 500 + 30 * i      // Delay for each leter i 
});


//////////////////////////////////////////////////////////////////////////
// Title motion at height ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

// Creae animations
// container animations
var animate = anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000,
    autoplay: false
}).add({
    targets: '#title-container',
    translateX: ['-50%','0%'],
    left: '10vw',
    top: '5vw',
},0).add({
    targets: '#title-container h1',
    fontSize: 20,
    color: '#fff'
},0).add({
    targets: '#title-container h3',
    opacity: [1,0],
    fontSize: 10
},0);

// Ad a listener for the scrolling motion
window.addEventListener('scroll',()=>{
    title = document.getElementById('title-container');                                     // Get the title object

    let activation_height = title.dataset.activation_height/100 * window.innerHeight;       // Height at which the thingy starts moving up
    let deactivation_height = title.dataset.deactivation_height/100 * window.innerHeight;   // Height where it should've stopped moving
    let delta_height = deactivation_height - activation_height;                             // The difference
    let scroll = window.scrollY-activation_height                                           // The actual height of the view-window relative to the page

    // We are going to change the scroll variable to be 0 before the activation_height, 1 after, and linear in between
    scroll = (scroll < 0 ? 0 : (scroll/delta_height > 1 ? 1 : scroll/delta_height)) * animate.duration;

    // This will assynchronouly perform the animation
    const render = () => {
        animate.seek(scroll);   // request the scroll frame of the animation to be performed
    }

    requestAnimationFrame(render);
});

//////////////////////////////////////////////////////////////////////////
// Typewriter effect  ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

var is_typing = false;      // Flag to set when to start typing

// recursive function to type the text
function type(text,element,speed,i=0) {
    if (i<text.length) {                                            // While we are not at the end of the text
        element.innerHTML += text.charAt(i);                        // Add to thte inner html of the element the next character
        i++;                                                        // increment our index
        setTimeout(function(){type(text,element,speed,i);},speed);  // Call the function again after a "speed" delay
    } else {
        return true;                                                // A flag to know when the typing action stops
    }
};

//recursive function to delete "number" characters from the end
function del(number, element,speed){
    if(number>0) {                                                          // While we haven't deleted "number" characters
        element.innerHTML = str.substring(0,element.innerHTML.length - 1)   // Delete the last character
        setTimeout(function(){del(number-1,element,speed);},speed);         // Call the function again ater a "speed" delay
    } else {
        return true;                                                        // A flag to know when the typing action stops
    }
};

// Now we need to apply this to all elements that are to be typed
var typewriters = document.getElementsByClassName('typewriter');    // Get all the typewriters from the document

for(let i=0;i<typewriters.length;i++){                              // For all the typewriters
    let typewriter = typewriters[i];                                // Hold the current writer
    let script = typewriter.dataset.script;                         // Get the the script for that typewriter

    // The script contains commands on how to write it, so we need to decode it.
    // The commands are in the form: {command <value>} with optional values
    /* 
    The commands are the following
       {type}:          Starts typing until another command is met
       {speed <value>}: Sets the speed of the writing
       {wait <value>}:  Waits for <value> ms
       {end}:           End the typing loop
       {del <value>}:   Delete <value characters>
    */
    let end_typing = false;     // Flag to know when to stop the recursive parsing of the file
    let typing_commands = [];   // This array will contain the command and text to be executed in sequence
    let last_end = -1;          // Varibale to store the last index in the string that a brace was found
    let instruction = 0         // Number of instructions so far

    while (!end_typing){        // While we haven't reached the end command
        // Detect the command in braces
        let brace_start = script.indexOf('{',last_end);                 // Find the next {
        let brace_end   = script.indexOf('}',brace_start);              // Find the next }
        let next_command = script.substring(brace_start+1,brace_end);   // Get whatever is inbetween these { }
        let value = -1;                                                 // Varibale to store the value if there is one
        let text = '';                                                  // Variable to store the text of the command if needed

        // If the command has a space in it, it means we should look for a value
        if (next_command.includes(' ')){
            let space_start = next_command.indexOf(' ');                        // Find the location of the space
            value = next_command.substring(space_start+1,end_command);          // Find the location of the next 
            next_command = next_command.substring(brace_start+1,space_start);   // Concat the command to just itself
        }

        // We now need to detect the text
        if (next_command == 'type'){
            let next_brace_start = script.indexOf('{',brace_end);       // Find the next brace
            text = script.substring(brace_end+1,next_brace_start);      // Update the text in between
        }

        // Create an new entry in the instruction sequence
        typing_commands[instruction] = [next_command,value,text];
        instruction+=1;

        end_typing = next_command == 'end';         // If you've reached the end change the flag appropriately.
    }
}

