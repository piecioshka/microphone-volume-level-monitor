// Copied from https://stackoverflow.com/a/52952907/1204375
async function listen(cb) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = function () {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (let i = 0; i < length; i++) {
            values += (array[i]);
        }

        const average = Math.round(values / length);
        cb(average);
    }
}

function updateBarIndicator(average) {
    const $el = document.querySelector('.indicator');
    $el.style.height = `${average}%`;
}

function updateTextIndicator(average) {
    const $el = document.querySelector('.percent');
    $el.textContent = `${average}%`;
}

function main() {
    listen((percent) => {
        updateBarIndicator(percent);
        updateTextIndicator(percent);
    });
}

main();
