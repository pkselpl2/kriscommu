let board = "general";
let user = localStorage.getItem("user");
let posts = JSON.parse(localStorage.getItem("posts") || "[]");

// 로그인 처리
function login() {
  const name = document.getElementById("loginName").value;
  if (!name) return;
  localStorage.setItem("user", name);
  location.reload();
}

if (user) {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("writeBox").style.display = "block";
  document.getElementById("userLabel").innerText = "User: " + user;
}

// 게시판
function setBoard(b) {
  board = b;
  render();
}

// 글 작성
function addPost() {
  const text = document.getElementById("content").value;
  if (!text) return;

  posts.unshift({
    id: Date.now(),
    user,
    text,
    board,
    likes: 0,
    comments: []
  });

  save();
  document.getElementById("content").value = "";
  render();
}

// 좋아요
function like(id) {
  const p = posts.find(p => p.id === id);
  p.likes++;
  save();
  render();
}

// 댓글
function comment(id, input) {
  const p = posts.find(p => p.id === id);
  if (!input.value) return;
  p.comments.push({ user, text: input.value });
  input.value = "";
  save();
  render();
}

// 저장
function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// 렌더
function render() {
  const area = document.getElementById("posts");
  area.innerHTML = "";

  posts.filter(p => p.board === board).forEach(p => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <b>${p.user}</b>
      <p>${p.text}</p>
      <div class="actions">
        ❤️ ${p.likes}
        <button onclick="like(${p.id})">Like</button>
      </div>
      <div>
        ${p.comments.map(c =>
          `<div class="comment">💬 ${c.user}: ${c.text}</div>`
        ).join("")}
        <input placeholder="Comment..."
          onkeydown="if(event.key==='Enter')comment(${p.id}, this)">
      </div>
    `;
    area.appendChild(div);
  });
}

render();
