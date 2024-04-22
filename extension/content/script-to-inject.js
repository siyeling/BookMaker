document.addEventListener("run_js", function(e) {
    console.log(e);
    let script = document.createElement('script')
    script.textContent = e.detail
    document.body.appendChild(script)
    document.body.removeChild(script)
});