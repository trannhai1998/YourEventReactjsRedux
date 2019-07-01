document.addEventListener("DOMContentLoaded",function(){
var nut = document.querySelectorAll('div.nut ul li');
var slides = document.querySelectorAll('div.slide div');
for(var i = 0 ; i < nut.length; i++){
nut[i].addEventListener('click',function(){
    var nutnay = this;
    var vitrislide = 0;
    console.log(nutnay.previousElementSibling);
    for(var i = 0;nutnay = nutnay.previousElementSibling; vitrislide++){
        //chay den khi nutnay = nutnay thi dung.
        // chay xong lenh nay khi click vao nut ta lay dc vitrislide
    }
    for(var i = 0; i < slides.length; i++){
        slides[i].classList.remove('ra');
    }
    for(var i = 0; i < slides.length; i++){
        slides[vitrislide].classList.add('ra');
    }
})
}
},false)