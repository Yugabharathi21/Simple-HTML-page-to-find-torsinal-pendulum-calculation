const PI = 3.14;

class Pendulum {
    constructor() {
        this.l = 0;
        this.t1 = 0;
        this.t2 = 0;
        this.tmean = 0;
        this.time = 0;
        this.ltsq = 0;
    }
}

class Reading {
    constructor() {
        this.psr = 0;
        this.hsc = 0;
        this.or = 0;
        this.cr = 0;
    }
}

function createPendulumInputs(n) {
    const pendulumInputs = document.getElementById('pendulumInputs');
    pendulumInputs.innerHTML = '';

    for (let i = 0; i < n; i++) {
        pendulumInputs.innerHTML += `
            <h3>Observation ${i + 1}</h3>
            <label>Length:</label>
            <input type="number" step="any" name="length${i}" required><br><br>
            <label>Time Trial - I:</label>
            <input type="number" step="any" name="time1_${i}" required><br><br>
            <label>Time Trial - II:</label>
            <input type="number" step="any" name="time2_${i}" required><br><br>
        `;
    }
}

function createReadingInputs(n) {
    const readingInputs = document.getElementById('readingInputs');
    readingInputs.innerHTML = '';

    for (let i = 0; i < n; i++) {
        readingInputs.innerHTML += `
            <h3>Reading ${i + 1}</h3>
            <label>P.S.R.:</label>
            <input type="number" step="any" name="psr${i}" required><br><br>
            <label>H.S.C.:</label>
            <input type="number" step="any" name="hsc${i}" required><br><br>
        `;
    }
}

document.getElementById('observations').addEventListener('change', function() {
    createPendulumInputs(this.value);
});

document.getElementById('readings').addEventListener('change', function() {
    createReadingInputs(this.value);
});

function main() {
    const form = document.getElementById('pendulumForm');
    const output = document.getElementById('output');
    let holder = 0;
    let n = parseInt(form.observations.value);
    const o = new Array(n).fill(0).map(() => new Pendulum());

    for (let i = 0; i < n; i++) {
        o[i].l = parseFloat(form[`length${i}`].value);
        o[i].t1 = parseFloat(form[`time1_${i}`].value);
        o[i].t2 = parseFloat(form[`time2_${i}`].value);
        o[i].tmean = (o[i].t1 + o[i].t2) / 2;
        o[i].time = o[i].tmean / 10;
        o[i].ltsq = (o[i].l * Math.pow(10, -3)) / (o[i].time * o[i].time);
        holder += o[i].ltsq;
    }

    const meanh = holder / n;
    const lc = 0.01;
    let ze = parseFloat(form.zeroError.value);
    let zc = -ze * 1 / 100;

    let N = parseInt(form.readings.value);
    const r = new Array(N).fill(0).map(() => new Reading());
    let meanholder = 0;

    for (let i = 0; i < N; i++) {
        r[i].psr = parseFloat(form[`psr${i}`].value) * Math.pow(10, -3);
        r[i].hsc = parseFloat(form[`hsc${i}`].value);
        r[i].or = r[i].psr + (r[i].hsc * lc);
        r[i].cr = r[i].or + zc;
        meanholder += r[i].cr;
    }

    const readholder = meanholder / N;
    const rad = (readholder / 2) * Math.pow(10, -3);
    const mass = 0.97;
    const radius = 0.47 / 6.28;
    const I = (mass * (radius * radius)) / 2;
    const rgd = (8 * PI * I) / (rad * rad * rad * rad) * meanh;
    const exp = Math.log10(rgd);

    output.textContent = `Mean of (L/T*T) : ${meanh}\n`;
    output.textContent += `The Zero Correction is ${zc}\n`;
    output.textContent += `Mean of C.R. : ${readholder}\n`;
    output.textContent += `Mean radius of the wire : ${rad}\n`;
    output.textContent += `Mass of the pendulum: 970g or 0.97kg\n`;
    output.textContent += `Radius of the pendulum: ${radius}\n`;
    output.textContent += `Moment of Inertia : ${I}\n`;
    output.textContent += `Rigidity of the given material : ${rgd / Math.pow(10, exp)} x 10^${exp + 1}\n`;
}
