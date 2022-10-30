import { FC, useState } from "react";
import "./styles.css";

const INPUT = [12, 3, 1, 2, -6, 5, -8, 6].sort((a, b) => a - b);

class Tile {
  number: number;
  isCurrentIndex: boolean;
  isLeftOrRight: boolean;
  constructor(number: number) {
    this.number = number;
    this.isCurrentIndex = false;
    this.isLeftOrRight = false;
  }
}

const initializeTiles = () => {
  return INPUT.map((n) => new Tile(n));
};

const game = (
  tilesArray: Tile[],
  targetSum: number,
  results: Array<Array<number>>,
  setResults: (res: Array<Array<number>>) => void
) => {
  let i = 0;
  console.log({ i });
  const refInterval = setInterval(() => {
    console.log("setInterval launched...");
    console.log("i after setInterval launched " + i);
    if (i < tilesArray.length - 2) {
      let left = i + 1;
      let right = tilesArray.length - 1;
      while (left < right) {
        const currentSum =
          tilesArray[i].number +
          tilesArray[left].number +
          tilesArray[right].number;
        if (currentSum === targetSum) {
          setResults([
            ...results,
            [
              tilesArray[i].number,
              tilesArray[left].number,
              tilesArray[right].number
            ]
          ]);
          left++;
          right--;
        } else if (currentSum > targetSum) {
          right--;
        } else if (currentSum < targetSum) {
          left++;
        }
      }
      i++;
    } else {
      clearInterval(refInterval);
    }
  }, 500);
  return refInterval;
};

type MagicTileProps = {
  tile: Tile;
};

const MagicTile: FC<MagicTileProps> = ({ tile }) => {
  return <div className="magic-tile">{tile.number}</div>;
};

type MagicArrayProps = {
  input: Tile[];
};

const MagicArray: FC<MagicArrayProps> = ({ input }) => {
  return (
    <div className="array-container">
      {input.map((t: Tile, idx: number) => (
        <MagicTile key={idx} tile={t} />
      ))}
    </div>
  );
};

type ControlsProps = {
  start: () => void;
  stop: () => void;
  initTargetSum: (n: number) => void;
};

const Controls: FC<ControlsProps> = ({ start, stop, initTargetSum }) => {
  const changeEventHandler = (e: any) => {
    const n = Number(e.target.value);
    initTargetSum(n);
  };
  return (
    <div>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
      <input onChange={changeEventHandler} />
    </div>
  );
};

type ResultsProps = { results: Array<Array<number>> };

const Results: FC<ResultsProps> = ({ results }) => {
  return <div className="results">{JSON.stringify(results)}</div>;
};

export default function App() {
  const [gameRef, setGameRef] = useState<NodeJS.Timer>();
  const [targetSum, setTargetSum] = useState<number>(0);
  const [results, setResults] = useState<Array<Array<number>>>([]);
  const tiles = initializeTiles();

  const initTargetSum = (n: number) => {
    setTargetSum(n);
  };

  const start = () => {
    console.log("start clicked");
    setGameRef(game(tiles, targetSum, results, setResults));
  };

  const stop = () => {
    console.log("stop clicked");

    clearInterval(gameRef);
  };

  return (
    <div className="App">
      <Controls start={start} stop={stop} initTargetSum={initTargetSum} />
      <MagicArray input={tiles} />
      <Results results={results} />
    </div>
  );
}
