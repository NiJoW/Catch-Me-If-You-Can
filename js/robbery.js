var game;

function startRobbery() {
    //Einleitung Raub & Gewonnen ausblenden
    document.getElementById("introductionRobbery").style.display = "none";
    document.getElementById("introductionWon").style.display = "none";

    var config = {
        type: Phaser.AUTO,
        width: 750,
        height: 550,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    y: 2000
                },
                debug: false
            }
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        }
    };

    game = new Phaser.Game(config);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
}
var map;

//Sprites
var player;
var cop;
var copLobby;
var cam1;
var geist;
var warnLicht;
var barrel;
var carpet;
var dia1;
var dia2;
var security;
var switchCamAnim;
var doorPic;
var chestClosed1;
var kopter;
var rabbit;
var mona;
var sword;
var ausgang;
var fenster;

var copLeft, copRight;
var copLobbyLeft, copLobbyRight;

var cursors;
var platforms;
var desert;
var pyramide;
var platformUnten;


//GameControl
var camOFF = false;
var hidden = false;
var behindDoor = false;
var detected = false;
var gameOver = false;
var onCarpet = false;
var leaveCarpet;

//Sounds
var verhaftet;
var switchCamSound;
var jump;
var door;
var alarm;
var collectCoin;

var text;
var score;

