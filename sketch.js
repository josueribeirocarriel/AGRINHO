// objetivo é que pegue os animais que escaparam e que durante essa perceguição aparecera desafios.
// como bombas em animais etc.
// umas partes do jogo foi feito com chatGPT e outras auteradas por mim.
// coloque no final o seu record.
// adicione um local para colocar eu nome.
// mude para que os animais andem em lugares diferentes.
// coloque bombas em em animais para que dificulte um pouco o jogo.
// apareça que os animal ficaram machucados com explosão.
// apareça um galinheiro explodido.
let animais = [];
let plantas = [];
let score = 0;
let tempoMaximo = 60;
let tempoInicial;
let jogoFinalizado = false;

let recorde = 0;
let nomeRecordista = "Nenhum";
let jogador = "";

let botaoReiniciar;
let telaInicial = true;
let botaoComecar;

let bombaAtiva = false;
let tempoBombaInicio = 0;
let tempoBombaLimite = 10;
let passarinho = null;

function setup() {
  createCanvas(700, 700);
  textAlign(CENTER, CENTER);
  textSize(24);
  noStroke();

  botaoComecar = createButton("🎮 Jogar");
  botaoComecar.position(width / 2 - 50, height / 2 + 100);
  botaoComecar.size(100, 40);
  botaoComecar.style("font-size", "18px");
  botaoComecar.mousePressed(iniciarJogo);
}

function iniciarJogo() {
  telaInicial = false;
  botaoComecar.remove();

  jogador = prompt("Digite seu nome:");

  if (localStorage.getItem("recorde")) {
    recorde = int(localStorage.getItem("recorde"));
  }
  if (localStorage.getItem("nomeRecordista")) {
    nomeRecordista = localStorage.getItem("nomeRecordista");
  }

  tempoInicial = millis();

  plantas = [];
  for (let i = 0; i < 30; i++) {
    plantas.push(createVector(random(width), random(height)));
  }

  animais = [];
  adicionarAnimal();
  adicionarAnimal();

  bombaAtiva = false;
  passarinho = null;
}

function draw() {
  if (telaInicial) {
    background(700, 650, 200);
    fill(0);
    textSize(32);
    text("🐄 BEM-VINDO AO JOGO DO FAZENDEIRO! 👨‍🌾", width / 2, height / 2 - 140);
    textSize(20);
    text("Objetivo: Clique nos animais antes do tempo acabar!", width / 2, height / 2 - 60);
    text("Cada animal clicado dá 5 pontos.", width / 2, height / 2 - 30);
    text("Novos animais aparecem a cada 10 pontos.", width / 2, height / 2);
    text("Cuidado! Eles andam e comem plantações.", width / 2, height / 2 + 30);
    text("Um animal pode ter uma bomba 💣 em cima!", width / 2, height / 2 + 60);
    text("Se pegar a bomba, entregue para o pássaro 🐦 em 10 segundos!", width / 2, height / 2 + 90);
    text("O recorde é salvo no navegador.", width / 2, height / 2 + 120);
    return;
  }

  let tempoDecorrido = (millis() - tempoInicial) / 1000;
  let tempoRestante = max(0, tempoMaximo - floor(tempoDecorrido));

  if (!jogoFinalizado && tempoRestante > 0) {
    desenharCenario();

    for (let p of plantas) {
      fill(0, 200, 0);
      ellipse(p.x, p.y, 6, 6);
    }

    if (bombaAtiva) {
      let tempoBombaDecorrido = (millis() - tempoBombaInicio) / 1000;
      let tempoBombaRestante = max(0, tempoBombaLimite - floor(tempoBombaDecorrido));
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER, TOP);
      text("🚨 Entregue a bomba ao pássaro! Tempo: " + tempoBombaRestante + "s", width / 2, 10);

      if (tempoBombaRestante <= 0) {
        jogoFinalizado = true;
      }
    }

    for (let a of animais) {
      a.pos.x += random(-1.5, 1.5);
      a.pos.y += random(-1.5, 1.5);
      a.pos.x = constrain(a.pos.x, 0, width);
      a.pos.y = constrain(a.pos.y, 0, height);

      for (let i = plantas.length - 1; i >= 0; i--) {
        if (dist(a.pos.x, a.pos.y, plantas[i].x, plantas[i].y) < 15) {
          plantas.splice(i, 1);
        }
      }

      textSize(64);
      text(a.tipo, a.pos.x, a.pos.y);

      if (a.temBomba) {
        textSize(32);
        text("💣", a.pos.x, a.pos.y - 50);
      }
    }

    if (bombaAtiva && passarinho) {
      // Passarinho voando dentro do cenário, refletindo nas bordas
      passarinho.pos.add(passarinho.vel);

      if (passarinho.pos.x < 20 || passarinho.pos.x > width - 20) {
        passarinho.vel.x *= -1;
      }
      if (passarinho.pos.y < 20 || passarinho.pos.y > height - 20) {
        passarinho.vel.y *= -1;
      }

      textSize(48);
      text("🐦", passarinho.pos.x, passarinho.pos.y);
    }

    fill(0);
    ellipse(mouseX, mouseY, 20, 20);

    if (animais.length < 5 && score / 10 > animais.length - 1) {
      adicionarAnimal();
    }
  } else {
    if (!jogoFinalizado) {
      if (score > recorde) {
        recorde = score;
        nomeRecordista = jogador;
        localStorage.setItem("recorde", recorde);
        localStorage.setItem("nomeRecordista", nomeRecordista);
      }
    }

    jogoFinalizado = true;
    background(180, 220, 140);
    desenharCenaFinal();

    if (!botaoReiniciar) {
      botaoReiniciar = createButton("🔁 Tentar novamente");
      botaoReiniciar.position(width / 2 - 80, height - 100);
      botaoReiniciar.size(160, 40);
      botaoReiniciar.style("font-size", "16px");
      botaoReiniciar.mousePressed(reiniciarJogo);
    }
  }

  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Pontuação: " + score, 10, 10);
  text("Tempo: " + tempoRestante + "s", 10, 30);
}

