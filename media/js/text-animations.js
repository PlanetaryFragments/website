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
// Subtitle reveal animation /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////