import chordConfig from "@/page/guitar/chord.config";

let keyIndex = 0;
const getNoteItemKey = (type) => {
    keyIndex++;
    if (type === undefined) type = 'NoteItem';
    return `${type}_${keyIndex}`
}
const getRandomBarArr = ({barLength, barBeat, beatNote, minBeatNote, maxFret, noteRate}) => {
    let newStack = [];
    for (let i = 0; i < barLength; i++) {
        let beatNoteStack = [];
        //小节剩余的拍子
        let leftNote = barBeat * beatNote;
        let barBeatIndex = 0;
        //最快的拍子
        let maxBarBeatIndex = barBeat * beatNote / minBeatNote;
        //小节拍子
        let barNoteSize = 0;
        //需要弹奏的音符数量
        let fretStringSize = 0;
        while (barBeatIndex < maxBarBeatIndex) {
            const noteSize = barBeatIndex * minBeatNote;
            if (barNoteSize > noteSize) {
                if (noteSize % beatNote === 0) {
                    //在拍子上补-1表示休止符
                    beatNoteStack.push(-1);
                } else {
                    //不在拍子上补
                    beatNoteStack.push(0);
                }
            } else {
                //获取随机拍子
                let note = getRandomNote(noteRate);
                if (note <= leftNote) {
                    leftNote -= note;
                } else {
                    note = leftNote;
                    leftNote = 0;
                }
                beatNoteStack.push(note);
                fretStringSize += 1;
                barNoteSize += note;
            }
            barBeatIndex++;
        }
        //获取随机弹奏位置
        let randomFretStringArr = getRandomFretString(fretStringSize, maxFret);
        //该小节
        const key = getNoteItemKey('barKey');
        let barItem = {
            _key: key,
            noteList: []
        };
        let randomFretStringIndex = 0;
        for (let i = 0; i < beatNoteStack.length; i++) {
            let note = beatNoteStack[i];
            const key = getNoteItemKey('noteItem');
            if (note > 0) {
                let fretString = randomFretStringArr[randomFretStringIndex];
                let pitchName = chordConfig.pitchNames[fretString.string - 1][fretString.fret];
                barItem.noteList.push({
                    _key: key,
                    note: note,
                    ...fretString,
                    ...pitchName
                })
                randomFretStringIndex++;
            } else {
                barItem.noteList.push({
                    _key: key,
                    note: note,
                });
            }
        }
        newStack.push(barItem);
    }
    return newStack;
}
const getRandomFretString = (size, maxFret) => {
    let result = [];
    let chordLength = chordConfig.enabledChord.length;
    let chordContinueSize = 0;
    let randomChordName;
    for (let i = 0; i < size; i++) {
        let beginChord = false;
        if (chordContinueSize < 1) {
            let useChord = (i === 0 || Math.random() > 0.5) && (size - i > 1);
            if (useChord) {
                let randomChordIndex = Math.floor(Math.random() * chordLength);
                beginChord = true;
                randomChordName = chordConfig.enabledChord[randomChordIndex];
                let chordItemLength = chordConfig.chordMap[randomChordName].length;
                chordContinueSize = 2 + Math.floor(Math.random() * (chordItemLength - 1));
            } else {
                result.push({
                    fret: Math.floor(Math.random() * (maxFret + 1)),
                    string: Math.ceil(Math.random() * 6),
                })
            }
        }
        if (chordContinueSize > 0) {
            let chord = chordConfig.chordMap[randomChordName];
            let chordItemLength = chordConfig.chordMap[randomChordName].length;
            let chordItemIndex = Math.floor(Math.random() * chordItemLength);
            let chordItem = chord[chordItemIndex];
            result.push({
                beginChord: beginChord,
                chordName: randomChordName,
                fret: chordItem.fret,
                string: chordItem.string
            })
            chordContinueSize--;
        }
    }
    return result;
}

const getRandomNote = (noteRate) => {
    let maxIndex = 0;
    let maxRate = 0;
    for (let index = 0; index < noteRate.length; index++) {
        let rate = noteRate[index] * Math.random()
        if (rate > maxRate) {
            maxRate = rate;
            maxIndex = index;
        }
    }
    let note = 1 / (1 << maxIndex)
    return note;
}
export default {
    getRandomBarArr
}
