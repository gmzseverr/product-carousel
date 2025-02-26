(() => {
  const init = () => {
    buildHTML();
    buildCSS();
    setEvents();
  };

  //HTML BODY
  const buildHTML = () => {
    const html = `

<div class="container">
    <h1 class="container-title" >You Might Also Like</h1>
    <div clas="carousel-container">
        <div class="left-btn">&#9001;</div>
                <div class="carousel">
                <div class="product-container">
                <div class="product-card"></div>


                </div>
        <div class="right-btn">&#9001;</div>
    </div>
                
            
                

</div>
        
                 

        `;

    $(".product-detail").append(html);
  };

  const buildCSS = () => {
    const css = `
            .container {
                background-color: red;
  
            }
            .container-title{
                color: #29323b;
                font-size: 32px;
                font-weight: lighter;
            }
            .carousel-container{
                background-color: green;
            }
            .carousel{
                background-color: gray;
            }
            .left-btn, .right-btn {
                display:flex;
                justify-content: center;
                cursor:pointer;
                font-size:50px;
            }
            .product-container{

            }
            .product-card{
                width:21rem;
                height:38rem;
                background-color:pink;
            }
        `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const setEvents = () => {
    $("").on("click", () => {
      console.log("clicked");
    });
  };

  init();
})();
