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
  up: true
};

//SIGN IN VARIABLES
let signinstage = 0;
let info = {
  email: "",
  password: "",
  stage: "EMAIL",
  incorrect: false,
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

  textStyle(BOLD);

  data = {
    flow: data.flow.getArray(),
    colors: data.colors,
    auth: data.auth.getArray(),
  };
  glide.info=(height / 5) * 2;

  s = min([width, height]) / 500;

  //SIGN IN
  info = getItem("USER INFO");
  type = createInput();
  type.style("background-color", color(0, 0, 0, 0));
  type.style("border-color", color(0, 0, 0, 0));
  type.style("color", color(0, 0, 0, 0));
  type.value(" ");

  //COOKIES
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
      key === "Enter" ||
      (dist(width * 0.87, height / 2 - height / 25, mouseX, mouseY) < s * 30 &&
        hold === 1)
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
      redirect = "FLOW";
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

  if (mouseY < height / 10 && hold === 1) {
    info = {
      email: "",
      password: "",
      stage: "EMAIL",
      incorrect: false,
    };
    stage = "SIGN IN";
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
  if (scroll > height / 2) {
    scroll = height / 2;
  }
  if (scroll < -s * 170 * h.titles.length + height / 2) {
    scroll = -s * 170 * h.titles.length + height / 2;
  }

  stroke(c("Grey"));
  noFill();
  strokeWeight(2);
  rect(s * 20, scroll - height / 2.3, width - s * 40, height / 3, 20);

  type.size(width - s * 40, height / 3);
  type.position(s * 20, scroll - height / 2.3);

  noStroke();
  fill(c("Inverse"));
  textSize(s * 120);
  if (minute() < 10) {
    text(
      hour() + ":0" + minute(),
      s * 20,
      scroll - height / 2.3,
      width - s * 40,
      height / 3
    );
  } else {
    text(
      hour() + ":" + minute(),
      s * 20,
      scroll - height / 2.3,
      width - s * 40,
      height / 3
    );
  }
  textSize(s*30);
  text(type.value(),s * 20,
      scroll - height / 3.2,
      width - s * 40,
      height / 3);

  textSize(s * 25);

  for (let i = 0; i < h.titles.length; i++) {
    textAlign(LEFT, CENTER);
    fill(c("Inverse"));
    text(h.titles[i], s * 10, i * s * 170 + scroll - s * 30);
    for (let j = 0; j < h.names[i].length; j++) {
      noFill();
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
        glide.info+100>(height / 5) * 2 &&
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
        glide.up=false;
        glide.info=(height / 5) * 2;
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
    if (glide.info<(height / 5) * 2 && glide.up){
      glide.info+=50;
    }
    if (glide.info>0 && !glide.up){
      glide.info-=50;
    }
    if (!button(0, (height / 5) * 3, width, height) && hold===1){
      glide.up=true;
    }
    if (glide.info===(height / 5) * 2 && glide.up){
      choosen="";
    }
    fill(0, 0, 0, map(glide.info,0,(height / 5) * 2,200,0));
    rect(0, 0, width, height);
    
    
    
    push();
    translate(0,glide.info);
    noStroke();
    stroke(c("Inverse"));
    fill(c("Background"));
    rect(0, (height / 5) * 3, width, height, 20);

    fill(c("Grey"));
    rect(width / 10, (height / 5) * 3.1, width - width / 5, height / 60, 20);
    noFill();
    rect(width * 0.08, (height / 21) * 15, width / 4, height / 4, 10);
    rect(width * 0.38, (height / 21) * 15, width / 4, height / 4, 10);
    rect(width * 0.68, (height / 21) * 15, width / 4, height / 4, 10);

    noStroke();
    textAlign(CENTER, CENTER);
    textSize(s * 30);
    fill(c("Inverse"));
    text(choosen, 0, (height / 5) * 3, width, height / 6);

    textSize(s * 20);
    text("Flashcards", width * 0.08, (height / 21) * 15, width / 4, height / 4);
    text("Notes", width * 0.38, (height / 21) * 15, width / 4, height / 4);
    text("Test", width * 0.68, (height / 21) * 15, width / 4, height / 4);
    pop();
    
    if (
      button(width * 0.08, (height / 21) * 15, width / 4, height / 4) &&
      hold === 1
    ) {
      for (let i = 0; i < data.flow.length; i++) {
        if (data.flow[i][2] === choosen) {
          file = data.flow[i][3].split("#");
        }
      }
      stage = "FLASHCARDS";

      saverecent(choosen);
    }
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

//INTERFACE
function draw() {
  textFont("Roboto");
  if (stage === "SIGN IN") {
    signin();
    type.show();
  }
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
        choosen = null;
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
