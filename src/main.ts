import * as THREE from 'three';
import { gsap } from 'gsap';

type Suit = '♠' | '♥' | '♦' | '♣';
type Card = { value: number; label: string; suit: Suit; color: string };

function getCardLabel(value: number) {
  if (value === 1) return 'A';
  if (value === 11) return 'J';
  if (value === 12) return 'Q';
  if (value === 13) return 'K';
  return value.toString();
}
function randomSuit(): Suit {
  const suits: Suit[] = ['♠', '♥', '♦', '♣'];
  return suits[Math.floor(Math.random() * 4)];
}
function randomCard(): Card {
  const value = Math.floor(Math.random() * 13) + 1;
  const label = getCardLabel(value);
  const suit = randomSuit();
  const color = suit === '♥' || suit === '♦' ? '#c00' : '#000';
  return { value, label, suit, color };
}
function generate4Cards(): Card[] {
  return [randomCard(), randomCard(), randomCard(), randomCard()];
}

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
const cardMeshes: THREE.Mesh[] = [];
let cards: Card[] = generate4Cards();

let score = 0;
function updateScore() {
  const el = document.getElementById('score');
  if (el) el.innerText = `Poin: ${score}`;
}

// --- NEW: State ekspresi berupa array --- //
let expArr: string[] = [];      // Array label ekspresi, misal ['10', '*', '2', '+', 'A']
let pickedIndexes: number[] = []; // Index kartu yang sudah di-ekspresi-kan (disable tombol kartu)

function createCardTexture(label: string, suit: string, color: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 356;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
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

function render3DCards(newCards: Card[]) {
  if (!scene) return;
  cardMeshes.forEach(mesh => scene.remove(mesh));
  cardMeshes.length = 0;
  const pilePosition = { x: 0, y: 1.5, z: -3 };
  newCards.forEach((card, i) => {
    const geometry = new THREE.BoxGeometry(1.6, 2.5, 0.13);
    const front = new THREE.MeshPhongMaterial({ map: createCardTexture(card.label, card.suit, card.color) });
    const back = new THREE.MeshPhongMaterial({ color: 0x183c8e });
    const edge = new THREE.MeshPhongMaterial({ color: 0xf1f1f1 });
    const materials = [edge, edge, edge, edge, front, back];
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(pilePosition.x, pilePosition.y, pilePosition.z);
    mesh.castShadow = true;
    mesh.name = `card${i}`;
    scene.add(mesh);
    cardMeshes.push(mesh);
    const target = { x: -2.4 + i * 1.7, y: 1.5, z: 0 };
    gsap.to(mesh.position, {
      x: target.x, y: target.y, z: target.z, duration: 0.6, delay: i * 0.12, ease: "power2.out"
    });
  });
}

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

  // Cahaya utama dari atas kanan
  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(0, 10, 8);
  scene.add(light);

  // Cahaya tambahan dari depan kamera ke kartu
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
  frontLight.position.set(0, 5, 10);
  scene.add(frontLight);

  // Cahaya ambient (biar tidak ada bagian gelap)
  const amb = new THREE.AmbientLight(0xffffff, 0.7);
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

    camera.position.x = Math.max(-8, Math.min(8, camera.position.x));
    camera.position.y = Math.max(2, Math.min(10, camera.position.y));
    camera.position.z = Math.max(4, Math.min(14, camera.position.z));
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

// --- Render UI Ekspresi Tombol ---
function renderCardButtons() {
  const cardsDiv = document.getElementById('cards-list')!;
  cardsDiv.innerHTML = '';
  cards.forEach((card, i) => {
    const btn = document.createElement('button');
    btn.className = 'card-inline exp-btn' + ((card.suit === '♥' || card.suit === '♦') ? ' red' : '');
    btn.innerText = `${card.label}${card.suit}`;
    btn.disabled = pickedIndexes.includes(i);
    btn.onclick = () => {
      expArr.push(card.label);
      pickedIndexes.push(i);
      renderCardButtons();
      renderExpBar();
    };
    cardsDiv.appendChild(btn);
  });
}
function renderOpButtons() {
  const ops = ['+', '-', '*', '/', '(', ')'];
  const opDiv = document.getElementById('op-list')!;
  opDiv.innerHTML = '';
  ops.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'op-btn exp-btn';
    btn.innerText = op;
    btn.onclick = () => {
      expArr.push(op);
      renderExpBar();
    };
    opDiv.appendChild(btn);
  });
}
function renderExpBar() {
  const bar = document.getElementById('exp-bar')!;
  bar.innerHTML = '';
  expArr.forEach((token, idx) => {
    const btn = document.createElement('button');
    btn.className = 'expbar-btn exp-btn';
    btn.innerText = token;
    btn.title = 'Hapus dari ekspresi';
    btn.onclick = () => {
      // Kalau token ini adalah kartu, maka re-aktifkan tombol kartunya
      const cardIdx = cards.findIndex((c, i) => c.label === token && pickedIndexes.includes(i));
      if (cardIdx !== -1 && pickedIndexes.includes(cardIdx)) {
        pickedIndexes = pickedIndexes.filter(ix => ix !== cardIdx);
        renderCardButtons();
      }
      expArr.splice(idx, 1);
      renderExpBar();
    };
    bar.appendChild(btn);
  });
}

