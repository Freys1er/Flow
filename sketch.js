p5.disableFriendlyErrors = true;

//VARS
let stage = "FLOW";
let choosen = null;
let points = [];
let s = 0;
let hold = 0;
let end = 0;
let total = 0;
let scroll = {
  pos: 0,
  velocity: 0,
};
let redirect = "HOME";
let cookies;

//FLASHCARDS
let h = {
  keys: [],
  titles: [],
  names: [],
  r: [],
  scroll: [],
  menu: false,
  recent: [],
};
let file;
let shift = 0;
let index = 0;
let wait = false;
let ans = false;
let streak = 0;
let qanda = 0;
let start = 0;
let search = "";
let glide = {
  info: 0,
  up: true,
};
//NOTES
let notes = {
  progress: 1,
  len: 0,
  next: 0,
  count: 0,
};

let data = {};
function preload() {
  data.flow = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1737979596&single=true&output=csv",
    "header",
    "csv"
  );
  data.colors = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=875058641&single=true&output=csv",
    "header",
    "csv"
  );
}

function contains(a, b) {
  // Convert both strings to lowercase
  let lowerA = a.toLowerCase();
  let lowerB = b.toLowerCase();

  // Remove special characters from both strings
  let cleanedA = lowerA.replace(/[^a-z0-9]/gi, '');
  let cleanedB = lowerB.replace(/[^a-z0-9]/gi, '');

  // Check if the cleaned string a contains the cleaned string b
  return cleanedA.includes(cleanedB);
}

//filters
function filtersets(term) {
  if (!term){
    term = '';
  }
  sets = [];
  for (let i = 0;i<data.flow.length;i++){
    if (contains(data.flow[i].join(""),term)){
      sets.push(data.flow[i]);
    }
  }
}

