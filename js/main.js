// 전역변수 피한다 
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [{ //0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight setting
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2}],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3}],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2}],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3}],
                // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4}],
                // messageB_opacity_out: [0, 1, { start: 0.3, end: 0.4}],
            }
        },
        { //1
            type: 'normal',
            // heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        { //2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        { //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ]

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal'){
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.yOffsetHeight;
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
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);

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
            } else if (currentYOffset < partScrollStart) {
                // 현재 스크롤 좌표가 부분 스크롤 시작점 보다 작을 때
                rv = values[0];
            } else if (currentYOffset > partScrollStart) {
                // 현재 스크롤 좌표가 부분 스크롤 시작점 보다 클 때
                rv = values[1];
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
        const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 씬의 scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; 

        switch (currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
                let messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
                let messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);
                let messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

                if (scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = messageA_opacity_in;
                    objs.messageA.style.transform = `translate3d(0, ${messageA_translateY_in}%, 0)`;
                }else {
                    objs.messageA.style.opacity = messageA_opacity_out;
                    objs.messageA.style.transform = `translate3d(0, ${messageA_translateY_out}%, 0)`;
                }
                console.log(messageA_translateY_in, messageA_translateY_out);
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
        
    }

    function scrollLoop() {
        prevScollHeight = 0;
        enterNewScene = false;
        for (let i = 0; i < currentScene; i++) {
            prevScollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
        }

        if (yOffset < prevScollHeight) {
            if (currentScene === 0) return; //브라우저 바운스 효과로 마이너스가 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
        }

        if (enterNewScene) return;

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset; // 현재 스크롤 위치
        scrollLoop();
    });
    window, addEventListener('DOMContentLoaded', setLayout); // 돔이 로딩 되면 시작(더 빠름)
    // window,addEventListener('load', setLayout); // 이미지 로딩 후 시작
    window.addEventListener('resize', setLayout);


    setLayout();


})();