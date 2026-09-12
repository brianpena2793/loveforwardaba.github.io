const t=document.querySelector('.menu-toggle');const n=document.querySelector('.nav');if(t&&n)t.addEventListener('click',()=>n.classList.toggle('open')); const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});
