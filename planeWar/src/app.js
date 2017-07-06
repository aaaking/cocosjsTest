var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

var gameWidth = 100;
var gameHeight = 200;
var gameMarginX = 200;
var gameMarginY = 200;

var GameLayer = cc.Layer.extend({
    background1: null,
    background2: null,
    planeLayer: null,
    bulletLayer: null,
    enemyLayer: null,
    controlLayer: null,
    bgPosY: 0,
    score: 0,
    ctor: function () {
        this._super();
        this.init();
        this.loadListener();
        return true;
    },

    init: function () {
        // this.setTouchEnabled(true);
        // this.setMouseEnabled(true);
        // this.setKeyboardEnabled(true);//We have delete these three functions from layer in v3.0.
        var size = cc.winSize;
        this.bgPosY = size.height / 2;
        cc.spriteFrameCache.addSpriteFrames(res.s_ShootBackgroundList, res.s_ShootBackground);
        //1
        this.background1 = cc.Sprite.create("#background.png");
        this.background1.setPosition(size.width / 2, size.height / 2);
        var scaleX_1 = size.width / this.background1.getContentSize().width;
        var scaleY_1 = size.height / this.background1.getContentSize().height;
        if (scaleX_1 > scaleY_1) {
            this.background1.setScale(scaleY_1);
            gameWidth = this.background1.getContentSize().width * scaleY_1;
            gameHeight = this.background1.getContentSize().height * scaleY_1;
            gameMarginX = (size.width - gameWidth) / 2;
            gameMarginY = 0;
        } else {
            this.background1.setScale(scaleX_1);
            gameWidth = this.background1.getContentSize().width * scaleX_1;
            gameHeight = this.background1.getContentSize().height * scaleX_1;
            gameMarginX = 0;
            gameMarginY = (size.height - gameHeight) / 2;
        }
        this.addChild(this.background1);
        //2
        this.background2 = cc.Sprite.create("#background.png");
        this.background2.setPosition(size.width / 2, size.height / 2);
        var scaleX_2 = size.width / this.background2.getContentSize().width;
        var scaleY_2 = size.height / this.background2.getContentSize().height;
        if (scaleX_2 > scaleY_2) {
            this.background2.setScale(scaleY_2);
        } else {
            this.background2.setScale(scaleX_2);
        }
        this.addChild(this.background2);
        //飞机
        this.planeLayer = new PlaneLayer();
        this.addChild(this.planeLayer);
        //子弹
        this.bulletLayer = new BulletLayer(this.planeLayer.getChildByTag(AIRPLANE));
        this.bulletLayer.startShoot();
        this.addChild(this.bulletLayer);
        //敌机
        this.enemyLayer = new EnemyLayer();
        this.addChild(this.enemyLayer);
        //控制层
        this.controlLayer = new ControlLayer();
        this.controlLayer.setPositionX(gameMarginX);
        this.addChild(this.controlLayer);
        //循环移动背景
        this.schedule(function () {
            this.bgPosY -= 2;
            if (this.background1.getPositionY() <= (0 - gameHeight) / 2) {
                this.bgPosY = size.height / 2;
            }
            this.updateBgPosition();
        }, 0.02);

        this.scheduleUpdate();
    },

    updateBgPosition: function () {
        this.background1.setPositionY(this.bgPosY);
        this.background2.setPositionY(this.bgPosY + gameHeight - 2);
    },
    loadListener: function () {
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: false,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        });
        cc.eventManager.addListener(listener, this);
    },
    onTouchBegan: function (touch, event) {
        var self = this.target;
        var position = touch.getLocation();
        var plane = self.planeLayer.getChildByTag(AIRPLANE);
        var locationInNode = plane.convertToNodeSpace(position);
        var rect = cc.rect(0, 0, plane.getContentSize().width, plane.getContentSize().height);
        if (cc.rectContainsPoint(rect, locationInNode)) {
            return true;
        }
        return false;
    },
    onTouchMoved: function (touch, event) {
        var self = this.target;
        var position = touch.getLocation();
        self.planeLayer.getChildByTag(AIRPLANE).setPosition(position.x, position.y);
    },
    onTouchEnded: function (touch, event) {
    }
});

