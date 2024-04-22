//Notes

//

//VARIABLES
let theme = {
  network: "Blue",
  navbar: "Blue",
  clock: "Analogue",
};

let keys = [];
let account = "";
let stage = "HOME";

let points = [];
let colors;
let dark = true;
let raw;
let s = 0;
let email;
let hold = 0;
let end = 0;
let sets = [];
let total = [];
let scroll = 0;
let redirect = "HOME";

//FLASHCARDS
let file;
let shift = 0;
let index = 0;
let wait = false;
let ans = false;
let streak = 0;
let qanda = 0;
let start = 0;

//CHARTS
let charts = {
  assets: [],
  votes: [],
  data: [],
  values: [],
  show: [],
  dates: [],
};

//KEYS
let numpadOn = false;
let numbers = [];
let number;
let keymenu = {
  show: false,
};

//SETUP]
let data = {};
function preload() {
  data.delta = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=552341349&single=true&output=csv",
    "header",
    "csv"
  );
  data.flow = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1737979596&single=true&output=csv",
    "header",
    "csv"
  );
  data.crypto = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1106526394&single=true&output=csv",
    "header",
    "csv"
  );
  data.charts = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1341412256&single=true&output=csv",
    "header",
    "csv"
  );
  data.chat = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1030526539&single=true&output=csv",
    "header",
    "csv"
  );
  data.colors = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQ0JHVAqwYCw7f0qTELagJOXXB38bihDE94NdtY8F4-qQFvGJV2ATjHeE_d4ovCvn9DXJ2VbPB-mFI/pub?gid=1160900751&single=true&output=csv",
    "header",
    "csv"
  );
}

