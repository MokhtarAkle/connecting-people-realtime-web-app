// const input = document.querySelector("#big-search-bar");

// const options = {
//   bounds: defaultBounds,
//   componentRestrictions: { country: "nl" },
//   fields: ["address_components", "geometry", "icon", "name"],
//   strictBounds: false,
// };
// const autocomplete = new google.maps.places.Autocomplete(input, options);
// google.maps.event.addListener(autocomplete, 'place_changed', function () {
//   const place = autocomplete.getPlace();

//   markers = [];

//   const icon = {
//     url: place.icon,
//     size: new google.maps.Size(71, 71),
//     origin: new google.maps.Point(0, 0),
//     anchor: new google.maps.Point(17, 34),
//     scaledSize: new google.maps.Size(25, 25),
//   };

//   markers.push(
//     new google.maps.Marker({
//       map,
//       icon,
//       title: place.name,
//       position: place.geometry.location,
//     })
//   );
//   map.setCenter(place.geometry.location);
//   map.setZoom(12);
//   if(listAnimation.classList.contains("animation-hidden")){

//   }
//   else{
//     listAnimation.classList.toggle("animation-hidden");
//     listAnimation.classList.remove("animation-visible");
//     buttonSlide.classList.toggle("side-out-flip");
//   };
// });

// function populate(usedArray){
//   for (let i = 0; i < usedArray.length; i++){
//     populateName[i].textContent = usedArray[i].name;
//     populateLocation[i].textContent = usedArray[i].location + ", " + usedArray[i].town;
//     populateSize[i].textContent = usedArray[i].size;
//     populateUse[i].textContent = usedArray[i].utilization;
//     populateFunction[i].textContent = usedArray[i].function + " | " + "\r\n" + usedArray[i].function1 + " | " +  usedArray[i].function2 ;
//     listInformation[i].style.display = "block";
//     if(parseInt(usedArray[i].utilization) < 50){
//       populateUse[i].classList.add("lowFill");
//     }
//     else if(parseInt(usedArray[i].utilization) > 50 && parseInt(usedArray[i].utilization) < 75){
//       populateUse[i].classList.add("mediumFill");
//     }
//     else if(parseInt(usedArray[i].utilization) > 75){
//       populateUse[i].classList.add("highFill");
//     }

//     if(usedArray[i].function1 == " "){
//       populateFunction[i].textContent = usedArray[i].function
//     }
//     else if(usedArray[i].function2 == " "){
//       populateFunction[i].textContent = usedArray[i].function + " | "  + "\r\n" + usedArray[i].function1
//     }
//   }
// }

// function depopulate(){
//   for (let i = 0; i < populateName.length; i++){
//     populateName[i].textContent = " ";
//     populateLocation[i].textContent = " ";
//     populateSize[i].textContent = " ";
//     populateUse[i].textContent = " ";
//     populateFunction[i].textContent = " ";
//     listInformation[i].style.display = "none";
//     populateUse[i].classList.remove("lowFill", "mediumFill", "highFill");
//   }
// }

// function depopDynamic(){
//   for (let i = 0; i < dynamicFill.length; i++){
//     dynamicFill[i].textContent = " ";
//     dynamicFill[i].style.display = "none";
//   }
// }
// populate(smartzones);

// function initSort(){

//   sortSize.addEventListener("click", () =>{
//     sortSize.classList.toggle("sizeActive");
//     sortUse.classList.remove("useActive");
//     sortFunc.classList.remove("funcActive");
//     sortLoc.classList.remove("locActive");
//     smartzones.sort((a, b) => {
//   const sizeA = a.size.toUpperCase(); 
//   const sizeB = b.size.toUpperCase(); 
//   if (sizeA < sizeB) {
//   return -1;
//   }
//   if (sizeA > sizeB) {
//   return 1;
//   }
//   depopulate();
//   populate(smartzones);
//   return 0;
//   });
//   });