function mouseWheel(event) {
  scroll.pos -= event.delta;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  s = min([width, height]) / 500;
}

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);

  data = {
    flow: data.flow.getArray(),
    colors: data.colors,
  };

  glide.info = (height / 5) * 2;

  s = min([width, height]) / 500;

  type = createInput();
  type.style("background-color", color(0, 0, 0, 0));
  type.style("border-color", color(0, 0, 0, 0));
  type.style("color", color(0, 0, 0, 0));
  type.value(" ");

  //DATA WRANGLING - FLAHSCARDS
  for (let i = 0; i < data.flow.length; i++) {
    total += data.flow[i][3].split("#").length;
  }

  filtersets();
}
//FUNCTIONS
function todate(x) {
  x = x.split(" ")[0].split("/");
  return (
    [
      "January",
      "Febuary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][int(x[0]) - 1] +
    " " +
    x[1] +
    ", " +
    x[2]
  );
}

function button(x, y, w, h) {
  return mouseX > x && mouseY > y && mouseX < x + width && mouseY < y + h;
}

//COLORS
function c(x) {
  if (data.colors.getColumn(x)[0]) {
    let list = split(data.colors.getColumn(x)[0], ",");
    return color(list[0], list[1], list[2]);
  } else {
    console.warn("Color '" + x + "' was not found, reverted to red");
    return color(255, 0, 0);
  }
}

//APPS
function shownotes(x) {
  background(c("Background"));
  x = x.split(/<|>/);
  if (mouseIsPressed) {
    scroll.velocity = pmouseY - mouseY;
    scroll.pos -= scroll.velocity;
    scroll.velocity *= 0.95;
  }
  if (scroll.pos < -notes.len) {
    notes.next = true;
    scroll.pos = -notes.len;
  }
  if (scroll.pos > 0) {
    scroll.pos = 0;
  }
  j = 0;
  fill(c("Text"));
  notes.count = 0;
  i = 1;
  push();
  translate(0, scroll.pos);
  while (notes.count < notes.progress && i < x.length) {
    if (x[i] === "H1") {
      textAlign(CENTER, TOP);
      textSize(s * 70);
      text(x[i + 1], 0, j, width, Infinity);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H2") {
      textAlign(CENTER, TOP);
      textSize(s * 50);
      text(x[i + 1], 0, j, width, Infinity);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H3") {
      textAlign(LEFT, TOP);
      textSize(s * 30);
      text(x[i + 1], width / 60, j, width, Infinity);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H4") {
      textAlign(LEFT, TOP);
      textSize(s * 20);
      text(x[i + 1], width / 60, j, width, Infinity);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "H5") {
      textAlign(LEFT, TOP);
      textSize(s * 15);
      text(x[i + 1], width / 60, j, width, Infinity);
      j += ceil(textWidth(x[i + 1]) / width) * textAscent() * 1.6;
    } else if (x[i] === "BR") {
      notes.name = x[i + 1];
      notes.count++;
      j += s * 30;
    }
    i += 2;
  }
  pop();
  notes.len = j - height * 0.7;

  if (notes.count > notes.progress) {
    notes.next = false;
    notes.progress = 1;
    stage = "FLOW";
    choosen = "";
    wait = true;
  }

  if (notes.next) {
    textSize(s * 30);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(c("Button"));
    rect(width / 30, (height / 10) * 9, width - width / 15, height / 12, 10);
    if (notes.progress * 2 < x.length) {
      fill(c("Background"));
      text(
        notes.name,
        width / 30,
        (height / 10) * 9,
        width - width / 15,
        height / 12
      );
      textStyle(NORMAL);
      if (
        button(
          width / 30,
          (height / 10) * 9,
          width - width / 15,
          height / 12
        ) &&
        hold === 1
      ) {
        notes.next = false;
        notes.progress++;
        if (notes.name === "DONE") {
          notes.next = false;
          notes.progress = 1;
          stage = "FLOW";
          choosen = "";
          wait = true;
        }
      }
    }
  }

  fill(c("Back"));
  noStroke();
  text("◄", s * 20, s * 20);
  if (hold === 1 && button(0, 0, s * 40, s * 40)) {
    notes.next = false;
    notes.progress = 1;
    stage = "FLOW";
    choosen = "";
    wait = true;
    scroll.pos = height / 3;
  }
}

function loading() {
  background(c("White"));

  noFill();
  strokeWeight(10);
  stroke(c("Blue"));
  arc(
    width / 2,
    height / 2,
    s * 50,
    s * 50,
    frameCount / 10,
    frameCount / 10 + 300 + sin(frameCount / 10)
  );

  if (frameCount > end) {
    stage = redirect;
  }
}

function saverecent() {
  for (let i = 0; i < h.recent.length; i++) {
    if (h.recent[i] === choosen) {
      h.recent.splice(i, 1);
    }
  }
  h.recent.splice(0, 0, choosen);
  storeItem("Recent_Sets", h.recent);
}

function flow() {
  background(c("Background"));
  if (search !== type.value()) {
    search = type.value();
    filtersets(search);
  }

  if (mouseIsPressed) {
    scroll.velocity = pmouseY - mouseY;
  }

  scroll.pos -= scroll.velocity;
  scroll.velocity *= 0.95;

  if (scroll.pos < -data.flow.length * height * 0.22 + height) {
    scroll.pos = -sets.length * height * 0.22 + height;
  }
  if (scroll.pos > height / 9) {
    scroll.pos = height / 9;
  }
  stroke(c("SetsStroke"));
  fill(c("Background"));
  strokeWeight(2);
  rect(
    width / 80,
    -height * 0.1 + scroll.pos,
    width - width / 40,
    height / 20,
    20
  );

  type.size(width - width / 40, height / 20);
  type.position(width / 80, -height * 0.1 + scroll.pos);

  textAlign(CENTER, CENTER);
  noStroke();
  fill(c("SetsText"));
  textSize(s * 20);
  text(
    type.value(),
    width / 80,
    -height * 0.1 + scroll.pos,
    width - width / 40,
    height / 20
  );
  if (type.value().length <= 1) {
    text(
      "Search " + total + " flashcards",
      width / 80,
      -height * 0.1 + scroll.pos,
      width - width / 40,
      height / 20
    );
  }
  noStroke();

  for (let i = 0; i < sets.length; i++) {
    fill(c("SetsFill"));
    stroke(c("SetsStroke"));

    rect(
      width / 80,
      i * height * 0.22 + scroll.pos - height / 40,
      width - width / 40,
      height * 0.19,
      20
    );

    noStroke();
    textSize(min(s * 50, (width / sets[i][2].length) * 2));
    fill(c("SetsText"));
    text(
      sets[i][2],
      width / 2,
      i * height * 0.22 + scroll.pos + height / 40
    );

    textSize(s * 30);
    if (sets[i][4] === "NOTES") {
      text("Notes", width / 2, i * height * 0.22 + scroll.pos + height / 30);
    } else {
      text(
        floor(sets[i][3].split("#").length / 2) + " flashcards",
        width / 2,
        i * height * 0.22 + scroll.pos + height / 10
      );
    }

    textSize(s * 15);

    text(
      sets[i][0],
      width / 4,
      i * height * 0.22 + scroll.pos + height / 7
    );
    text(
      sets[i][1],
      (width / 4) * 3,
      i * height * 0.22 + scroll.pos + height / 7
    );

    if (
      hold < 10 &&
      hold > 0 &&
      abs(pmouseX - mouseX) > abs(pmouseY - mouseY) &&
      !mouseIsPressed &&
      button(
        width / 80,
        i * height * 0.22 + scroll.pos - height / 40,
        width - width / 40,
        height * 0.19
      )
    ) {
      stage = sets[i][4];
      file = sets[i][3];
      choosen = sets[i][2];

      if (stage !== "NOTES") {
        file = file.split("#");
      }
      saverecent(choosen);
    }
  }
}

function flashcards() {
  fill(c("Background"));
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(s * 20);
  fill(c("SetsTitle"));
  noStroke();
  text(choosen.name, width / 2, height / 40);
  textSize(s * 25);
  if (ans) {
    text(file[0] + "\n\n\n" + file[1], shift * 3, 0, width, height);
  } else {
    text(file[0], shift * 3, 0, width, height);
  }
  strokeWeight(40 * s);
  stroke(
    lerpColor(c("Green"), c("Red"), map(streak, 0, file.length / 2, 1, 0))
  );
  line(0, height, map(streak, 0, file.length / 2, 0, width), height);

  if (hold > 0 && !wait) {
    shift += mouseX - pmouseX;
  } else {
    shift = 0;
  }
  if (!mouseIsPressed) {
    wait = false;
    //YES
    if (shift * 3 < -width / 4) {
      file.splice(file.length, 0, file[1]);
      file.splice(file.length, 0, file[0]);
      file.splice(0, 2);
      wait = true;
      ans = false;
      streak++;
    }
    //NO
    if (shift * 3 > width / 4) {
      if (!ans) {
        wait = true;
        ans = true;
      } else {
        file.splice(6, 0, file[1]);
        file.splice(6, 0, file[0]);
        file.splice(0, 2);
        wait = true;
        ans = false;
        streak = 0;
      }
    }
  }

  textAlign(LEFT, TOP);
  fill(c("Exit"));
  noStroke();
  rect(width / 80, height / 4, height / 120, height / 2, 20);
  if (mouseIsPressed && mouseX < width / 20) {
    stage = "EXIT-FLOW";
    wait = true;
  }
}

//INTERFACE
function draw() {
  textStyle(BOLD);
  textFont("Roboto");
  if (stage === "LOADING") {
    loading();
    type.hide();
  }
  if (stage === "FLOW") {
    flow();
    type.show();
  }
  if (stage === "FLASHCARDS") {
    flashcards();
    type.hide();
  }
  if (stage === "NOTES") {
    shownotes(file);
    type.hide();
  }

  if (stage === "EXIT-FLOW") {
    type.hide();
    flow();
    push();
    translate(mouseX, 0);
    flashcards();
    pop();
    if (hold === 0) {
      if (mouseX < width / 2) {
        stage = "FLASHCARDS";
      } else {
        stage = "FLOW";
      }
    }
  }

  if (mouseIsPressed) {
    hold++;
  } else {
    hold = 0;
    wait = false;
  }
}
