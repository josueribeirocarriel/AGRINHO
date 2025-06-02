// para pegar um animal so clicar em sua cabeça.
let animais = [];
let plantas = [];
let score = 0;
let tempoMaximo = 60; // tempo em segundos
let tempoInicial;
let jogoFinalizado = false;

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(64);
  noStroke();
  tempoInicial = millis();

  // Plantações
  for (let i = 0; i < 30; i++) {
    plantas.push(createVector(random(width), random(height)));
  }

  // Começa com 2 animais
  adicionarAnimal();
  adicionarAnimal();
}

function draw() {
  let tempoDecorrido = (millis() - tempoInicial) / 1000;
  let tempoRestante = max(0, tempoMaximo - floor(tempoDecorrido));

  if (!jogoFinalizado && tempoRestante > 0) {
    desenharCenario();

    // Plantas
    for (let p of plantas) {
      fill(0, 200, 0);
      ellipse(p.x, p.y, 6, 6);
    }

    // Animais
    for (let a of animais) {
      a.pos.x += random(-1.5, 1.5);
      a.pos.y += random(-1.5, 1.5);
      a.pos.x = constrain(a.pos.x, 0, width);
      a.pos.y = constrain(a.pos.y, 0, height);

      // Come planta
      for (let i = plantas.length - 1; i >= 0; i--) {
        if (dist(a.pos.x, a.pos.y, plantas[i].x, plantas[i].y) < 15) {
          plantas.splice(i, 1);
        }
      }

      // Desenha
      textSize(64);
      text(a.tipo, a.pos.x, a.pos.y);
    }

    // Cursor
    fill(0);
    ellipse(mouseX, mouseY, 20, 20);

    // Mais animais a cada 10 pontos
    if (animais.length < 5 && score / 10 > animais.length - 1) {
      adicionarAnimal();
    }
  } else {
    jogoFinalizado = true;
    background(180, 220, 140);
    desenharTelhadoComAnimaisEFazendeiro();
  }

  // HUD
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Pontuação: " + score, 10, 10);
  text("Tempo: " + tempoRestante + "s", 10, 30);
}

function mousePressed() {
  if (!jogoFinalizado) {
    for (let i = animais.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, animais[i].pos.x, animais[i].pos.y) < 40) {
        score += 5;
        animais.splice(i, 1);
        adicionarAnimal();
        break;
      }
    }
  }
}

function adicionarAnimal() {
  let tipos = ["🐄", "🐔", "🐂"];
  if (animais.length < 5) {
    let tipo = random(tipos);
    let novo = {
      tipo: tipo,
      pos: createVector(random(width), random(height))
    };
    animais.push(novo);
  }
}

function desenharCenario() {
  background(120, 200, 120); // Pasto
  fill(90, 170, 90);
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height);
    rect(x, y, 2, 10);
  }
}

function desenharTelhadoComAnimaisEFazendeiro() {
  fill(150, 75, 0);
  triangle(150, 150, 300, 50, 450, 150);
  fill(200, 150, 100);
  rect(150, 150, 300, 120);

  textSize(48);
  fill(0);
  textAlign(CENTER, CENTER);
  text("🐄  🐔  🐂", width / 2, 210);

  textSize(40);
  text("👨‍🌾", width / 2, 320);

  textSize(24);
  text("Tempo esgotado!", width / 2, 360);
  text("Obrigado por pegar meus animais!", width / 2, 380);
}















































}
