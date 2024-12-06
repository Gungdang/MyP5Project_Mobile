let font;
let img, originalImg; // 원본 이미지를 저장할 변수 추가
let scatterDistance = 120; // 초기 흩어짐 거리
let errorBoxes = [];
let showQuestionBox = true;
let generatingErrors = false;
let isShaking = false; // 흔들림 상태
let isFrozen = false; // NO 버튼을 눌렀을 때 모든 동작을 멈추게 하는 상태
let errorSpawnInterval = 5;
let errorSpawnCounter = 0;
let questionIndex = 0;

// 더블 터치 감지를 위한 변수
let lastTouchTime = 0;

// 질문별 에러 메시지 설정
const errorMessagesByQuestion = [
  [
    " Is the issue tackled in the project widely acknowledged as a significant problem in today's society?",
    " Did I adopt an inventive and imaginative approach to draw public attention to this matter?",
    " Did I move beyond simply identifying the problem by presenting concrete, actionable, and realistic solutions?",
    " Try Again!                  -Press Enter-"
  ],
  [
    " Did the design challenge traditional stereotypes or introduce a new way of thinking?",
    " Does the project have the potential to engage the public and inspire behavioral change?",
    " Did it deliver a clear message that resonates with the audience and motivates them to act?",
    " Try Again!                -Press Enter-"
  ],
  [
    " Did I make an effort to overcome personal biases or preconceptions during the design process?",
    " Did I treat failures or setbacks as opportunities for reflection, learning, and growth?",
    " Did I actively seek and integrate feedback from professionals in other fields or from the general public?",
    " Try Again!                -Press Enter-"
  ],
  [
    "Did I gain new insights or perspectives through working with people from diverse backgrounds?",
    "Was my process guided by empathy, respect, and a commitment to understanding the needs of my audience and participants?",
    "Did I ensure an inclusive perspective that avoids favoring specific groups or viewpoints?",
    " Try Again!                -Press Enter-"
  ],
  [
    "Did it encourage the audience to recognize overlooked issues or opportunities in their everyday lives?",
    "Did the design offer fresh and enriching experiences that positively impact people's lives?",
    "Does the project have the potential to leave a meaningful, long-lasting impact instead of being a one-time effort?",
    " Try Again!                -Press Enter-"
  ]
];

const questions = [
  "Did the project address important social issues?",
  "Did the project shift public perceptions?",
  "Did I approach the process                        with openness and honesty?",
  "Did I foster collaboration and inclusivity?",
  "Did the project broaden public perspectives and expand their world?",
  "Did my design create social value?"
];

function preload() {
  font = loadFont("assets/Pretendard-Thin.ttf");
  originalImg = loadImage("assets/example.jpg"); // 원본 이미지 로드
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  textAlign(CENTER, CENTER);

  img = originalImg.get(); // 현재 상태 이미지 초기화
  scatterImage(); // 초기 이미지 흩어짐 적용
}

function draw() {
  if (isShaking) {
    applyShakeEffect(); // 흔들림 효과
  }

  background(0);
  image(img, 0, 0, width, height);

  for (let box of errorBoxes) {
    box.display();
  }

  if (showQuestionBox || isFrozen) {
    drawQuestionBox();
  }

  if (generatingErrors) {
    errorSpawnCounter++;
    if (errorSpawnCounter % errorSpawnInterval === 0) {
      createErrorBox(); // 에러 박스 생성
    }
  }
}

function scatterImage() {
  img = originalImg.get(); // 매번 원본 이미지를 복사
  img.loadPixels();
  let scattered = createImage(img.width, img.height);

  scattered.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let x = (i / 4) % img.width;
    let y = Math.floor((i / 4) / img.width);

    let dx = Math.floor(random(-scatterDistance, scatterDistance));
    let dy = Math.floor(random(-scatterDistance, scatterDistance));

    let newX = (x + dx + img.width) % img.width;
    let newY = (y + dy + img.height) % img.height;

    let newIdx = 4 * (newY * img.width + newX);
    scattered.pixels[newIdx] = img.pixels[i];
    scattered.pixels[newIdx + 1] = img.pixels[i + 1];
    scattered.pixels[newIdx + 2] = img.pixels[i + 2];
    scattered.pixels[newIdx + 3] = img.pixels[i + 3];
  }
  scattered.updatePixels();
  img = scattered;
}

function applyShakeEffect() {
  let shakeAmount = 10; // 흔들림 강도
  translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
}

function drawQuestionBox() {
  fill(255); // 질문 상자 배경 색상
  stroke(0); // 테두리 색상
  strokeWeight(2); // 테두리 두께
  rect(width / 4, height / 4, width / 2, height / 2, 20);

  fill(0); // 텍스트 색상
  textSize(questionIndex === questions.length - 1 ? 30 : 25); // 마지막 질문 크기 조정
  let lines = splitByWords(questions[questionIndex], 50);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, height / 4 + 120 + i * 30 + 10);
  }

  if (questionIndex === questions.length - 1) {
    drawYesButton(width / 2 - 120, height / 2 + 40, 240, 60, "Yes", () => {
      scatterDistance = 0;
      scatterImage();
      showQuestionBox = false;
    });
  } else {
    drawYesButton(width / 2 - 100, height / 2 + 40, 80, 40, "Yes", () => {
      questionIndex++;
      scatterDistance = max(0, scatterDistance - 20);
      scatterImage();
    });

    drawNoButton(width / 2 + 20, height / 2 + 40, 80, 40, "No", () => {
      generatingErrors = true;
      isShaking = true;
      isFrozen = true;
      createErrorBox();
    });
  }
}

function createErrorBox() { /*...*/ }
function mousePressed() { /*...*/ }
function windowResized() { resizeCanvas(windowWidth, windowHeight); scatterImage(); }
