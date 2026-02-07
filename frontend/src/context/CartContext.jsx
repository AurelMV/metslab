import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (newProduct) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === newProduct.id);
        
        if (existingItem) {
            // Si ya existe, sumamos la cantidad que viene del ProductDetail
            return prevCart.map(item =>
                item.id === newProduct.id 
                ? { ...item, quantity: item.quantity + newProduct.quantity } 
                : item
            );
        }
        // Si no existe, lo agregamos tal cual
        return [...prevCart, newProduct];
    });
    setIsCartOpen(true); // Abre el Aside automáticamente
};

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);