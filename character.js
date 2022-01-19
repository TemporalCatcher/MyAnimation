const mc = {state:{idle:0, idle2:1, walk:2, run:3, jump:4, 
                    fall:5, wall_slide:6, wall_jump: 7},
            dir:{right:0, left:1}};
class Character {
    constructor(game, x, y, t) {
        Object.assign(this, {game, x, y, t});
        this.spritesheet = ASSET_MANAGER.getAsset("./Animation.png");
        this.hair =  ASSET_MANAGER.getAsset("./hair.png");
        this.ponytail = [{x:4, y:4}, {x:64, y:100}, {x:64, y:100}, {x:64, y:100}];

        this.w = 16;
        this.h = 32;

        this.velocity = {x:0, y:0};
        this.acceleration = {x:0, y:8};

        this.state = mc.state.fall;
        this.dir = mc.dir.right;

        this.animations = [];
        this.animate_hair = [];
        this.loadAnimations();

        this.animation = this.animations[0][0];
        this.animate = 0;
        this.elapsedTime = 0;
    }

    // loads all sprite animation as well as location of the first hair relative to the sprite
    loadAnimations() {
        for (var i = 0; i < 8; i++) {
            this.animations.push([]); // animation type
            this.animate_hair.push([]);
            for (var j = 0; j < 2; j++) {
                this.animations[i].push([]); //facing
                this.animate_hair[i].push([]);
            }
        }
        
        let state = null;
        const right = mc.dir.right;
        const left = mc.dir.left;

        // idle animations
        state = mc.state.idle;
        this.animations[state][right] = new Animator(this.spritesheet, 0, 0, 32, 32, 0, 3, 0.4, 0, true, true);
        this.animate_hair[state][right] = [{x:4, y:-4}, {x:4, y:-4}, {x:4, y:-4}, {x:4, y:-4}, {x:4, y:-4}, {x:4, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 0, 32, 32, 32, 0, 3, 0.4, 0, true, true);
        this.animate_hair[state][left] = [{x:12, y:-4}, {x:12, y:-4}, {x:12, y:-4}, {x:12, y:-4}, {x:12, y:-4}, {x:12, y:-4}];
        
        // idle 2 animations
        state = mc.state.idle2;
        this.animations[state][right] = new Animator(this.spritesheet, 0, 64, 32, 32, 2, 5, 0.15, 0, true, true);
        this.animate_hair[state][right] = [{x:4, y:-4}, {x:3, y:-4}, {x:2, y:-3}, {x:2, y:-3}, {x:3, y:-4},
                                   {x:4, y:-4}, {x:5, y:-4}, {x:6, y:-3}, {x:6, y:-3}, {x:5, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 0, 96, 32, 32, 2, 5, 0.15, 0, true, true);
        this.animate_hair[state][left] = [{x:12, y:-4}, {x:13, y:-4}, {x:14, y:-3}, {x:14, y:-3}, {x:13, y:-4},
            {x:12, y:-4}, {x:11, y:-4}, {x:10, y:-3}, {x:10, y:-3}, {x:11, y:-4}];

        // walk animations
        state = mc.state.walk;
        this.animations[state][right] = new Animator(this.spritesheet, 0, 128, 32, 32, 0, 8, 0.15, 0, false, true);
        this.animate_hair[state][right] = [{x:0, y:-4}, {x:0, y:-3}, {x:2, y:-4}, {x:4, y:-4}, {x:4, y:-4},
            {x:4, y:-3}, {x:2, y:-4}, {x:0, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 0, 160, 32, 32, 0, 8, 0.15, 0, false, true);
        this.animate_hair[state][left] = [{x:16, y:-4}, {x:16, y:-3}, {x:14, y:-4}, {x:12, y:-4}, {x:12, y:-4},
            {x:12, y:-3}, {x:14, y:-4}, {x:16, y:-4}];

        // run animations
        state = mc.state.run;
        this.animations[state][right] = new Animator(this.spritesheet, 0, 192, 32, 32, 0, 8, 0.1, 0, false, true);
        this.animate_hair[state][right] = [{x:3, y:-4}, {x:3, y:-3}, {x:5, y:-4}, {x:7, y:-4}, {x:7, y:-4},
            {x:7, y:-3}, {x:5, y:-4}, {x:3, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 0, 224, 32, 32, 0, 8, 0.1, 0, false, true);
        this.animate_hair[state][left] = [{x:13, y:-4}, {x:13, y:-3}, {x:11, y:-4}, {x:9, y:-4}, {x:9, y:-4},
            {x:9, y:-3}, {x:11, y:-4}, {x:13, y:-4}];

        // jump animations
        state = mc.state.jump;
        this.animations[state][right] = new Animator(this.spritesheet, 32, 256, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][right] = [{x:8, y:-2}, {x:5, y:-3}];
        this.animations[state][left] = new Animator(this.spritesheet, 32, 288, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][left] = [{x:8, y:-2}, {x:11, y:-3}];

        // fall animations
        state = mc.state.fall;
        this.animations[state][right] = new Animator(this.spritesheet, 64, 256, 32, 32, 0, 4, 0.15, 0, false, false);
        this.animate_hair[state][right] = [{x:4, y:-3}, {x:5, y:-4}, {x:5, y:-5}, {x:6, y:-6}];
        this.animations[state][left] = new Animator(this.spritesheet, 64, 288, 32, 32, 0, 4, 0.15, 0, false, false);
        this.animate_hair[state][left] = [{x:12, y:-3}, {x:11, y:-4}, {x:11, y:-5}, {x:10, y:-6}];

        // wall slide animations
        state = mc.state.wall_slide;
        this.animations[state][right] = new Animator(this.spritesheet, 192, 256, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][right] = [{x:4, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 192, 288, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][left] = [{x:12, y:-4}];

        // wall jump animations
        state = mc.state.wall_jump;
        this.animations[state][right] = new Animator(this.spritesheet, 224, 256, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][right] = [{x:4, y:-4}];
        this.animations[state][left] = new Animator(this.spritesheet, 224, 288, 32, 32, 0, 1, 0.15, 0, false, false);
        this.animate_hair[state][left] = [{x:12, y:-4}];
    }

    update() {
        this.elapsedTime += this.game.clockTick;
        const scale = 4;
        const w = this.w * scale / 2;
        const h = this.h * scale / 2;
        const walk_speed = 10;
        const run_speed = 20;
        const wjump_spd = {x: 30, y: -35};
        const jump_min = -45;
        const max_fall = 45;
        const hold_max = 64;
        const dt = this.game.clockTick * 20;
        const fall_spd = 4;
        const slide_spd = 4;

        const c_height = this.game.ctx.canvas.height;
        const c_width = this.game.ctx.canvas.width;

        this.x = updatePosition(this.x, this.velocity.x, 0, dt);
        this.velocity.x = updateVelocity(this.velocity.x, 0, dt);

        this.y = updatePosition(this.y, this.velocity.y, this.acceleration.y, dt);
        this.velocity.y = updateVelocity(this.velocity.y, this.acceleration.y, dt);
        
        // collision with the edge of the screen
        {
            let check = this.y + h - c_height;
            if (check < 0 && this.velocity.y >= 0 && this.state != mc.state.fall && (this.animate == 10 ||this.animate == 8 || this.animate ==12)) {
                this.state = mc.state.fall;
                this.animations[this.state][this.dir].elapsedTime = 0;
            }
            if (check > 0) {
                this.acceleration.y = 0;
                this.velocity.y = 0;
                this.y -= check;
                this.elapsedTime = 0;
                if (this.animate == 0) {
                    this.animate = 1;
                    this.state = mc.state.idle;
                }
                else if (this.animate == 10) {
                    this.animate = 11;
                    this.state = mc.state.run;
                }
                this.animations[this.state][this.dir].elapsedTime = 0;
            }

            if (this.x - w < 0) {
                this.x = w;
                if (this.animate == 8 && this.velocity.y >= 0) {
                    this.velocity.x = 0;
                    this.state = mc.state.wall_slide;
                    this.dir = mc.dir.right;
                    this.acceleration.y = 2;
                    this.velocity.y = 0;
                    this.animate = 9;
                    this.elapsedTime = 0;
                    this.animations[this.state][this.dir].elapsedTime = 0;
                }
            }

            if (this.x - w > c_width && this.animate == 12) {
                this.animate =13;
                this.elapsedTime = 0;
                this.animations[this.state][this.dir].elapsedTime = 0;
            }
        }

        if (this.animate == 1 && this.elapsedTime >= 3) {
            this.velocity.x = -walk_speed;
            this.dir = mc.dir.left;
            this.state = mc.state.walk;
            this.animate = 2;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 2 && this.elapsedTime > 1){
            this.velocity.x = 0;
            this.state = mc.state.idle;
            this.animate = 3;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 3 && this.elapsedTime >= 2) {
            this.velocity.x = walk_speed;
            this.dir = mc.dir.right;
            this.state = mc.state.walk;
            this.animate = 4;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 4 && this.elapsedTime >= 2) {
            this.velocity.x = 0;
            this.state = mc.state.idle;
            this.animate = 5;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 5 && this.elapsedTime >= 2) {
            this.state = mc.state.idle2;
            this.animate = 6;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 6 && this.elapsedTime >= 4) {
            this.velocity.x = -run_speed;
            this.state = mc.state.run;
            this.dir = mc.dir.left;
            this.animate = 7;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 7 && this.elapsedTime >= 1.25) {
            this.velocity.y = -60;
            this.acceleration.y = 6;
            this.state = mc.state.jump;
            this.animate = 8;
            this.elapsedTime = 0;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 9 && this.elapsedTime >= .75) {
            this.velocity.y = -60;
            this.acceleration.y = 6;
            this.velocity.x = run_speed;
            this.state = mc.state.wall_jump;
            this.animate = 10;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 11 && this.elapsedTime >= .5) {
            this.velocity.y = -60;
            this.acceleration.y = 6;
            this.state = mc.state.jump;
            this.animate = 12;
            this.animations[this.state][this.dir].elapsedTime = 0;
        }
        else if (this.animate == 13) {
            this.velocity.y = 0;
            this.acceleration.y = 6;
            this.velocity.x = 0;
            this.animate = 0;
            this.state = mc.state.fall;
            this.animations[this.state][this.dir].elapsedTime = 0;
            this.x = c_width/2;
            this.y = -128;
        }
        
    }

    draw(ctx) {
        if (this.animation != this.animations[this.state][this.dir]) {
            this.animation = this.animations[this.state][this.dir];
            switch (this.state) {
                case mc.state.run: 
                case mc.state.walk:
                    this.animation.elapsedTime = this.animation.frameDuration * 3;
                    break;
                default :
                    this.animation.elapsedTime = 0;
            }
        }
        const scale = 4;
        // draw ponytail
        {
            const frame = this.animation.currentFrame();
            const hair_frame = this.animate_hair[this.state][this.dir][frame];
            console.log(this.state);
            this.ponytail[0].x = this.x+(hair_frame.x-this.hair.width)*scale;
            this.ponytail[0].y = this.y+(hair_frame.y-this.hair.height)*scale;
            ctx.drawImage(this.hair, this.ponytail[0].x, this.ponytail[0].y, 16*scale, 16*scale);
            const end = this.ponytail.length-1;
            for (let i = 1; i < this.ponytail.length; i++) {
                this.ponytail[i].y += 4;
                const xdir = this.ponytail[i-1].x-this.ponytail[i].x;
                const ydir = this.ponytail[i-1].y-this.ponytail[i].y;
                const off = 10;
                const hyp = xdir*xdir + ydir*ydir;
                const r = off*off;
                // if hair distance is greater than limit, bring closer to previous hair
                if (hyp > r) {
                    const ratio = Math.sqrt(r) / Math.sqrt(hyp);
                    this.ponytail[i].x = this.ponytail[i-1].x - xdir * ratio;
                    this.ponytail[i].y = this.ponytail[i-1].y - ydir * ratio;
                }
                const offx = this.ponytail[i].x;
                const offy = this.ponytail[i].y;
                ctx.drawImage(this.hair, offx, offy, 16*scale, 16*scale);
            }

        }
        
        //ctx.fillRect(this.x-this.w*block/2, this.y-this.h*block/2, this.w*block, this.h*block);
        this.animations[this.state][this.dir].drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
    }


}