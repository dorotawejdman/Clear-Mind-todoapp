document.querySelector('#theme-btn').addEventListener('click', ()=>{
    document.querySelector('html').classList.add('dark');
    console.log(document.documentElement.style);

    document.documentElement.style.setProperty("$bg-beige", "#bd0b0b");
})