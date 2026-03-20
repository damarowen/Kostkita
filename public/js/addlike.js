function changeState() {


    //**use this to parse kost id in url address bar */
    const pathname = window.location.pathname; //kost/14124124
    const id = pathname.split('/')[2]; //124124214
    const url = `/kost/${id}/like`
    
    const btnLike = document.getElementById('btnLike');
    const btnUnlike = document.getElementById('btnUnlike');

    // btnLike True
    if (btnLike) {

        btnLike.setAttribute('class', 'btn btn-sm btn-success')
        // redefine inside button tag
        btnLike.innerHTML = "<span><i id=fas class=fas ></i></span> You Like This Post"
        // chang id to button unlike for next click
        btnLike.id = "btnUnlike"

    } else {
        btnUnlike.setAttribute('class', 'btn btn-sm btn-secondary')
        // redefine inside button tag
        btnUnlike.innerHTML = "<span><i id=fas class=fas ></i></span> Like"
        // chang id to button like for next click
        btnUnlike.id = "btnLike"
    }

    // insert logo thumbs up 
    const fas = document.getElementById('fas');
    fas.classList.add('fa-thumbs-up')

    // disable button to prevent rapid double clicks
    const activeBtn = btnLike || btnUnlike
    if (activeBtn) activeBtn.disabled = true

    // send http request to server and reload only after it completes
    axios({
        method: 'post',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(() => {
        // ensure server-side state is saved before reloading UI
        window.location.reload()
    })
    .catch((err) => {
        console.error(err)
        // fallback: reload to resync UI with server
        window.location.reload()
    })
    }

