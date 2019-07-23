let gameEscape;
let alreadyEscaped = false;
let debugModus = false;
let keyDebug;
let gameOptions = {
    platformGapRange: [200, 400],
    platformWidthRange: [50, 150],
    platformHeight: 600,
    platformDisplayHeigh: 1300,
    playerWidth: 72.7272,
    playerHeight: 100,
    poleWidth: 8,
    growTime: 500,
    rotateTime: 500,
    walkTime: 3,
    fallTime: 500,
    scrollTime: 250
}
// Player-Modus
const IDLE = 0;
const WAITING = 1;
const GROWING = 2;
const WALKING = 3;
const FLIGHT = 4;

// Flucht-Höhe // ändern um Spieldauer (somit Schwiegkeitsgrad) zu erhöhen
const escapeHeight = 644;

let coinScoreText;
let coinScoreCounter = 0;
let radianAngle;
// Sounds
let poleGrowSound;
let collectCoinSound;
let plattformReachedSound;
let fallSound;
let heliSound;

function startEscapeGame() {
    //Einleitung Flucht & Gewonnen ausblenden
  document.getElementById("introductionEscape").style.display = "none"; document.getElementById("introductionWon").style.display = "none";
    
    let gameConfig = {
        type: Phaser.AUTO,
        width: 750,
        height: 1334,
        scene: [playGame]
    }
    gameEscape = new Phaser.Game(gameConfig);
    window.focus();
    resize2();
    window.addEventListener("resize", resize2, false);
}

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        //Bilder laden (fuer Sprites)
        this.load.image("tile", "imgEscape/tile.png"); // Stab
        // Hochhäuser
        this.load.image("house50", "imgEscape/50.png");
        this.load.image("house90", "imgEscape/90.png");
        this.load.image("house110", "imgEscape/110.png");
        this.load.image("house150", "imgEscape/150.png");
        // Diamand = coin
        this.load.image("coin", "imgEscape/diamand2.png");
        this.load.image("coinScore", "imgEscape/diamand2.png");
        this.load.image("player", "imgEscape/dieb3.png");
        this.load.image("helicopter", "imgEscape/helicopter.png");
        this.load.image("background", "imgEscape/escbackground.png");

        // Sounds laden
        this.load.audio('poleGrow', ['assetsEscape/sound/pole/poleGrow6.mp3']);
        this.load.audio('collectCoin', ['assetsEscape/sound/coin/coin_collect.mp3']);
        this.load.audio('plattformReached',['assetsEscape/sound/plattformReached2.mp3']);
         this.load.audio('fallSound',['assetsEscape/sound/fall/scream_fall_Adobe2.mp3']);
        this.load.audio('heliSound',['assetsEscape/sound/heli/heli5.mp3']);

    }

    create(){
        // Sprites hinzufuegen
        this.add.image(0,0,"background").setOrigin(0,0);
        this.addCoin();
        this.addCoinScore();
        this.addPlatforms();
        this.addPlayer();
        this.addPole();

        // Input-Listner aktivieren
        this.input.on("pointerdown", this.growOrFlip, this);
        this.input.on("pointerup", this.stopGrowAndCheckLength, this);
        this.input.on("pointerup", this.calculatePoleLength, this);
        // Listener für Debug-Modus
        this.input.keyboard.on('keydown_D', function (event) {
            debugModus = true;
            console.log('Debug-Modus on');
        });

        // Sounds hinzufuegen
        poleGrowSound = this.sound.add('poleGrow');
        collectCoinSound = this.sound.add('collectCoin');
        plattformReachedSound =  this.sound.add('plattformReached');
        fallSound =  this.sound.add('fallSound');
        heliSound =  this.sound.add('heliSound');
    }
