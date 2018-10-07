var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ResConfig = (function () {
    function ResConfig() {
    }
    ResConfig.sound_boom = "boom_mp3";
    return ResConfig;
}());
__reflect(ResConfig.prototype, "ResConfig");
//# sourceMappingURL=ResConfig.js.map