function preload() {
    //    this.load.tilemapTiledJSON('map', 'assetsRobbery/map.json');
    this.load.tilemapTiledJSON('map', 'assetsRobbery/KARTE.json');
    //    this.load.spritesheet('museumTiles', 'assetsRobbery/museumTiles.png', {
    //        frameWidth: 32,
    //        frameHeight: 32
    //    });
    this.load.spritesheet('tileCOLOR', 'assetsRobbery/tileCOLOR.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('tileSetRobbery', 'assetsRobbery/tileSetRobbery.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('terrain_atlas', 'assetsRobbery/terrain_atlas.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('base_out_atlas', 'assetsRobbery/base_out_atlas.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    this.load.spritesheet('thief', 'assetsRobbery/diebAnimiert2.png', {
        frameWidth: 30,
        frameHeight: 42
    });
    this.load.spritesheet('copSprite', 'assetsRobbery/cop-sheet.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('carpet', 'assetsRobbery/flyingCarpet.png', {
        frameWidth: 96,
        frameHeight: 32
    });
    this.load.spritesheet('switchCamAnim', 'assetsRobbery/switch.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('cam', 'assetsRobbery/cameraNEW.png', {
        frameWidth: 100,
        frameHeight: 120
    });
    this.load.spritesheet('ghost', 'assetsRobbery/flaschengeistNEW.png', {
        frameWidth: 57,
        frameHeight: 96
    });
    this.load.spritesheet('cameraOFF', 'assetsRobbery/cameraOFF.png', {
        frameWidth: 100,
        frameHeight: 120
    });
    this.load.spritesheet('warnLicht', 'assetsRobbery/alarmOff-sheet.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    //    this.load.spritesheet('warnLicht', 'assetsRobbery/warnLicht.png', {
    //        frameWidth: 16,
    //        frameHeight: 16
    //    });
    this.load.spritesheet('barrel', 'assetsRobbery/barrel.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    this.load.spritesheet('diamond', 'assetsRobbery/diamand2.png', {
        frameWidth: 16,
        frameHeight: 16
    });
    this.load.spritesheet('kopter', 'assetsRobbery/kopter.png', {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.spritesheet('rabbit', 'assetsRobbery/rabbitPIXEL.png', {
        frameWidth: 380,
        frameHeight: 507
    });
    this.load.spritesheet('mona', 'assetsRobbery/monaLisaPixel.png', {
        frameWidth: 300,
        frameHeight: 200
    });
    this.load.spritesheet('sword', 'assetsRobbery/daggerPIXEL.png', {
        frameWidth: 449,
        frameHeight: 150
    });
    this.load.spritesheet('ausgang', 'assetsRobbery/ausgang.png', {
        frameWidth: 834,
        frameHeight: 937
    });
    this.load.spritesheet('fenster', 'assetsRobbery/kirchenFensterPIXEL.png', {
        frameWidth: 1000,
        frameHeight: 1600
    });

    this.load.audio('jump', ['assetsRobbery/sounds/jump.mp3']);
    this.load.audio('switchCamSound', ['assetsRobbery/sounds/camSwitch.mp3']);
    this.load.audio('verhaftet', ['assetsRobbery/sounds/verhaftet.mp3']);
    this.load.audio('door', ['assetsRobbery/sounds/door.mp3']);
    this.load.audio('alarm', ['assetsRobbery/sounds/alarm1.mp3']);
    //    this.load.audio('alarm', ['assetsRobbery/sounds/alarm2.mp3']);
    this.load.audio('collectCoin', ['assetsEscape/sound/coin/coin_collect.mp3']);
    this.load.image('security', 'assetsRobbery/security.png');
    this.load.image('doorPic', 'assetsRobbery/door.png');
    this.load.image('chestClosed1', 'assetsRobbery/chestClosed.png');
}

function create() {

    //Maneull naechstes Level
    this.input.on("pointerup", stopGame, this);




    map = this.make.tilemap({
        key: 'map'
    });

    var tileCOLOR = map.addTilesetImage('tileCOLOR');
    var tileSetRobbery = map.addTilesetImage('tileSetRobbery');
    var terrain_atlas = map.addTilesetImage('terrain_atlas');
    var base_out_atlas = map.addTilesetImage('base_out_atlas');



    platforms = map.createDynamicLayer('platforms', tileCOLOR, 0, 0);
    desert = map.createDynamicLayer('desert', tileSetRobbery, 0, 0);
    background2Etage = map.createDynamicLayer('background2Etage', terrain_atlas, 0, 0);
    backgroundUnten = map.createDynamicLayer('backgroundUnten', base_out_atlas, 0, 0);
    pyramide = map.createDynamicLayer('pyramide', terrain_atlas, 0, 0);
    platformUnten = map.createDynamicLayer('platformUnten', base_out_atlas, 0, 0);
    background3Etage = map.createDynamicLayer('background3Etage', terrain_atlas, 0, 0);

    platforms.setCollisionByExclusion([-1]);
    pyramide.setCollisionByExclusion([-1]);
    platformUnten.setCollisionByExclusion([-1]);
    this.physics.world.bounds.width = platforms.width;
    this.physics.world.bounds.height = platforms.height;

    //    fenster = this.physics.add.sprite();
    ausgang = this.physics.add.sprite(1882, 170, 'ausgang');
    ausgang.setCollideWorldBounds(true);
    ausgang.setScale(0.05);
    kopter = this.physics.add.sprite(300, 480, 'kopter');
    kopter.setCollideWorldBounds(true);
    mona = this.physics.add.sprite(1310, 480, 'mona');
    mona.setCollideWorldBounds(true);
    mona.setScale(0.3);
    rabbit = this.physics.add.sprite(300, 400, 'rabbit');
    rabbit.setCollideWorldBounds(true);
    rabbit.setScale(0.1);
    sword = this.physics.add.sprite(960, 280, 'sword');
    sword.setCollideWorldBounds(true);
    sword.setScale(0.07);
    security = this.physics.add.sprite(280, 1550, 'security');
    security.setCollideWorldBounds(true);
    security.setScale(1.3);
    doorPic = this.physics.add.sprite(925, 1400, 'doorPic');
    doorPic.setCollideWorldBounds(true);
    doorPic.setScale(1.3);
    chestClosed1 = this.physics.add.sprite(1450, 1300, 'chestClosed1');
    chestClosed1.setCollideWorldBounds(true);
    chestClosed1.setScale(1.3);


    geist = this.physics.add.sprite(768, 1022, 'ghost');
    geist.setCollideWorldBounds(true);

    player = this.physics.add.sprite(155, 1550, 'thief');
    //    player = this.physics.add.sprite(1800, 170, 'thief');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    cop = this.physics.add.sprite(350, 1010, 'copSprite');
    cop.setCollideWorldBounds(true);
    cop.body.setSize(cop.width, cop.height);
    cop.setVelocityX(100);
    copLobby = this.physics.add.sprite(672, 1550, 'copSprite');
    copLobby.setCollideWorldBounds(true);
    copLobby.body.setSize(copLobby.width, copLobby.height);
    copLobby.setVelocityX(100);

    carpet = this.physics.add.sprite(70, 1050, 'carpet');
    carpet.setCollideWorldBounds(true);
    carpet.body.setSize(carpet.width, carpet.height);
    carpet.setVelocityX(0);
    carpet.body.immovable = true;

    barrel = this.physics.add.sprite(110, 1550, 'barrel');
    barrel.setCollideWorldBounds(true);
    barrel.body.setSize(barrel.width, barrel.height);

    cam1 = this.physics.add.sprite(1600, 1010, 'cam');
    cam1.setCollideWorldBounds(true);
    cameraOFF = this.physics.add.sprite(1600, 1010, 'cameraOFF');
    cameraOFF.setCollideWorldBounds(true);
    switchCamAnim = this.physics.add.sprite(1888, 1392, 'switchCamAnim');
    switchCamAnim.setCollideWorldBounds(true);



    warnLicht = this.physics.add.sprite(280, 1464, 'warnLicht');
    warnLicht.body.immovable = true;

    jump = this.sound.add('jump');
    switchCamSound = this.sound.add('switchCamSound');
    verhaftet = this.sound.add('verhaftet');
    door = this.sound.add('door');
    alarm = this.sound.add('alarm');
    collectCoin = this.sound.add('collectCoin');

    //    dia1 = this.physics.add.sprite(30, 1330, 'diamond');
    dia1 = this.physics.add.sprite(35, 1300, 'diamond');
    dia2 = this.physics.add.sprite(1232, 970, 'diamond');




    this.physics.add.collider(platforms, player);
    this.physics.add.collider(platforms, cop);
    this.physics.add.collider(platforms, copLobby);
    this.physics.add.collider(platforms, barrel);
    this.physics.add.collider(player, barrel);
    this.physics.add.collider(player, warnLicht);
    this.physics.add.collider(player, carpet);
    this.physics.add.collider(platforms, carpet);
    this.physics.add.collider(platforms, dia1);
    this.physics.add.collider(platforms, dia2);
    this.physics.add.collider(desert, player);
    this.physics.add.collider(platforms, security);
    this.physics.add.collider(platforms, doorPic);
    this.physics.add.collider(platforms, sword);
    this.physics.add.collider(platforms, rabbit);
    this.physics.add.collider(platforms, kopter);
    this.physics.add.collider(platforms, mona);
    this.physics.add.collider(platforms, ausgang);



    this.physics.add.collider(player, pyramide);
    this.physics.add.collider(pyramide, dia2);

    this.physics.add.collider(player, platformUnten);
    this.physics.add.collider(platformUnten, dia1);

    this.physics.add.collider(platformUnten, chestClosed1);



    //Player
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('thief', {
            start: 4,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('thief', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    //Cop
    this.anims.create({
        key: 'copAnim',
        frames: this.anims.generateFrameNumbers('copSprite', {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    //    this.anims.create({
    //        key: 'cLeft',
    //        frames: this.anims.generateFrameNumbers('dude', {
    //            start: 0,
    //            end: 3
    //        }),
    //        frameRate: 10,
    //        repeat: -1
    //    });
    //
    //    this.anims.create({
    //        key: 'cRight',
    //        frames: this.anims.generateFrameNumbers('dude', {
    //            start: 5,
    //            end: 8
    //        }),
    //        frameRate: 10,
    //        repeat: -1
    //    });

    this.anims.create({
        key: 'carpetMove',
        frames: this.anims.generateFrameNumbers('carpet', {
            start: 0,
            end: 1
        }),
        frameRate: 3,
        repeat: -1
    });

    this.anims.create({
        key: 'C',
        frames: this.anims.generateFrameNumbers('cam', {
            start: 0,
            end: 3
        }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'CO',
        frames: this.anims.generateFrameNumbers('cameraOFF', {
            start: 0,
            end: 3
        }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'G',
        frames: this.anims.generateFrameNumbers('ghost', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'switchON',
        frames: this.anims.generateFrameNumbers('switchCamAnim', {
            start: 0,
            end: 0
        }),
        //        frameRate: 5,
        //        repeat: -1
    });
    this.anims.create({
        key: 'switchOFF',
        frames: this.anims.generateFrameNumbers('switchCamAnim', {
            start: 1,
            end: 1
        }),
        //        frameRate: 5,
        //        repeat: -1
    });
    this.anims.create({
        key: 'lichtAn',
        frames: this.anims.generateFrameNumbers('warnLicht', {
            start: 0,
            end: 2
        }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'lichtAus',
        frames: this.anims.generateFrameNumbers('warnLicht', {
            start: 1,
            end: 1
        }),
        //        frameRate: 5,
        //        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    this.cameras.main.setBackgroundColor('#ccccff');

    //    text = this.add.text(20, 570, '0', {
    //        fontSize: '20px',
    //        fill: '#ffffff'
    //    });
    //    text.setScrollFactor(0);

    //    timedEvent = this.time.addEvent({
    //        delay: 300,
    //        callback: updateCop,
    //        callbackScope: this,
    //        loop: true
    //    });

}


function update() {


    carpet.anims.play('carpetMove', true);
    copLobby.anims.play('copAnim', true);
    cop.anims.play('copAnim', true);
    switchCamAnim.body.setAllowGravity(false);
    switchCamAnim.anims.play('switchON', true);
    jump.volume = 0.1;
    warnLicht.body.setAllowGravity(false);
    cam1.body.setAllowGravity(false);
    cam1.anims.play('C', true);
    cameraOFF.body.setAllowGravity(false);
    geist.body.setAllowGravity(false);
    geist.anims.play('G', true);

    if (!detected) {
        warnLicht.anims.play('lichtAus', true);
    }

    if (gameOver) {
        return;
    }


    //Spieler Steuerung
    if (cursors.left.isDown && !onCarpet) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown && !onCarpet) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.stop();
    }
    if (cursors.space.isDown && player.body.onFloor() && !onCarpet) {
        player.setVelocityY(-550);
        jump.play();
    }

    //Spieler in Luft langsamer
    if (cursors.left.isDown && !player.body.onFloor()) {
        player.setVelocityX(-100);
        player.anims.play('left', true);
    } else if (cursors.right.isDown && !player.body.onFloor()) {
        player.setVelocityX(100);
        player.anims.play('right', true);
    }


    //Polizisten automatische Bewegung

    //Cop unten
    if (copLobby.x <= 675 && !detected) {
        copLobbyRight = true;
        copLobbyLeft = false;
        copLobby.setVelocityX(50);
        if (player.x < copLobby.x) {
            //schneller wenn rechts von Spieler, damit man nicht so lange warten muss
            copLobby.setVelocityX(70);
        }
    }
    if (copLobby.x >= 1160 && !detected) {
        copLobbyRight = false;
        copLobbyLeft = true;
        copLobby.setVelocityX(-50);
        if (player.x < copLobby.x) {
            copLobby.setVelocityX(-70);
        }
    }

    //Cop oben
    if (cop.x <= 300) {
        copRight = true;
        copLeft = false;
        cop.setVelocityX(50);
    }
    if (cop.x >= 500) {
        copRight = false;
        copLeft = true;
        cop.setVelocityX(-50);

    }



    //Sonderfunktionen, wenn Pfeiltaste nach oben gedrueckt

    //hinter Tuer verstecken
    if (cursors.up.isDown && player.x >= 915 && player.x <= 935 && player.y >= 1344) {
        hidden = true;
        player.setScale(.9);
        player.visible = false;
        if (behindDoor == false) {
            door.play();
        }
        behindDoor = true;
    } else {
        player.setScale(1);
        hidden = false;
        player.visible = true;
        if (behindDoor == true) {
            door.play();
        }
        behindDoor = false;
    }

    //Diamand sammeln
    if (this.physics.collide(player, dia1)) {
        dia1.visible = false;
        dia1.body.checkCollision.none = true;
        collectCoin.play();
    }
    if (this.physics.collide(player, dia2)) {
        dia2.visible = false;
        dia2.body.checkCollision.none = true;
        collectCoin.play();
    }


    //Kamera ausschalten
    if (player.x >= 1880 && player.y < 1440 && player.y > 1360 && cursors.up.isDown && camOFF == false) {
        //mach cam1 aus
        camOFF = true;
        cam1.visible = false;
        cameraOFF.visible = true;
        cameraOFF.anims.play('CO', true);
        switchCamSound.play();
    }
    if (camOFF == false) {
        cameraOFF.visible = false;
    } else {
        switchCamAnim.anims.play('switchOFF', true);
    }


    //fliegender Teppich
    if (player.x < 80 && player.y < 1024 && player.y > 496) {
        player.setVelocityY(-200);
    }


    //Kiste sammeln
    if ((chestClosed1.x - player.x) < 20 && (player.x - chestClosed1.x) < 20 && (chestClosed1.y - player.y) < 30 && (player.y - chestClosed1.y) < 30 && cursors.up.isDown) {
        chestClosed1.visible = false;
        collectCoin.play();
    }
    //Dolch sammeln
    if ((sword.x - player.x) < 20 && (player.x - sword.x) < 20 && (sword.y - player.y) < 30 && (player.y - sword.y) < 30 && cursors.up.isDown) {
        sword.visible = false;
        collectCoin.play();
    }



    //Pruefungen auf GameOver

    //von Cop gesehen (Sichtweite von 150 in Sichtrichtung und 100px in der Hoehe)
    //Cop unten
    if (!hidden && copLobbyLeft && player.x < copLobby.x && ((copLobby.x - player.x) < 150) && (player.y - 20) <= copLobby.y && (copLobby.y - player.y < 100)) {
        verhaftet.play();
        this.physics.pause();
        gameOverFN(player);
        restartRob();
    }
    if (!hidden && copLobbyRight && player.x > copLobby.x && (player.x - copLobby.x) < 150 && (player.y - 20) <= copLobby.y && (copLobby.y - player.y) < 100) {
        verhaftet.play();
        this.physics.pause();
        gameOverFN(player);
        restartRob();
    }


    //Cop oben
    if (!hidden && copLeft && player.x < cop.x && (cop.x - player.x) < 150 && player.y <= cop.y && (cop.y - player.y) < 96) {
        //laeuft schnell auf einen zu, ansatt das GameOver per Sicht auszulösen
        cop.setVelocityX(-200);
        //        this.physics.pause();
        //        gameOverFN(player);
    }
    if (!hidden && copRight && player.x > cop.x && (player.x - cop.x) < 150 && player.y <= cop.y && (cop.y - player.y) < 96) {
        verhaftet.play();
        this.physics.pause();
        gameOverFN(player);
        restartRob();
    }

    //wenn Metalldetektor durchquert, rennt der Cop auf einen zu
    if (detected) {
        if (copLobby.x <= 320) {
            copLobbyRight = true;
            copLobbyLeft = false;
            copLobby.setVelocityX(200);
        }
        if (copLobby.x >= 1160) {
            copLobbyRight = false;
            copLobbyLeft = true;
            copLobby.setVelocityX(-200);
        }
    }


    //Kollision mit eingeschalteter Kamera pruefen
    if (this.physics.collide(player, cam1)) {
        verhaftet.play();
        this.physics.pause();
        gameOverFN(player);
        restartRob();
    }


    if (player.x > 380 && player.y < 576 && player.y > 512) {
        this.physics.pause();
        gameOverFN(player);
        restartRob();
    }

    //bei durchqueren des Metalldetektors wird detected auf true gesetzt
    if (player.x >= 264 && player.x <= 320 && player.y >= 1504) {
        detected = true;
        alarm.play();
        warnLicht.anims.play('lichtAn', true);
        copLobbyRight = false;
        copLobbyLeft = true;
        copLobby.setVelocityX(-200);
    }



    //Ausschalten der Kollisionserkennung wenn versteckt
    if (hidden) {
        player.body.checkCollision.none = true;
    } else {
        player.body.checkCollision.none = false;
    }

    if (camOFF) {
        cam1.body.checkCollision.none = true;
    } else {
        cam1.body.checkCollision.none = false;
    }


    //damit der Block nicht weiterrutscht, nachdem er geschoben wurde
    if (!this.physics.collide(player, barrel)) {
        barrel.setVelocityX(0);
    }

    if ((barrel.x - player.x < 20) && (player.x - barrel.x < 20) && (barrel.y - player.y < 50) && cursors.space.isDown) {
        player.setVelocityY(-550);
    }

    if ((warnLicht.x - player.x < 15) && (player.x - warnLicht.x < 15) && (warnLicht.y - player.y < 50) && cursors.space.isDown) {
        player.setVelocityY(-550);
    }


    this.physics.add.collider(player, cop, gameOverFN, null, this);
    this.physics.add.collider(player, copLobby, gameOverFN, null, this);
    this.physics.add.collider(player, cam1, gameOverFN, null, this);
    this.physics.add.collider(player, desert, gameOverFN, null, this);



    if (player.x > 1880 && player.y < 192) {
        gameOver = true;
        stopGame();
    }



}


//Funktion, die Spiel beendet / neu startet
function gameOverFN(player) {
    player.setTint(0xff0000);
    player.setVelocityX(0);
    cop.setVelocityX(0);
    copLobby.setVelocityX(0);
    cam1.setVelocityX(0);
    verhaftet.play();
    player.anims.stop();
    cop.anims.stop();
    copLobby.anims.stop();
    gameOver = true;
}


function resize() {
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
