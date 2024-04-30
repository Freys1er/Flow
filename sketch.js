//Notes

//

//VARIABLES
let theme = {
  network: "Blue",
  navbar: "Blue",
  clock: "Analogue",
};

let stage = "FLOW";
let choosen = null;
let points = [];
let dark = true;
let s = 0;
let hold = 0;
let end = 0;
let sets = [];
let total = [];
let scroll = 0;
let redirect = "HOME";

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
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ0JHVAqwYCw7f0qTELagJOXXB38bihDE94NdtY8F4-qQFvGJV2ATjHeE_d4ovCvn9DXJ2VbPB-mFI/pub?gid=1160900751&single=true&output=csv",
    "header",
    "csv"
  );
  data.auth = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1955007359&single=true&output=csv",
    "header",
    "csv"
  );
}

//MORE SETUp
function filtersets(term) {
  h.recent = getItem("Recent_Sets");
  if (!h.recent) {
    h.recent = [];
  }
  h.keys = [];
  h.titles = ["CONTINUE STUDYING"];
  h.names = [h.recent];
  h.r = [];
  h.colors = [];

  for (let i = 0; i < data.flow.length; i++) {
    if (data.flow[i].join("").indexOf(term) > -1) {
      x = data.flow[i][2].toUpperCase().split(" ");
      for (let j = 0; j < x.length; j++) {
        if (h.keys.indexOf(x[j]) === -1) {
          h.keys.push(x[j]);
          h.r.push([]);
        }
        h.r[h.keys.indexOf(x[j])].push(data.flow[i][2]);
      }
    }
  }

  for (let i = 100; i > 0; i--) {
    for (let j = 0; j < h.keys.length; j++) {
      if (h.r[j].length === i && h.keys[j].length > 2) {
        h.titles.push(h.keys[j]);
        h.names.push(h.r[j]);
        h.scroll.push(s * 50);
      }
    }
  }
}
function hashMessage(message) {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    // Get the ASCII value of each character
    const charCode = message.charCodeAt(i);
    // Combine the character codes
    hash = (hash << 5) - hash + charCode;
  }
  // Ensure the hash is positive
  return str(Math.abs(hash));
}

function mouseWheel(event) {
  scroll -= event.delta;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  s = min([width, height]) / 500;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  data = {
    flow: data.flow.getArray(),
    colors: data.colors,
    auth: data.auth.getArray(),
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
    sets.push(data.flow[i][2]);
    total.push(data.flow[i][3].split("#").length);
  }

  filtersets();

  //BACKGROUND ANIMATION
  for (let i = 0; i < 20; i++) {
    points.push([random(width), random(height), random(-1, 1), random(-1, 1)]);
  }
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
function animation() {
  strokeWeight(2);
  for (let i = 0; i < points.length; i++) {
    points[i][0] += points[i][2] / 10;
    points[i][1] += points[i][3] / 10;

    if (points[i][0] > width || points[i][0] < 0) {
      points[i][2] = -points[i][2];
    }
    if (points[i][1] > height || points[i][1] < 0) {
      points[i][3] = -points[i][3];
    }
  }

  // Draw lines between nearby points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i][0], points[i][1], points[j][0], points[j][1]);
      stroke(
        lerpColor(color(0, 0, 0, 0), c(theme.network), map(d, 0, s * 300, 1, 0))
      );
      line(points[i][0], points[i][1], points[j][0], points[j][1]);
    }
  }
}
function button(x, y, w, h) {
  return mouseX > x && mouseY > y && mouseX < x + width && mouseY < y + h;
}

//COLORS
function c(x) {
  if (dark) {
    i = 1;
  } else {
    i = 0;
  }
  let list = split(data.colors.getColumn(x)[i], ",");
  return color(list[0], list[1], list[2]);
}

