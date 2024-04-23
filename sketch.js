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
function mouseWheel(event) {
  scroll -= event.delta;
}
function mouseDragged() {
  scroll -= pmouseY - mouseY;
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

  filterchats()
  
  print(chat);

  //BACKGROUND ANIMATION
  for (let i = 0; i < 20; i++) {
    points.push([random(width), random(height), random(-1, 1), random(-1, 1)]);
  }
}
//FUNCTIONS
function filterchats(){
  chat = {
    data: [],
    keys: [],
  };
  for (let i = 0; i < data.chat.length; i++) {
    if (data.chat[i][0] !== "") {
      chat.keyy = data.chat[i][2].split("|")[1];
      chat.message = data.chat[i][2].split("|")[0];
      if (keys.indexOf(chat.keyy)>-1 || chat.keyy===info.email || chat.keyy==="Public"){
        if (chat.keys.indexOf(chat.keyy) === -1) {
          chat.keys.push(chat.keyy);
          chat.data.push([]);
        }
        chat.message={
          message:chat.message,
          time:data.chat[i][0],
          user:data.chat[i][1]
        }
        chat.data[chat.keys.indexOf(chat.keyy)].push(chat.message);
      }
    }
  }
}
function showmessages(data) {
  textAlign(LEFT, TOP);
  noStroke();
  j = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].message !== "") {
      if (data[i].c === "Blue") {
        fill(c("Blue"));
      } else {
        fill(c("Grey3"));
      }
      textSize(16 * tex);
      wid = textWidth(data[i].message);

      rect(
        w / 20 + move,
        h - j * d - scroll.position * d,
        wid + w / 25,
        tex * 28,
        60
      );
      fill(c("Inverse"));
      text(
        data[i].message,
        w / 15 + move,
        h - j * d + tex * 7 - scroll.position * d,
        w,
        h
      );
      textSize(12 * tex);
      fill(255, 255, 255, map(move, 0, tex * 40, 0, 255));
      text(
        totime(data[i].time),
        w / 50,
        h - j * d + h / 100 - scroll.position * d
      );
    }else{
      j-=tex*30;
    }
    fill(c("Inverse"));
    if (data[i].user !== data[(i + 1) % data.length].user) {
      text(
        data[i].user,
        w / 18 + move,
        h - j * d - tex * 13 - scroll.position * d
      );
      j += tex * 30;
    }
    if (todate(data[i].time) !== todate(data[(i + 1) % data.length].time)) {
      text(
        todate(data[i].time),
        w / 3 + move,
        h - j * d - tex * 20 - scroll.position * d
      );
      j += tex * 30;
    }
    j += tex * 30;
  }
}
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
      dist(width * 0.87, height / 2 - height / 25, mouseX, mouseY) < s * 30 &&
      hold === 1
    ) {
      window.location.replace(
        "https://docs.google.com/forms/d/e/1FAIpQLSfkt1Z1Uu9T7M821tRA4chC0jo2MYskrAGCxBLWE7_uI3r6RQ/viewform?usp=pp_url&entry.2039879610=" +
          info.email
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
    if (info.password === password) {
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

  len = charts.values.length;
  text(choosen, width / 2, height / 40);
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
function chats() {
  background(c("Background"));
  if (scroll > height / 10) {
    scroll = height / 10;
  }
  if (scroll < (-height / 10) * chat.keys.length + height / 2) {
    scroll = (-height / 10) * chat.keys.length + height / 2;
  }
  choosen=list(chat.keys,height/10,scroll);
  if (choosen){
    stage="VIEW CHAT";
    messagebox.show();
  }
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
      filterchats()
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
        filterchats()
      }
      keymenu.show = false;
    }
  }
  navbar();
}
function viewchat(){
  background(c("Background"));
  strokeWeight(2);
  stroke(c("White"));
  fill(lerpColor(c(theme.navbar), color(0, 0, 0), 0.8));
  rect(width / 40, (height / 10) * 9, width - width / 20, height / 12, 100);
  fill(c("Blue"))
  ellipse(width/40+width-width/10,height/10*9.4,height / 12,height / 12);
  
  textSize(s*25);
  textAlign(LEFT,CENTER);
  noStroke();
  fill(c("White"));
  text(messagebox.value(),width / 20, (height / 10) * 9.1, width - width / 20, height / 12);
  textAlign(CENTER, CENTER);
  text("✈︎", width/40+width-width/10,height/10*9.4);
  
  if (dist(width/40+width-width/10,height/10*9.4,mouseX,mouseY)<height/20&&hold===1){
    chat.send=messagebox.value()+"|"+choosen;
    window.location.replace("https://docs.google.com/forms/d/e/1FAIpQLSf2GFoVDodD4gTCUwFf2VYmwAi3ySxeVwcqHLl3rH0AD6pKIQ/viewform?usp=pp_url&entry.619223333="+chat.send);
  }
  showmessages(chat.data[chat.keys.indexOf(choosen)]);
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
  if (stage === "VIEW CHAT"){
    viewchat();
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
