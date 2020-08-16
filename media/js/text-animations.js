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

// window.addEventListener('mousemove', event => {
//     bg = document.getElementsByClassName('night-bg');
//     if (bg.length>0){
//         bg = bg[0];
//     }
//     else {
//         return;
//     }

//     mouseXpercentage = Math.round(event.offsetX / window.innerWidth * 100);
//     mouseYpercentage = Math.round(event.offsetY / window.innerHeight * 100);

//     bg.style.background = 'radial-gradient(circle at ' + mouseXpercentage + '% ' + mouseYpercentage + '%, white, #000712)'
// });

// var toggle_height = 300;
// var prev = !(window.scrollY >= toggle_height);
// window.addEventListener('scroll', function() {
//     // console.log(window.scrollY);
//     current = window.scrollY >= toggle_height;
//     if (current == prev){
//         body = document.getElementsByTagName('body')[0];
//         body.classList.toggle('night-bg');
//     }
//     // console.log(prev,current)
//     prev = !current;
// });