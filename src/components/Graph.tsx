import React from "react";

interface CardData {
  text: string;
  body: string;
  icon: React.ReactNode;
  classButton: string;
  className: string;
}

interface GraphProps {
  cards: CardData[];
}

const Graph: React.FC<GraphProps> = ({ cards }) => {
  return (
    <section className="flex flex-wrap gap-6 justify-center mt-8 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.className} min-w-[220px] max-w-xs rounded-xl p-4`}
        >
          <div className={`${card.classButton} p-3 inline-flex items-center justify-center mb-4`}>
            {card.icon}
          </div>
          <h3 className="text-xl font-semibold mb-1">{card.text}</h3>
          <p className="text-gray-300">{card.body}</p>
        </div>
      ))}
    </section>
  );
};

export default Graph;
