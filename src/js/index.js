/// <reference types="../@types/jquery" />

// loading screen
$(window).on("load", function () {
  $(".loading-screen").fadeOut(1000);
  $("body").removeClass("overflow-hidden");
});
// inner loading screen
function showingLoadingScreen() {
  $(".inner-loading-screen").removeClass("hidden");
  $("body").addClass("overflow-hidden");
}

function hiddingLoadingScreen() {
  $(".inner-loading-screen").addClass("hidden");
  $("body").removeClass("overflow-hidden");
}
//NAVBAR
$("#openBtn").on("click", function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  $("#openBtn").toggleClass("hidden");
  $("#closeBtn").toggleClass("hidden");
});
$("#closeBtn").on("click", function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  $("#closeBtn").toggleClass("hidden");
  $("#openBtn").toggleClass("hidden");
});
// search by Name related variables
let searchByName = $("#searchByName");
let searchByLetter = $("#searchByLetter");
let currentMeal;
// search by category related variables
let categories;
let currentCategoryName;
let mealsList;
// search by areas related variables
let areas;
let currentAreaName;
// search by ingredients related variables
let ingredients;

// search by letter
async function fetchByLetter(letter) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  let data = await response.json();
  mealsList = data.meals;
  console.log(mealsList);
}
searchByLetter.on("input", async function () {
  showingLoadingScreen();

  let mealLetter = searchByLetter.val();

  if (mealLetter.length !== 1) {
    hiddingLoadingScreen();
    return;
  }

  await fetchByLetter(mealLetter);

  if (mealsList == null) {
    mealLetter = "a";
    await fetchByLetter(mealLetter);
  }

  displayMeal(mealsList);
  hiddingLoadingScreen();
});

// search by name
$("#search").on("click", function () {
  $("#searchContainer").removeClass("hidden");
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
});
$("#search")
  .siblings()
  .on("click", function () {
    $("#searchContainer").addClass("hidden");
  });
searchByName.on("input", async function () {
  showingLoadingScreen();

  let mealName = searchByName.val();
  await fetchByName(mealName);
  if (mealsList != null) {
    displayMeal(mealsList);
    hiddingLoadingScreen();
  }
});

async function fetchByName(mealName) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );
  let data = await response.json();
  mealsList = data.meals;
}

// displaying default meals
async function defaultMeals() {
  await fetchByName("");
  displayMeal(mealsList);
}
defaultMeals();

function displayMeal(array) {
  let box = "";
  $("#dataRow").html(
    "<div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ' id='mealsGrid'></div>"
  );
  let counter = array.length;
  if (array.length > 20) {
    counter = 20;
  }
  for (let i = 0; i < counter; i++) {
    box += `
     <div class="meal group card">
  <img
    src="${array[i].strMealThumb}"
    alt="yrstur pie"
    class="w-full"
  />
  <div class="layer flex items-center">
    <h3 class="title text-titleSize">${array[i].strMeal}</h3>
  </div>
</div>
    
    `;
  }
  $("#mealsGrid").html(box);
}

// finding meals base on Categories
$("#category").on("click", async function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  showingLoadingScreen();

  await fetchByCategory();
  displayCategory();
  hiddingLoadingScreen();
});

async function fetchByCategory() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();
  categories = data.categories;
}

function displayCategory() {
  let box = "";
  $("#dataRow").html(
    "<div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ' id='mealsGrid'></div>"
  );
  categories.forEach((cat) => {
    box += `
    <div class="card  category group">
  <img
    src="${cat.strCategoryThumb}"
    alt="yrstur pie"
    class="w-full"
  />
  <div class="layer flex-col center p-2 text-center">
    <h3 class="title text-titleSize ">${cat.strCategory}</h3>
    <p>${cat.strCategoryDescription.split(" ").splice(0, 20).join(" ")}</p>
  </div>
</div>
`;
  });

  $("#mealsGrid").html(box);
}

$("#dataRow").on("click", ".category", async function (e) {
  showingLoadingScreen();

  currentCategoryName = $(e.currentTarget).find("h3").text();
  await fetchClickedItem("c", currentCategoryName);
  displayMeal(mealsList);
  hiddingLoadingScreen();
});

