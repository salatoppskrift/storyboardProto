interface IdHaver {
    id: string,
    dateMade: string,
    dateUpdated:
    | null
    | string
}

const createOwnId = () => {
    return (
        Array.from({ length: 3 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
        + (() => {
            const randNumb = Math.floor(Math.random() * 99);
            return randNumb < 9 ? "0" + randNumb : randNumb;
        })()
        + Array.from({ length: 5 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
    )
        .split("")
        .splice(Math.floor(Math.random() * 9) + 1, 0, "_")
        .join("");
}

abstract class BaseClass {
    identity: IdHaver;
    constructor() {
        this.identity = {
            id: createOwnId(),
            dateMade: new Date().toLocaleString(),
            dateUpdated: null
        }
    }
}

class Drawing extends BaseClass {
    dialogue: null | string;
    action: null | string;
    img: string;
    constructor(img: string) {
        super();
        this.dialogue = null;
        this.action = null;
        this.img = img ?? "";
    }
    editDrawing() {
        return {
            action: (act: string) => { this.action = act; },
            dialogue: (dialog: string) => { this.dialogue = dialog; },
            image: (img: string) => { this.img = img; }
        }
    }
}
class Shot extends BaseClass {
    drawings: Drawing[];
    constructor() {
        super();
        this.drawings = [];
    }
    addDrawings(...drawing: Drawing[]) {
        this.drawings.push(...drawing);
    }
}
class Scene extends BaseClass {
    shots: Shot[];
    constructor() {
        super();
        this.shots = [];
    }
}
class Storyboard extends BaseClass {
    summary: string;
    scenes: Scene[];
    constructor() {
        super();
        this.summary = "";
        this.scenes = [];
    }
}

class User extends BaseClass {
    storyboards: Storyboard[];
    constructor(id?: string, dateMade?: string, storyboards?: Storyboard[]) {
        super();
        this.identity = {
            id: id ?? createOwnId(),
            dateMade: dateMade ?? new Date().toLocaleString(),
            dateUpdated: null
        };
        this.storyboards = storyboards ?? [];
    }
    addStoryboard(...storyboards: Storyboard[]) {
        this.storyboards.push(...storyboards);
    }
    addSceneToStoryboard(storyboardId: string) {
        return (sceneId: string) => {
            this.storyboards.filter(storyboard =>
                storyboard.identity.id === storyboardId
            )[0].scenes.push(
                this.storyboards.flatMap(
                    storyboard => storyboard.scenes
                ).filter(scene => scene.identity.id === sceneId)[0]
            )
        }
    }
}
