"use strict"


// css and javascript example page
const exampleContainer = document.querySelector('.example-container');

exampleContainer.querySelectorAll('.circle').forEach(circle => {
  circle.addEventListener('click', () => {
    const circleColor = getComputedStyle(circle).background;

    if (getComputedStyle(document.body).background === circleColor) {
      document.body.style.background = '';
    } else {
      document.body.style.background = circleColor;
    }
  });
});
// page end
