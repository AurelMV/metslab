import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

function EditProfile() {
  const { user } = useOutletContext();
  const [formData, setFormData] = useState({ name: user?.name || '',});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            name="name"
            type="text" 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>
        
        <button className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
export default EditProfile;