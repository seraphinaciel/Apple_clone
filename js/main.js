// 전역변수 피한다 
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 활성화된 씬(scroll-section)

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
                messageA_opacity: [0, 1]
            }
        },
        { //1
            type: 'normal',
            heightNum: 5,
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
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScollHeight;

        switch (currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
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
        for (let i = 0; i < currentScene; i++) {
            prevScollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
        }

        if (yOffset < prevScollHeight) {
            if (currentScene === 0) return; //브라우저 바운스 효과로 마이너스가 되는 것을 방지(모바일)
            currentScene--;
        }

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