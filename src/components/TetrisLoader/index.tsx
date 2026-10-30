import classnames from "classnames";
import { useTranslation } from "react-i18next";
import useTetrisGame from "./hooks/useTetrisGame";
import type { TTetrisLoaderProps } from "./type";
import "./style.scss";

const TetrisLoader = (props: TTetrisLoaderProps) => {
  const { t } = useTranslation();
  const {
    className,
    size = "md",
    speed = "normal",
    showLoadingText = true,
    loadingText = t("tetris_loader.loading"),
  } = props;

  const { displayGrid, isClearing, config } = useTetrisGame({ size, speed });

  const rootClassName = classnames("tetris-loader", className);

  return (
    <div className={rootClassName}>
      <div className="tetris-loader-board-wrap">
        <div className={classnames("tetris-loader-board", config.boardPadding)}>
          {displayGrid.map((row, ri) => (
            <div key={ri} className="tetris-loader-row">
              {row.map((cell, ci) => {
                const cellClassName = classnames(
                  "tetris-loader-cell",
                  config.cellSize,
                  cell.filled && "tetris-loader-cell-filled",
                  cell.clearing && "tetris-loader-cell-clearing",
                  isClearing && ri < 4 && "tetris-loader-cell-top-clearing"
                );

                return <div key={`${ri}-${ci}`} className={cellClassName} />;
              })}
            </div>
          ))}
        </div>
      </div>
      {showLoadingText && <p className="tetris-loader-text">{loadingText}</p>}
    </div>
  );
};

export default TetrisLoader;
