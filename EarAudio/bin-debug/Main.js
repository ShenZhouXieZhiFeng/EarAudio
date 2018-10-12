var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        window['main'] = _this;
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        this.runGame();
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, platform.login()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 3:
                        userInfo = _a.sent();
                        // console.log(userInfo);
                        this.playAudio();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.playAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, arraybuffer, ac, audioBuffer, source, channleNode, gainNodeLeft, gainNodeRight, mergerNode, analyser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "http://127.0.0.1:5064/resource/sounds/boom.mp3";
                        return [4 /*yield*/, this.loadSoundAsync(url)];
                    case 1:
                        arraybuffer = _a.sent();
                        ac = new AudioContext();
                        return [4 /*yield*/, this.decodeAudioBuffer(arraybuffer, ac)];
                    case 2:
                        audioBuffer = _a.sent();
                        source = ac.createBufferSource();
                        source.buffer = audioBuffer;
                        channleNode = ac.createChannelSplitter(2);
                        source.connect(channleNode);
                        gainNodeLeft = ac.createGain();
                        gainNodeLeft.gain.value = 1;
                        channleNode.connect(gainNodeLeft, 0);
                        this.leftGain = gainNodeLeft;
                        gainNodeRight = ac.createGain();
                        gainNodeRight.gain.value = 1;
                        channleNode.connect(gainNodeRight, 1);
                        this.rightGain = gainNodeRight;
                        mergerNode = ac.createChannelMerger(2);
                        gainNodeLeft.connect(mergerNode, 0, 0);
                        gainNodeRight.connect(mergerNode, 0, 1);
                        analyser = ac.createAnalyser();
                        this.analyseNode = analyser;
                        this.audioAnalyser = analyser;
                        mergerNode.connect(analyser);
                        analyser.connect(ac.destination);
                        this.setAnalyse();
                        source.start(0);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.setAnalyse = function () {
        var analyseNode = this.analyseNode;
        // analyseNode.fftSize = 2048; // frame1
        analyseNode.fftSize = 256; // frame2
        var bufferLength = analyseNode.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        this.analyseDataArray = dataArray;
        var eCanvas = document.getElementsByTagName("canvas")[0];
        var drawCanvas = document.createElement("canvas");
        drawCanvas.width = Main.WIDTH;
        drawCanvas.height = Main.HEIGHT;
        this.drawCanvas = drawCanvas;
        eCanvas.parentElement.appendChild(drawCanvas);
        var contex = drawCanvas.getContext("2d");
        this.canvasCtx = contex;
        console.error(contex);
    };
    Main.prototype.beginDraw = function () {
        var timer = new egret.Timer(100, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, this.analyseFrame2, this);
        timer.addEventListener(egret.TimerEvent.TIMER, this.analyseFrame1, this);
        timer.start();
        // this.addEventListener(egret.Event.ENTER_FRAME, this.analyseFrame1, this);
    };
    Main.prototype.analyseFrame2 = function () {
        var analyseNode = this.analyseNode;
        var dataArray = this.analyseDataArray;
        var bufferSize = dataArray.length;
        var ctx = this.canvasCtx;
        var width = this.drawCanvas.width;
        var height = this.drawCanvas.height;
        ctx.clearRect(0, 0, width, height);
        analyseNode.getByteTimeDomainData(dataArray);
        var barWidth = (Main.WIDTH / bufferSize) * 2.5;
        var barHeight;
        var x = 0;
        for (var i = 0; i < bufferSize; i++) {
            barHeight = dataArray[i] / 2 + 100;
            ctx.fillStyle = 'rgb(' + (barHeight * 10) + ',50,50)';
            ctx.fillRect(x, Main.HEIGHT - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
        ctx.stroke();
    };
    Main.prototype.analyseFrame1 = function () {
        var analyseNode = this.analyseNode;
        var dataArray = this.analyseDataArray;
        var bufferSize = dataArray.length;
        var ctx = this.canvasCtx;
        var width = this.drawCanvas.width;
        var height = this.drawCanvas.height;
        // ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(200,200,200)';
        // ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.beginPath();
        analyseNode.getByteTimeDomainData(dataArray);
        var x = 0;
        var sliceWidth = width * 1.0 / bufferSize;
        for (var i = 0; i < bufferSize; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * height / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
    };
    /**
     * 0 1 other
     */
    Main.prototype.changeChannel = function (flag) {
        var leftVolume = 1;
        var rightVolume = 1;
        if (flag == 0) {
            leftVolume = 0.1;
        }
        else if (flag == 1) {
            rightVolume = 0.1;
        }
        var _time = 500;
        var leftGain = this.leftGain.gain;
        var rightGain = this.rightGain.gain;
        egret.Tween.get(leftGain).to({ value: leftVolume }, _time);
        egret.Tween.get(rightGain).to({ value: rightVolume }, _time);
    };
    Main.prototype.decodeAudioBuffer = function (buffer, ctx) {
        if (ctx === void 0) { ctx = null; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        if (!ctx) {
                            ctx = new AudioContext();
                        }
                        ctx.decodeAudioData(buffer, function (audioBuffer) {
                            resolve(audioBuffer);
                        });
                    })];
            });
        });
    };
    Main.prototype.loadSoundAsync = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var req = new XMLHttpRequest();
                        req.open('GET', url, true);
                        req.responseType = "arraybuffer";
                        req.onload = function () {
                            resolve(req.response);
                        };
                        req.send();
                    })];
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.WIDTH = 1280;
    Main.HEIGHT = 720;
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map