async function fetchClickedItem(letter, item) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${letter}=${item}`
  );
  let data = await response.json();
  mealsList = data.meals;
}
// display the instruction
///////////////
///////////////
///////////////
$("#dataRow").on("click", ".meal", async function (e) {
  showingLoadingScreen();

  currentMeal = $(e.currentTarget).find("h3").text();
  await fetchByName(currentMeal);

  displayInstruction();
  hiddingLoadingScreen();
});
function displayInstruction() {
  // Create a variable to store ingredients dynamically
  let ingredients = "";

  // Loop through the mealsList[0] object to find ingredient and measure pairs
  for (let i = 1; i <= 20; i++) {
    let ingredient = mealsList[0][`strIngredient${i}`];
    let measure = mealsList[0][`strMeasure${i}`];

    // Check if the ingredient exists and is not empty
    if (ingredient && ingredient.trim() !== "") {
      ingredients += `<span>${measure} ${ingredient}</span>`;
    }
  }

  let box = `
  <div
            class="grid w-[85%] mx-auto sm:grid-cols-1 md:grid-cols-[30%_minmax(0,1fr)] gap-6"
          >
            <div class="image-box">
              <img
                src="${mealsList[0].strMealThumb}"
                alt=""
                class="w-full rounded-md"
              />
              <h2 class="text-white text-[32px] font-medium image-box-title">
                ${mealsList[0].strMeal}
              </h2>
            </div>
            <div class="description text-white">
              <h2 class="mb-2 text-[32px] font-medium">Instructions</h2>
              <p class="mb-4">${mealsList[0].strInstructions}</p>
              <h3 class="text-titleSize">
                <span class="font-bold pe-2">Area:</span>${mealsList[0].strArea}
              </h3>
              <h3 class="text-titleSize">
                <span class="font-bold pe-2">Category:</span
                >${mealsList[0].strCategory}
              </h3>
              <h3 class="text-titleSize mb-2">
                <span class="font-bold pe-2">Recipes:</span>
              </h3>
              <div class="recipes mb-4 flex flex-wrap">
                <span>150ml Water</span>
                <span>1 tsp Sugar</span>
                <span>15g Yeast</span>
                <span>225g Plain Flour</span>
                <span>1 1/2 tsp Salt</span>
                <span>Drizzle Olive Oil</span>
                <span>80g Passata</span>
                <span>70g Mozzarella</span>
                <span>Peeled and Sliced Oregano</span>
                <span>Leaves Basil</span>
                <span>Pinch Black Pepper</span>
              </div>
              <h3 class="text-titleSize mb-3">
                <span class="font-bold pe-2">Tages:</span>
              </h3>
              <div class="buttons">
                <a
                  href="${mealsList[0].strSource}"
                  class="bg-green-600 hover:bg-green-700"
                  >Source</a
                >
                <a
                  href="${mealsList[0].strYoutube}"
                  class="bg-red-600 hover:bg-red-700"
                  >Youtube</a
                >
              </div>
            </div>
          </div>
  `;
  $("#dataRow").html(box);
}
////////////////////
////////////////////
////////////////////
////////////////////
// displaying meals base on area

// displaying areas on clicking the area link
$("#area").on("click", async function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  showingLoadingScreen();

  await fetchList();
  displayArea();
  hiddingLoadingScreen();
});
// displaying meals on clicking  certain area(country)
$("#dataRow").on("click", ".country", async function (e) {
  showingLoadingScreen();

  currentAreaName = $(e.currentTarget).find("h3").text();
  await fetchClickedItem("a", currentAreaName);
  displayMeal(mealsList);
  hiddingLoadingScreen();
});

async function fetchList() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();
  areas = data.meals;
}

function displayArea() {
  let box = "";
  $("#dataRow").html(
    "<div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ' id='mealsGrid'></div>"
  );
  areas.forEach((area) => {
    box += `
     <div class="country cursor-pointer">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3 class="title-country">${area.strArea}</h3>
          </div>
`;
  });

  $("#mealsGrid").html(box);
}

// dispalying meal based on ingredients
$("#ingredients").on("click", async function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  showingLoadingScreen();

  await fetchIngredients();
  displayIngredients();
  hiddingLoadingScreen();
});
$("#dataRow").on("click", ".ingredient", async function (e) {
  showingLoadingScreen();

  currentIngredient = $(e.currentTarget).find("h3").text();
  await fetchClickedItem("i", currentIngredient);
  displayMeal(mealsList);
  hiddingLoadingScreen();
});

async function fetchIngredients() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();
  ingredients = data.meals;
}
function displayIngredients() {
  let box = "";
  $("#dataRow").html(
    "<div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ' id='mealsGrid'></div>"
  );
  for (let i = 0; i < 20; i++) {
    box += `
   <div class="ingredient cursor-pointer text-white text-center">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3 class="title-country mb-2">${ingredients[i].strIngredient}</h3>
           <p">${ingredients[i].strDescription
             .split(" ")
             .splice(0, 20)
             .join(" ")}</p>
        </div>
