import React from "react";

interface TreeProps {
    data: (number | null)[][];
    onNodeClick?: (value: number) => void;
}

const NODE_SIZE = 50;
const NODE_STYLES = {
    position: "absolute" as "absolute",
    width: `${NODE_SIZE}px`,
    height: `${NODE_SIZE}px`,
    borderRadius: "100%",
    border: "solid 2px black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}

export const Tree: React.FC<TreeProps> = ({ data, onNodeClick }) => {
    const size = data.length ? data[data.length - 1].length : 0;
    const width = size * NODE_SIZE;

    return (
        <div style={{ position: "relative", margin: "30px" }}>
            {data.reduce<React.ReactElement[]>((acc, levelData, level) => {
                const containerWidth = width / levelData.length;

                levelData.forEach((value, index) => {
                    if (value !== null) {
                        const node = (
                            <div
                                style={{
                                    ...NODE_STYLES,
                                    ...(onNodeClick ? { cursor: "pointer" } : {}),
                                    top: NODE_SIZE * level,
                                    left: index * containerWidth + ((containerWidth - NODE_SIZE) / 2)
                                }}
                                onClick={() => onNodeClick?.(value)}
                            >
                                {value}
                            </div>
                        );
                        acc.push(node);
                    }
                });

                return acc;
            }, [])}
        </div>
    );
}