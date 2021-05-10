let lamps = [];
let srcs = [];

let index = 0;

let execer;

function setup() {
  const p = select("#p5container");
  // const cnv = createCanvas(p.width, p.height);
  const cnv = createCanvas(windowWidth, windowHeight - 100);
  cnv.parent('p5container');

  // background(20);

  lamps[0] = select('#lamp_0');
  lamps[1] = select('#lamp_1');
  lamps[2] = select('#lamp_2');
  lamps[3] = select('#lamp_3');

  srcs[0] = new SrcArea(0);
  srcs[1] = new SrcArea(1);
  srcs[2] = new SrcArea(2);
  srcs[3] = new SrcArea(3);

  execer = new Execer();
}

function draw() {
  if (frameCount % 60 == 0) {
    index++;
    if (index > 3) index = 0;

    for (let i = 0; i < lamps.length; i++) {
      if (i == index) {
        lamps[i].style('background-color', 'red');
        execer.t = 0;
        execer.codeObj = srcs[i].codeObj;
      }
      else lamps[i].style('background-color', 'white');
    }
  }
  execer.draw();
}

function keyReleased() {
}

class Execer {

  constructor() {
    this.codeObj = {};

    this.t = 0;

    this.x = 0.5;
    this.y = 0.5;
    this.z = 0.1;
  }
  // setup() {
  //   try {
  //     eval(this.setupCode);
  //     return true;
  //   }
  //   catch (err) {
  //     print(err);
  //     return err;
  //   }
  // }
  draw() {
    this.x = this.tryEval(this.codeObj.x, this.x);
    this.y = this.tryEval(this.codeObj.y, this.y);
    this.z = this.tryEval(this.codeObj.z, this.z);

    const r = int(this.x);
    const g = int(this.y);
    const b = int(this.z);

    background(255);
    noStroke();
    fill(r, g, b);
    circle(this.x % 1 * width, this.y % 1 * height, this.z % 1 * width); // z todo
    this.t += 1 / 59;
  }

  tryEval(code, currVal) {
    const t = this.t;
    const a = 0;//volume
    const x = this.x;
    const y = this.y;
    const z = this.z;

    try {
      const value = eval(code);
      if (value) return value;
      return currVal;
    }
    catch (err) {
      print(err);
      return currVal;
    }
  }
}

const sampleCode = [
  't',
  '128 - t',
  'noise(t/2)',
  'sin(t*PI)',
  'int(noise(t*2)*255) + 0.5',
  'x',
  'y',
  'int(z**2) + .5'
];

class SrcArea {

  constructor(id) {
    this.id = id;
    this.codeObj = {};
    this.lamp = select('#lamp_' + id);

    this.createMyInput('x', 'editor_' + id);
    this.createMyInput('y', 'editor_' + id);
    this.createMyInput('z', 'editor_' + id);
  }
  createMyInput(key, parentName) {
    const _t = this;
    const defaultCode = random(sampleCode);
    this.codeObj[key] = defaultCode;

    const div = createDiv('').parent(parentName);
    createSpan(key + "=").parent(div);
    createInput(defaultCode).parent(div).input(function () {
      _t.codeObj[key] = this.value();
    });

  }

}