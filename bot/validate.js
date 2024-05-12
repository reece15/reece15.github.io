const functions = (function (){
    const TYPE_MAPPING = {
        SPIDER: '网络蜘蛛',
        BOT: '无JS运行环境的爬虫',
        BOT_V8: '模拟JS运行环境的爬虫',
        HEADLESS: '无头浏览器'
    }

    return {
        test_bot: [() => {
                const test_match = /baidu|google|sogou|spider|bot|python|java|PhantomJS/i.test(window.navigator.userAgent);
                return [test_match, window.navigator.userAgent];
            },
            'navigator.userAgent',
            'user-agent中是否有常见爬虫user-agent包含的字符 如spider, bot, baidu, python,PhantomJS等',
            TYPE_MAPPING.SPIDER
        ],

        test_env_window: [() => {
                const test_ok = !window || window === document;
                return [test_ok, window.toString()];
            },
            'window',
            'window 对象是否存在, window !== document',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_navigator: [() => {
                return [!window.navigator, window.navigator.toString()];
            },
            'navigator',
            'navigator对象是否存在',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_onmouseover: [() => {
                return [document.onmouseover === undefined, document.onmouseover];
            },
            'document.onmouseover',
            'document.onmouseover是否存在',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_title: [() => {
                return [document.title === undefined || document.title.length === 0, document.title];
            },
            'document.title',
            'document.title是否存在',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_platform: [() => {
                return [!navigator.platform, navigator.platform];
            },
            'navigator.platform',
            'navigator.platform是否存在',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_location: [() => {
                const test_ok = window.location !== undefined && window.location.href !== undefined;
                return [!test_ok, !test_ok ? null : window.location.href];
            },
            'window.location.href',
            'window.location.href是否存在',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_history: [() => {
                let test_ok = history
                    && history.length !== undefined
                    && history.scrollRestoration !== undefined;
                let result = !test_ok ? 'history不存在' : '';

                const string = new Array(1024 * 1024 * 3).join('T');
                const href = window.location.href;

                try {
                    history.replaceState({x: 0x1111, p: string}, 'A:TEST');
                }catch (e) {
                    test_ok = false;
                    result += `执行history.replaceState title异常. ${e.name || e.message}`;
                }

                try {
                    history.replaceState({x: 0xfffe},  'A:AAAA', 'https://www$.$$$$.$$/');
                }catch (e) {
                    if ((e.name || e.message) !== 'SecurityError') {
                        test_ok = false;
                        result += `执行history.replaceState 无效域名异常. ${e.name || e.message}`;
                    }

                }finally {
                    history.replaceState({}, "", href);
                }
                return [!test_ok, !test_ok ? result : '正常'];
            },
            '历史记录',
            'window.history是否正常. ' +
            'history.length > 0. ' +
            'history.scrollRestoration是否存在.' +
            '执行history.replaceState是否正常. ' +
            '执行history.replaceState 无效域名时, 检测异常是否为SecurityError. ',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_iframe_normal: [() => {
                const iframe = document.createElement('iframe')
                iframe.style.display='none';
                document.body.appendChild(iframe);
                iframe.contentDocument.write("<p class=\'test\'>test</p><input type=\'password\' id=\'test\' value=\'000\'/>");
                const test_ok = iframe.contentDocument.getElementById("test") &&
                    iframe.contentDocument.getElementById("test").value == '000';
                document.body.removeChild(iframe);
                return [!test_ok, !test_ok ? null: '支持'];
            },
            '是否支持iframe',
            '创建iframe, 并创建 段落和password类型input,尝试用id读取input和p,尝试读取input password的value',
            TYPE_MAPPING.BOT_V8
        ],

        test_env_devtool: [(cb) => {
                const devtool = new Date();
                let flag = false;
                devtool.toString = function() {
                    if (flag) {
                        cb();
                    }
                    flag = true;
                }

                console.log('', devtool);
                return [false, '正在检测中'];
            },
            'devtool',
            '检测是否开启控制台或者调试',
            TYPE_MAPPING.HEADLESS
        ],


        test_user_agent: [() => {
                const flag = /headless/i.test(window.navigator.userAgent);
                return [flag, window.navigator.userAgent];
            },
            'navigator.userAgent',
            'useragent是否含有headless. chromedriver启动的chrome，useragent中会有headless字符串',
            TYPE_MAPPING.HEADLESS
        ],

        test_plugins: [()=> {
                let length = navigator.plugins.length;
                return [length === 0, length];
            },
            'navigator.plugins',
            'navigator.plugins 会返回一个数组，里面是当前浏览器里的插件信息。通常，普通Chrome浏览器有一些缺省插件，比如 Chrome PDF viewer 或 Google Native Client。相反，在无头模式里，没有任何插件，返回的是个空数组。',
            TYPE_MAPPING.HEADLESS
        ],

        test_languages: [()=> {
                let languages = window.navigator.languages;
                return [!languages, languages];
            },
            'navigator.languages',
            '在无头模式里，navigator.languages 返回的是个空字符串。',
            TYPE_MAPPING.HEADLESS
        ],

        // test_env_speechSynthesis: [() => {
        //         let result = '';
        //         let test_ok = window.speechSynthesis !== undefined && window.speechSynthesis.getVoices();
        //         const names = ['removeEventListener', 'onvoiceschanged', 'addEventListener'].filter(name => window.speechSynthesis[name] === undefined);
        //         const voices = window.speechSynthesis.getVoices()
        //
        //         if (!test_ok) {
        //             result = 'window.speechSynthesis = null';
        //         }
        //         if (names && names.length > 0) {
        //             test_ok = false;
        //             result += `${names} 是 undefined`
        //         }
        //
        //         console.log(voices);
        //
        //         if (voices.length === 0) {
        //             test_ok = false;
        //             result += ` window.speechSynthesis.getVoices()返回数量为0`
        //         }
        //
        //         return [!test_ok, result];
        //     },
        //     'window.speechSynthesis',
        //     'Web Speech API语音合成功能是否完整. ' +
        //     '主要检测window.speechSynthesis是否存在，window.speechSynthesis.getVoice()返回数量是否大于0，' +
        //     'window.speechSynthesis下是否存在removeEventListener, onvoiceschanged, addEventListener方法',
        //     TYPE_MAPPING.HEADLESS
        // ],

        test_env_permission: [() => {
                return [!Notification.permission, Notification.permission];
            },
            'Notification.permission',
            'Notification.permission是否存在',
            TYPE_MAPPING.HEADLESS
        ],

        test_env_webdriver: [() => {
                return [navigator.webdriver, navigator.webdriver];
            },
            'navigator.webdriver',
            'navigator.webdriver是否存在.chromedriver启动的chrome会存在这个值',
            TYPE_MAPPING.HEADLESS
        ],

        test_env_chrome: [() => {
                let test_ok = true;
                let result = '';
                console.log(window.chrome);
                if (!window.chrome || !window.chrome.csi || !window.chrome.app || ! window.chrome.loadTimes) {
                    test_ok = false;
                    result = '当前是chrome浏览器但缺少必要属性window.chrome';
                }
                return [!test_ok, result];
            },
            'window.chrome',
            'window.chrome是否存在',
            TYPE_MAPPING.HEADLESS
        ],

        test_env_webgl: [() => {
                const gl = document.createElement('canvas').getContext('webgl');

                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

                const flag = vendor === "Brian Paul" && renderer === "Mesa OffScreen";
                return [flag, `webgl vendor:${vendor}, webgl renderer: ${renderer}`];
            },
            'webgl',
            'vendor是Mesa OffScreen, renderer是Brian Paul ',
            TYPE_MAPPING.HEADLESS
        ],

        test_idc: [()=> {
                const idc = '$cdc_asdjflasutopfhvcZLmcfl_';
                const flag = idc in document;
                return [flag, flag ? idc: null];
            },
            '$cdc_asdjflasutopfhvcZLmcfl_',
            'document.$cdc_asdjflasutopfhvcZLmcfl_是否存在. chromedriver二进制数据里包含改字段，会设置到document上',
            TYPE_MAPPING.HEADLESS
        ],
    };
})();