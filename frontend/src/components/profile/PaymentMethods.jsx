function PaymentMethods() {
  const cards = [
    { id: 1, brand: 'Visa', last4: '4242', exp: '12/26', color: 'bg-blue-600' },
    { id: 2, brand: 'Mastercard', last4: '8812', exp: '08/25', color: 'bg-gray-800' }
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Métodos de Pago</h2>
      <div className="space-y-4">
        {cards.map(card => (
          <div key={card.id} className={`${card.color} text-white p-6 rounded-2xl flex justify-between items-center shadow-md`}>
            <div>
              <p className="text-xs opacity-80 uppercase tracking-widest">{card.brand}</p>
              <p className="text-xl font-mono mt-1">•••• •••• •••• {card.last4}</p>
              <p className="text-xs mt-2 opacity-80">Expira: {card.exp}</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-all">
              Gestionar
            </button>
          </div>
        ))}
        <button className="w-full border-2 border-dashed border-gray-200 py-4 rounded-2xl text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-all font-medium">
          + Agregar nueva tarjeta
        </button>
      </div>
    </div>
  );
}
export default PaymentMethods;