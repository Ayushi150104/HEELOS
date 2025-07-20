import React, { useState, useRef, ReactNode, useEffect } from "react";
import { BsUsbPlugFill } from "react-icons/bs";

type Position = { x: number; y: number };

type DraggableItem<T = any> = T & {
  key: string | number;
  position: Position;
  type?: string; // 'task' or 'w' (editable)
  color?: string;
  text?: string; // for editable 'w' cards
};

type Connector = {
  fromKey: string | number;
  toKey: string | number;
  color: string;
};

type FreeDragBoardMobileProps<T> = {
  items: DraggableItem<T>[];
  darkMode?: boolean | null;
  setItems: (items: DraggableItem<T>[]) => void;
  children: (item: DraggableItem<T>) => ReactNode;
  initialConnectors?: Omit<Connector, "color">[];
  className?: string;
  width?: number | string;
  height?: number | string;
  snapToGrid?: number;
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

function FreeDragBoardMobile<T>({
  items,
  setItems,
  children,
  darkMode,
  initialConnectors = [],
  className = "",
  width = "100%",
  height = "100%",
  snapToGrid = 10,
}: FreeDragBoardMobileProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingIndex = useRef<number | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [selectedCardKey, setSelectedCardKey] = useState<string | number | null>(null);
  const [editingKey, setEditingKey] = useState<string | number | null>(null);

  const [showPlugMap, setShowPlugMap] = useState<Record<string | number, boolean>>({});
  const [connectors, setConnectors] = useState<Connector[]>(
    initialConnectors.map(c => ({ ...c, color: getRandomColor() }))
  );

  const [connectingFrom, setConnectingFrom] = useState<string | number | null>(null);
  const [tempConnectorEnd, setTempConnectorEnd] = useState<Position | null>(null);

  // Handle outside click/tap to close editing mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (editingKey === null) return;

      const container = containerRef.current;
      if (!container) return;

      const editingElem = container.querySelector(`[data-key="${editingKey}"]`);
      if (editingElem && editingElem.contains(e.target as Node)) {
        // Click inside editing card, do nothing
        return;
      }
      // Otherwise, close editing
      setEditingKey(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [editingKey]);

  // Touch handlers for dragging cards
  const onTouchStart = (e: React.TouchEvent, index: number) => {
    if (connectingFrom !== null) return;

    e.preventDefault();

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const touch = e.touches[0];
    const item = items[index];
    const itemPos = item.position;

    dragOffset.current = {
      x: touch.clientX - containerRect.left - itemPos.x,
      y: touch.clientY - containerRect.top - itemPos.y,
    };

    draggingIndex.current = index;

    setSelectedCardKey(item.key);
    setSelectedConnector(null);
    setEditingKey(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (draggingIndex.current === null) return;

    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];

    let newX = touch.clientX - containerRect.left - dragOffset.current.x;
    let newY = touch.clientY - containerRect.top - dragOffset.current.y;

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

  const onTouchEnd = () => {
    draggingIndex.current = null;
    // You can add pushHistory or other state tracking here if needed
  };

  // Connector drag/drop logic (untouched, only formatted)
  useEffect(() => {
    if (!connectingFrom) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setTempConnectorEnd({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const mouseX = touch.clientX;
      const mouseY = touch.clientY;

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
          setConnectors([...connectors, { fromKey: connectingFrom, toKey: targetKey, color: getRandomColor() }]);
        }
      }

      setConnectingFrom(null);
      setTempConnectorEnd(null);
    };

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [connectingFrom, items, connectors]);

  // Prevent default touch scroll when dragging
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (draggingIndex.current !== null) {
        e.preventDefault();
      }
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (draggingIndex.current !== null) {
        e.preventDefault();
      }
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

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
    setConnectors(removeConnectorBetween(connectors, selectedConnector.fromKey, selectedConnector.toKey));
    setSelectedConnector(null);
  };

  const removeSelectedCard = () => {
    if (selectedCardKey === null) return;
    setItems(items.filter(item => item.key !== selectedCardKey));
    setConnectors(
      connectors.filter(c => c.fromKey !== selectedCardKey && c.toKey !== selectedCardKey)
    );
    setSelectedCardKey(null);
    if (editingKey === selectedCardKey) setEditingKey(null);
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
      className={`relative overflow-visible rounded-md shadow-inner p-4 outline-none ${className}`}
      style={{
        width,
        height,
        userSelect: "none",
        minHeight: 300,
        touchAction: "none",
      }}
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
          if (fromType !== 't') return null;

          return (
            <path
              d={createBezierPath(getItemCenter(fromItem), tempConnectorEnd)}
              fill="none"
              stroke={darkMode ? "#fefefe" : "#000"}
              strokeWidth={3}
              markerEnd="url(#arrowhead)"
              pointerEvents="none"
              strokeDasharray="5,5"
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
            onTouchStart={(e) => {
              onTouchStart(e, idx);
            }}
            onTouchMove={itemType === 't' ? onTouchMove : onTouchMove}
            onTouchEnd={itemType === 't' ? onTouchEnd : onTouchEnd}
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(item.key);
              if (editingKey !== item.key) {
                setEditingKey(item.key);
              }
            }}
            className={`z-20 text-left ${item.type === 'w' ? item.color : "bg-[#3f3f3f] "}`}
            style={{
              position: "absolute",
              left: item.position.x,
              top: item.position.y,
              cursor: itemType === 't' ? "grab" : "text",
              borderRadius: 6,
              userSelect: "none",
              padding: 8,
              minWidth: 150,
              minHeight: 60,
              backgroundColor: item.color || "#3f3f3f",
              color: 'white',
              boxSizing: "border-box",
              zIndex: isSelected ? 10 : 1,
            }}
          >
            {/* Remove button */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setItems(items.filter(i => i.key !== item.key));
                setConnectors(connectors.filter(c => c.fromKey !== item.key && c.toKey !== item.key));
                if (selectedCardKey === item.key) setSelectedCardKey(null);
                if (editingKey === item.key) setEditingKey(null);
              }}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                cursor: "pointer",
                fontWeight: "bold",
                color: "white",
                backgroundColor: "tomato",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
                zIndex: 20,
              }}
              title="Remove card"
            >
              ×
            </div>

            {/* Editable content for 'w' cards */}
            {itemType === 'w' ? (
              isEditing ? (
                <textarea
                  value={item.text || ""}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setItems(items.map(i =>
                      i.key === item.key ? { ...i, text: newText } : i
                    ));
                  }}
                  autoFocus
                  className="bg-zinc-800"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: "#3f3f46",
                    color: 'white',
                    resize: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    overflowWrap: 'break-word',
                  }}
                />
              ) : (
                <div
                  onClick={() => setEditingKey(item.key)}
                  style={{ whiteSpace: "pre-wrap", minHeight: 50, cursor: "text" }}
                >
                  {item.text || "Click to edit"}
                </div>
              )
            ) : (
              // For 't' type cards, render children normally
              children(item)
            )}

            {/* Plug icon for 't' */}
            {itemType === 't' && (
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: 28,
                  color: darkMode ? (showPlugMap[item.key] ? "red" : "gray") : (showPlugMap[item.key] ? "red" : "gray"),
                  transition: "color 0.2s",
                  userSelect: "none",
                }}
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

      {/* Remove selected connector or card buttons (optional UI) */}
      {selectedConnector && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeSelectedConnector();
          }}
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 1000,
            backgroundColor: "red",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Remove selected connector"
        >
          Remove Connection
        </button>
      )}
    </div>
  );
}

export default FreeDragBoardMobile;