// --- Expression Validation ---
// J, Q, K = 10; A = 11
function valueFromLabel(label: string): number {
  if (label === 'A') return 11;
  if (label === 'J' || label === 'Q' || label === 'K') return 10;
  return parseInt(label, 10);
}
function extractNumbers(arr: string[]): number[] {
  return arr.filter(x =>
    /^[AJQK]$/.test(x) || /^[0-9]{1,2}$/.test(x)
  ).map(label => valueFromLabel(label));
}
function areSameCards(exprNums: number[], cardVals: number[]) {
  exprNums = [...exprNums].sort((a, b) => a - b);
  cardVals = [...cardVals].sort((a, b) => a - b);
  return JSON.stringify(exprNums) === JSON.stringify(cardVals);
}
function check24(exprArr: string[], cardVals: number[]): string {
  const expr = exprArr.map(x => /^[AJQK]$/.test(x) ? valueFromLabel(x).toString() : x).join(' ');
  try {
    if (!expr.match(/^[0-9+\-*/(). ]+$/)) return 'Ekspresi tidak valid!';
    const used = extractNumbers(exprArr);
    if (used.length !== 4) return 'Ekspresi harus gunakan semua 4 kartu!';
    if (!areSameCards(used, cardVals)) return 'Ekspresi harus gunakan tepat kartu yang tersedia!';
    const val = Function(`"use strict";return (${expr})`)();
    if (Math.abs(val - 24) < 1e-6) return '🎉 Benar! Hasilnya 24';
    return '❌ Jawaban Anda Salah. Hasil ekspresi: ' + val;
  } catch {
    return 'Ekspresi tidak valid!';
  }
}

function updateAll() {
  expArr = [];
  pickedIndexes = [];
  render3DCards(cards);
  renderCardButtons();
  renderOpButtons();
  renderExpBar();
  document.getElementById('result')!.innerText = '';
  updateScore();
}

window.onload = () => {
  setupThree();
  renderCardButtons();
  renderOpButtons();
  renderExpBar();
  updateScore();

  document.getElementById('check-btn')!.onclick = () => {
    const cardVals = cards.map(c => valueFromLabel(c.label));
    const result = check24(expArr, cardVals);
    document.getElementById('result')!.innerText = result;
    if (result.startsWith('🎉 Benar!')) {
      score++;
      updateScore();
    }
    expArr = [];
    pickedIndexes = [];
    renderCardButtons();
    renderExpBar();
  };
  document.getElementById('new-btn')!.onclick = () => {
    cards = generate4Cards();
    updateAll();
  };
};
