var hotelName = localStorage.getItem('selectedHotel');
const hotel = document.getElementById('hotel');
const hero = document.getElementById('hero');
const about = document.getElementById('about');
const address = document.getElementById('hotel-address-list');
const pricing = document.getElementById('hotel-pricing-list');
const imageGrid = document.getElementById('image-grid');

var hotelObj = data.find(hotel => hotel.name === hotelName);

function createHotelUI(){
  createHero();
  createAbout();
  addHotelAddress();
  addPrices();
  createImageGrid();
}

function createHero(){
  let img = document.createElement('img');
  img.classList.add('hero-image');
  img.setAttribute('src', hotelObj.images[0]);
  let heroHeading = document.createElement('h2');
  heroHeading.innerText = hotelObj.name;
  heroHeading.classList.add('hero-heading');
  hero.append(img, heroHeading);
}

function createAbout(){
  let p = document.createElement('p');
  p.innerText = hotelObj.hotelDetails;
  about.append(p);
}

function addHotelAddress(){
  for(let i in hotelObj.info){
    let li = document.createElement('p');
    li.innerText = `${i.toUpperCase()}: ${hotelObj.info[i]}`;
    address.append(li);
  }
}

function addPrices(){
  for(let i in hotelObj.prices){
    let li = document.createElement('p');
    li.innerText = `${i}: ₹ ${hotelObj.prices[i]}`;
    pricing.append(li);
  }
}

function createImageGrid(){
  hotelObj.images.forEach(image => {
    let img = document.createElement('img');
    img.setAttribute('src', image);
    img.classList.add('hotel-image');
    imageGrid.append(img);
  })
}

createHotelUI();