`;
  }

  $("#mealsGrid").html(box);
}

// displaying contact

$("#contact").on("click", function () {
  $("#sideBarLayer").animate({ width: "toggle" }, 400);
  let box = `
   <form id="myForm" class="min-h-screen flex center flex-col">
            <div
              class="w-[75%] mx-auto grid gap-6 grid-cols-1 justify-center items-center content-center md:grid-cols-2"
            >
              <div>
                <input
                  id="name"
                  class="custom-input w-full border p-2"
                  type="text"
                  placeholder="Enter Your Name"
                />
                <p class="text-red-500 hidden"></p>
              </div>
              <div>
                <input
                  id="email"
                  class="custom-input w-full border p-2"
                  type="email"
                  placeholder="Enter Your Email"
                />
                <p class="text-red-500 hidden"></p>
              </div>
              <div>
                <input
                  id="phone"
                  class="custom-input w-full border p-2"
                  type="number"
                  placeholder="Enter Your Phone"
                />
                <p class="text-red-500 hidden"></p>
              </div>
              <div>
                <input
                  id="age"
                  class="custom-input w-full border p-2"
                  type="text"
                  placeholder="Enter Your Age"
                />
                <p class="text-red-500 hidden"></p>
              </div>
              <div>
                <input
                  id="password"
                  class="custom-input w-full border p-2"
                  type="password"
                  placeholder="Enter Your Password"
                />
                <p class="text-red-500 hidden"></p>
              </div>
              <div>
                <input
                  id="repassword"
                  class="custom-input w-full border p-2"
                  type="password"
                  placeholder="Repassword"
                />
                <p class="text-red-500 hidden"></p>
              </div>
            </div>
            <button
              id="submitButton"
              disabled
              class="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-2 py-[6px] mt-4 rounded center opacity-50"
            >
              Submit
            </button>
          </form>
  
  `;
  $("#dataRow").html(box);
});

// Contact validation
let form = $("#myForm");
let nameInput = $("#name");
let emailInput = $("#email");
let phoneInput = $("#phone");
let ageInput = $("#age");
let passwordInput = $("#password");
let repasswordInput = $("#repassword");
let submitButton = $("#submitButton");

let nameRegex = /^[A-Za-z ]{2,}$/;
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let phoneRegex = /^\d{10}$/;
let ageRegex = /^\d+$/;
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

function checkValidity() {
  let isValid = true;

  if (!nameRegex.test(nameInput.val())) {
    nameInput
      .next("p")
      .text("Please enter a valid name.")
      .removeClass("hidden");
    isValid = false;
  } else {
    nameInput.next("p").addClass("hidden");
  }

  if (!emailRegex.test(emailInput.val())) {
    emailInput
      .next("p")
      .text("Please enter a valid email.")
      .removeClass("hidden");
    isValid = false;
  } else {
    emailInput.next("p").addClass("hidden");
  }

  if (!phoneRegex.test(phoneInput.val())) {
    phoneInput
      .next("p")
      .text("Please enter a valid phone number.")
      .removeClass("hidden");
    isValid = false;
  } else {
    phoneInput.next("p").addClass("hidden");
  }

  if (!ageRegex.test(ageInput.val())) {
    ageInput.next("p").text("Please enter a valid age.").removeClass("hidden");
    isValid = false;
  } else {
    ageInput.next("p").addClass("hidden");
  }

  if (!passwordRegex.test(passwordInput.val())) {
    passwordInput
      .next("p")
      .text(
        "Password must be at least 6 characters long and include at least one letter and one number."
      )
      .removeClass("hidden");
    isValid = false;
  } else {
    passwordInput.next("p").addClass("hidden");
  }

  if (passwordInput.val() !== repasswordInput.val()) {
    repasswordInput
      .next("p")
      .text("Passwords do not match.")
      .removeClass("hidden");
    isValid = false;
  } else {
    repasswordInput.next("p").addClass("hidden");
  }

  if (isValid) {
    submitButton
      .prop("disabled", false)
      .removeClass("opacity-50")
      .addClass("opacity-100");
  } else {
    submitButton
      .prop("disabled", true)
      .removeClass("opacity-100")
      .addClass("opacity-50");
  }
}

nameInput.on("input", checkValidity);
emailInput.on("input", checkValidity);
phoneInput.on("input", checkValidity);
ageInput.on("input", checkValidity);
passwordInput.on("input", checkValidity);
repasswordInput.on("input", checkValidity);
