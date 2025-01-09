import {useEffect, useState} from "react";

const withProtectedPage = (WrappedComponent: React.FC) => {
    const WithProtection: React.FC = (props) => {
        const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Stan dla weryfikacji tokenu
        const [isClient, setIsClient] = useState(false); // Flaga informująca, czy to jest strona klienta

        useEffect(() => {
            setIsClient(true); // Ustawiamy flagę po stronie klienta
        }, []);

        useEffect(() => {
            if (!isClient) return; // Jeśli nie jesteśmy na kliencie, nie wykonuj zapytania

            const token = localStorage.getItem('token') || sessionStorage.getItem('token');

            if (!token) {
                // Jeśli nie ma tokenu, przekieruj na stronę logowania
                window.location.href = '/login_panel'; // Korzystamy z `window.location.href` do przekierowania
                return;
            }

            // Wysyłamy zapytanie do backendu, aby sprawdzić ważność tokenu
            fetch('http://localhost:8080/api/auth/authenticatetoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token}),
            })
                .then((response) => {
                    if (response.ok) {
                        // Jeśli odpowiedź jest OK, to token jest ważny
                        setIsAuthenticated(true);
                    } else {
                        // Jeśli odpowiedź jest błędna (np. 401 Unauthorized), przekieruj na stronę logowania
                        setIsAuthenticated(false);
                        window.location.href = 'http://localhost:3000/login_panel'; // Przekierowanie
                    }
                })
                .catch((error) => {
                    // W przypadku błędu (np. brak połączenia z API), przekierowanie na stronę logowania
                    console.error('Error verifying token:', error);
                    setIsAuthenticated(false);
                    window.location.href = 'http://localhost:3000/login_panel'; // Przekierowanie
                });
        }, [isClient]);

        // Gdy komponent renderuje się po stronie serwera, sprawdzamy, czy jesteśmy na kliencie
        if (!isClient) {
            return null; // Zwracamy null, aby unikać problemów przy renderowaniu po stronie serwera
        }

        if (isAuthenticated === null) {
            return <div>Loading...</div>; // Możesz wyświetlić spinner ładowania lub coś podobnego
        }

        if (!isAuthenticated) {
            return <div>Not authenticated. Redirecting...</div>; // Jeśli użytkownik nie jest uwierzytelniony
        }

        // Zwracamy komponent opakowany, jeśli użytkownik jest uwierzytelniony
        return <WrappedComponent {...props} />;
    };

    return WithProtection;
};

export default withProtectedPage;
