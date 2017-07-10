var WelcomeScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = new WelcomeLayer();
        this.addChild(layer);
    }
});

var WelcomeLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },
    onEnter: function () {
        this._super();
        var winsize = cc.director.getWinSize();
        // var spritebg = new cc.Sprite(res.menu.bg);
        var bg = new cc.LayerGradient(cc.color(85, 142, 139, 100), cc.color(6, 31, 33, 100), cc.p(0, 0));
        bg.attr({
            anchorX: 0,
            anchorY: 0,
            width: winsize.width,
            height: winsize.height
        });
        this.addChild(bg);

        cc.MenuItemFont.setFontSize(60);

        this.welcome = new cc.LabelTTF("欢迎您，" + cc.sys.localStorage.getItem("username"), "Arial", 60);
        this.welcome.setColor(cc.color(255, 255, 255));//white color
        this.welcome.setPosition(cc.p(140, winsize.height - 50));
        this.welcome.setScale(0.5);
        this.addChild(this.welcome, 10);

        //setting btn
        var setBtn = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite(res.setting),
            new cc.Sprite(res.setting),
            this.onSet, this));
        setBtn.setPosition(cc.p(winsize.width + 21, this.welcome.getPositionY()));//设置按钮图片的宽高都是42像素
        this.addChild(setBtn, 1);
        var actionTo = cc.MoveTo.create(2, cc.p(winsize.width - 21 - 40, this.welcome.getPositionY())).easing(cc.easeElasticOut());
        var seq = cc.Sequence.create(
            actionTo,
            cc.CallFunc.create(function (setBtn) {
                var shaking = cc.MoveTo.create(2, cc.p(winsize.width - 21 - 40 - 5, this.getPositionY())).easing(cc.easeBackInOut());
                var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width - 21 - 40 + 5, this.getPositionY())).easing(cc.easeBackInOut());
                var shakingSeq = cc.Sequence.create(cc.DelayTime.create(0.3), shaking, shakingBack);
                setBtn.runAction(shakingSeq.repeatForever());
            }, setBtn));
        setBtn.runAction(seq);

        //exit button
        this.exitBtn = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite(res.back), // normal state image
            new cc.Sprite(res.back), // select state image
            function () {
                cc.director.end();
            }, this));
        this.exitBtn.setPosition(60, 60);
        this.exitBtn.attr({
            width: 72,
            height: 72
        });
        this.addChild(this.exitBtn);

        // play btn
        var playBtn = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite(res.play), // normal state image
            new cc.Sprite(res.play), // select state image
            this.onPlay, this));
        var playBtnPosX = winsize.width / 2, playBtnPosY = winsize.height / 2 - 200;
        playBtn.setPosition(cc.p(playBtnPosX, playBtnPosY));
        this.addChild(playBtn);
        var seq = cc.Sequence.create(
            // cc.MoveTo.create(2, cc.p(playBtnPosX, playBtnPosY)).easing(cc.easeElasticInOut(0.8)),
            cc.CallFunc.create(function (playBtn) {
                var shaking = cc.MoveTo.create(1, cc.p(playBtnPosX, playBtnPosY)).easing(cc.easeIn(2.0));
                var shakingBack = cc.MoveTo.create(1, cc.p(playBtnPosX, playBtnPosY - 10)).easing(cc.easeOut(2.0));
                var shakingSeq = cc.Sequence.create(shaking, shakingBack);
                var shakingSeq = cc.Sequence.create(shaking, shakingBack);
                playBtn.runAction(shakingSeq.repeatForever());
            }, playBtn));
        playBtn.runAction(seq);

        //storeBtn
        var storeBtn = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite(res.icon_rank),
            new cc.Sprite(res.icon_rank),
            this.onStore, this));
        storeBtn.setPosition(cc.p(winsize.width + 200, winsize.height - 220));
        this.addChild(storeBtn);
        var actionTo = cc.MoveTo.create(2, cc.p(winsize.width - 200, winsize.height - 220)).easing(cc.easeElasticOut());
        var seq = cc.Sequence.create(
            actionTo,
            cc.CallFunc.create(function (storeBtn) {
                var shaking = cc.MoveTo.create(2, cc.p(winsize.width - 205, winsize.height - 220)).easing(cc.easeBackInOut());
                var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width - 195, winsize.height - 220)).easing(cc.easeBackInOut());
                var shakingSeq = cc.Sequence.create(shaking, shakingBack);
                storeBtn.runAction(shakingSeq.repeatForever());
            }, storeBtn));
        storeBtn.runAction(seq);

        //aboutBtn
        var aboutBtn = new cc.Menu(new cc.MenuItemSprite(
            new cc.Sprite(res.about),
            new cc.Sprite(res.about),
            this.onAbout, this));
        aboutBtn.setPosition(cc.p(winsize.width - 200, winsize.height + 100));
        this.addChild(aboutBtn, 1);
        var actionTo = cc.MoveTo.create(2, cc.p(winsize.width - 200, winsize.height - 303)).easing(cc.easeElasticOut());
        var seq = cc.Sequence.create(
            actionTo,
            cc.CallFunc.create(function (aboutBtn) {
                var shaking = cc.MoveTo.create(2, cc.p(winsize.width - 205, winsize.height - 303)).easing(cc.easeBackInOut());
                var shakingBack = cc.MoveTo.create(2, cc.p(winsize.width - 195, winsize.height - 303)).easing(cc.easeBackInOut());
                var shakingSeq = cc.Sequence.create(cc.DelayTime.create(0.2), shaking, shakingBack);
                aboutBtn.runAction(shakingSeq.repeatForever());
            }, aboutBtn));
        aboutBtn.runAction(seq);

        //add an player here
        this.spriteSheet = new cc.SpriteBatchNode(res.panda_png);
        this.runningAction = new cc.RepeatForever(new cc.Animate(
            new cc.Animation([1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
                return cc.spriteFrameCache.getSpriteFrame("panda_run_0" + i + ".png");
            }), 0.08)
        ));
        this.runningAction.retain();
        this.sprite = new cc.Sprite("#panda_run_01.png");
        // this.sprite.setPosition(cc.p(-100, 30));
        // this.sprite.setPosition(cc.p(winsize.width / 2, winsize.height / 2));
        // this.spriteSheet.setPosition(cc.p(-100, 30));
        this.spriteSheet.setPosition(cc.p(winsize.width / 2, winsize.height / 2));
        this.spriteSheet.addChild(this.sprite);
        this.addChild(this.spriteSheet, 0);
        this.sprite.runAction(this.runningAction);

        // var moveTo = cc.MoveTo.create(10, cc.p(winsize.width + 200, 30));
        // var seq = cc.Sequence.create(moveTo, cc.CallFunc(function (panda) {
        //     panda.setPositionX(-100);
        // }, this.sprite));
        // this.spriteSheet.runAction(seq.repeatForever());

        var particle = cc.ParticleSystem.create(res.particle.circle);
        particle.setPosition(800, 100);
        this.addChild(particle, 100);

        this.scheduleUpdate();
        return true;
    },
    /**
     * Triggered when play is clicked.
     */
    onPlay: function () {
        cc.audioEngine.playEffect(res.sound.button);
        this.addChild(new GameModeLayer(), 100);
        //cc.director.runScene(new NetworkPlayScene());
    },

    /**
     * Triggered when option is clicked.
     */
    onSet: function () {
        var winsize = cc.director.getWinSize();
        this.draw = new cc.DrawNode();
        this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
        this.addChild(this.draw, 4, 1);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            target: this.draw,
            onTouchBegan: function () {
                return true;
            },
            onTouchEnded: function () {
                this.target.removeFromParent();
            }
        }, this.draw);

        //音效
        var effectLabel = new cc.LabelTTF("音效", "Arial", 30);
        effectLabel.setPosition(cc.p(winsize.width + 100, winsize.height / 2 + 50));
        effectLabel.runAction(cc.MoveTo.create(1, cc.p(winsize.width / 2 - 50, winsize.height / 2 + 50)).easing(cc.easeElasticOut()));
        this.draw.addChild(effectLabel);
        var effectIsOn = cc.sys.localStorage.getItem("effectIsOn");
        var effectCheckBox = new ccui.CheckBox(res.off, res.on);
        effectCheckBox.setPosition(cc.p(winsize.width + 100, winsize.height / 2 + 50));
        effectCheckBox.runAction(cc.MoveTo.create(1, cc.p(winsize.width / 2 + 50, winsize.height / 2 + 50)).easing(cc.easeElasticOut()));
        effectCheckBox.setSelected(effectIsOn == 1);
        effectCheckBox.addEventListener(function (sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    cc.sys.localStorage.setItem("effectIsOn", 1);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    cc.sys.localStorage.setItem("effectIsOn", 0);
                    break;
                default:
                    break;
            }
        }, this);
        this.draw.addChild(effectCheckBox);
        //音乐
        var musicLabel = new cc.LabelTTF("音乐", "Arial", 30);
        musicLabel.setPosition(cc.p(winsize.width + 100, winsize.height / 2 + 110));
        musicLabel.runAction(cc.MoveTo.create(1, cc.p(winsize.width / 2 - 50, winsize.height / 2 + 110)).easing(cc.easeElasticOut()));
        this.draw.addChild(musicLabel);
        var musicIsOn = cc.sys.localStorage.getItem("musicIsOn");
        var musicCheckBox = new ccui.CheckBox(res.off, res.on);
        musicCheckBox.setPosition(cc.p(winsize.width + 100, winsize.height / 2 + 110));
        musicCheckBox.runAction(cc.MoveTo.create(1, cc.p(winsize.width / 2 + 50, winsize.height / 2 + 110)).easing(cc.easeElasticOut()));
        musicCheckBox.setSelected(effectIsOn == 1);
        musicCheckBox.addEventListener(function (sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    cc.sys.localStorage.setItem("musicIsOn", 1);
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    cc.sys.localStorage.setItem("musicIsOn", 0);
                    break;
                default:
                    break;
            }
        }, this);
        this.draw.addChild(musicCheckBox);
        //还有一个"难度"的设置，以后加上，diffDeg=1表示"难"，diffDeg=0表示容易

        //toggle //effect
        // var on = new cc.MenuItemImage(res.ui.onBtn);
        // var off = new cc.MenuItemImage(res.ui.offBtn);
        // if (!canAudioPlaying) {
        //     on = new cc.MenuItemImage(res.ui.onBtn);
        //     off = new cc.MenuItemImage(res.ui.offBtn);
        // } else {
        //     on = new cc.MenuItemImage(res.ui.offBtn);
        //     off = new cc.MenuItemImage(res.ui.onBtn);
        // }
        // var toggler = new cc.MenuItemToggle(on, off,
        //     function (that) {
        //         // TODO: settings.
        //         console.log(that);
        //     }, this);
        // this.effect = new cc.Menu(toggler);
        // this.effect.setPosition(cc.p(winsize.width + 100, winsize.height / 2 + 10));
        // this.effect.setScale(0.8);
        // this.effect.runAction(cc.MoveTo.create(1, cc.p(winsize.width / 2 - 30, winsize.height / 2 + 10)).easing(cc.easeElasticOut()));
        // this.draw.addChild(this.effect, 6);
    },

    /**
     * Triggered when about is clicked.
     */
    onAbout: function () {
        var winsize = cc.director.getWinSize();
        this.draw = new cc.DrawNode();
        this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
        // this.draw = new cc.LayerColor(cc.color(0, 0, 0, 80), winsize.width, winsize.height);
        this.addChild(this.draw, 4, 1);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this.draw,
            swallowTouches: true,
            onTouchBegan: function () {
                return true;
            },
            onTouchEnded: function (touch, event) {
                var target = this.target;
                target.removeFromParent();
            }
        }, this.draw);

        var actionTo = cc.MoveTo.create(1, cc.p(winsize.width / 2, winsize.height / 2)).easing(cc.easeElasticOut());
        var deleteLabel = new cc.LabelTTF("只是用来熟悉\ncocos2d-js\n2017/07/10", "Arial", 35);
        deleteLabel.setPosition(winsize.width + deleteLabel.width / 2, winsize.height / 2);
        deleteLabel.setFontFillColor(cc.color.GREEN);
        deleteLabel.setTag(1);
        deleteLabel.runAction(actionTo);
        this.draw.addChild(deleteLabel);
    },

    /**
     * store layer
     */

    onStore: function () {
        this.openStore = true;
        cc.audioEngine.stopMusic();

//		this.totalCoin = sys.localStorage.getItem("TotalCoin");
//		this.magnetNum = sys.localStorage.getItem("magnet");
//		this.shoesNum = sys.localStorage.getItem("shoes");
//		this.redshoesNum = sys.localStorage.getItem("redshoes");
//
//		var winsize = cc.director.getWinSize();
//		this.draw = new cc.DrawNode();
//		this.draw.drawRect(cc.p(0, winsize.height), cc.p(winsize.width, 0), cc.color(0, 0, 0, 80), 0, cc.color(0, 0, 0, 80));
//		this.addChild(this.draw, 4, 1);
//
//		cc.eventManager.addListener({
//			event: cc.EventListener.TOUCH_ONE_BY_ONE,
//			swallowTouches: true,
//			onTouchBegan: function(){return true;},
//		}, this.draw);
//
//		this.board = new cc.Sprite(res.ui.storeBoard);
//		this.board.setPosition(cc.p(winsize.width/2+300, winsize.height/2));
//		this.board.setScale(0.57);
//		this.addChild(this.board, 5);
//		var actionTo = cc.MoveTo.create(1, cc.p(winsize.width/2, winsize.height/2)).easing(cc.easeElasticOut());
//		this.board.runAction(actionTo);
//
//		this.backBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.backBtn),
//				new cc.Sprite(res.ui.backBtn),
//				this.backToMenu, this));
//		this.backBtn.setPosition(cc.p(winsize.width+100, 60));
//		this.backBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//			x: winsize.width/2+300,
//			y: winsize.height/2-190
//		});
//		this.backBtn.setScale(0.6);
//		this.backBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-100, winsize.height/2-210)).easing(cc.easeElasticOut()));
//		this.addChild(this.backBtn, 6);
//
//		//show coins nums
//		this.labelCoins = new cc.LabelTTF(this.totalCoin, "Helvetica", 50);
//		this.labelCoins.setColor(cc.color(255, 255, 255));//white color
//		this.labelCoins.setPosition(cc.p(winsize.width+100, winsize.height/2+128));
//		this.labelCoins.setScale(0.3);
//		this.addChild(this.labelCoins, 10);
//		//this.labelCoins.retain();
//		this.labelCoins.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+50, winsize.height/2+128)).easing(cc.easeElasticOut()));
//
//		this.buyMagnetBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy30),
//				new cc.Sprite(res.ui.buy30),
//				function(){
//					//buy magnet
//					if(this.totalCoin - 30 < 0){
//						return;
//					}
//					this.totalCoin -= 30;
//					this.magnetNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("magnet", this.magnetNum);
//					cc.audioEngine.playEffect(res.sound.button);
//				}, this));
//		this.buyMagnetBtn.setPosition(cc.p(winsize.width+80, winsize.height/2+70));
//		this.buyMagnetBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyMagnetBtn.setScale(0.6);
//		this.buyMagnetBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2+70)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyMagnetBtn, 6);
//
//		this.buyShoesBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy50),
//				new cc.Sprite(res.ui.buy50),
//				function(){
//					//buy shoes
//					if(this.totalCoin - 50 < 0){
//						return;
//					}
//					this.totalCoin -= 50;
//					this.shoesNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("shoes", this.shoesNum);
//					cc.audioEngine.playEffect(res.sound.button);
//				}, this));
//		this.buyShoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-10));
//		this.buyShoesBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyShoesBtn.setScale(0.6);
//		this.buyShoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-10)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyShoesBtn, 6);
//
//		this.buyRedshoesBtn = new cc.Menu(new cc.MenuItemSprite(
//				new cc.Sprite(res.ui.buy50),
//				new cc.Sprite(res.ui.buy50),
//				function(){
//					//buy red shoes
//					if(this.totalCoin - 50 < 0){
//						return;
//					}
//					this.totalCoin -= 50;
//					this.redshoesNum++;
//					sys.localStorage.setItem("TotalCoin", this.totalCoin);
//					sys.localStorage.setItem("redshoes", this.redshoesNum);
//					cc.audioEngine.playEffect(res.sound.button);
//				}, this));
//		this.buyRedshoesBtn.setPosition(cc.p(winsize.width+80, winsize.height/2-90));
//		this.buyRedshoesBtn.attr({
//			anchorX: 0,
//			anchorY: 0,
//		});
//		this.buyRedshoesBtn.setScale(0.6);
//		this.buyRedshoesBtn.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+80, winsize.height/2-90)).easing(cc.easeElasticOut()));
//		this.addChild(this.buyRedshoesBtn, 6);
//
//		/**
//		 * show prop nums of own
//		 */
//
//		//show magnet
//		this.labelMagnet = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelMagnet.setColor(cc.color(255, 255, 255));//white color
//		this.labelMagnet.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelMagnet.setScale(0.3);
//		this.addChild(this.labelMagnet, 10);
//		this.labelMagnet.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2-70, winsize.height/6-5)).easing(cc.easeElasticOut()));
//
//		//show shoes
//		this.labelShoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelShoes.setColor(cc.color(255, 255, 255));//white color
//		this.labelShoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelShoes.setScale(0.3);
//		this.addChild(this.labelShoes, 10);
//		this.labelShoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+20, winsize.height/6-5)).easing(cc.easeElasticOut()));
//
//		//show redshoes
//		this.labelRedshoes = new cc.LabelTTF(this.magnetNum, "Helvetica", 60);
//		this.labelRedshoes.setColor(cc.color(255, 255, 255));//white color
//		this.labelRedshoes.setPosition(cc.p(winsize.width+100, winsize.height/6-5));
//		this.labelRedshoes.setScale(0.3);
//		this.addChild(this.labelRedshoes, 10);
//		this.labelRedshoes.runAction(cc.MoveTo.create(1, cc.p(winsize.width/2+100, winsize.height/6-5)).easing(cc.easeElasticOut()));


        this.addChild(new RankLayer(), 100);
    },

    update: function (dt) {
        if (this.openStore) {
            //this.labelCoins.setString(this.totalCoin);
            //this.labelMagnet.setString(this.magnetNum);
            //this.labelShoes.setString(this.shoesNum);
            //this.labelRedshoes.setString(this.redshoesNum);
        }
    },

    backToMenu: function () {
        var winsize = cc.director.getWinSize();
        this.backBtn.runAction(cc.Sequence.create(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 - 190)).easing(cc.easeElasticInOut(0.45)),
            cc.CallFunc(function () {
                this.board.removeFromParent();
                this.backBtn.removeFromParent();
                this.draw.removeFromParent();
            }.bind(this))));
        this.board.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2)).easing(cc.easeElasticInOut(0.45)));
        if (this.effect)
            this.effect.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 + 10)).easing(cc.easeElasticInOut(0.45)));
        if (this.audio)
            this.audio.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 - 65)).easing(cc.easeElasticInOut(0.45)));
        if (this.diff)
            this.diff.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 - 140)).easing(cc.easeElasticInOut(0.45)));

        if (this.buyMagnetBtn)
            this.buyMagnetBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 + 70)).easing(cc.easeElasticInOut(0.45)));
        if (this.buyShoesBtn)
            this.buyShoesBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 - 10)).easing(cc.easeElasticInOut(0.45)));
        if (this.buyRedshoesBtn)
            this.buyRedshoesBtn.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 - 90)).easing(cc.easeElasticInOut(0.45)));
        if (this.labelCoins)
            this.labelCoins.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 2 + 128)).easing(cc.easeElasticInOut(0.45)));
        if (this.labelMagnet)
            this.labelMagnet.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 6 - 5)).easing(cc.easeElasticInOut(0.45)));
        if (this.labelShoes)
            this.labelShoes.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 6 - 5)).easing(cc.easeElasticInOut(0.45)));
        if (this.labelRedshoes) {
            this.labelRedshoes.runAction(cc.MoveTo.create(1, cc.p(-250, winsize.height / 6 - 5)).easing(cc.easeElasticInOut(0.45)));
            //change music
            cc.audioEngine.stopMusic();
            if (canMusicPlaying) {
                cc.audioEngine.playMusic(res.sound.menu);
            }
        }
    }
});