//Sprites hinzufuegen
     addPlatforms(){ //Hochhaeuser
        this.mainPlatform = 0;
        this.platforms = [];
        this.platforms.push(this.addPlatform(0));
        this.platforms.push(this.addPlatform(gameEscape.config.width));
        this.tweenPlatform();
    }
    addPlatform(posX){
        let platform = this.add.sprite(posX, gameEscape.config.height - gameOptions.platformHeight, "house110");
        platform.displayWidth = 110;
        platform.displayHeight = gameOptions.platformDisplayHeigh; //gameOptions.platformHeight;
       // platform.alpha = 0.7;
        platform.setOrigin(0, 0);
        return platform
    }
    addPlayer(){
        this.player = this.add.sprite(this.platforms[this.mainPlatform].displayWidth - gameOptions.poleWidth,  gameEscape.config.height - gameOptions.platformHeight,"player");
        this.player.displayHeight=100;
        this.player.displayWidth=72.7272;
         this.player.setOrigin(1, 1)
    };
    addPole(){ // Stab zum ueberqueren
        this.pole = this.add.sprite(this.platforms[this.mainPlatform].displayWidth, gameEscape.config.height - gameOptions.platformHeight, "tile");
        this.pole.setOrigin(1, 1);
        this.pole.displayWidth = gameOptions.poleWidth;
        this.pole.displayHeight = gameOptions.playerHeight / 4;
    }
    addHelicopter(){
        this.player.visible = false;
        this.pole.visible = false;
        this.helicopter = this.add.sprite(150, this.player.y,"helicopter");
        this.helicopter.setOrigin(1, 1)
        this.helicopter.setScale(0.4);
    }
    startHelicopter(){
        alreadyEscaped = true; 
        playHeliSound();

        this.tweens.add({
            targets: [this.helicopter],
            x: gameEscape.config.width+100,
            y: 0,
            duration: gameOptions.scrollTime*3,
            callbackScope: this,
            onComplete: function(){
                showWon();
            }
        })
    }
    addCoin(){ // Diamand = Coin
        this.coin = this.add.sprite(0,gameEscape.config.height - gameOptions.platformHeight + gameOptions.playerHeight / 2,"coin");
        this.coin.setScale(0.3);
        this.coin.visible = false;
    }
    addCoinScore(){ // Icon fuer Muenz/Diamenten-Zaehler
        this.coinCounter = this.add.sprite(35, 30,"coinScore");
        this.coinCounter.setScale(0.3);
        this.coinCounter.visible = true;
        this.setCoinScoreText();
    }
    setCoinScoreText(){ //Muenz/Diamenten-Zaehler
        this.coinScoreText = this.add.text(80, 10, '0', { fontSize: '40px', fill: '#fff' });
        console.log(coinScoreCounter);
        this.coinScoreText.setText(coinScoreCounter+'');
    }
    increaseCoinScore(){ //Muenz/Diamenten-Zaehler hochsetzen
        coinScoreCounter++;
        this.coinScoreText.setText(coinScoreCounter+'');
    }
    placeCoin(addHeight){ // Diamanten platzieren an korrekter Position (Stab verlaeuft schraeg)
         this.coin.x = Phaser.Math.Between(this.platforms[this.mainPlatform].getBounds().right + 35, this.platforms[1 - this.mainPlatform ].getBounds().left - 35);

        let x1= this.platforms[this.mainPlatform].getBounds().left;
        let y1= this.platforms[this.mainPlatform].getBounds().top;
        let x2= this.platforms[1-this.mainPlatform].getBounds().right;
        let y2= this.platforms[1-this.mainPlatform].getBounds().top;

        let m = ( (y2-y1) / (x2-x1) );
        let n = ( (y1*x2 - y2*x1) / (x2 - x1) );
        let x = this.coin.x;//4
        let y = m * x + n + gameOptions.playerHeight/2;
        this.coin.y = y;

        this.coin.visible = true;
    }
   // Hinein-Sliden (neuer) Hochhaeuser (plattforms)
    tweenPlatform(){
        let destinationX = this.platforms[this.mainPlatform].displayWidth + Phaser.Math.Between(gameOptions.platformGapRange[0], gameOptions.platformGapRange[1]);
        let sizeWidth = this.getRandomWidth();
        console.log(sizeWidth);
        let addHeight = 30;
        // "Animation" zum Hinein-Sliden der Plattform
        this.tweens.add({
            targets: [this.platforms[1 - this.mainPlatform]],
            x: destinationX,
            y: this.platforms[1 - this.mainPlatform].y - addHeight,
            displayWidth: sizeWidth,
            displayHeight: gameOptions.platformDisplayHeigh,
            duration: gameOptions.scrollTime,
            callbackScope: this,
            onComplete: function(){
                this.gameMode = WAITING;
                this.placeCoin(addHeight); // Muenze plazieren
            }
        })


    }

    // Stab wachsen lassen oder Spieler-Flip
    growOrFlip(){
        // Stab wächst, wenn in Modus Waiting
        if(this.gameMode == WAITING){
            this.gameMode = GROWING;
            playPoleGrowSound();
            this.growTween = this.tweens.add({
                targets: [this.pole],
                displayHeight: gameOptions.platformGapRange[1] + gameOptions.platformWidthRange[1],
                duration: gameOptions.growTime,
            });
        }
        // Player drehen: Toggle: Über oder unterhalb des Poles laufen
        // wenn Player bereits den Abgrund ueberquert
        if(this.gameMode == WALKING){
            if(this.player.flipY){
                this.player.flipY = false;
                this.player.y = gameEscape.config.height - gameOptions.platformHeight;
            }
            else{
               //Player drehen: ueber Kopf untehalb des poles
                this.player.flipY = true;
                let playerBound = this.player.getBounds();
                let platformBound = this.platforms[1 - this.mainPlatform].getBounds();
                // auf Plattform selbst nicht moeglich
                if(Phaser.Geom.Rectangle.Intersection(playerBound, platformBound).width != 0){
                    this.player.flipY = false;
                }
            }
        }
    }

    // Stab-Wachsen beenden, pruefen ob Stab lang genug um Abgrund zu queren
    stopGrowAndCheckLength(){

        if(this.gameMode == GROWING){
            this.gameMode = IDLE;
            this.growTween.stop();
            poleGrowSound.stop();

            //Stab: Nicht zu kurz: richtige Laenge oder zu lang
           if((debugModus == true)||(this.pole.displayHeight > this.platforms[1 - this.mainPlatform].x - this.pole.x)){
                this.tweens.add({
                    targets: [this.pole],
                    angle: (90-this.calculateAngle()),
                    duration: gameOptions.rotateTime,
                    ease: "Bounce.easeOut",
                    callbackScope: this,
                    onComplete: function(){
                        this.gameMode = WALKING;

                        //Stab: Gute Länge, nicht zu lang (und nicht zu kurz)
                        if((debugModus == true)||(this.pole.displayHeight < this.platforms[1 - this.mainPlatform].x + this.platforms[1 - this.mainPlatform].displayWidth - this.pole.x)){
                            this.walkTween = this.tweens.add({
                                targets: [this.player],
                                x: this.platforms[1 - this.mainPlatform].x + this.platforms[1 - this.mainPlatform].displayWidth - this.pole.displayWidth,
                                y: this.platforms[1 - this.mainPlatform].y,
                                duration: gameOptions.walkTime * this.pole.displayHeight,
                                callbackScope: this,
                                onComplete: function(){
                                    this.moveEverthingToTheLeft()
                                }
                            })
                        }
                        else{ // Stab zu lang
                            this.platformTooLong();
                        }
                    }
                })
            }
            else{ //Stab zu kurz
                this.platformTooShort();
            }
        }
    }

    // An linke Bildschirmseite bewegen: Player, Stab, Hochhaeuser
    moveEverthingToTheLeft(){
        this.coin.visible = false;
        this.tweens.add({
            targets: [this.player, this.pole, this.platforms[1 - this.mainPlatform], this.platforms[this.mainPlatform]],
            props: {
                x: { // An linke Bildschirmseite bewegen
                    value: "-= " +  this.platforms[1 - this.mainPlatform].x
                }
            },
            duration: gameOptions.scrollTime,
            callbackScope: this,
            onComplete: function(){
                this.prepareNextMove();
            }
        })
    }

    //Naechsten Zug vorbereitn
    prepareNextMove(){
        this.gameMode = IDLE;
        this.platforms[this.mainPlatform].x = gameEscape.config.width;
        let addHeight = 30;
        this.platforms[this.mainPlatform].y = this.platforms[this.mainPlatform].y - addHeight;
        this.mainPlatform = 1 - this.mainPlatform;
        playSoundPlattformReached();
        this.tweenPlatform();
        //Stab zurücksetzen
        this.pole.angle = 0;
        this.pole.x = this.platforms[this.mainPlatform].displayWidth;
        this.pole.y = this.platforms[this.mainPlatform].y;
        this.pole.displayHeight = gameOptions.playerHeight / 4;
      // Fluchthöhe erreicht: Flucht mit Helikopter einleiten
      if(this.player.y<=escapeHeight){ //andere passende Hoehen: Zum Testen oder mehr Herausforderung 344 //644 //744
          this.reachedPointForEscape();
      }
    }

    // Fluchthöhe erreicht: Flucht mit Helikopter einleiten
    reachedPointForEscape(){
        this.input.mouse.enabled = false;
          this.gameMode = FLIGHT;
          this.addHelicopter();
          this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: function(){
                this.startHelicopter();
            }
        })
    }

    platformTooLong(){
        // hier Gegenkathe des "größeren Dreieck" benötigt
        // nicht nur über der Schlucht, sondern ganz bis zum Ende des Stabs
        let gegenkathete = this.pole.displayHeight * Math.sin(radianAngle);
        let goTo = Math.round(this.player.y - gegenkathete);
        this.walkTween = this.tweens.add({
            targets: [this.player],
            x: this.pole.x + this.pole.displayHeight + this.player.displayWidth,
            y: goTo,
            duration: gameOptions.walkTime * this.pole.displayHeight,
            callbackScope: this,
            onComplete: function(){
                this.fallAndDie();
            }
        })
    }

    // Animation bei zu kurzer Plattform: Spieler läuft nur bis zum  Ende des Stabs, fällt, Stab klappt um
    platformTooShort(){
        this.tweens.add({
            // Stab klappt zunächst um 90 Grad um
            targets: [this.pole],
            angle: 90,
            duration: gameOptions.rotateTime,
            ease: "Cubic.easeIn",
            callbackScope: this,
            onComplete: function(){
                // Spieler läuft zum Ende des Stabs
                this.gameMode = WALKING;
                this.tweens.add({
                    targets: [this.player],
                    x: this.pole.x + this.pole.displayHeight,
                    duration: gameOptions.walkTime * this.pole.displayHeight,
                    callbackScope: this,
                    // Stab klappt um und fällt nach unten
                    onComplete: function(){
                        this.tweens.add({
                            targets: [this.pole],
                            angle: 180,
                            duration: gameOptions.rotateTime,
                            ease: "Cubic.easeIn"
                        })
                        // Spieler fällt
                        this.fallAndDie();
                    }
                })
            }
        })
    }

    // Spieler fällt, Spiel startet von vorn
    fallAndDie(){
        this.gameMode = IDLE;
        playFallSound();
        this.tweens.add({
            targets: [this.player],
            y: gameEscape.config.height + this.player.displayHeight * 2,
            duration: gameOptions.fallTime,
            ease: "Cubic.easeIn",
            callbackScope: this,
            onComplete: function(){
                this.shakeAndRestart();
            }
        })
    }

    // Spiel erzittert, startet von vorn
    shakeAndRestart(){
        this.cameras.main.shake(800, 0.01);
        coinScoreCounter = 0;
        this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: function(){
                this.scene.start("PlayGame");
            }
        })
    }

 // Stablänge berechnen
 calculatePoleLength(){
         var gap = this.platforms[1 - this.mainPlatform].x - this.pole.x;
            //höhen-Diffenerenz 
            var heightDifference = this.platforms[this.mainPlatform].y - this.platforms[1 - this.mainPlatform].y;
            var secPlatformWidth = this.platforms[1 - this.mainPlatform].displayWidth;
            var poleHeight = this.pole.displayHeight;
            if(this.poleHasGoodLength(gap, heightDifference, secPlatformWidth,poleHeight)){
                console.log("Gute Länge :)");
            }else{
                console.log("Schlechte Länge :(");
            } 
    }
    poleHasGoodLength(gap, heightDifference, secPlatformWidth,poleHeight){
        //Ankathete
        let adjacent = secPlatformWidth * heightDifference / gap;
        console.log("Ankathete"+adjacent);
        //Pythagoras
        let hypotenuse = Math.sqrt(Math.pow(secPlatformWidth, 2)+Math.pow(adjacent, 2));
        console.log("hypotenuse"+hypotenuse);
        //Hypothenuse der gap
         let hypoGap = Math.sqrt(Math.pow(gap, 2)+Math.pow(heightDifference, 2));
        //tatsächlicher Überstand des Stabs über 2. Plattform
        let poleOverlap = poleHeight - hypoGap;
        // var poleOverlap = this.pole.displayHeight - hypoGap;
        if(poleOverlap<secPlatformWidth && poleOverlap>0){
           return true;
           }
        return false;

    }

    // Winkel berechnen, um den der Stab sich zur höheren Plattform neigen muss
    calculateAngle(){
        let heightDifference = this.platforms[this.mainPlatform].y-this.platforms[1 - this.mainPlatform].y;
        let gap = this.platforms[1 - this.mainPlatform].x - this.pole.x;
        radianAngle = Math.atan(heightDifference/gap);
        let angleDegree = this.radians_to_degrees(radianAngle);
        return angleDegree;
    }
    radians_to_degrees(radians)
    {
      let pi = Math.PI;
      return radians * (180/pi);
    }

    // da mit Grafiken für Gebäude gearbeitet:
    //Zufällige Breite für nächstes Gebäude wählen und Grafik als Textur laden
    getRandomWidth(){
        //zufaelliger Integer 0, 1, 2 oder 3
            let rand =  Math.floor(Math.random() *4);
            switch(rand){
                case 0:
                    this.platforms[1 - this.mainPlatform].setTexture('house50');
                    return 50;
                   // break;
                case 1:
                    this.platforms[1 - this.mainPlatform].setTexture('house90');
                    return 90;
                case 2:
                    this.platforms[1 - this.mainPlatform].setTexture('house110');
                    return 110;
                case 3:
                    this.platforms[1 - this.mainPlatform].setTexture('house150');
                    return 150;
              default:
                   // console.log("case default>"+rand);
            }
    }

    update(){ // Prüft auf Zusammenstoß mit Gebäude & Münze einsammeln
        // Spieler über Kopf (unter Stab, um Münze einzusammeln): Kollision mit Plattform?
        if(this.player.flipY){
            this.player.y = this.player.y + gameOptions.playerHeight - gameOptions.poleWidth;
            let playerBound = this.player.getBounds();
            let coinBound = this.coin.getBounds();
            let platformBound = this.platforms[1 - this.mainPlatform].getBounds();
            // Zusammenstoß mit Plattform
            if(Phaser.Geom.Rectangle.Intersection(playerBound, platformBound).width != 0){
                playFallSound();
                    this.walkTween.stop();
                    this.gameMode = IDLE;
                    this.shakeAndRestart();
            }
            // Münze einsammeln
            if(this.coin.visible && Phaser.Geom.Rectangle.Intersection(playerBound, coinBound).width != 0){
                playCollectCoinSound();
                this.coin.visible = false;
                this.increaseCoinScore();
            }
        }

    }
};


function playPoleGrowSound(){
    poleGrowSound.play();
}

function playCollectCoinSound(){
     collectCoinSound.play();
}

function playSoundPlattformReached(){
    plattformReachedSound.play();
}

function playFallSound(){
    fallSound.play();
}

function playHeliSound(){
    heliSound.play();
}


function resize2(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = gameEscape.config.width / gameEscape.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
