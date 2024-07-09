document.addEventListener('DOMContentLoaded', function(){
    const button = document.querySelector(".searchBtn")
    const bar = document.querySelector(".searchBar")
    const input = document.getElementById("searchInput")
    const close = document.getElementById("searchClose")

    
    button.addEventListener('click', function(){
        bar.style.visibility = 'visible'
        bar.classList.add('open')
        this.setAttribute('aria-expanded' , 'true')
        input.focus()
    })

    close.addEventListener('click', function(){
        bar.style.visibility = 'hidden'
        bar.classList.remove('open')
        this.setAttribute('aria-expanded' , 'false')
    })
})