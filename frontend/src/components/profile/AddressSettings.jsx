function AddressSettings() {
  const addresses = [
    { id: 1, type: 'Casa', detail: 'Calle Principal 123, Cusco', primary: true },
    { id: 2, type: 'Trabajo', detail: 'Av. Sol 456, Oficina 302', primary: false }
  ];

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mis Direcciones</h2>
        <button className="text-orange-500 font-bold text-sm hover:underline">+ Agregar nueva</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`p-4 rounded-2xl border-2 transition-all ${addr.primary ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
            <div className="flex justify-between mb-2">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${addr.primary ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {addr.type}
              </span>
              <button className="text-gray-400 hover:text-red-500 text-sm">Eliminar</button>
            </div>
            <p className="text-gray-700 text-sm">{addr.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AddressSettings;