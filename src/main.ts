import * as THREE from 'three';
import { gsap } from "gsap";

// --- Type & Card Data ---
type Suit = '♠' | '♥' | '♦' | '♣';
type Card = { value: number; label: string; suit: Suit; color: string };

// Utility: get label for card value
function getCardLabel(value: number) {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return value.toString();
}

// --- Card Generation ---
function randomSuit(): Suit {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  return suits[Math.floor(Math.random() * 4)];
}
function randomCard(): Card {
  const value = Math.floor(Math.random() * 13) + 1; // 1-13
  const label = getCardLabel(value);
  const suit = randomSuit();
  const color = suit === '♥' || suit === '♦' ? '#c00' : '#000';
  return { value, label, suit, color };
}
function generate4Cards(): Card[] {
  // Boleh duplikat, 4 kartu random
  return [randomCard(), randomCard(), randomCard(), randomCard()];
}

// --- Three.js Setup ---
let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, controls: any;
const cardMeshes: THREE.Mesh[] = [];
let cards: Card[] = generate4Cards();

// --- Score ---
let score = 0;
function updateScore() {
  const el = document.getElementById('score');
  if (el) el.innerText = `Poin: ${score}`;
}

// Generate card texture dynamically (front)
function createCardTexture(label: string, suit: string, color: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 356;
  const ctx = canvas.getContext('2d')!;
  // Border & BG
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  // Label & Suit
  ctx.fillStyle = color;
  ctx.font = 'bold 88px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(label, 24, 96);
  ctx.font = '62px Arial';
  ctx.fillText(suit, 24, 180);
  ctx.textAlign = 'right';
  ctx.fillText(label, 232, 356 - 28);
  ctx.font = '54px Arial';
  ctx.fillText(suit, 232, 356 - 68);
  return new THREE.CanvasTexture(canvas);
}

// --- Render 3D Cards ---
function render3DCards(newCards: Card[]) {

    if (!scene) return;
    // Remove old cards from scene
    cardMeshes.forEach(mesh => scene.remove(mesh));
    cardMeshes.length = 0;

    // Posisi awal: tumpukan (pile)
    const pilePosition = { x: 0, y: 1.5, z: -3 };

    // Layout target posisi di meja
    newCards.forEach((card, i) => {
      const geometry = new THREE.BoxGeometry(1.6, 2.5, 0.13);
      const front = new THREE.MeshPhongMaterial({ map: createCardTexture(card.label, card.suit, card.color) });
      const back = new THREE.MeshPhongMaterial({ color: 0x183c8e });
      const edge = new THREE.MeshPhongMaterial({ color: 0xf1f1f1 });
      const materials = [edge, edge, edge, edge, front, back];

      const mesh = new THREE.Mesh(geometry, materials);
      // Mulai dari tumpukan
      mesh.position.set(pilePosition.x, pilePosition.y, pilePosition.z);
      mesh.castShadow = true;
      mesh.name = `card${i}`;
      scene.add(mesh);
      cardMeshes.push(mesh);

      // Animasi ke posisi final di meja, delay satu per satu
      const target = { x: -2.4 + i * 1.7, y: 1.5, z: 0 };
      gsap.to(mesh.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.6,
        delay: i * 0.12,
        ease: "power2.out"
      });
    });
  }


// --- Setup Three.js Scene ---
function setupThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x317a46);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / 350, 0.1, 100);
  camera.position.set(0, 6, 7);
  camera.lookAt(0, 1.5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, 300);
  const container = document.getElementById('threejs-container')!;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Meja
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5),
    new THREE.MeshPhongMaterial({ color: 0x276944, side: THREE.DoubleSide })
  );
  plane.position.y = 0; plane.position.z = 0; plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Cahaya
  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(6, 8, 6);
  scene.add(light);

  const amb = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(amb);

  render3DCards(cards);

  // Drag camera (orbit)
  let isDragging = false, lastX = 0, lastY = 0;
  renderer.domElement.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    camera.position.x -= dx * 0.01;
    camera.position.y += dy * 0.012;
    camera.lookAt(0, 1.5, 0);
    lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// --- Card Click Integration (for UI only, not 3D drag) ---
