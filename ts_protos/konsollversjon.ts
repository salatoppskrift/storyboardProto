// made in ts playground
interface IdHaver {
    id: string,
    dateMade: string,
    dateUpdated: string
}

interface Drawing extends IdHaver {
    content: string,
    comment?: string,
    dialogue: string,
};
interface Shot extends IdHaver {
    drawings: Drawing[],
    description: string,
    alias?: string
};
interface Scene extends IdHaver {
    shots: Shot[]
}

interface Storyboard extends IdHaver {
    title: string,
    summary: string,
    scenes: Scene[]
};

class User implements IdHaver {
    id;
    name: string;
    dateMade;
    dateUpdated;
    storyboards: Storyboard[];

    constructor(name: string, storyboards?: Storyboard[]) {
        this.id = this.createId();
        this.name = name;
        this.dateMade = new Date().toLocaleString();
        this.dateUpdated = new Date().toLocaleString();
        this.storyboards = storyboards ?? [];
    }

    createNewStoryboard(title: string, summary: string) {
        const newBoard: Storyboard = {
            id: this.createId(),
            dateMade: new Date().toLocaleString(),
            dateUpdated: new Date().toLocaleString(),
            title: title,
            summary: summary,
            scenes: []
        }
        this.storyboards = [...this.storyboards, newBoard];
    }

    createNewScene(shots?: Shot[]): Scene {
        return {
            id: this.createId(),
            dateMade: new Date().toLocaleString(),
            dateUpdated: new Date().toLocaleString(),
            shots: shots ?? []
        }
    }

    createNewShot(drawings?: Drawing[]): Shot {
        return {
            id: this.createId(),
            dateMade: new Date().toLocaleString(),
            dateUpdated: new Date().toLocaleString(),
            drawings: drawings ?? [],
            description: ""
        }
    }

    addDrawingsToShot(strbrdId: string, sceneId: string, shotId: string, drawings: Drawing[]) {
        this.storyboards.filter(storyboard => storyboard.id === strbrdId)
            .flatMap(strbrd => strbrd.scenes.filter(scene => scene.id === sceneId ? scene : []))
            .flatMap(scene => scene.shots.filter(shot => shot.id === shotId ? shot : []))
        [0].drawings.push(...drawings);
    }

    createNewDrawings(imgString: string): Drawing[] {
        if (!(/.jpeg|\.png/g).exec(imgString)) return [];
        return [{
            id: this.createId(),
            content: imgString,
            dateMade: new Date().toLocaleString(),
            dateUpdated: new Date().toLocaleString(),
            dialogue: ""
        }]
    }

    private createId() {
        return (
            Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
            + (() => {
                const randNumb = Math.floor(Math.random() * 99);
                return randNumb < 9 ? "0" + randNumb : randNumb;
            })()
            + Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
        )
            .split("")
            .toSpliced(Math.floor(Math.random() * 8) + 1, 0, "_")
            .toSpliced(Math.floor(Math.random() * 9) + 1, 0, "_")
            .join("");
    }
}

const bruker = new User("lala");
bruker.createNewStoryboard("Moose running away", "");

const newScene: Scene = bruker.createNewScene();

const newShot: Shot = bruker.createNewShot();

const newDrawings: Drawing[] = bruker.createNewDrawings("tegningABC.png");

newShot.drawings = [...newShot.drawings, ...newDrawings];
newScene.shots = [...newScene.shots, newShot];

const selectedId = bruker.storyboards[0].id;

const selectedStoryboard = bruker.storyboards.filter(storyboard => storyboard.id === selectedId)[0];

selectedStoryboard.scenes = [...selectedStoryboard.scenes, newScene];

console.clear();
console.log(bruker)
