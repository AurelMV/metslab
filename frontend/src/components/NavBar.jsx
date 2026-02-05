function NavBar() {
    return ( 
        <div>
            <nav className="shadow-lg p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold text-xl">
                        MetsLab
                    </div>
                    <div>
                        <a href="/lobby" className="hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Lobby</a>
                        <a href="/profile" className="hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Profile</a>
                    </div>
                </div>
            </nav>
        </div>
     );
}

export default NavBar;