function mousePressed() {
  if (!jogoFinalizado) {
    if (bombaAtiva && passarinho) {
      if (dist(mouseX, mouseY, passarinho.pos.x, passarinho.pos.y) < 40) {
        passarinho = null;
        bombaAtiva = false;
        score += 20;
        return;
      }
    }

    for (let i = animais.length - 1; i >= 0; i--) {
      let a = animais[i];
      if (dist(mouseX, mouseY, a.pos.x, a.pos.y) < 40) {
        if (a.temBomba) {
          bombaAtiva = true;
          tempoBombaInicio = millis();
          a.temBomba = false;

          passarinho = {
            pos: createVector(width / 2, height / 2),
            vel: createVector(random([-3, 3]), random([-3, 3]))
          };
        } else {
          score += 5;
          animais.splice(i, 1);
          adicionarAnimal();
        }
        break;
      }
    }
  }
}

function adicionarAnimal() {
  let tiposNormais = ["🐄", "🐔", "🐂"];
  if (animais.length < 5) {
    let tipo = random(tiposNormais);
    let temBomba = false;
    if (!bombaAtiva && random() < 0.1 && animais.every(a => !a.temBomba)) {
      temBomba = true;
    }
    let novo = {
      tipo: tipo,
      pos: createVector(random(width), random(height)),
      temBomba: temBomba
    };
    animais.push(novo);
  }
}

function desenharCenario() {
  background(120, 200, 120);
  fill(90, 170, 90);
  for (let i = 0; i < 60; i++) {
    let x = random(width);
    let y = random(height);
    rect(x, y, 2, 10);
  }
}

function desenharCenaFinal() {
  background(180, 220, 140);
  let cx = width / 2;

  if (bombaAtiva) {
    // Galinheiro destruído e animais machucados
    textAlign(CENTER, CENTER);
    fill(150, 50, 30);
    // Galinheiro quebrado (casinha caindo)
    rect(cx - 160, 150, 320, 100);
    fill(100, 50, 0);
    triangle(cx - 160, 150, cx, 50, cx + 160, 150);
    fill(180, 180, 180, 150);
    rect(cx - 140, 170, 280, 60);

    textSize(72);
    text("💥🔥🏚️", cx, 110);

    textSize(48);
    fill(120, 0, 0);
    text("Bomba explodiu!", cx, 230);

    textSize(48);
    fill(80, 0, 0);
    text("Animais machucados...", cx, 280);

    // Animais machucados (com emojis tristes)
    textSize(64);
    text("🐄💔 🐔💔 🐂💔", cx, 350);
  } else {
    // Cena normal final
    fill(150, 75, 0);
    triangle(cx - 150, 150, cx, 50, cx + 150, 150);
    fill(200, 150, 100);
    rect(cx - 150, 150, 300, 120);

    textSize(48);
    fill(0);
    text("🐄  🐔  🐂", cx, 210);

    textSize(40);
    text("👨‍🌾", cx, 320);

    textSize(24);
    text("Tempo esgotado!", cx, 360);
    text("Obrigado por pegar meus animais!", cx, 380);
  }

  textSize(24);
  fill(0);
  textAlign(CENTER, TOP);
  text("Recorde: " + recorde + " pontos (" + nomeRecordista + ")", width / 2, height - 60);
}

function reiniciarJogo() {
  score = 0;
  tempoInicial = millis();
  jogoFinalizado = false;
  plantas = [];
  for (let i = 0; i < 30; i++) {
    plantas.push(createVector(random(width), random(height)));
  }
  animais = [];
  adicionarAnimal();
  adicionarAnimal();
  bombaAtiva = false;
  passarinho = null;

  botaoReiniciar.remove();
  botaoReiniciar = null;
}
