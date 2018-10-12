class Main extends egret.DisplayObjectContainer {

    private static WIDTH = 1280;
    private static HEIGHT = 720;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        window['main'] = this;
    }

    private onAddToStage(event: egret.Event) {
        this.runGame();
    }

    private async runGame() {
        await this.loadResource()
        await platform.login();
        const userInfo = await platform.getUserInfo();
        // console.log(userInfo);
        this.playAudio();
    }

    private leftGain: GainNode;
    private rightGain: GainNode;
    private audioAnalyser: AnalyserNode;
    private analyseNode: AnalyserNode;
    private async playAudio() {
        let url = "http://127.0.0.1:5064/resource/sounds/boom.mp3";
        let arraybuffer = await this.loadSoundAsync(url);
        let ac = new AudioContext();
        let audioBuffer = await this.decodeAudioBuffer(arraybuffer, ac);
        let source = ac.createBufferSource();
        source.buffer = audioBuffer;

        // 通道控制
        let channleNode: ChannelSplitterNode = ac.createChannelSplitter(2);
        source.connect(channleNode);

        // 左声道音量控制
        let gainNodeLeft = ac.createGain();
        gainNodeLeft.gain.value = 1;
        channleNode.connect(gainNodeLeft, 0);
        this.leftGain = gainNodeLeft;

        // 右声道音量控制
        let gainNodeRight = ac.createGain();
        gainNodeRight.gain.value = 1;
        channleNode.connect(gainNodeRight, 1);
        this.rightGain = gainNodeRight;

        // 处理完的两个声音重新合并
        let mergerNode: ChannelMergerNode = ac.createChannelMerger(2);
        gainNodeLeft.connect(mergerNode, 0, 0);
        gainNodeRight.connect(mergerNode, 0, 1);

        // 将合并的声音输出
        // mergerNode.connect(ac.destination);

        // 插入分析器
        let analyser: AnalyserNode = ac.createAnalyser();
        this.analyseNode = analyser;
        this.audioAnalyser = analyser;
        mergerNode.connect(analyser);
        analyser.connect(ac.destination);
        this.setAnalyse();

        source.start(0);
    }

    private analyseDataArray: Uint8Array;
    private canvasCtx: CanvasRenderingContext2D;
    private drawCanvas: HTMLCanvasElement;

    private setAnalyse() {
        let analyseNode = this.analyseNode;
        // analyseNode.fftSize = 2048; // frame1
        analyseNode.fftSize = 256; // frame2
        let bufferLength = analyseNode.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyseDataArray = dataArray;

        let eCanvas = document.getElementsByTagName("canvas")[0];
        var drawCanvas: HTMLCanvasElement = document.createElement("canvas");
        drawCanvas.width = Main.WIDTH;
        drawCanvas.height = Main.HEIGHT;
        this.drawCanvas = drawCanvas;
        eCanvas.parentElement.appendChild(drawCanvas);
        let contex: CanvasRenderingContext2D = drawCanvas.getContext("2d");
        this.canvasCtx = contex;

        console.error(contex);
    }

    private beginDraw()
    {
        let timer = new egret.Timer(100, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, this.analyseFrame2, this);
        timer.addEventListener(egret.TimerEvent.TIMER, this.analyseFrame1, this);
        timer.start();
        // this.addEventListener(egret.Event.ENTER_FRAME, this.analyseFrame1, this);
    }

    private analyseFrame2()
    {
        let analyseNode = this.analyseNode;
        let dataArray = this.analyseDataArray;
        let bufferSize = dataArray.length;

        let ctx = this.canvasCtx;
        let width = this.drawCanvas.width;
        let height = this.drawCanvas.height;
        ctx.clearRect(0, 0, width, height);

        analyseNode.getByteTimeDomainData(dataArray);
        
        let barWidth = (Main.WIDTH / bufferSize) * 2.5;
        let barHeight;
        let x = 0;
        for(let i = 0; i < bufferSize; i ++)
        {
            barHeight = dataArray[i] / 2 + 100;
            ctx.fillStyle = 'rgb(' + (barHeight * 10) +',50,50)';
            ctx.fillRect(x, Main.HEIGHT - barHeight / 2, barWidth, barHeight);

            x += barWidth + 1;
        }

        ctx.stroke();
    }

    private analyseFrame1() {
        let analyseNode = this.analyseNode;
        let dataArray = this.analyseDataArray;
        let bufferSize = dataArray.length;

        let ctx = this.canvasCtx;
        let width = this.drawCanvas.width;
        let height = this.drawCanvas.height;
        // ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgb(200,200,200)';
        // ctx.fillRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.beginPath();

        analyseNode.getByteTimeDomainData(dataArray);
        
        let x = 0;
        let sliceWidth = width * 1.0 / bufferSize;
        for(let i = 0;i < bufferSize; i ++)
        {
            let v = dataArray[i] / 128.0;
            let y = v * height / 2;

            if(i === 0)
            {
                ctx.moveTo(x,y);
            }
            else
            {
                ctx.lineTo(x,y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
    }

    /**
     * 0 1 other
     */
    public changeChannel(flag) {
        let leftVolume = 1;
        let rightVolume = 1;
        if (flag == 0) {
            leftVolume = 0.1;
        }
        else if (flag == 1) {
            rightVolume = 0.1
        }
        let _time = 500;
        let leftGain = this.leftGain.gain;
        let rightGain = this.rightGain.gain;
        egret.Tween.get(leftGain).to({ value: leftVolume }, _time);
        egret.Tween.get(rightGain).to({ value: rightVolume }, _time);
    }

    async decodeAudioBuffer(buffer, ctx = null): Promise<any> {
        return new Promise((resolve) => {
            if (!ctx) {
                ctx = new AudioContext();
            }
            ctx.decodeAudioData(buffer, (audioBuffer) => {
                resolve(audioBuffer);
            })
        })
    }

    async loadSoundAsync(url): Promise<any> {
        return new Promise((resolve) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.responseType = "arraybuffer";
            req.onload = () => {
                resolve(req.response);
            }
            req.send();
        })
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }
}