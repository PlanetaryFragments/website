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
var is_on_header = false;

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


window.addEventListener('scroll',()=>{
    title = document.getElementById('title-container');     // get the title object

    let activation_height = title.dataset.activation_height/100 * window.innerHeight;
    let deactivation_height = title.dataset.deactivation_height/100 * window.innerHeight;
    let delta_height = deactivation_height - activation_height;
    let scroll = window.scrollY-activation_height

    scroll = (scroll < 0 ? 0 : (scroll/delta_height > 1 ? 1 : scroll/delta_height)) * animate.duration;

    const render = () => {
        animate.seek(scroll);
    }

    requestAnimationFrame(render);

    // console.log(window.scrollY,is_on_header);

});

//////////////////////////////////////////////////////////////////////////
// Subtitle reveal animation /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////