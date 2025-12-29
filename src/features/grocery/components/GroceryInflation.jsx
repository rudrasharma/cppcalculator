import React, { useState, useMemo, useEffect } from 'react';
import { STAPLES } from '../data/groceryData';
import { calculateGroceryTotals } from '../utils/groceryEngine';
import GroceryInflationForm from './GroceryInflationForm';
import GroceryInflationResults from './GroceryInflationResults';

export default function GroceryInflation({ 
    isVisible = true,
    initialProvince = 'ON',
    initialYears = 5,
    initialCartIds = [] 
}) {
    // State Management
    const [province, setProvince] = useState(initialProvince);
    const [years, setYears] = useState(initialYears);
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState([]); // Start empty, useEffect will fill it

    // Initialize cart from URL params
    useEffect(() => {
        // Log the IDs so you can find the correct numbers for seo-scenarios.js
        console.log("Available Grocery IDs:", STAPLES.map(s => `${s.name}: ${s.id}`));

        if (initialCartIds && initialCartIds.length > 0) {
            // "Loose" equality check (==) allows matching string "1" with number 1
            const foundItems = STAPLES.filter(item => 
                initialCartIds.some(id => id == item.id)
            );
            setCart(foundItems);
        }
    }, [initialCartIds]);

    // Calculate totals using the engine
    const totals = useMemo(() => {
        return calculateGroceryTotals(cart, years, province);
    }, [cart, years, province]);

    if (!isVisible) return null;

    const scrollToReceipt = () => {
        const receipt = document.getElementById('future-receipt');
        if (receipt) receipt.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-12 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                <GroceryInflationForm
                    province={province}
                    setProvince={setProvince}
                    years={years}
                    setYears={setYears}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    cart={cart}
                    setCart={setCart}
                    totals={totals}
                    scrollToReceipt={scrollToReceipt}
                />
                <GroceryInflationResults
                    cart={cart}
                    province={province}
                    years={years}
                    totals={totals}
                />
            </div>
        </div>
    );
}