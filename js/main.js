// 전역변수 피한다 
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        { //0
            type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
			}
		},
		{// 1
			type: 'normal',
			// heightNum: 5, // type normal에서는 필요 없음
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
				content: document.querySelector('#scroll-section-1 .description')
			}
		},
		{// 2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
				canvas: document.querySelector('#video-canvas-1'),
				context: document.querySelector('#video-canvas-1').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 960,
				imageSequence: [0, 959],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
				messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
				messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
				pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
            }
        },
        { //3
            type: 'sticky',
            heightNum: 4,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('#scroll-section-3 .canvas-caption'),
                canvas: document.querySelector('#scroll-section-3 .image-blend-canvas'),
                context: document.querySelector('#scroll-section-3 .image-blend-canvas').getContext('2d'),
                ImagePath: [
                    './images/blend-image-1.jpg',
                    './images/blend-image-2.jpg',
                ],
                images: []
            },
            values:{
                rect1X: [0, 0, {start: 0, end:0}],
                rect2X: [0, 0, {start: 0, end:0}],
                blendHeight: [0, 0, {start: 0, end:0}],
                canvas_scale: [0, 0, {start: 0, end:0}],
                canvasCaption_opacity: [0, 1, {start: 0, end:0}],
                canvasCaption_translateY: [20, 0, {start: 0, end:0}],
                rectStartY: 0 //기준점
            }
        }
    ]

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image(); 
            // == imgElem = document.createElement('img');
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image(); 
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }
        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.ImagePath.length; i++) {
            imgElem3 = new Image(); 
            imgElem3.src = sceneInfo[3].objs.ImagePath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }

    function checkMenu(){
        if(yOffset > 44){
            document.body.classList.add('local-nav-sticky');
        }else{
            document.body.classList.remove('local-nav-sticky');
        }
    }

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal'){
                // sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.yOffsetHeight;
                // sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight + window.innerHeight;
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset = window.pageYOffset;

        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;

        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 씬에서 스크롤 된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3){
            // 부분 스크롤 start ~ end 사이에 애니메이션 실행
            // 부분 스크롤(start ~ end)의 값 = (end - start) * 현재화면(currentScene = 0)높이
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                // 부분 스크롤 영역 비율 = 부분 스크롤 start ~ end 사이의 값 - (현재 스크롤 된 좌표 - start)
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
                // console.log('current' + rv)
                // 여기에서 캔버스 비율 잡아야 함..ㅠ 0.45345 이런거..
            } else if (currentYOffset > partScrollStart) {
                // 현재 스크롤 좌표가 부분 스크롤 시작점 보다 클 때
                rv = values[1];
            } else if (currentYOffset < partScrollStart) {
                // 현재 스크롤 좌표가 부분 스크롤 시작점 보다 작을 때
                rv = values[0];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; 

        switch (currentScene) {
            // 이미지의 불투명도 오류: 스크롤을 아래로 내릴 때, 불투명도가 1에서 0으로 변경이 되어야 하는데 0.09898.. 이런 식으로 소수점이 붙어 버림
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                let messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                let messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                let messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = messageA_opacity_in;
                    objs.messageA.style.transform = `translate3d(0, ${messageA_translateY_in}%, 0)`;
                }else {
                    objs.messageA.style.opacity = messageA_opacity_out;
                    objs.messageA.style.transform = `translate3d(0, ${messageA_translateY_out}%, 0)`;
                }
                if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}

				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}

				break;

			case 2:
				// console.log('2 play');
				// let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5){
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }
				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
                if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}

				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}

                // 3번 캔버스 미리보기
                if (scrollRatio > 0.9){
                    const objs = sceneInfo[3].objs;
					const values = sceneInfo[3].values;
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
						// 캔버스보다 브라우저 창이 홀쭉한 경우
						canvasScaleRatio = heightRatio;
					} else {
						// 캔버스보다 브라우저 창이 납작한 경우
						canvasScaleRatio = widthRatio;
					}

                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					// objs.context.fillStyle = 'white';
					objs.context.drawImage(objs.images[0], 0, 0);

                    // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 좌우 흰색 박스 그리기
                    objs.context.fillRect(
                        parseInt(values.rect1X[0]), 
                        0, 
                        parseInt(whiteRectWidth), 
                        objs.canvas.height
                    );
					objs.context.fillRect(
                        parseInt(values.rect2X[0]), 
                        0, 
                        parseInt(whiteRectWidth), 
                        objs.canvas.height
                    );
                }

                break;
            
            case 3:
                // 가로/세로 모두 꽉차게 하기 위해 여기서 연산
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 긴 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = 'white';
				objs.context.drawImage(objs.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                if (!values.rectStartY){
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    /* 
                        offsetTop은 변형된 값은 사용하지 않음, FM. 그래서 아래와 같이 계산 해야함
                        비율로 변형된 offsetTop 값 = {캔버스 높이 - (캔버스 높이 * 비율)} / 2
                        비율로 줄어든 캔버스 높이 = (캔버스 높이 * 비율)
                     */
                    // 스크롤링 속도에 따라 값이 바뀜(현재 타이밍에 맞춰 값을 표출함)
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)), 
                    0, 
                    parseInt(whiteRectWidth), 
                    objs.canvas.height
                );
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)), 
                    0, 
                    parseInt(whiteRectWidth), 
                    objs.canvas.height
                );

                // 캔버스가 브라우저 상단에 닿지 않았다면
                if(scrollRatio < values.rect1X[2].end){
                    console.log('0 캔버스 닿기 전')
                    objs.canvas.classList.remove('sticky');
                }else {
                    console.log('1 캔버스 닿은 후');
                    
                    // 이미지 블렌드
                    // objs.context.drawImage(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight); sy~ : 변경전원본, dy~ : 변경후 이미지
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                    
                    objs.context.drawImage(objs.images[1], 
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );
                        
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;
                        
                    if(scrollRatio > values.blendHeight[2].end){
                        console.log('2 축소 시작');
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);                        
                        values.canvas_scale[2].start = values.blendHeight[2].end;          
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;
                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)}`;
                        objs.canvas.style.marginTop = 0;
                    }
                    if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0){
                        console.log('3 스크롤 시작');
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        values.canvasCaption_translateY[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0`;
                    }
                }

                break;
            }
        
    }
 
     function scrollLoop() {
        prevScollHeight = 0;
        enterNewScene = false;

        for (let i = 0; i < currentScene; i++) {
            prevScollHeight += sceneInfo[i].scrollHeight;
        }

        if (delayedYOffset < prevScollHeight + sceneInfo[currentScene].scrollHeight) {
            document.body.classList.remove('scroll-effect-end');
        }
        if (delayedYOffset > prevScollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            if(currentScene === sceneInfo.length - 1){
                document.body.classList.add('scroll-effect-end');
            }
            if(currentScene < sceneInfo.length - 1){
                currentScene++;
            }
        }

        if (delayedYOffset < prevScollHeight) {
            if (currentScene === 0) return;
            //브라우저 바운스 효과로 마이너스가 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
        }

        document.body.setAttribute('id', `show-scene-${currentScene}`);     

        if (enterNewScene) return;

        playAnimation();
    }

    function loop(){
        // (점점 감속하는 스크롤) = 현재지점 + (목표지점 - 현재지점) * 0.1
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if (!enterNewScene) {
            if(currentScene === 0 || currentScene === 2){
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                const currentYOffset = delayedYOffset - prevScollHeight;
    
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if(objs.videoImages[sequence]){
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

        rafId = requestAnimationFrame(loop);

        if(Math.abs(yOffset - delayedYOffset) < 1){
            cancelAnimationFrame(rafId);
            rafState = false;
        }

    }

   
    window, addEventListener('load', () => {
        // debugger;
        document.body.classList.remove('before-load');
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

        // 첫 로딩 때 아무것도 안뜨니, 시간차로 찔끔찔끔 스크롤 해서 화면을 띄워줌
        // 0.02초
        if(yOffset > 0){
            let tempYOffset = yOffset;
            let tempScrollCount = 0;
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;
                tempScrollCount++;

                // console.log('tempScrollCount ' + tempScrollCount);

                if(tempScrollCount > 10){
                    clearInterval(siId);
                }
            }, 20);
        }
        
        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset; // 현재 스크롤 위치
            scrollLoop();
            checkMenu();
    
            if(!rafState){
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', () => {
            if(window.innerWidth > 900){
                // setLayout();
                // sceneInfo[3].values.rectStartY = 0;
                window.location.reload();
            }
        });

        window.addEventListener('orientationchange', () => {
            scrollTo(0, 0);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } );

        document.querySelector('.loading').addEventListener('transitionend', (e) => {
            document.body.removeChild(e.currentTarget);
        });
    });

    // 이미지 로딩 후 시작
    /* 돔이 로딩 되면 시작(더 빠름)
    window,addEventListener('DOMContentLoaded', setLayout);  */
    // window,addEventListener('load', setLayout);
    

    setCanvasImages();




})();