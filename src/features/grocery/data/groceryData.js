export const PROVINCIAL_FACTORS = {
    ON: { label: 'Ontario', factor: 0.98, inflation: 3.1 },
    QC: { label: 'Quebec', factor: 1.00, inflation: 1.8 },
    BC: { label: 'British Columbia', factor: 1.07, inflation: 2.8 },
    AB: { label: 'Alberta', factor: 1.05, inflation: 3.2 },
    MB: { label: 'Manitoba', factor: 1.02, inflation: 3.3 },
    SK: { label: 'Saskatchewan', factor: 1.01, inflation: 2.8 },
    NS: { label: 'Nova Scotia', factor: 1.05, inflation: 2.7 },
    NB: { label: 'New Brunswick', factor: 1.04, inflation: 3.1 },
    PE: { label: 'PEI', factor: 1.04, inflation: 3.1 },
    NL: { label: 'Newfoundland', factor: 1.06, inflation: 3.8 }
};

export const STAPLES = [
    // --- MEAT & PROTEIN ---
    { id: 'beef', name: 'Ground Beef (kg)', price: 15.83, category: 'Meat', icon: '🥩', inflation: 17.7 },
    { id: 'chicken', name: 'Chicken Breast (kg)', price: 14.17, category: 'Meat', icon: '🍗', inflation: 7.4 },
    { id: 'bacon', name: 'Bacon (500g)', price: 7.68, category: 'Meat', icon: '🥓', inflation: 8.2 },
    { id: 'salmon', name: 'Salmon Fillets (kg)', price: 24.55, category: 'Meat', icon: '🐟', inflation: 3.8 },
    { id: 'tofu', name: 'Extra Firm Tofu', price: 4.25, category: 'Meat', icon: '🧊', inflation: 3.1 },

    // --- DAIRY & EGGS ---
    { id: 'milk', name: 'Milk (4L)', price: 6.83, category: 'Dairy', icon: '🥛', inflation: 3.5 },
    { id: 'eggs', name: 'Eggs (Dozen)', price: 4.76, category: 'Dairy', icon: '🥚', inflation: 4.2 },
    { id: 'butter', name: 'Butter (454g)', price: 5.75, category: 'Dairy', icon: '🧈', inflation: 5.1 },
    { id: 'cheese', name: 'Block Cheese (500g)', price: 6.84, category: 'Dairy', icon: '🧀', inflation: 3.9 },
    { id: 'yogurt', name: 'Yogurt (500g)', price: 3.72, category: 'Dairy', icon: '🥣', inflation: 2.8 },

    // --- PRODUCE ---
    { id: 'apples', name: 'Apples (kg)', price: 4.40, category: 'Produce', icon: '🍎', inflation: 15.5 },
    { id: 'bananas', name: 'Bananas (kg)', price: 1.67, category: 'Produce', icon: '🍌', inflation: 1.2 },
    { id: 'lettuce', name: 'Romaine Lettuce', price: 3.61, category: 'Produce', icon: '🥬', inflation: 26.8 },
    { id: 'tomatoes', name: 'Tomatoes (kg)', price: 4.64, category: 'Produce', icon: '🍅', inflation: 4.7 },
    { id: 'potatoes', name: 'Potatoes (4.5kg)', price: 10.33, category: 'Produce', icon: '🥔', inflation: 3.5 },

    // --- PANTRY ---
    { id: 'coffee', name: 'Coffee (300g)', price: 5.61, category: 'Pantry', icon: '☕', inflation: 27.8 },
    { id: 'bread', name: 'White Bread (675g)', price: 3.53, category: 'Pantry', icon: '🍞', inflation: 3.2 },
    { id: 'rice', name: 'White Rice (2kg)', price: 8.50, category: 'Pantry', icon: '🍚', inflation: 2.1 },
    { id: 'pasta', name: 'Dry Pasta (500g)', price: 2.75, category: 'Pantry', icon: '🍝', inflation: 4.0 },
    { id: 'cereal', name: 'Corn Flakes (675g)', price: 6.38, category: 'Pantry', icon: '🥣', inflation: 2.5 },
];