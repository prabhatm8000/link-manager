const tailwindColors = {
    red: {
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
    },
    blue: {
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
    },
    cyan: {
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
    },
    green: {
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
    },
    yellow: {
        400: "#facc15",
        500: "#eab308",
        600: "#ca8a04",
    },
    orange: {
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
    },
    purple: {
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
    },
};

const colors = ["red", "blue", "cyan", "green", "yellow", "orange", "purple"];

const getRandomColor = ({ strength }: { strength: "400" | "500" | "600" }): string => {
    const color: string = colors[Math.floor(Math.random() * colors.length)];
    const hexCode = tailwindColors[color as keyof typeof tailwindColors]?.[strength];
    return hexCode;
};

export default getRandomColor;
