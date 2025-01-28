const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear-on-scroll-show');
        } else {
            entry.target.classList.remove('appear-on-scroll-show')
        }
    });
});

const appearOnScroll = document.querySelectorAll(".appear-on-scroll");

appearOnScroll.forEach((element) => observer.observe(element));