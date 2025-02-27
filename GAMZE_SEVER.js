(() => {
  //******SHORTCUTS
  const API_URL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/product.json";
  const PRODUCTS_KEY = "products";
  const FAVORITES = "favorites";
  let favoriteProducts = JSON.parse(localStorage.getItem(FAVORITES)) || [];

  ///*** USEFUL FUNCTIONS  ***/

  // get products
  const getProducts = async () => {
    let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY));

    // if no products in localStorage --> fetch from API
    if (!products) {
      try {
        const response = await fetch(API_URL);

        // if the response fails --> throw an error
        if (!response.ok) {
          throw new Error("Failed to get products from API");
        }

        // get the products from API
        products = await response.json();
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      } catch (error) {
        //  if the fetch fails
        console.error("Error fetching products:", error);

        // if error ---> set products as an empty array
        products = [];
      }
    }
    return products;
  };

  // checking is favorited
  const isProductFavorited = (id) => {
    return favoriteProducts.includes(id);
  };

  //color change favorite icon
  const setFavoriteState = (button, id) => {
    const heartIcon = button.querySelector(".heart-icon path");
    if (isProductFavorited(id)) {
      heartIcon.setAttribute("fill", "#193db0");
      heartIcon.setAttribute("stroke", "#193db0");
    } else {
      heartIcon.setAttribute("fill", "none");
      heartIcon.setAttribute("stroke", "#808080");
    }
  };

  // add/remove favorites
  function toggleFavorite(productId) {
    const index = favoriteProducts.indexOf(productId);

    if (index === -1) {
      // if not favorited add to favorite
      favoriteProducts.push(productId);
      console.log(`Product ${productId} added to favorites`);
    } else {
      // if favorited femove from favorites //
      favoriteProducts.splice(index, 1);
      console.log(`Product ${productId} removed from favorites`);
    }

    // save faroites to local storage
    localStorage.setItem(FAVORITES, JSON.stringify(favoriteProducts));
    //console.log("favorited products:", favoriteProducts);
  }

  const init = async () => {
    const products = await getProducts();
    buildHTML(products);
    buildCSS();
    setEvents(products);
  };

  // HTML
  const buildHTML = (products) => {
    const html = `
    
    <div class="carousel-box">
      <h2 class="carousel-title">You Might Also Like</h2>
      <div class="carousel-container">
        <div class="left-btn">&#9001;</div>
        <div class="carousel">
          <div class="product-container">
            ${products
              .map(
                (product) => `
                <div class="product-card">
                <div id="error-message" style="color: red; font-size: 16px; display: none;"></div>
                  <div class="product-image">
                    <a href="${product.url}" target="_blank">
                    <img src="${product.img}" alt="${product.name}" loading="lazy" />

                    </a>
                    <div class="like-btn" data-id="${product.id} ">
                      <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
                        <path d="M50 80s30-20 30-40c0-11-9-20-20-20-8 0-15 6-15 14 0-8-7-14-15-14-11 0-20 9-20 20 0 20 30 40 30 40z" fill="none" stroke="#ccc" stroke-width="4"/>
                      </svg>
                    </div>
                  </div>
                  <div class="product-information-box">
                    <div class="product-title">
                      <a href="${product.url}" target="_blank">${product.name}</a>
                    </div>
                    <div class="product-price">
                      <p>${product.price} TRY</p>
                    </div>
                  </div>
                </div>`
              )
              .join("")}
          </div>
        </div>
        <div class="right-btn">&#9002;</div>
      </div>
    </div>
    `;
    $(".product-detail").append(html);
  };

  ///// *EVENTS* /////

  const setEvents = () => {
    const productContainers = [
      ...document.querySelectorAll(".product-container"),
    ];
    const leftBtn = [...document.querySelectorAll(".left-btn")];
    const rightBtn = [...document.querySelectorAll(".right-btn")];
    const favoriteButtons = document.querySelectorAll(".like-btn");

    //****** LIKE BUTTON *******

    favoriteButtons.forEach((button) => {
      const productId = button.dataset.id;
      setFavoriteState(button, productId);
    });

    document.addEventListener("click", (event) => {
      if (event.target.closest(".like-btn")) {
        const button = event.target.closest(".like-btn");
        const productId = button.dataset.id;

        //console.log("like button clicked:", event);
        toggleFavorite(productId); // add/remove favorites
        setFavoriteState(button, productId); // update heart colo
      }
    });

    //****** SCROLL *******

    // function to scroll
    const handleScroll = (item, direction) => {
      const productCardWidth = item.querySelector(".product-card").offsetWidth;
      const maxScrollLeft = item.scrollWidth - item.offsetWidth + 20;
      //console.log(`scrolling to ${direction}`);

      if (direction === "right") {
        item.scrollLeft +=
          item.scrollLeft + productCardWidth >= maxScrollLeft
            ? productCardWidth * 0.5
            : productCardWidth;
      } else if (direction === "left") {
        item.scrollLeft -= productCardWidth;
      }
    };

    document.addEventListener("click", (event) => {
      const target = event.target;
      const productContainer = target.closest(".carousel-container");
      if (target.closest(".left-btn") || target.closest(".right-btn")) {
        const direction = target.closest(".left-btn") ? "left" : "right";
        //console.log(`${direction} button clicked`);
        handleScroll(productContainer, direction);
      }
    });

    productContainers.forEach((item, i) => {
      // right button event
      rightBtn[i].addEventListener("click", (event) => {
        console.log("Right button clicked:", event);
        handleScroll(item, "right");
      });

      // left button event
      leftBtn[i].addEventListener("click", (event) => {
        console.log("Left button clicked:", event);
        handleScroll(item, "left");
      });
    });

    // scroll with keyboard
    document.addEventListener("keydown", (event) => {
      const direction =
        event.key === "ArrowRight"
          ? "right"
          : event.key === "ArrowLeft"
          ? "left"
          : null;

      if (direction) {
        //console.log(`key pressed: ${direction}`);
        productContainers.forEach((item) => handleScroll(item, direction));
      }
    });
  };

  // styles
  const buildCSS = () => {
    const css = `
    body {
      font-family: "Open Sans", sans-serif;
      font-size: 15px;
      color: #555;
      box-sizing: border-box;
      background-color: #fbf9f8;
    }

    .carousel-box{
      background-color: #faf9f7;
      position: relative;
      display:flex;
      flex-direction:column;
     justify-content:start;
     padding:50px;
    }

    .carousel-container {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      scroll-snap-type: x mandatory;
      overflow-x: auto;
    }

    .carousel-title {
      color: #29323b;
      font-size: 32px;
      font-weight: lighter;
      padding-bottom: 30px;
      padding-left:80px; 
    }

    .carousel {
      display: flex;
      overflow-x: auto;
      scroll-behavior: smooth;
    }

    .product-container {
      display: flex;
      gap: 15px;
      overflow-x: auto;   
      scroll-behavior: smooth;
      position: relative;
      scroll-snap-type: x mandatory;
  }
  
  .product-container::-webkit-scrollbar {
    display: none;
  }


    .product-card {
     flex:none;
      text-align: center;
      background-color: white;
      padding-bottom:15px;
      position: relative;
      width: 14%;
      max-width:300px;
      min-width: 220px;
      transition: transform 0.3s ease;
      scroll-snap-align: start;
    }

    .product-image {
      position: relative;
    }
    .product-card img {
      width: 100%;
      height: auto;
    
    }
    .like-btn {
      cursor: pointer;
      position: absolute;
      top: 9px;
      right: 15px;
      width: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      border: solid 0.5px #b6b7b9;
      display: flex;
      justify-content: center;
      align-items: center;
      
    }

    .like-btn svg {
      overflow-clip-margin: content-box;
   
    }

   
    .like-btn:hover {
      background-color: #f1f1f1;
      border-color: #ccc;
    }

    .heart-icon.filled {
  fill: #193db0;
  stroke: #193db0;
}

.heart-icon.empty {
  fill: none;
  stroke: #ccc;
}    

.left-btn, .right-btn {
  position: relative;
  padding: 10px;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition:  transform 0.2s ease;
  font-size:50px;
  color:#808080;
}

.left-btn:hover, .right-btn:hover {
 font-weight:bolder;
}
.product-information-box{
  padding:5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1; 
}

a{
  text-decoration: none;
  color:inherit;
  font-weight: inherit;
}
.product-title{
  height:50px;  
  padding:10px;

  width:auto;
  text-align:start;
}
.product-title a{
  text-overflow: ellipsis;
  white-space: initial;
  display: flex;

  color: #555 ;
  font-size: 18px;
  text-align: left;
 
}

.product-price{
  color: #193db0;
font-size: 20px;
display: inline-block;
font-weight: bold;
}

@media only screen and (max-width: 991px)  {
    .product-card {
    

 
    }
    .carousel-box{
       padding:5px;
      }
 
}
@media only screen and (max-width: 400px)  {
    .carousel-title {
        color: #29323b;
        font-size: 28px;
        font-weight: lighter;
        padding-bottom: 10px;
        
      }
   
    .carousel-box{
       padding:0px;
      }
 
}



}
    `;
    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  init();
})();