//MORE SETUp
function mouseWheel(event) {
  scroll -= event.delta;
}
function mouseDragged() {
  scroll -= pmouseY - mouseY;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  s = min([width, height]) / 500;

  email.size(width * 0.7, height / 12);
  email.position(width * 0.15, height / 2);
  email.style("background-color", color(0, 0, 0, 0));
  email.style("border-color", color(0, 0, 0, 0));
  email.style("color", color(0, 0, 0, 0));
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  data = {
    delta: data.delta.getArray(),
    flow: data.flow.getArray(),
    crypto: data.crypto.getArray(),
    charts: data.charts.getArray(),
    chat: data.chat.getArray(),
    colors: data.colors,
  };

  s = min([width, height]) / 500;
  //GET KEYS
  keys = getItem("KEYS");
  if (!keys) {
    keys = [];
  }
  //SIGN IN
  account = getItem("EMAIL");
  email = createInput();
  email.size(width * 0.7, height / 12);
  email.position(width * 0.15, height / 2);
  email.style("background-color", color(0, 0, 0, 0));
  email.style("border-color", color(0, 0, 0, 0));
  email.style("color", color(0, 0, 0, 0));
  email.hide();

  //COOKIES
  stage = getItem("PAGE");
  if (!stage) {
    stage = "HOME";
  }

  if (!account) {
    stage = "SIGN IN";
  }

  //DATA WRANGLING - FLAHSCARDS
  for (let i = 0; i < data.flow.length; i++) {
    sets.push(data.flow[i][2]);
    total.push(data.flow[i][3].split("#").length);
  }

  filtercharts(keys);

  //BACKGROUND ANIMATION
  for (let i = 0; i < 20; i++) {
    points.push([random(width), random(height), random(-1, 1), random(-1, 1)]);
  }
}
//FUNCTIONS
function numpad() {
  textSize(s * 50);
  for (let i = 0; i < 9; i++) {
    fill(lerpColor(c("White"), color(255, 255, 255, 0), 0.8));
    ellipse(
      ((i % 3) * width) / 4 + width / 4,
      (floor(i / 3) * height) / 7 + height / 2,
      s * 100,
      s * 100
    );
    fill(c("White"));
    text(
      i + 1,
      ((i % 3) * width) / 4 + width / 4,
      (floor(i / 3) * height) / 7 + height / 2
    );
  }
  for (let i = 0; i < 9; i++) {
    if (
      dist(
        ((i % 3) * width) / 4 + width / 4,
        (floor(i / 3) * height) / 7 + height / 2,
        mouseX,
        mouseY
      ) <
        s * 50 &&
      hold === 1
    ) {
      return i + 1;
    }
  }
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
function filtercharts(keys) {
  for (let i = 0; i < data.charts.length; i++) {
    if (
      data.charts[i][3] !== "" &&
      charts.assets.indexOf(data.charts[i][2]) === -1
    ) {
      a = false;
      if (data.charts[i][2].indexOf("-") === -1) {
        a = true;
      } else {
        for (let j = 0; j < keys.length; j++) {
          if (data.charts[i][2].split("-")[1] === keys[j]) {
            a = true;
          }
        }
      }
      if (a) {
        charts.assets.push(data.charts[i][2]);
        charts.votes.push(1);
      }
    } else {
      charts.votes[charts.assets.indexOf(data.charts[i][2])]++;
    }
  }

  charts.data = [];
  for (let i = 0; i < charts.assets.length; i++) {
    charts.data.push({ name: charts.assets[i], value: charts.votes[i] });
  }

  charts.data.sort((a, b) => b.value - a.value);
  charts.votes = [];
  charts.assets = [];

  for (let i = 0; i < charts.data.length; i++) {
    if (keys.length > 0 || charts.data[i].value > 1) {
      charts.assets.push(charts.data[i].name);
      charts.votes.push(charts.data[i].value);
    }
  }
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
//DYNAMIC MENU
function list(l, s, scr, l2) {
  textAlign(LEFT, CENTER);
  for (let i = 0; i < l.length; i++) {
    strokeWeight(2);
    stroke(
      lerpColor(
        c("Grey2"),
        color(0, 0, 0, 0),
        map(i * s + scr, -100, 100, 1, 0)
      )
    );
    line(width / 15, i * s + scr, width - width / 15, i * s + scr);

    textSize(s / 3);
    noStroke();
    fill(
      lerpColor(
        c("White"),
        color(0, 0, 0, 0),
        map(i * s + scr, -100, 100, 1, 0)
      )
    );
    text(l[i], width / 18, i * s + s / 2 + scr);
    if (l2) {
      text(l2[i], width - width / 4, i * s + s / 2 + scr);
    }

    textSize(s / 2);
    text(">", width - width / 8, i * s + s / 2 + scr);

    if (
      mouseY > i * s + scr &&
      mouseY < i * s + s + scr &&
      hold < 5 &&
      hold > 0 &&
      !mouseIsPressed &&
      !wait
    ) {
      return l[i];
    }
  }
}

//DYNAMIC NAVBAR
function navbar() {
  strokeWeight(2);
  stroke(c("White"));
  fill(lerpColor(c(theme.navbar), color(0, 0, 0), 0.8));
  rect(width / 40, (height / 10) * 9, width - width / 20, height / 12, 100);

  noStroke();
  fill(c("White"));
  textAlign(CENTER, CENTER);
  //UI
  textSize(90);
  text("⌂", map(3, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  textSize(70);
  text("🗄", map(2, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  text("⌥", map(5, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  textSize(60);
  text("🂡", map(1, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  textSize(50);
  text("✉", map(4, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);

  //BUTTONS
  if (
    button(
      map(0.5, 0, 6, width / 40, width - width / 20),
      (height / 10) * 9,
      map(1.5, 0, 6, width / 40, width - width / 20),
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "FLOW";
  }
  if (
    button(
      map(1.5, 0, 6, width / 40, width - width / 20),
      (height / 10) * 9,
      map(2.5, 0, 6, width / 40, width - width / 20),
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "CHARTS";
  }
  if (
    button(
      map(2.5, 0, 6, width / 40, width - width / 20),
      (height / 10) * 9,
      map(3.5, 0, 6, width / 40, width - width / 20),
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "HOME";
  }
  if (
    button(
      map(3.5, 0, 6, width / 40, width - width / 20),
      (height / 10) * 9,
      map(4.5, 0, 6, width / 40, width - width / 20),
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "CHATS";
  }
  if (
    button(
      map(4.5, 0, 6, width / 40, width - width / 20),
      (height / 10) * 9,
      map(5.5, 0, 6, width / 40, width - width / 20),
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "KEYS";
  }

  //Page changes
  if (
    button(width / 20, (height / 10) * 9, width - width / 20, height / 12) &&
    hold === 1
  ) {
    storeItem("PAGE", stage);
    scroll = 0;
    start = frameCount;
    wait = true;
  }
}

//APPS
function home() {
  background(c("Background"));
  animation();
  //CLOCK
  noStroke();

  fill(c("Inverse"));
  textSize(s * 160);
  textAlign(CENTER, TOP);
  if (minute() < 10) {
    text(hour() + ":0" + minute(), width / 2, height / 8);
  } else {
    text(hour() + ":" + minute(), width / 2, height / 8);
  }
  //LOG IN
  textSize(s * 20);
  text("Logged in as " + account, width / 2, height / 40);

  if (hold === 1 && mouseY < height / 20) {
    account = "";
    end = frameCount + 100;
    stage = "LOADING";
    redirect = "SIGN IN";
  }
  navbar();
}

function signin() {
  email.show();
  noStroke();
  background(lerpColor(c("Grey"), c("White"), 0.6));

  fill(c("White"));
  rect(width / 10, height / 10, width - width / 5, height - height / 5, 20);

  noFill();
  strokeWeight(1);
  stroke(c("Background"));
  rect(width * 0.15, height / 2, width * 0.7, height / 12, 10);

  noStroke();
  textAlign(LEFT, TOP);
  fill(c("Background"));
  textSize(s * 70);
  text("Sign in", width / 6, height / 6);

  textAlign(LEFT, CENTER);
  textSize(s * 30);
  text("To continue to Flow", width / 6, s * 80 + height / 5);

  textSize(s * 20);
  if (email.value() === "") {
    fill(c("Grey3"));
    text("Email or Username", width / 6, height / 1.83);
  } else {
    fill(c("Background"));
    text(email.value(), width / 6, height / 1.83);
  }
  if (email.value().length > 5) {
    fill(c("Blue"));
  } else {
    fill(c("Grey2"));
  }
  rect(
    width - width / 5 + width / 10 - s * 200,
    height - height / 4,
    s * 150,
    height / 12,
    90
  );

  textSize(s * 25);
  textAlign(CENTER, CENTER);
  fill(c("White"));
  textStyle(BOLD);
  text(
    "Continue",
    width - width / 5 + width / 10 - s * 200,
    height - height / 4 + s * 2,
    s * 150,
    height / 12
  );
  textStyle(NORMAL);

  if (
    email.value().length > 5 &&
    button(
      width - width / 5 + width / 10 - s * 200,
      height - height / 4,
      s * 150,
      height / 12
    ) &&
    hold === 1
  ) {
    stage = "LOADING";
    redirect = "HOME";
    account = email.value();
    email.hide();
    storeItem("EMAIL", account);
    end = frameCount + 100;
    email.hide();
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

function flow() {
  background(c("Background"));
  textSize(s * 20);
  text(
    floor(total.reduce((a, b) => a + b) - 10000 / (frameCount - start) / 10) +
      " flashcards and counting...",
    width / 2,
    height / 40
  );
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < (-height / 10) * sets.length + height / 2) {
    scroll = (-height / 10) * sets.length + height / 2;
  }
  choosen = list(sets, height / 10, scroll, total);
  if (choosen) {
    for (let i = 0; i < data.flow.length; i++) {
      if (data.flow[i][2] === choosen) {
        file = data.flow[i][3].split("#");
      }
    }
    stage = "FLASHCARDS";
  }
  navbar();
}

function flashcards() {
  fill(c("Background"));
  rect(0, 0, width, height);
  animation();

  textAlign(CENTER, CENTER);
  textSize(s * 20);
  fill(c("White"));
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
  fill(c("Grey4"));
  noStroke();
  rect(width / 80, height / 4, width / 180, height / 2, 20);
  rect(width / 40, height / 4, width / 180, height / 2, 20);

  if (hold === 1 && mouseX < width / 20) {
    stage = "EXIT-FLOW";
    wait = true;
  }
}

function leaderboards() {
  background(c("Background"));
  textSize(s * 20);
  text(
    floor(
      charts.votes.reduce((a, b) => a + b) - 1000 / (frameCount - start) / 10
    ) + " votes and counting...",
    width / 2,
    height / 40
  );
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < (-height / 10) * charts.assets.length + height / 2) {
    scroll = (-height / 10) * charts.assets.length + height / 2;
  }
  choosen = list(charts.assets, height / 10, scroll, charts.votes);
  if (choosen) {
    file = [];
    charts.date = "";
    charts.dates = [];
    charts.values = [];
    for (let i = 0; i < data.charts.length; i++) {
      if (data.charts[i][2] === choosen) {
        timestamp = data.charts[i][0].split(" ")[0];
        value = float(data.charts[i][3]);
        if (charts.date !== timestamp) {
          charts.date = timestamp;
          charts.values.push(value);
          charts.dates.push(charts.date);
        } else {
          charts.values[charts.values.length - 1] =
            (charts.values[charts.values.length - 1] + value) / 2;
        }
      }
    }
    stage = "CHART";
  }

  navbar();
}
function showchart() {
  fill(c("Background"));
  rect(0, 0, width, height);
  if (hold > 0) {
    scroll -= (pmouseX - mouseX) * 2;
  }
  if (scroll < 0) {
    scroll = 0;
  }
  if (scroll > ((charts.values.length - 1) * width) / 4) {
    scroll = ((charts.values.length - 1) * width) / 4;
  }
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < charts.values.length; i++) {
    if ((-i * width) / 4 + scroll + width / 2 > 0) {
      noStroke();
      fill(c("White"));
      textSize(s * 15);
      text(charts.dates[i], width / 2 + scroll + (-i * width) / 4, height / 7);

      stroke(c("Grey2"));
      line(
        width / 2 + scroll + (-i * width) / 4,
        height / 5,
        width / 2 + scroll + (-i * width) / 4,
        (height / 15) * 10 + height / 5
      );

      vertex(
        (-i * width) / 4 + scroll + width / 2,
        map(
          charts.values[i],
          10,
          0,
          height / 5,
          (10 * height) / 15 + height / 5
        )
      );
    }
  }
  strokeWeight(3);
  stroke(c("Green"));
  noFill();
  endShape();
  strokeWeight(1);
  stroke(c("Grey2"));
  fill(c("Inverse"));
  for (let i = 0; i <= 10; i++) {
    line(
      0,
      (i * height) / 15 + height / 5,
      width,
      (i * height) / 15 + height / 5
    );
    text(10 - i, width - 10, (i * height) / 15 + height / 5);
  }
  noStroke();
  textAlign(CENTER, CENTER);
  fill(c("White"));
  textSize(s * 25);
  text(choosen, width * 0.4975, height * 0.046);

  fill(c("Blue"));
  rect(width / 4, height - height / 8, width / 2, height / 12, 10);
  fill(c("Background"));
  text("VOTE", width / 2, height - height / 12);

  if (
    hold === 1 &&
    button(width / 4, height - height / 8, width / 2, height / 12)
  ) {
    window.location.replace(
      "https://docs.google.com/forms/d/e/1FAIpQLSdvtosvQ3nNgq-YKbzfVIuObONqYFKBPWyKndm7tlYN5LEGvQ/viewform?entry.1418346935=" +
        "" +
        "&entry.224164793=" +
        choosen
    );
  }

  fill(c("Grey4"));
  noStroke();
  rect(width / 80, height / 4, width / 180, height / 2, 20);
  rect(width / 40, height / 4, width / 180, height / 2, 20);

  if (hold === 1 && mouseX < width / 20) {
    stage = "EXIT-CHARTS";
    wait = true;
  }
}
//https://docs.google.com/forms/d/e/1FAIpQLSf2GFoVDodD4gTCUwFf2VYmwAi3ySxeVwcqHLl3rH0AD6pKIQ/viewform?usp=pp_url&entry.1118110704=CHAT NAME&entry.619223333=MESSAGE
function chats() {
  background(c("Background"));

  navbar();
}

function editkeys() {
  background(c("Background"));
  animation();
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < (-height / 10) * keys.length + height / 2) {
    scroll = (-height / 10) * keys.length + height / 2;
  }
  choosen = list(keys, height / 10, scroll);
  textAlign(CENTER, CENTER);
  textSize(s * 70);
  text("+", width - width / 14, height / 20);
  if (numpadOn) {
    number = numpad();
    if (number) {
      numbers.push(number);
    }
    fill(c("Grey4"));
    rect(width / 5, height / 5.5, width / 1.7, height / 8, 20);
    fill(c("White"));
    text(numbers.join(" "), width / 2, height / 4);
    if (numbers.length > 5) {
      keys.push(numbers.join(""));
      numbers = [];
      numpadOn = false;
      end = frameCount + 50;
      redirect = "KEYS";
      stage = "LOADING";
      storeItem("KEYS", keys);
      filtercharts(keys);
    }
  }
  if (
    dist(width - width / 14, height / 20, mouseX, mouseY) < s * 200 &&
    hold === 1
  ) {
    numpadOn = true;
  }
  if (choosen) {
    keymenu = {
      ky: choosen,
      show: true,
    };
    wait = true;
  }
  if (keymenu.show && !numpadOn) {
    fill(c("White"));
    rect(width / 4, height / 2 - height / 9, width / 2, height / 5, 20);

    fill(c("Red"));
    rect(width / 4 + 10, (height / 10) * 5, width / 2 - 20, height / 12, 20);

    textSize(s * 25);
    fill(c("Background"));
    text("DELETE", width / 2, (height / 10) * 5.4);

    textSize(s * 40);
    text(keymenu.ky, width / 2, (height / 10) * 4.5);

    if (hold === 1) {
      if (
        button(
          width / 4 + 10,
          (height / 10) * 5,
          width / 2 - 20,
          height / 12
        ) &&
        hold === 1
      ) {
        keys.splice(keys.indexOf(keymenu.ky), 1);
        storeItem("KEYS", keys);
        filtercharts(keys);
      }
      keymenu.show = false;
    }
  }
  navbar();
}
function showleader() {}

//INTERFACE
function draw() {
  textFont("Roboto");
  if (stage === "HOME") {
    home();
  }
  if (stage === "SIGN IN") {
    signin();
  }
  if (stage === "LOADING") {
    loading();
  }
  if (stage === "FLOW") {
    flow();
  }
  if (stage === "FLASHCARDS") {
    flashcards();
  }
  if (stage === "CHARTS") {
    leaderboards();
  }
  if (stage === "LEADERBOARD") {
    showleader();
  }
  if (stage === "CHART") {
    showchart();
  }
  if (stage === "CHATS") {
    chats();
  }
  if (stage === "KEYS") {
    editkeys();
  }

  //EXITS
  if (stage === "EXIT-FLOW") {
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
        stage = "FLOW";
      }
    }
  }
  if (stage === "EXIT-CHARTS") {
    leaderboards();
    push();
    translate(mouseX, 0);
    showchart();
    pop();
    if (hold === 0) {
      if (mouseX < width / 2) {
        stage = "CHART";
      } else {
        stage = "CHARTS";
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