//APPS
function shownotes(x) {
  background(c("Background"));
  x = x.split(/<|>/);
  if (mouseIsPressed) {
    scroll -= pmouseY - mouseY;
  }
  if (scroll < -notes.len) {
    notes.next = true;
    scroll = -notes.len;
  }
  if (scroll > 0) {
    scroll = 0;
  }
  j = 0;
  fill(c("Inverse"));
  notes.count = 0;
  i = 1;
  push();
  translate(0, scroll);
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

  if (notes.next) {
    textSize(s * 30);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    fill(c("Inverse"));
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

  fill(c("Inverse"));
  noStroke();
  text("◄", s * 20, s * 20);
  if (hold === 1 && button(0, 0, s * 40, s * 40)) {
    notes.next = false;
    notes.progress = 1;
    stage = "FLOW";
    choosen = "";
    wait = true;
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
  animation();
  if (search !== type.value()) {
    search = type.value();
    filtersets(search);
  }

  fill(c("Inverse"));
  textSize(s * 20);
  text(
    floor(total.reduce((a, b) => a + b) - 10000 / (frameCount - start) / 10) +
      " flashcards and counting...",
    width / 2,
    height / 40
  );

  if (abs(mouseX - pmouseX) < abs(mouseY - pmouseY) && mouseIsPressed) {
    scroll -= pmouseY - mouseY;
  }
  if (scroll > height / 3) {
    scroll = height / 3;
  }
  if (scroll < -s * 170 * h.titles.length + height / 2) {
    scroll = -s * 170 * h.titles.length + height / 2;
  }

  stroke(c("Grey"));
  noFill();
  strokeWeight(2);
  rect(s * 20, scroll - height / 3.5, width - s * 40, height / 5, 20);

  type.size(width - s * 40, height / 3);
  type.position(s * 20, scroll - height / 2.3);

  textAlign(CENTER, CENTER);
  noStroke();
  fill(c("Inverse"));
  textSize(s * 80);
  if (minute() < 10) {
    text(
      hour() + ":0" + minute(),
      s * 20,
      scroll - height / 3.5,
      width - s * 40,
      height / 5
    );
  } else {
    text(
      hour() + ":" + minute(),
      s * 20,
      scroll - height / 3.5,
      width - s * 40,
      height / 5
    );
  }
  textSize(s * 30);
  text(type.value(), s * 20, scroll - height / 3.2, width - s * 40, height / 3);

  textSize(s * 25);
  noStroke();

  for (let i = 0; i < h.titles.length; i++) {
    textAlign(LEFT, CENTER);
    fill(c("Inverse"));
    text(h.titles[i], s * 10, i * s * 170 + scroll - s * 30);
    for (let j = 0; j < h.names[i].length; j++) {
      fill(255, 255, 255, 30);
      strokeWeight(2);
      stroke(c("Grey"));
      if (choosen === h.names[i][j]) {
        fill(c("Inverse"));
      }
      rect(
        j * s * 220 + h.scroll[i],
        i * s * 170 + scroll,
        s * 190,
        s * 100,
        20
      );
      noStroke();

      if (
        glide.info + 100 > (height / 5) * 2 &&
        hold > 0 &&
        hold < 10 &&
        button(
          j * s * 220 + h.scroll[i],
          i * s * 170 + scroll,
          s * 190,
          s * 100
        ) &&
        !mouseIsPressed
      ) {
        choosen = h.names[i][j];
        glide.up = false;
        glide.info = (height / 5) * 2;
      }

      textAlign(CENTER, CENTER);
      if (choosen === h.names[i][j]) {
        fill(c("Background"));
      } else {
        fill(c("Inverse"));
      }
      text(
        h.names[i][j],
        j * s * 220 + h.scroll[i],
        i * s * 170 + scroll,
        s * 180,
        s * 100
      );
    }
    if (
      mouseIsPressed &&
      mouseY > i * s * 170 + scroll &&
      mouseY < i * s * 170 + scroll + s * 170 &&
      abs(mouseX - pmouseX) > abs(mouseY - pmouseY)
    ) {
      h.scroll[i] += mouseX - pmouseX;
      if (h.scroll[i] < -h.names[i].length * s * 220 + s * 300) {
        h.scroll[i] = -h.names[i].length * s * 220 + s * 300;
      }
    }
    if (h.scroll[i] > s * 50) {
      h.scroll[i] = s * 50;
    }
  }
  if (choosen && stage !== "EXIT-FLOW") {
    for (let i = 0; i < data.flow.length; i++) {
      if (data.flow[i][2] === choosen) {
        stage = data.flow[i][4];
        file = data.flow[i][3];
      }
    }
    if (stage !== "NOTES") {
      file = file.split("#");
    }
    saverecent(choosen);
  }
}

function flashcards() {
  fill(c("Background"));
  rect(0, 0, width, height);
  animation();

  textAlign(CENTER, CENTER);
  textSize(s * 20);
  fill(c("Inverse"));
  noStroke();
  text(choosen, width / 2, height / 40);
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
  fill(c("Inverse"));
  noStroke();
  rect(width / 80, height / 4, width / 180, height / 2, 20);
  rect(width / 40, height / 4, width / 180, height / 2, 20);

  if (hold === 1 && mouseX < width / 20) {
    stage = "EXIT-FLOW";
    wait = true;
  }
}

function quiz(f) {
  background(c("Background"));

  fill(c("Grey"));
  rect(width / 20, height / 20, width - width / 10, height / 3, 20);

  fill(c("Inverse"));
  noStroke();
  rect(width / 80, height / 4, width / 180, height / 2, 20);
  rect(width / 40, height / 4, width / 180, height / 2, 20);
  if (hold === 1 && mouseX < width / 20) {
    stage = "EXIT-QUIZ";
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
  }
  if (stage === "QUIZ") {
    quiz(file);
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
        file = null;
        choosen = "";
        stage = "FLOW";
        glide.info = (height / 5) * 2;
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