function renderCardsList(cards: Card[]) {
  const cardsList = document.getElementById('cards-list')!;
  cardsList.innerHTML = '';
  cards.forEach((card, i) => {
    const span = document.createElement('span');
    span.className = 'card-inline' + ((card.suit === '♥' || card.suit === '♦') ? ' red' : '');
    span.innerText = `${card.label}${card.suit}`;
    span.title = `Klik untuk menambah ke ekspresi`;
    span.onclick = () => {
      const input = document.getElementById('expression') as HTMLInputElement;
      input.value += input.value ? ` ${card.label}` : `${card.label}`;
      input.focus();
    };
    cardsList.appendChild(span);
  });
}

// --- Operator Buttons ---
function renderOperators() {
  const ops = ['+', '-', '*', '/', '(', ')'];
  const opsDiv = document.getElementById('operators')!;
  opsDiv.innerHTML = '';
  ops.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'op-btn';
    btn.innerText = op;
    btn.onclick = () => {
      const input = document.getElementById('expression') as HTMLInputElement;
      input.value += ' ' + op + ' ';
      input.focus();
    };
    opsDiv.appendChild(btn);
  });
}

// --- Expression Validation ---
function valueFromLabel(label: string): number {
  if (label === 'A') return 1;
  if (label === 'J') return 11;
  if (label === 'Q') return 12;
  if (label === 'K') return 13;
  return parseInt(label, 10);
}
function extractNumbers(expr: string): number[] {
  // Ambil A/J/Q/K/angka
  const re = /(A|J|Q|K|[1-9]|10|11|12|13)/g;
  return (expr.match(re) || []).map(label => valueFromLabel(label));
}
function areSameCards(exprNums: number[], cardVals: number[]) {
  // Cek apakah exprNums menggunakan persis cardVals (order doesn't matter)
  exprNums.sort((a, b) => a - b);
  cardVals = [...cardVals].sort((a, b) => a - b);
  return JSON.stringify(exprNums) === JSON.stringify(cardVals);
}
function check24(expr: string, cardVals: number[]): string {
  // Remove spaces
  let cleanExpr = expr.replace(/([AJQK])/g, (m) => valueFromLabel(m).toString());
  try {
    // Disallow letters (after konversi ke angka)
    if (/[^0-9+\-*/(). ]/.test(cleanExpr)) return 'Ekspresi tidak valid!';
    // Extract angka
    const used = extractNumbers(expr);
    if (used.length !== 4) return 'Ekspresi harus gunakan semua 4 kartu!';
    if (!areSameCards(used, cardVals)) return 'Ekspresi harus gunakan tepat kartu yang tersedia!';
    // Eval (pakai Function untuk keamanan, TIDAK pakai eval langsung!)
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict";return (${cleanExpr})`)();
    if (Math.abs(val - 24) < 1e-6) return '🎉 Benar! Hasilnya 24';
    return '❌ Jawaban Anda Salah. Hasil ekspresi: ' + val;
  } catch {
    return 'Ekspresi tidak valid!';
  }
}

// --- Main UI Logic ---
function updateAll() {
  render3DCards(cards);
  renderCardsList(cards);
  renderOperators();
  const expr = document.getElementById('expression') as HTMLInputElement;
  expr.value = '';
  document.getElementById('result')!.innerText = '';
  updateScore();
}

// --- Event Binding ---
window.onload = () => {
  setupThree();
  renderCardsList(cards);
  renderOperators();
  updateScore();

  document.getElementById('check-btn')!.onclick = () => {
    const expr = (document.getElementById('expression') as HTMLInputElement).value;
    const cardVals = cards.map(c => c.value);
    const result = check24(expr, cardVals);
    document.getElementById('result')!.innerText = result;

    // Tambah skor jika benar
    if (result.startsWith('🎉 Benar!')) {
      score++;
      updateScore();
    }
  };
  document.getElementById('new-btn')!.onclick = () => {
    cards = generate4Cards();
    updateAll();
  };
};
