var _a;
import Konva from 'konva';
import Quill from 'quill';
// HTML Editor 생성
const quillOptions = {
    theme: 'snow',
    placeholder: 'Type something...',
    modules: {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
        ]
    }
};
const editor = new Quill('#editor', quillOptions);
// Konva Stage 설정
const stageConfig = {
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
};
const stage = new Konva.Stage(stageConfig);
const layer = new Konva.Layer();
stage.add(layer);
// 이미지 로드 및 계산 함수
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
}
function getImageSize(html) {
    return new Promise((resolve) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.pointerEvents = 'none';
        div.style.width = '500px'; // Quill 편집기 너비와 일치시킴
        document.body.appendChild(div);
        setTimeout(() => {
            const width = div.clientWidth;
            const height = div.clientHeight;
            document.body.removeChild(div);
            resolve({ width, height });
        }, 50);
    });
}
// HTML을 Canvas에 렌더링하는 함수
async function addHtml() {
    const html = editor.root.innerHTML;
    const div = document.createElement('div');
    div.innerHTML = html;
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.pointerEvents = 'none';
    div.style.width = '500px'; // Quill 편집기 너비와 일치시킴
    div.style.left = '-9999px';
    document.body.appendChild(div);
    // foreignObject를 위한 SVG 생성
    const size = await getImageSize(html);
    const data = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${html}
        </div>
      </foreignObject>
    </svg>
  `;
    // SVG 데이터를 base64로 인코딩
    const encodedData = encodeURIComponent(data);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedData}`;
    try {
        // 이미지 로드 및 Konva Image 객체 생성
        const img = await loadImage(dataUrl);
        const image = new Konva.Image({
            x: 10,
            y: 10,
            image: img,
            draggable: true
        });
        layer.add(image);
        layer.draw();
        document.body.removeChild(div);
    }
    catch (error) {
        console.error('Error loading image:', error);
        document.body.removeChild(div);
    }
}
// 버튼 이벤트 등록
(_a = document.getElementById('add')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addHtml);
// 윈도우 리사이즈 처리
window.addEventListener('resize', () => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
});
//# sourceMappingURL=app.js.map