document.addEventListener('DOMContentLoaded', function() {
    const talkCircle = document.querySelector('.talk-circle')
    const messageBox = document.querySelector('.message-box')

    // change message-box visibility
    talkCircle.addEventListener('click', function() {
        messageBox.classList.toggle('display')
    })
})