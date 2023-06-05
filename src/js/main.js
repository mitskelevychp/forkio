let btn = document.querySelector(".header__button");
console.log(btn)
btn.addEventListener('click', change);
btn.addEventListener('click', toggleList)

function change (){
    if(document.querySelector('#span').className == "active"){
        document.querySelector('#span').classList.remove('active')
console.log("win1")
    }else{
        document.querySelector('#span').classList.add('active')
    }
    console.log("win2")
}

function toggleList(){
    if(document.querySelector('#span').className !== "active"){
        document.querySelector("#header__list").classList.remove('active')
console.log("list1")
    }else{
        document.querySelector("#header__list").classList.add('active')
        console.log("list2")
    }
}