'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarheight = navbar.getBoundingClientRect().height;

document.addEventListener('scroll',()=>{
  // console.log(window.scrollY);
  // console.log(`navbarheight : ${navbarheight}`);
  if(window.scrollY > navbarheight){
    navbar.classList.add('navbar-dark');
  } else{
    navbar.classList.remove('navbar-dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event)=>{
  const target = event.target;
  const link = target.dataset.link;
  if(link == null){
    return;
  }
  navbarMenu.classList.remove('open');
  // console.log(event.target.dataset.link);
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar_toggle-btn');
navbarToggleBtn.addEventListener('click',() =>{
  navbarMenu.classList.toggle('open');
});

// HAndle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click',()=>{
  scrollIntoView('#contact');
});

// 모든 섹션 요소를 가져와 IntersactionObserver를 이용
const sectionIds = [
  '#home', 
  '#about', 
  '#skills', 
  '#work',
  '#testimonials', 
  '#contact'
];
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => 
  document.querySelector(`[data-link="${id}"]`)
);
// console.log(sections);
// console.log(nevItems);

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected){
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
};

// 스크롤하는 중복되는 부분을 함수로 추출
//(보통 유틸리티 함수는 제일 밑으로 내려주지만 나는 공부를 위해 제자리에 두었당)
function scrollIntoView(selector){
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({behavior : "smooth"});
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold:0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting && entry.intersectionRatio > 0){
      // console.log(entry);
      const index = sectionIds.indexOf(`#${entry.target.id}`);

      // console.log(index, entry.target.id );
      if(entry.boundingClientRect.y < 0){
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }

      //함수로 만들었음
      // selectedNavItem.classList.remove('active');
      // selectedNavItem = navItems[selectedIndex];
      // selectedNavItem.classList.add('active');
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', ()=>{
  if(window.scrollY === 0){
    selectedNavIndex = 0;
  } else if(window.scrollY + window.innerHeight === document.body.clientHeight){
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll',()=>{
  home.style.opacity = 1 - window.scrollY / homeHeight

});

//Show "arrow up button when scrolling down"
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll',()=>{
  if(window.scrollY > homeHeight/2){
    arrowUp.classList.add('visible');
  } else{
    arrowUp.classList.remove('visible');
  }
});

// Handle click on the "arrow up"button
arrowUp.addEventListener('click',()=>{
  scrollIntoView('#home');
});

//projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if(filter == null){
    return;
  }
  //remove selection from the previous item and selet the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target = 
    e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');


  projectContainer.classList.add('anim-out');
  setTimeout(() =>{
    // 아래코드를 따로 빼놓으면 이미 필터링된 후에 애니메이션이 작동되어 이상하다.
    // setTimeout() 안에 넣음으로써 0.3초뒤에 코드를 실행해준다
    projects.forEach((project) => {
      console.log(project.dataset.type);
      if(filter === '*' || filter === project.dataset.type){
        project.classList.remove('invisible');
      } else{
        project.classList.add('invisible');
      }
    });

    projectContainer.classList.remove('anim-out');
  }, 300);
/*  
  아래 세개의 반복문은 같은거다!

  projects.forEach((project) => {
    console.log(project);
  });

  for(let project of projects){
    console.log(project);
  }

  let project;
  for(let i = 0; i <projects.length; i++){
    project = projects[i];
    console.log(project);
  }
*/
});