//   sortUse.addEventListener("click", () =>{
//     sortUse.classList.toggle("useActive");
//     sortSize.classList.remove("sizeActive");
//     sortFunc.classList.remove("funcActive");
//     sortLoc.classList.remove("locActive");
//     smartzones.sort((a, b) => {
//   const useA = a.utilization.toUpperCase(); 
//   const useB = b.utilization.toUpperCase(); 
//   if (useA < useB) {
//   return -1;
//   }
//   if (useA > useB) {
//   return 1;
//   }
//   depopulate();
//   populate(smartzones);
//   return 0;
//   });
//   });

//   sortFunc.addEventListener("click", () =>{
//     sortFunc.classList.toggle("funcActive");
//     sortSize.classList.remove("sizeActive");
//     sortUse.classList.remove("useActive");
//     sortLoc.classList.remove("locActive");
//     smartzones.sort((a, b) => {
//   const funcA = a.function.toUpperCase();
//   const funcB = b.function.toUpperCase();
//   if (funcA < funcB) {
//   return -1;
//   }
//   if (funcA > funcB) {
//   return 1;
//   }
//   depopulate();
//   populate(smartzones);
//   return 0;
//   });
//   });

//   sortLoc.addEventListener("click", () =>{
//     sortLoc.classList.toggle("locActive");
//     sortSize.classList.remove("sizeActive");
//     sortUse.classList.remove("useActive");
//     sortFunc.classList.remove("funcActive");
//     smartzones.sort((a, b) => {
//   const locA = a.town.toUpperCase();
//   const locB = b.town.toUpperCase();
//   if (locA < locB) {
//   return -1;
//   }
//   if (locA > locB) {
//   return 1;
//   }
//   depopulate();
//   populate(smartzones);
//   return 0;
//   });
//   });
// }
// initSort();
// function filterTest(){
  
//   for (let i = 0; i < checkboxes.length; i++){
//     checkboxes[i].addEventListener("change", () =>{
//       if(checkboxes[i].name == "filterLoc" && checkboxes[i].checked){
//         let locCheck = smartzones.filter(location => location.town == checkboxes[i].value);
//         depopulate();
//         populate(locCheck);
//         depopDynamic();
//         dynamicFill[i].textContent = checkboxes[i].value;
//         dynamicFill[i].style.display = "inline";
//       }
//       else if(checkboxes[i].name == "filterFunc" && checkboxes[i].checked){
//         let funcCheck = smartzones.filter(functionality => functionality.function == checkboxes[i].value);
//         console.log(checkboxes[i].value)
//         depopulate();
//         populate(funcCheck);
//         depopDynamic();
//         dynamicFill[i].textContent = checkboxes[i].value;
//         dynamicFill[i].style.display = "inline";
//       }
//       else if(checkboxes[i].name == "filterGrootte" && checkboxes[i].checked){
//         let sizeCheck = smartzones.filter(area => area.size == checkboxes[i].value);
//         depopulate();
//         populate(sizeCheck);
//         depopDynamic();
//         dynamicFill[i].textContent = checkboxes[i].value;
//         dynamicFill[i].style.display = "inline";
//       }
//       else if(checkboxes[i].name == "filterGebruik" && checkboxes[i].checked){
//         let usageCheck = smartzones.filter(usage => parseInt(usage.utilization) < parseInt(checkboxes[i].value));
//         depopulate();
//         populate(usageCheck);
//         depopDynamic();
//         dynamicFill[i].textContent = checkboxes[i].value;
//         dynamicFill[i].style.display = "inline";
//       }
//       else{
//         depopulate();
//         populate(smartzones);
//         depopDynamic();
//       }
//     });
//   }
//   }
//   filterTest();
// }

// function classToggle(element, class1, class2){
//   if(element.classList.contains(class1)){
//     element.classList.toggle(class2);
//     element.classList.remove(class1);
//   }
//   else{
//     element.classList.toggle(class2);
//     element.classList.add(class1);
//   }
// }

// searchForm.addEventListener('submit', preventSubmit);

// searchIcon.addEventListener("click", searchShow);

// <% for(let i = 0; i < smartzones.length; i++){ %>
//   <option value="<%= smartzones[i].id %>" name="smartzoneId"><%= smartzones[i].name %></option>
//   <% } %>


// function searchShow(){
//   if(searchBar.style.display === "none"){
//     searchBar.style.display = "block";
//   }
//   else{
//     searchBar.style.display = "none";
//   }
// }

