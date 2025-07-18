import React, { useState, useRef, ReactNode, useEffect, KeyboardEvent } from "react";
import { BsUsbPlugFill } from "react-icons/bs";

type Position = { x: number; y: number };

type DraggableItem<T = any> = T & {
  key: string | number;
  position: Position;
  type?: string; // 'task' or 'editable'
};

type Connector = {
  fromKey: string | number;
  toKey: string | number;
  color: string;
};

type FreeDragBoardProps<T> = {
  items: DraggableItem<T>[];
  darkMode?: boolean | null;
  setItems: (items: DraggableItem<T>[]) => void;
  children: (item: DraggableItem<T>) => ReactNode;
  initialConnectors?: Omit<Connector, "color">[];
  className?: string;
  width?: number | string;
  height?: number | string;
  snapToGrid?: number; // grid size in px for snapping
};

function getRandomColor() {
  const colors = [
    "#3b82f6", "#ef4444", "#f59e0b", "#10b981",
    "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function isConnectorExists(connectors: Connector[], fromKey: string | number, toKey: string | number) {
  return connectors.some(c => c.fromKey === fromKey && c.toKey === toKey);
}

function removeConnectorBetween(connectors: Connector[], fromKey: string | number, toKey: string | number) {
  return connectors.filter(c => !(c.fromKey === fromKey && c.toKey === toKey));
}

function getItemByKey<T>(items: DraggableItem<T>[], key: string | number) {
  return items.find(item => item.key === key);
}

function clampPosition(
  pos: Position,
  containerSize: { width: number; height: number },
  itemSize: { width: number; height: number }
): Position {
  return {
    x: Math.min(
      Math.max(pos.x, 0),
      containerSize.width - itemSize.width
    ),
    y: Math.min(
      Math.max(pos.y, 0),
      containerSize.height - itemSize.height
    ),
  };
}

function snapPosition(pos: Position, snap: number) {
  return {
    x: Math.round(pos.x / snap) * snap,
    y: Math.round(pos.y / snap) * snap,
  };
}

function FreeDragBoard<T>({
  items,
  setItems,
  children,
  darkMode,
  initialConnectors = [],
  className = "",
  width = "100%",
  height = "100%",
  snapToGrid = 10,
}: FreeDragBoardProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingIndex = useRef<number | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selection and editing states
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [selectedCardKey, setSelectedCardKey] = useState<string | number | null>(null);
  const [editingKey, setEditingKey] = useState<string | number | null>(null);

  const [showPlugMap, setShowPlugMap] = useState<Record<string | number, boolean>>({});
  const [connectors, setConnectors] = useState<Connector[]>(
    initialConnectors.map(c => ({ ...c, color: getRandomColor() }))
  );

  const [connectingFrom, setConnectingFrom] = useState<string | number | null>(null);
  const [tempConnectorEnd, setTempConnectorEnd] = useState<Position | null>(null);

  // Undo / redo stack for items and connectors
  const history = useRef<{ items: DraggableItem<T>[]; connectors: Connector[] }[]>([]);
  const historyIndex = useRef(-1);

  // Push state to history
  const pushHistory = (newItems: DraggableItem<T>[], newConnectors: Connector[]) => {
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }
    history.current.push({
      items: JSON.parse(JSON.stringify(newItems)),
      connectors: JSON.parse(JSON.stringify(newConnectors)),
    });
    historyIndex.current++;
  };

  useEffect(() => {
    pushHistory(items, connectors);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setItemsWithHistory = (newItems: DraggableItem<T>[]) => {
    setItems(newItems);
    pushHistory(newItems, connectors);
  };

  const setConnectorsWithHistory = (newConnectors: Connector[]) => {
    setConnectors(newConnectors);
    pushHistory(items, newConnectors);
  };

  const togglePlug = (key: string | number) => {
    setShowPlugMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getItemCenter = (item: DraggableItem<T>) => {
    const container = containerRef.current;
    if (!container) return { x: item.position.x, y: item.position.y };

    const childElem = container.querySelector(`[data-key="${item.key}"]`) as HTMLElement | null;
    if (!childElem) return { x: item.position.x, y: item.position.y };

    const rect = childElem.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
    };
  };

  const createBezierPath = (from: Position, to: Position) => {
    const deltaX = Math.abs(to.x - from.x) * 0.5;
    const controlPoint1 = { x: from.x + deltaX, y: from.y };
    const controlPoint2 = { x: to.x - deltaX, y: to.y };

    return `M ${from.x} ${from.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${to.x} ${to.y}`;
  };

  const onConnectorClick = (fromKey: string | number, toKey: string | number) => {
    setSelectedConnector({ fromKey, toKey, color: "" });
  };

  const removeSelectedConnector = () => {
    if (!selectedConnector) return;
    setConnectorsWithHistory(removeConnectorBetween(connectors, selectedConnector.fromKey, selectedConnector.toKey));
    setSelectedConnector(null);
  };

  const removeSelectedCard = () => {
    if (selectedCardKey === null) return;
    setItemsWithHistory(items.filter(item => item.key !== selectedCardKey));
    setConnectorsWithHistory(
      connectors.filter(c => c.fromKey !== selectedCardKey && c.toKey !== selectedCardKey)
    );
    setSelectedCardKey(null);
    if (editingKey === selectedCardKey) setEditingKey(null);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (draggingIndex.current === null) return;
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    let newX = mouseX - containerRect.left - dragOffset.current.x;
    let newY = mouseY - containerRect.top - dragOffset.current.y;

    const draggingElem = container.querySelector(`[data-key="${items[draggingIndex.current].key}"]`) as HTMLElement | null;
    const elemWidth = draggingElem?.offsetWidth || 150;
    const elemHeight = draggingElem?.offsetHeight || 50;

    let clampedPos = clampPosition({ x: newX, y: newY }, { width: containerRect.width, height: containerRect.height }, { width: elemWidth, height: elemHeight });

    clampedPos = snapPosition(clampedPos, snapToGrid);

    setItems((prev) => {
      const updated = [...prev];
      updated[draggingIndex.current!] = {
        ...updated[draggingIndex.current!],
        position: clampedPos,
      };
      return updated;
    });
  };

  const onMouseUp = () => {
    draggingIndex.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    pushHistory(items, connectors);
  };

  const onDragStart = (e: React.MouseEvent, index: number) => {
    if (connectingFrom !== null) return;

    const item = items[index];
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const itemPos = item.position;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    dragOffset.current = {
      x: mouseX - containerRect.left - itemPos.x,
      y: mouseY - containerRect.top - itemPos.y,
    };

    draggingIndex.current = index;

    setSelectedCardKey(item.key);
    setSelectedConnector(null);
    setEditingKey(null);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Connector drag & drop handlers
  useEffect(() => {
    if (!connectingFrom) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTempConnectorEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      let targetKey: string | number | null = null;
      for (const item of items) {
        const el = containerRef.current.querySelector(`[data-key="${item.key}"]`) as HTMLElement | null;
        if (!el) continue;
        const elRect = el.getBoundingClientRect();
        if (
          mouseX >= elRect.left &&
          mouseX <= elRect.right &&
          mouseY >= elRect.top &&
          mouseY <= elRect.bottom
        ) {
          targetKey = item.key;
          break;
        }
      }

      const fromItem = getItemByKey(items, connectingFrom);
      const toItem = targetKey ? getItemByKey(items, targetKey) : null;

      const fromType = fromItem?.type === 'task' ? 't' : 'w';
      const toType = toItem?.type === 'task' ? 't' : 'w';

      if (targetKey && targetKey !== connectingFrom && fromType === 't' && toType === 't') {
        if (!isConnectorExists(connectors, connectingFrom, targetKey)) {
          setConnectorsWithHistory([...connectors, { fromKey: connectingFrom, toKey: targetKey, color: getRandomColor() }]);
        }
      }

      setConnectingFrom(null);
      setTempConnectorEnd(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [connectingFrom, items, connectors]);

  useEffect(() => {
    const preventSelect = (e: Event) => {
      if (draggingIndex.current !== null) e.preventDefault();
    };
    document.addEventListener("selectstart", preventSelect);
    return () => {
      document.removeEventListener("selectstart", preventSelect);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      if (selectedConnector) {
        removeSelectedConnector();
        e.preventDefault();
      } else if (selectedCardKey !== null) {
        removeSelectedCard();
        e.preventDefault();
      }
    }
    if (selectedCardKey !== null && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const delta = e.shiftKey ? 10 : 1;

      setItems((prev) => {
        const updated = prev.map(item => {
          if (item.key !== selectedCardKey) return item;
          let newPos = { ...item.position };
          if (e.key === "ArrowUp") newPos.y = Math.max(newPos.y - delta, 0);
          if (e.key === "ArrowDown") newPos.y = newPos.y + delta;
          if (e.key === "ArrowLeft") newPos.x = Math.max(newPos.x - delta, 0);
          if (e.key === "ArrowRight") newPos.x = newPos.x + delta;

          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            const elem = container.querySelector(`[data-key="${item.key}"]`) as HTMLElement | null;
            const w = elem?.offsetWidth || 150;
            const h = elem?.offsetHeight || 50;
            newPos = clampPosition(newPos, { width: rect.width, height: rect.height }, { width: w, height: h });
          }

          return { ...item, position: snapPosition(newPos, snapToGrid) };
        });
        pushHistory(updated, connectors);
        return updated;
      });
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (historyIndex.current > 0) {
        historyIndex.current--;
        const prev = history.current[historyIndex.current];
        setItems(prev.items);
        setConnectors(prev.connectors);
        setSelectedCardKey(null);
        setSelectedConnector(null);
        setEditingKey(null);
      }
    }

    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
      e.preventDefault();
      if (historyIndex.current < history.current.length - 1) {
        historyIndex.current++;
        const next = history.current[historyIndex.current];
        setItems(next.items);
        setConnectors(next.connectors);
        setSelectedCardKey(null);
        setSelectedConnector(null);
        setEditingKey(null);
      }
    }
  };

  const onCardClick = (key: string | number) => {
    setSelectedCardKey(key);
    setSelectedConnector(null);
    setEditingKey(null);
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`relative overflow-visible bg-transparent rounded-md shadow-inner p-4 outline-none ${className}`}
      style={{ width, height, userSelect: "none", minHeight: 300 }}
    >
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-auto"
        style={{ overflow: "visible", zIndex: 0 }}
        stroke="black"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={darkMode ? "#fff" : "#000"} />
          </marker>
        </defs>

        {connectors.map(({ fromKey, toKey, color }) => {
  const fromItem = getItemByKey(items, fromKey);
  const toItem = getItemByKey(items, toKey);
  if (!fromItem || !toItem) return null;

  const fromPos = getItemCenter(fromItem);
  const toPos = getItemCenter(toItem);

  const isSelected =
    selectedConnector &&
    String(selectedConnector.fromKey) === String(fromKey) &&
    String(selectedConnector.toKey) === String(toKey);

 


  return (
    <path
      key={`${fromKey}-${toKey}`}
      d={createBezierPath(fromPos, toPos)}
      fill="none"
      stroke={color}
      strokeWidth={isSelected ? 5 : 3}
      markerEnd="url(#arrowhead)"
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        onConnectorClick(fromKey, toKey);
        setSelectedCardKey(null);
      }}
    />
  );
})}


        {connectingFrom && tempConnectorEnd && (() => {
          const fromItem = getItemByKey(items, connectingFrom);
          if (!fromItem) return null;
          const fromType = fromItem.type === 'task' ? 't' : 'w';

          // Only show temp connector if from type is 't'
          if (fromType !== 't') return null;

          
          return (
            <path
              d={createBezierPath(getItemCenter(fromItem), tempConnectorEnd)}
              fill="none"
              stroke={darkMode ? "#fefefe" : "#000"}
              strokeWidth={3}
              markerEnd="url(#arrowhead)"
              pointerEvents="none"
              strokeDasharray="5,5" // dotted line for temp connector
            />
          );
        })()}
      </svg>

      {items.map((item, idx) => {
        const itemType = item.type === 'task' ? 't' : 'w';
        const isSelected = selectedCardKey === item.key;
        const isEditing = editingKey === item.key;

        return (
          
          <div
            key={item.key}
            data-key={item.key}
            onMouseDown={(e) => {
              if (itemType === 't') {
                onDragStart(e, idx);
              } else {
                draggingIndex.current = idx;
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (!containerRect) return;

                const itemPos = item.position;
                const mouseX = e.clientX;
                const mouseY = e.clientY;

                dragOffset.current = {
                  x: mouseX - containerRect.left - itemPos.x,
                  y: mouseY - containerRect.top - itemPos.y,
                };

                setSelectedCardKey(item.key);
                setSelectedConnector(null);
                setEditingKey(null);

                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(item.key);
            }}
            onDoubleClick={() => {
              if (itemType === 'w') {
                setEditingKey(item.key);
              }
            }}
            className="z-20"
            style={{
              position: "absolute",
              left: item.position.x,
              top: item.position.y,
              cursor: itemType === 't' ? "grab" : "default",
              border: isSelected ? "none" : "none",
              borderRadius: 6,
              userSelect: "none",
              padding: 8,
              minWidth: 150,
              minHeight: 60,
              backgroundColor: (item as any).color || "#333",
              color: 'white',
              boxSizing: "border-box",
              zIndex: isSelected ? 10 : 1,
            }}
          >
            {itemType === 'w' && isEditing ? (
              <textarea
                autoFocus
                value={(item as any).text || ""}
                onChange={(e) => {
                  const newText = e.target.value;
                  setItems((prev) =>
                    prev.map((it) =>
                      it.key === item.key ? { ...it, text: newText } : it
                    )
                  );
                }}
                onBlur={() => setEditingKey(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    setEditingKey(null);
                  }
                }}
                style={{
                  width: '100%',
                  fontSize: 16,
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                }}
              />
            ) : (
              children(item)
            )}

            {itemType === 't' && (
              
              <div
                style={{
                  position: "absolute",
                  right: -10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: 20,
                  color:  darkMode ? showPlugMap[item.key] ? "red" : "gray" : showPlugMap[item.key] ? "yellow" : "white",
                  transition: "color 0.2s",
                  userSelect: "none",
                }}
                className={` h-[90%] flex items-center w-max rounded-r-xl justify-end ${darkMode ? "bg-gray-50" : "bg-gray-950 text"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlug(item.key);
                  if (!showPlugMap[item.key]) {
                    setConnectingFrom(item.key);
                  } else {
                    setConnectingFrom(null);
                    setTempConnectorEnd(null);
                  }
                }}
                title={showPlugMap[item.key] ? "Cancel connection" : "Start connection"}
              >
                <BsUsbPlugFill />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FreeDragBoard;
