let slides = document.querySelectorAll('.slide');
let current = 0;

function nextSlide(){
    if(!slides || slides.length===0) return;
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
}

setInterval(nextSlide,4000);

function toggleMenu(){
    document.getElementById('navMenu').classList.toggle('show');
}
