// eslint-disable-next-line no-unused-vars
function selectOption(optionId) {
    // Remove 'selected' class from related labels
    let arr = optionId.split('-')
    let target = arr[1] 
    document.querySelectorAll(`.quiz-options-${target} div label`).forEach((label)  =>  label.classList.remove('selected'))
    // Add 'selected' class to the clicked label
    document.querySelector((`label[for="${optionId}"]`)).classList.add('selected')
}