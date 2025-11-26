let yesButton = document.getElementById("yes");
let noButton = document.getElementById("no");
let questionText = document.getElementById("question");
let mainImage = document.getElementById("mainImage");

let clickCount = 0;  // 记录点击 No 的次数

// No 按钮的文字变化
const noTexts = [
    "？你认真的吗😀", 
    "要不再想想？🤔", 
    "真的要选这个吗？😢 ", 
    "再好好考虑考虑呢😖", 
    "确定吗😬", 
    "真的确定吗😱",
    "omg😭",  
    "选这个也没用哦😜",
    "嘻嘻嘻嘻嘻😁"
];

// No 按钮点击事件
noButton.addEventListener("click", function() {
    clickCount++;

    // 第十次点击时让按钮消失
    if (clickCount === 10) {
        noButton.style.display = "none";
        return;
    }

    // 让 Yes 变大，每次放大 2 倍
    let yesSize = 1 + (clickCount * 1.2);
    yesButton.style.transform = `scale(${yesSize})`;

    // 挤压 No 按钮，每次右移 100px
    let noOffset = clickCount * 50;
    noButton.style.transform = `translateX(${noOffset}px)`;

    // **新增：让图片和文字往上移动**
    let moveUp = clickCount * 25; // 每次上移 20px
    mainImage.style.transform = `translateY(-${moveUp}px)`;
    questionText.style.transform = `translateY(-${moveUp}px)`;

    // No 文案变化（前 9 次变化）
    if (clickCount <= 9) {
        noButton.innerText = noTexts[clickCount - 1];
    }

    // 图片变化
    if (clickCount === 1) mainImage.src = "images/shocked.gif"; // 震惊
    if (clickCount === 2) mainImage.src = "images/think.gif";   // 思考
    if (clickCount === 3) mainImage.src = "images/angry.gif";   // 生气
    if (clickCount === 4) mainImage.src = "images/crying1.gif";  // 哭
    if (clickCount === 5) mainImage.src = "images/crying2.gif";  // 之后一直是哭
    if (clickCount === 6) mainImage.src = "images/crying3.gif";  // 之后一直是哭
    if (clickCount === 7) mainImage.src = "images/crying4.gif";  // 之后一直是哭
    if (clickCount === 8) mainImage.src = "images/crying5.gif";  // 之后一直是哭
    if (clickCount === 9) mainImage.src = "images/crying6.gif";  // 之后一直是哭
});

// Yes 按钮点击后，进入表白成功页面
yesButton.addEventListener("click", function() {
    document.body.innerHTML = `
        <div class="yes-screen">
            <h1 class="yes-text">!!!我可是超级爱你的呦!! ( >᎑<)♡︎ᐝ</h1>
            <img src="images/hug.gif" alt="拥抱" class="yes-image">
        </div>
    `;

    document.body.style.overflow = "hidden";
});