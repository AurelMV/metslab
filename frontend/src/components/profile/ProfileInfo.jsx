import { useOutletContext } from 'react-router-dom';

function ProfileInfo() {
  const { user } = useOutletContext(); // Accede al usuario cargado en Profile

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Información</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre Completo</label>
          <p className="text-lg text-gray-700 border-b pb-2">{user?.name}</p>
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Correo Electrónico</label>
          <p className="text-lg text-gray-700 border-b pb-2">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;