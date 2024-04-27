//Notes

//

//VARIABLES
let theme = {
  network: "Blue",
  navbar: "Blue",
  clock: "Analogue",
};

let keys = [];
let stage = "HOME";
let choosen = null;
let points = [];
let colors;
let dark = true;
let raw;
let s = 0;
let type;
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
};
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

//SIGN IN VARIABLES
let signinstage = 0;
let info = {
  email: "",
  password: "",
  stage: "EMAIL",
  incorrect: false,
};

//CHATS
let chat = {
  data: [],
  keys: [],
};
let messagebox;
let move = 0;
let messages;
let newchat = false;

//SETUP]
let data = {};
function preload() {
  data.flow = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1737979596&single=true&output=csv",
    "header",
    "csv"
  );
  data.people = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1330105403&single=true&output=csv",
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
  data.auth = loadTable(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSOMxqxDvZYRq4eCecjgaq49t28A5go4QuLUbf4meYu_ggtZvdpD3j2mr8gcRStObQO5gzkSOPjRPiI/pub?gid=1955007359&single=true&output=csv",
    "header",
    "csv"
  );
}

//MORE SETUp
function filtersets(x) {
  h.keys = [];
  h.titles = [];
  h.names = [];
  h.r = [];
  h.colors = [];

  for (let i = 0; i < data.flow.length; i++) {
    x = data.flow[i][2].toUpperCase().split(" ");
    for (let j = 0; j < x.length; j++) {
      if (h.keys.indexOf(x[j]) === -1) {
        h.keys.push(x[j]);
        h.r.push([]);
      }
      h.r[h.keys.indexOf(x[j])].push(data.flow[i][2]);
    }
  }

  for (let i = 100; i > 0; i--) {
    for (let j = 0; j < h.keys.length; j++) {
      if (h.r[j].length === i && h.keys[j].length > 2) {
        h.titles.push(h.keys[j]);
        h.names.push(h.r[j]);
        h.scroll.push(s * 50);
        h.colors.push(
          color(random(200, 255), random(200, 255), random(200, 255))
        );
      }
    }
  }
}
function shiftChar(inputString, amount) {
  let shiftedString = "";
  for (let i = 0; i < inputString.length; i++) {
    let charCode = inputString.charCodeAt(i);
    let shiftedCharCode = charCode - amount; // Shift the character code upward
    let shiftedChar = String.fromCharCode(shiftedCharCode);
    shiftedString += shiftedChar;
  }
  return shiftedString;
}
// Hash function for a given message
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

  type.size(width - 10, height - 10);
  type.position(0, 0);
  type.style("background-color", color(0, 0, 0, 0));
  type.style("border-color", color(0, 0, 0, 0));
  type.style("color", color(0, 0, 0, 0));

  messagebox.position(width / 40, (height / 10) * 9);
  messagebox.style("background-color", color(0, 0, 0, 0));
  messagebox.style("border-color", color(0, 0, 0, 0));
  messagebox.style("color", color(0, 0, 0, 0));
  messagebox.hide();
}
function setup() {
  createCanvas(windowWidth, windowHeight);

 textStyle(BOLD);
  
  data = {
    flow: data.flow.getArray(),
    people: data.people.getArray(),
    charts: data.charts.getArray(),
    chat: data.chat.getArray(),
    colors: data.colors,
    auth: data.auth.getArray(),
  };

  s = min([width, height]) / 500;
  //GET KEYS
  keys = getItem("KEYS");
  if (!keys) {
    keys = [];
  }
  //SIGN IN
  info = getItem("USER INFO");
  type = createInput();
  type.size(width - 10, height - 10);
  type.position(0, 0);
  type.style("background-color", color(0, 0, 0, 0));
  type.style("border-color", color(0, 0, 0, 0));
  type.style("color", color(0, 0, 0, 0));
  type.hide();

  messagebox = createInput();
  messagebox.size(width - width / 20, height / 12);
  messagebox.position(width / 40, (height / 10) * 9);
  messagebox.style("background-color", color(0, 0, 0, 0));
  messagebox.style("border-color", color(0, 0, 0, 0));
  messagebox.style("color", color(0, 0, 0, 0));
  messagebox.hide();

  //COOKIES
  stage = getItem("PAGE");
  if (!stage) {
    stage = "HOME";
  }

  if (!info) {
    info = {
      email: "",
      password: "",
      stage: "EMAIL",
      incorrect: false,
    };
    stage = "SIGN IN";
  }

  //DATA WRANGLING - FLAHSCARDS
  for (let i = 0; i < data.flow.length; i++) {
    sets.push(data.flow[i][2]);
    total.push(data.flow[i][3].split("#").length);
  }

  filtercharts(keys);

  filtersets();

  filterchats();

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
function filterchats() {
  chat = {
    data: [],
    keys: [],
  };
  for (let i = 0; i < keys.length; i++) {
    chat.data.push([]);
    chat.keys.push(keys[i]);
  }
  for (let i = 0; i < data.chat.length; i++) {
    if (data.chat[i][0] !== "") {
      decoded = shiftChar(data.chat[i][2], -5);
      chat.keyy = decoded.split("~")[1];
      chat.message = decoded.split("~")[0];
      if (
        keys.indexOf(chat.keyy) > -1 ||
        chat.keyy === info.email ||
        chat.keyy === "Public"
      ) {
        if (chat.keys.indexOf(chat.keyy) === -1) {
          chat.keys.push(chat.keyy);
          chat.data.push([]);
        }
        chat.message = {
          message: chat.message,
          time: data.chat[i][0],
          user: data.chat[i][1],
        };
        chat.data[chat.keys.indexOf(chat.keyy)].push(chat.message);
      }
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
  textSize(50);
  text("⌂", map(3, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  text("⨹", map(2, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  text("⌥", map(5, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  text("🂡", map(1, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);
  text("⎔", map(4, 0, 6, width / 40, width - width / 20), (height / 10) * 9.5);

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
  text("Logged in as " + info.email, width / 2, height / 40);

  if (hold === 1 && mouseY < height / 20) {
    info = {
      email: "",
      password: "",
      stage: "EMAIL",
    };
    end = frameCount + 100;
    stage = "LOADING";
    redirect = "SIGN IN";
  }
  navbar();
}

function signin() {
  type.show();
  noStroke();
  background("#fbfbfb");

  textSize(s * 30);
  noFill();
  strokeWeight(1);
  stroke(c("Background"));
  if (info.stage === "EMAIL") {
    rect(width * 0.05, height / 2 - height / 12, width * 0.9, height / 12, 10);
  } else if (info.stage === "NEW") {
    rect(width * 0.05, height / 2 - height / 12, width * 0.9, height / 12, 10);
  } else {
    rect(width * 0.05, height / 2 - height / 12, width * 0.9, height / 6, 10);
  }
  noStroke();
  textAlign(LEFT, CENTER);
  fill(c("Grey3"));
  if (info.email === "") {
    if (info.stage === "NEW") {
      text(
        "New Password",
        width * 0.1,
        height / 2 - height / 8.3,
        width * 0.9,
        height / 6
      );
    } else {
      text(
        "Google Email - GMail",
        width * 0.1,
        height / 2 - height / 8.3,
        width * 0.9,
        height / 6
      );
    }
  } else {
    text(
      info.email,
      width * 0.1,
      height / 2 - height / 8.3,
      width * 0.9,
      height / 6
    );
  }
  if (info.stage === "PASSWORD") {
    noFill();
    strokeWeight(1);
    stroke(c("Background"));
    line(width * 0.1, height / 2, width * 0.9, height / 2);
    noStroke();
    textAlign(LEFT, CENTER);
    fill(c("Grey3"));
    if (info.password === "") {
      text("Password", width * 0.1, height / 2, width * 0.9, height / 12);
    } else {
      textSize(s * 40);
      for (let i = 0; i < info.password.length; i++) {
        text(
          "•",
          width * 0.1 + i * s * 15,
          height / 2,
          width * 0.9,
          height / 12
        );
      }
    }
  }

  noStroke();
  textAlign(CENTER, CENTER);
  fill(c("Background"));
  textSize(s * 50);
  if (info.incorrect) {
    text(
      "Incorrect Password",
      width * 0.1,
      height / 6,
      width * 0.8,
      height / 5
    );
  } else if (info.stage === "NEW") {
    text("New Password", width * 0.1, height / 6, width * 0.8, height / 5);
  } else {
    text("Sign in with Flow", width * 0.1, height / 6, width * 0.8, height / 5);
  }

  fill(c("Blue"));
  textSize(s * 20);
  if (info.stage !== "NEW") {
    text(
      "Forgot password?",
      width / 4,
      height - height / 5,
      width / 2,
      height / 8
    );
  }
  if (
    hold === 1 &&
    button(width / 4, height - height / 5, width / 2, height / 8)
  ) {
    info.stage = "NEW";
  }
  //NEXT BUTTON - EMAIL
  if (info.stage === "EMAIL" && info.email.indexOf("@rrvsd.ca") > -1) {
    noFill();
    stroke(c("Grey3"));
    ellipse(width * 0.87, height / 2 - height / 25, s * 40, s * 40);

    fill(c("Background"));
    textSize(s * 30);
    text("➜", width * 0.87, height / 2 - height / 25);

    if (
      dist(width * 0.87, height / 2 - height / 25, mouseX, mouseY) < s * 30 &&
      hold === 1
    ) {
      info.stage = "PASSWORD";
      type.value("");
    }
  }
  if (info.stage === "NEW" && info.email.length > 5) {
    noFill();
    stroke(c("Grey3"));
    ellipse(width * 0.87, height / 2 - height / 25, s * 40, s * 40);

    fill(c("Background"));
    textSize(s * 30);
    text("➜", width * 0.87, height / 2 - height / 25);

    if (
      key === "Enter" ||
      (dist(width * 0.87, height / 2 - height / 25, mouseX, mouseY) < s * 30 &&
        hold === 1)
    ) {
      window.location.replace(
        "https://docs.google.com/forms/d/e/1FAIpQLSfkt1Z1Uu9T7M821tRA4chC0jo2MYskrAGCxBLWE7_uI3r6RQ/viewform?usp=pp_url&entry.2039879610=" +
          hashMessage(info.email)
      );
    }
  }
  //NEXT BUTTON - PASSWORD
  if (info.stage === "PASSWORD") {
    noFill();
    stroke(c("Grey3"));
    ellipse(width * 0.87, height / 2 + height / 25, s * 40, s * 40);

    fill(c("Background"));
    textSize(s * 30);
    text("➜", width * 0.87, height / 2 + height / 25);

    if (
      dist(width * 0.87, height / 2 + height / 25, mouseX, mouseY) < s * 30 &&
      hold === 1
    ) {
      info.stage = "DONE";
    }
  }

  if (info.stage === "PASSWORD") {
    info.password = type.value();
  }
  if (info.stage === "NEW" || info.stage === "EMAIL") {
    info.email = type.value();
  }

  if (info.stage === "DONE") {
    let password;
    for (let i = 0; i < data.auth.length; i++) {
      if (data.auth[i][1] === info.email) {
        password = data.auth[i][2];
      }
    }
    print(password);
    print(hashMessage(info.password));
    if (hashMessage(info.password) === password) {
      info.incorrect = false;
      stage = "LOADING";
      redirect = "HOME";
      storeItem("USER INFO", info);
      end = frameCount + 10;
      type.hide();
      info.stage = "EMAIL";
      type.value("");
    } else {
      info.incorrect = true;
      stage = "LOADING";
      redirect = "SIGN IN";
      end = frameCount + 100;
      info.stage = "EMAIL";
      type.value("");
    }
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
  animation();
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
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < -s * 170 * h.titles.length+height/2) {
    scroll = -s * 170 * h.titles.length+height/2;
  }

  for (let i = 0; i < h.titles.length; i++) {
    textAlign(LEFT, CENTER);
    fill(h.colors[i]);
    text(h.titles[i], s * 10, i * s * 170 + scroll - s * 30);
    for (let j = 0; j < h.names[i].length; j++) {
      fill(h.colors[i]);
      if (choosen === h.names[i][j]) {
        strokeWeight(s * 50);
        stroke(h.colors[i]);
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
        !wait &&
        !h.menu &&
        hold > 0 &&
        hold < 5 &&
        button(
          j * s * 220 + h.scroll[i],
          i * s * 170 + scroll,
          s * 190,
          s * 100
        ) &&
        !mouseIsPressed
      ) {
        choosen = h.names[i][j];
      }

      textAlign(CENTER, CENTER);
      fill(c("Background"));
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
    fill(c("Grey"));
    rect(0, (height / 5) * 3, width, height, 20);
    fill(c("Grey4"));
    rect(width / 10, (height / 5) * 3.1, width - width / 5, height / 60, 20);
    
    fill(c("Grey2"));
    rect(width/10, (height / 20) * 15, width-width/5, height/8,10);
    rect(width/10, (height / 20) * 18, width/2-width/8, height/15,10);
    rect(width/1.9, (height / 20) * 18, width/2-width/8, height/15,10);
    
    textAlign(CENTER,CENTER);
    textSize(s*30);
    fill(c("Background"));
    text(choosen,0, (height / 5) * 3, width, height/6);
    text("Flashcards",width/10, (height / 20) * 15, width-width/5, height/8);

    if (button(width/10, (height / 20) * 15, width-width/5, height/8) && hold===1) {
      for (let i = 0; i < data.flow.length; i++) {
        if (data.flow[i][2] === choosen) {
          file = data.flow[i][3].split("#");
        }
      }
      stage = "FLASHCARDS";
    }

    if (!button(0, (height / 5) * 3, width, height) && hold === 1) {
      choosen = null;
      wait = true;
    }
  } else {
    navbar();
  }
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
  if (hold>0){
    scroll -= pmouseY - mouseY;
  }
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

  len = charts.values.length;
  text(choosen, width / 2, height / 40);
  if (hold>0){
    scroll -= pmouseY - mouseY;
  }
  if (scroll < width / 4) {
    scroll = width / 4;
  }
  if (scroll > ((len - 2) * width) / 4) {
    scroll = ((len - 2) * width) / 4;
  }
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < len; i++) {
    if ((-i * width) / 4 + scroll + width / 2 > 0) {
      noStroke();
      fill(c("White"));
      textSize(s * 15);
      text(
        charts.dates[len - i],
        width / 2 + scroll + (-i * width) / 4,
        height / 7
      );

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
          charts.values[len - i],
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
    key === "Enter" ||
    (hold === 1 &&
      button(width / 4, height - height / 8, width / 2, height / 12))
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
function chats() {
  background(c("Background"));
  if (hold>0){
    scroll -= pmouseY - mouseY;
  }
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < (-height / 10) * chat.keys.length + height / 2) {
    scroll = (-height / 10) * chat.keys.length + height / 2;
  }
  choosen = list(chat.keys, height / 10, scroll);
  if (choosen) {
    stage = "VIEW CHAT";
    messages = chat.data[chat.keys.indexOf(choosen)];
    messagebox.show();
  }
  navbar();
}
function editkeys() {
  background(c("Background"));
  animation();
  if (hold>0){
    scroll -= pmouseY - mouseY;
  }
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
    textSize(s * 30);
    type.show();
    fill(c("Grey4"));
    rect(width / 5, height / 5.5, width / 1.7, height / 8, 20);
    fill(c("White"));
    text(type.value(), width / 2, height / 4);
    if (key === "Enter") {
      keys.push(type.value());
      type.value("");
      type.hide();
      numpadOn = false;
      end = frameCount + 50;
      redirect = "KEYS";
      stage = "LOADING";
      storeItem("KEYS", keys);
      filtercharts(keys);
      filterchats();
    }
  } else {
    type.hide();
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
        filterchats();
      }
      keymenu.show = false;
    }
  }
  navbar();
}
function viewchat() {
  background(c("Background"));
  let j = scroll;
  let date = "";
  let person = "";
  if (hold>0){
    scroll -= pmouseY - mouseY;
  }
  for (let i = 0; i < messages.length; i++) {
    fill(c("White"));
    if (date !== todate(messages[i].time)) {
      textAlign(CENTER, CENTER);
      textSize(s * 15);
      text(todate(messages[i].time), width / 2, j + height / 30);
      j += s * 50;
      textAlign(LEFT, CENTER);
    }
    if (person !== messages[i].user) {
      textSize(s * 15);
      text(messages[i].user, width / 35, j + height / 30);
      j += s * 50;
    }

    textAlign(LEFT, CENTER);
    textSize(s * 20);
    wid = textWidth(messages[i].message);
    fill(c("Blue"));
    rect(width / 40, j - s * 8, wid + width / 25, s * 35, 20);
    fill(c("White"));
    text(messages[i].message, width / 25, j, wid + width / 10, s * 22);
    j += s * 40;

    person = messages[i].user;
    date = todate(messages[i].time);
  }
  size = j - scroll;

  if (scroll > 0) {
    scroll = 0;
  }
  if (scroll < height / 2 - size) {
    scroll = height / 2 - size;
  }

  strokeWeight(2);
  stroke(c("White"));
  fill(lerpColor(c(theme.navbar), color(0, 0, 0), 0.8));
  rect(width / 40, (height / 10) * 9, width - width / 20, height / 12, 100);
  fill(c("Blue"));
  ellipse(
    width / 40 + width - width / 10,
    (height / 10) * 9.4,
    height / 12,
    height / 12
  );

  textSize(s * 25);
  textAlign(LEFT, CENTER);
  noStroke();
  fill(c("White"));
  text(
    messagebox.value(),
    width / 20,
    (height / 10) * 9.1,
    width - width / 20,
    height / 12
  );
  textAlign(CENTER, CENTER);
  text("✈︎", width / 40 + width - width / 10, (height / 10) * 9.4);

  if (
    key === "Enter" ||
    (dist(
      width / 40 + width - width / 10,
      (height / 10) * 9.4,
      mouseX,
      mouseY
    ) <
      height / 20 &&
      hold === 1)
  ) {
    chat.send = messagebox.value() + "~" + choosen;
    chat.send = shiftChar(chat.send, 5);
    window.location.replace(
      "https://docs.google.com/forms/d/e/1FAIpQLSf2GFoVDodD4gTCUwFf2VYmwAi3ySxeVwcqHLl3rH0AD6pKIQ/viewform?usp=pp_url&entry.619223333=" +
        chat.send
    );
  }

  fill(c("Grey4"));
  noStroke();
  rect(width / 80, height / 4, width / 180, height / 2, 20);
  rect(width / 40, height / 4, width / 180, height / 2, 20);

  if (hold === 1 && mouseX < width / 20) {
    stage = "EXIT-CHAT";
    wait = true;
  }
}

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
  if (stage === "CHART") {
    showchart();
  }
  if (stage === "CHATS") {
    chats();
  }
  if (stage === "KEYS") {
    editkeys();
  }
  if (stage === "VIEW CHAT") {
    viewchat();
  }
  if (stage === "FLOW-INFO") {
    flowinfo();
  }

  //EXITS
  if (stage === "EXIT-CHAT") {
    chats();
    push();
    translate(mouseX, 0);
    viewchat();
    pop();
    if (hold === 0) {
      if (mouseX < width / 2) {
        stage = "VIEW CHAT";
      } else {
        file = null;
        messagebox.hide();
        stage = "CHATS";
      }
    }
  }
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
        choosen = null;
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
