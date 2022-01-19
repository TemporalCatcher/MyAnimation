class Animator {
    constructor(spritesheet, xLeft, yTop, width, height, startFrame, frameCount, frameDuration, framePadding, oscillate, loop) {
        Object.assign(this, { spritesheet, xLeft, yTop, height, width, startFrame, frameCount, frameDuration, framePadding, oscillate, loop});

        this.elapsedTime = 0;
        if (this.oscillate) this.totalTime = this.frameCount * 2 * this.frameDuration;
        else this.totalTime = this.frameCount * this.frameDuration;
        this.count = 0;

        this.done = false;
    };

    drawFrame(tick, ctx, x, y, scale) {
        this.elapsedTime += tick;

        if (this.isDone()) {
            this.done = true;
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            } else {
                this.elapsedTime -= tick;
            }
        }
        else this.done = false;

        let frame = this.startFrame + this.currentFrame();
        if (this.oscillate) {
            if (frame >= this.frameCount) {
                frame = 2*this.frameCount-frame-1;
                if (frame < 0) {
                    frame = -frame -1;
                }
            }
        }
        
        ctx.drawImage(this.spritesheet,
            this.xLeft + frame * (this.width + this.framePadding), this.yTop, //source from sheet
            this.width, this.height,
            x-this.width * scale / 2, y-this.height * scale / 2,
            this.width * scale,
            this.height * scale);
        /*
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Green';
            ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        }*/
    };

    currentFrame() {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    isDone() {
        return (this.elapsedTime >= this.totalTime);
    };
};