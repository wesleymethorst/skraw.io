class Speler {
    constructor(naam) {
        this.naam = naam;
        this.punten = 0;
    }
    voegScoreToe(score) {
        this.punten += score;
    }
    getScore(){
        return this.punten;
    }
}

class Beurt {
    constructor(tekenaar, spelers) {
        this.tekenaar = tekenaar;
        this.spelers = spelers;
        this.onderwerp = null;
        this.timerStart = null;
        this.timerDuur = null;
        this.timer =  null;
        this.beurtActief = true;
        this.correctGeradenSpelers = new Set();
    }

    kiesOnderwerp(onderwerp) {
        this.onderwerp = onderwerp;
    }

    startTimer(duurInSeconden) {
        this.timerStart = Date.now();   
        this.timerDuur = duurInSeconden * 1000; 

        this.timer = setTimeout(() => {
            this.eindigBeurt();
        }, this.timerDuur);
    }

    getRemainingTimeInSeconds() {
        if (!this.timerStart || !this.timerDuur) return 0; 
        const elapsed = Date.now() - this.timerStart;
        var remaining = this.timerDuur - elapsed;
        return Math.ceil(remaining/1000);
    }

    controleerGok(gok, speler) {
        if (!this.beurtActief) return;
        if (this.correctGeradenSpelers.has(speler)) return;

        if(gok.toLowerCase() === this.onderwerp.toLowerCase()){
            speler.voegScoreToe(10);
            this.correctGeradenSpelers.add(speler);

            const nietTekenaarSpelers = this.spelers.filter(s => s !== this.tekenaar);
            const allemaalGeraden = nietTekenaarSpelers.every(s => this.correctGeradenSpelers.has(s));

            if (allemaalGeraden) {
                this.eindigBeurt();
            }
        }
    }

    eindigBeurt() {
        if (!this.beurtActief) return;
        this.beurtActief = false;
        clearTimeout(this.timer);
    }
}

class Spel {
    constructor(spelers, rondes, timerPerRound) {
        this.spelers = spelers.map(naam => new Speler(naam));
        this.huidigeRonde = 0;
        this.rondes = rondes;
        this.timerPerRound = timerPerRound;
    }

    async start(){
        for (let ronde = 1; ronde <= this.rondes; ronde++){
            for (const tekenaar of this.spelers) {
                const beurt = new Beurt(tekenaar, this.spelers);
                beurt.kiesOnderwerp("test");
                beurt.startTimer(timerPerRound);
            }
        }
        
        this.toonScores();
    }
    toonScores() {
        console.log("-- Scores --");
        this.spelers.forEach(speler => {
          console.log(`${speler.naam}: ${speler.score} punten`);
        });
    }
}

export { Speler, Beurt, Spel };