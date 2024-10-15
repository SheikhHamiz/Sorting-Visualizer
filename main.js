const array = [];
const size = 70;
let audioCtx=null;
const container = document.querySelector(".container");

init();

function init() {
    for(let i = 0; i < size; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function showBars(indices) {
    container.innerHTML = "";
    for(let i = 0; i < size; i++) {
        let node = document.createElement("div");
        node.style.height = array[i] * 300 + "px";
        node.style.width = (100 / size) + "%";
        node.classList.add("bar");
        container.appendChild(node);
        if(indices && indices.includes(i)){
            node.style.background="red";
        }
    }
}

function play(sortingAlgo) {
    let swaps = [];
    if(sortingAlgo.toLowerCase() === "insertionsort"){
        swaps = insertionSort([...array]);
    } else if(sortingAlgo.toLowerCase() === "bubblesort") {
        swaps = bubbleSort([...array]);
    } else {
        swaps = quickSortAlgo([...array]);
    }
    animate(swaps);   
}
function animate(swaps) {
    if(swaps.length == 0) {
        showBars();
        return;
    }
    const [i, j]  = swaps.shift();
    [array[i], array[j]] = [array[j], array[i]];
    showBars([i,j]);
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);
    setTimeout(function(){
        animate(swaps);
    },50);
}

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function bubbleSort(array){
    const swaps=[];
    do{
        var swapped=false;
        for(let i=1;i<array.length;i++){
            if(array[i-1]>array[i]){
                swaps.push([i-1,i]);
                swapped=true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return swaps;
}

function insertionSort(array) {
    const swaps=[];
    let i = 1;
    while(i < size) {
        j = i;
        while( j > 0 && array[j-1] > array[j]) {
            swaps.push([j-1,j]);
            [array[j-1],array[j]]=[array[j],array[j-1]];
            j--;
        }
        i++;
    }
    return swaps;
}
function quickSortAlgo(array) {
    const swaps = [];
    quickSort(array, 0, size-1,swaps);
    return swaps;
}
function quickSort(array, low, high, swaps) {
    if(low >= high || low < 0) { 
        return;
    }
    let pivot = partition(array, low, high,swaps);

    quickSort(array, low, pivot-1,swaps);
    quickSort(array, pivot+1, high,swaps);
}

function partition(array, low, high, swaps) {
    let pivotElem = array[high];
    let pivot = low;
    for(let j = low; j < high; j++) {
        if(array[j] <= pivotElem) {
            swaps.push([pivot,j]);
            [array[pivot], array[j]] = [array[j], array[pivot]];
            pivot++;
        } 
    }
    swaps.push([pivot,high]);
    [array[pivot], array[high]] = [array[high], array[pivot]];
    return pivot; 
}


